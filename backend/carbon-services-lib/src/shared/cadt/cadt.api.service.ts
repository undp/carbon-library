import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Programme } from '../entities/programme.entity';

@Injectable()
export class CadtApiService {
  constructor(private configService: ConfigService, private logger: Logger) {}

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

  public async createProgramme(programme: Programme) {
    return await this.sendHttpPost('v1/projects', {
        "projectId": programme.programmeId,
        "originProjectId": programme.programmeId,
        "registryOfOrigin": `${this.configService.get('systemCountryName')} Standard Carbon Registry`,
        "projectName": programme.title,
        "projectLink": "https://test.carbreg.org/programmeManagement/view/" + programme.programmeId,
        "projectDeveloper": programme.companyId,
        "sector": programme.sector,
        "projectType": programme.sector,
        "coveredByNDC": "Inside NDC",
        "projectStatus": "Pending",
        "projectStatusDate": "2022-03-12",
        "ndcInformation": "Estimated to contribute 56 tons of carbon capture towards US NDC goals.",
        "unitMetric": "tCO2e",
        "methodology": "CDM - AM0001"
    })
  }

  public async issueCredit(programmeId: string, cadtId: string, amount: number) {

  }
}
