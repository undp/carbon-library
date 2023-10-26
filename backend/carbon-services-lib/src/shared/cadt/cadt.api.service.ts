import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Programme } from '../entities/programme.entity';
import { CompanyService } from '../company/company.service';
import { ProgrammeStage } from '../enum/programme-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NDCAction } from '../entities/ndc.action.entity';
import { TypeOfMitigation } from '../enum/typeofmitigation.enum';
import { TxType } from '../enum/txtype.enum';

@Injectable()
export class CadtApiService {
  constructor(
    private configService: ConfigService,
    private companyService: CompanyService,
    @InjectRepository(Programme) private programmeRepo: Repository<Programme>,
    private logger: Logger,
  ) {}

  private async send(endpoint, fn, data?: any) {
    if (!this.configService.get('cadTrust.enable')) {
      this.logger.debug(
        'Does not execute since CAD-Trust is disable in the system',
      );
      return;
    }

    console.log('CADT request', data);
    const resp = await fn(
      this.configService.get('cadTrust.endpoint') + endpoint,
      data,
    ).catch((ex) => {
      console.log('Exception', ex);
      throw ex;
    });
    console.log('CADT response', resp);
    return resp;
  }

  private async sendHttpGet(endpoint: string, data: any) {
    return await this.send(endpoint, axios.get, data);
  }

  private async sendHttpPost(endpoint: string, data: any) {
    return await this.send(endpoint, axios.post, data);
  }

  private async sendHttpPut(endpoint: string, data: any) {
    return await this.send(endpoint, axios.put, data);
  }

  private getMapToCADTStatus(status: ProgrammeStage) {
    switch (status) {
      case ProgrammeStage.NEW:
      case ProgrammeStage.AWAITING_AUTHORIZATION:
        return 'Registered';
      case ProgrammeStage.APPROVED:
        return 'Listed';
      case ProgrammeStage.AUTHORISED:
        return 'Completed';
      case ProgrammeStage.REJECTED:
        return 'Withdrawn';
    }
  }

  private getUnitType(typeOfMitigation: TypeOfMitigation) {
    switch(typeOfMitigation) {
        case TypeOfMitigation.FORESTRY:
            return "Removal Nature";
        default:
            return "Reduction Technical";
    }
  }

  private getUnitStatus(txType: TxType) {
    switch(txType) {
        case TxType.APPROVE:
            return "Held";
        case TxType.RETIRE:
            return "Retired";
        case TxType.CREATE:
            return "Buffer";
        case TxType.TRANSFER:
            return "Exported";
    }
  }

  private getProjectDate(date: number) {
    const d = new Date(date);
    return `${d.getFullYear}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  public async createProgramme(programme: Programme) {
    const companies = await this.companyService.findByCompanyIds({
      companyIds: programme.companyId,
    });

    const pd = companies?.map((c) => c.name)?.join(', ');

    console.log('Comp', companies, pd);

    const p = await this.sendHttpPost('v1/projects', {
      projectId: programme.programmeId,
      originProjectId: programme.programmeId,
      registryOfOrigin: `${this.configService.get(
        'systemCountryName',
      )} Standard Carbon Registry`,
      projectName: programme.title,
      projectLink:
        this.configService.get('host') +
        '/programmeManagement/view/' +
        programme.programmeId,
      projectDeveloper: pd,
      sector: programme.sector,
      projectType:
        programme.mitigationActions?.length > 0
          ? programme.mitigationActions[0].typeOfMitigation
          : 'Pending',
      coveredByNDC: 'Inside NDC',
      projectStatus: this.getMapToCADTStatus(programme.currentStage),
      projectStatusDate: this.getProjectDate(programme.startTime * 1000),
      unitMetric: 'tCO2e',
      methodology:
        programme.mitigationActions?.length > 0
          ? programme.mitigationActions[0].properties.methodology
          : 'Pending',
      estimations: {
        unitCount: programme.creditEst,
      }
    });

    const cresp = await this.sendHttpPost('v1/staging/commit', undefined);
    //TODO: Make this reliable
    const response = await this.programmeRepo
      .update(
        {
          programmeId: programme.programmeId,
        },
        {
          cadtId: p?.data?.uuid,
        },
      )
      .catch((err: any) => {
        this.logger.error(
          `CADT id update failed on programme ${programme.programmeId} CADTId: ${p?.data?.uuid}`,
        );
        return err;
      });

    return p;
  }

  public async programmeStatusChange(cadtId: string, status: ProgrammeStage) {
    const auth = await this.sendHttpPut('v1/projects', {
      warehouseProjectId: String(cadtId),
      projectStatus: this.getMapToCADTStatus(status)
    });
    
    await await this.sendHttpPost('v1/staging/commit', undefined);
    return auth;
  }

  private getBlockStartFromSerialNumber(serialNo: string) {
    return Number(serialNo.split('-')[6]);
  }

  private getYearFromSerialNumber(serialNo: string) {
    return Number(serialNo.split('-')[4]);
  }

  public async issueCredit(
    programme: Programme,
    ndcAction: NDCAction,
    amount: number
  ) {
    const gov = await this.companyService.findGovByCountry(this.configService.get('systemCountry'));
    const blockStart = this.getBlockStartFromSerialNumber(programme.serialNo) + Number(programme.creditIssued) -  (Number(programme.creditIssued) > 0 ? 1 : 0);
    const credit = await this.sendHttpPut('v1/units', {
        "projectLocationId": programme.programmeProperties.geographicalLocation?.join(' '),
        "unitOwner": programme.companyId.join(', '),
        "countryJurisdictionOfOwner": this.configService.get('systemCountryName'),
        "unitBlockStart": blockStart,
        "unitBlockEnd": blockStart + amount - 1,
        "unitCount": amount,
        "vintageYear": this.getYearFromSerialNumber(programme.serialNo),
        "unitType": this.getUnitType(ndcAction.typeOfMitigation),
        "unitStatus": this.getUnitStatus(TxType.ISSUE),
        "unitRegistryLink": this.configService.get('host') + "/creditTransfers/viewAll",
        "correspondingAdjustmentDeclaration": "Unknown",
        "correspondingAdjustmentStatus": "Not Started",
        "issuance": {
            "warehouseProjectId": programme.cadtId,
            "startDate": this.getProjectDate(programme.startTime * 1000),
             "endDate": this.getProjectDate(programme.endTime * 1000),
             "verificationApproach": "Pending",
             "verificationReportDate": this.getProjectDate(ndcAction.txTime), //TODO
             "verificationBody": gov.name // TODO
        }
    });
    await await this.sendHttpPost('v1/staging/commit', undefined);
    return credit;
  }
}
