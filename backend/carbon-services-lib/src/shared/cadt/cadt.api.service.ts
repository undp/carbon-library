import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Programme } from '../entities/programme.entity';
import { CompanyService } from '../company/company.service';
import { ProgrammeStage } from '../enum/programme-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CadtApiService {
  constructor(
    private configService: ConfigService,
    private companyService: CompanyService,
    @InjectRepository(Programme) private programmeRepo: Repository<Programme>,
    private logger: Logger,
  ) {}

  private async sendHttp(endpoint: string, data: any) {
    if (!this.configService.get('cadTrust.enable')) {
      this.logger.debug(
        'Does not execute since CAD-Trust is disable in the system',
      );
      return;
    }

    return await axios
      .post(this.configService.get('cadTrust.endpoint') + endpoint, data)
      .catch((ex) => {
        console.log('Exception', ex.response?.data?.message);
        throw ex;
      });
  }

  private async sendHttpPost(endpoint: string, data: any) {
    if (!this.configService.get('cadTrust.enable')) {
      this.logger.debug(
        'Does not execute since CAD-Trust is disable in the system',
      );
      return;
    }

    return await axios
      .post(this.configService.get('cadTrust.endpoint') + endpoint, data)
      .catch((ex) => {
        console.log('Exception', ex.response?.data?.statusCode);
        throw ex;
      });
  }

  private async sendHttpPut(endpoint: string, data: any) {
    if (!this.configService.get('cadTrust.syncEnable')) {
      this.logger.debug(
        'Does not execute since CAD-Trust is disable in the system',
      );
      return;
    }

    return await axios
      .put(this.configService.get('cadTrust.endpoint') + endpoint, data)
      .catch((ex) => {
        console.log('Exception', ex.response?.data?.statusCode);
        throw ex;
      });
  }

  private getMapToCADTStatus(status: ProgrammeStage) {
    switch (status) {
      case ProgrammeStage.NEW:
      case ProgrammeStage.AWAITING_AUTHORIZATION:
        return 'Registered';
      case ProgrammeStage.APPROVED:
        return 'Listed';
      case ProgrammeStage.REJECTED:
        return 'Withdrawn';
    }
  }

  private getProjectDate(startDate: number) {
    const d = new Date(startDate);
    return `${d.getFullYear}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  public async createProgramme(programme: Programme) {
    const companies = await this.companyService.findByCompanyIds({
      companyIds: programme.companyId,
    });

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
      projectDeveloper: companies?.map((c) => c.name)?.join(', '),
      sector: programme.sector,
      projectType:
        programme.mitigationActions?.length > 0
          ? programme.mitigationActions[0].typeOfMitigation
          : 'No NDC Action',
      coveredByNDC: 'Inside NDC',
      projectStatus: this.getMapToCADTStatus(programme.currentStage),
      projectStatusDate: this.getProjectDate(programme.startTime),
      ndcInformation:
        programme.mitigationActions?.length > 0
          ? programme.mitigationActions[0].actionId
          : 'No NDC Action',
      unitMetric: 'tCO2e',
      methodology:
        programme.mitigationActions?.length > 0
          ? programme.mitigationActions[0].properties.methodology
          : 'No NDC Action',
    });

    await await this.sendHttpPost('v1/staging/commit', undefined);

    //TODO: Make this reliable
    const response = await this.programmeRepo
    .update(
        {
        programmeId: programme.programmeId,
        },
        {
            cadtId: p.data.uuid
        }
    )
    .catch((err: any) => {
        this.logger.error(`CADT id update failed on programme ${programme.programmeId} CADTId: ${p.data.uuid}`);
        return err;
    });
    
    return p;
  }

  // public async findcadtrusprojectbyId(programmeId:string){
  //   const
  // }

  public async authProgramme(
    programmeId: string,
    cadtId: string,
    amount: number,
  ) {
    const auth = await this.sendHttpPut('v1/projects', {
      warehouseProjectId: String(cadtId),
      projectId: programmeId,
      estimations: amount,
    });
    await await this.sendHttpPost('v1/staging/commit', undefined);
    return auth;
  }

  public async issueCredit(
    programmeId: string,
    cadtId: string,
    amount: number,
  ) {
    const credit = await this.sendHttpPut('v1/projects', {
      warehouseProjectId: String(cadtId),
      projectId: programmeId,
      issuances: amount,
    });
    await await this.sendHttpPost('v1/staging/commit', undefined);
    return credit;
  }
}
