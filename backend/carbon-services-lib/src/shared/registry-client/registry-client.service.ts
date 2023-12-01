import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserDto } from "../dto/user.dto";
import axios from "axios";
import { ProgrammeApprove } from "../dto/programme.approve";
import { AuthorizationLetterGen } from "../util/authorisation.letter.gen";
import { CompanyService } from "../company/company.service";
import { ProgrammeService } from "../programme/programme.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ProgrammeDocument } from "../entities/programme.document";
import { Repository } from "typeorm";
import { DocumentStatus } from "../enum/document.status";
import { DocType } from "../enum/document.type";
import { FindOrganisationQueryDto } from "../dto/find.organisation.dto";
import { DataListResponseDto } from "../dto/data.list.response";
import { ProgrammeDocumentDto } from "../dto/programme.document.dto";
import { SYSTEM_TYPE } from "../enum/system.names.enum";
import { ProgrammeDto } from "../dto/programme.dto";
import { NDCActionType } from "../enum/ndc.action.enum";
import { NDCAction } from "../entities/ndc.action.entity";
import { NDCActionDto } from "../dto/ndc.action.dto";
import { EmailHelperService } from "../email-helper/email-helper.service";
import { EmailTemplates } from "../email-helper/email.template";

@Injectable()
export class RegistryClientService {
  constructor(private configService: ConfigService,
    private logger: Logger,
    private authLetterGen: AuthorizationLetterGen,
    private companyService: CompanyService,
    private programmeService: ProgrammeService,
    @InjectRepository(ProgrammeDocument)
    private documentRepo: Repository<ProgrammeDocument>,
    private emailHelperService: EmailHelperService,
) {}

  private async sendHttp(endpoint: string, data: any) {
    if (!this.configService.get("registry.syncEnable")) {
      this.logger.debug("Company created ignored due to registry sync disable");
      return;
    }

    return await axios
      .post(this.configService.get("registry.endpoint") + endpoint, data, {
        headers: {
          api_key: `${this.configService.get("registry.apiToken")}`,
        },
      })
      .catch((ex) => {
        console.log("Exception", ex.response?.data?.message);
        if (
          ex.response?.data?.statusCode == 400 &&
          ex.response?.data?.message?.indexOf("already exist") >= 0
        ) {
          return true;
        }
        throw ex;
      });
  }

  private async sendHttpPut(endpoint: string, data: any) {
    if (!this.configService.get("registry.syncEnable")) {
      this.logger.debug("Company created ignored due to registry sync disable");
      return;
    }

    return await axios
      .put(this.configService.get("registry.endpoint") + endpoint, data, {
        headers: {
          api_key: `${this.configService.get("registry.apiToken")}`,
        },
      })
      .catch((ex) => {
        console.log("Exception", ex.response?.data?.statusCode);
        if (
          ex.response?.data?.statusCode == 400 &&
          ex.response?.data?.message?.indexOf("already exist") >= 0
        ) {
          return true;
        }
        throw ex;
      });
  }

  public async createCompany(userDto: UserDto) {
    const resp = await this.sendHttp("/national/user/add", userDto);
    console.log(
      "Successfully create company on MRV",
      userDto.company.name
    );
    return resp;
  }

  public async authProgramme(actionProps:any) {
    if(this.configService.get('systemType')==SYSTEM_TYPE.CARBON_UNIFIED){
      const programme = await this.programmeService.findById(actionProps.programmeId)
      const orgNames:DataListResponseDto  = await this.companyService.queryNames({
        size: 10,
        page: 1,
        filterAnd: [{
          key: 'companyId',
          operation: 'IN',
          value: programme.companyId
        }],
        filterOr: undefined,
        filterBy:undefined,
        sort: undefined
      }, undefined) ;
      let orgData = orgNames.data
      
      const documents = await this.documentRepo.find({
        where: [
          { programmeId: programme.programmeId, status: DocumentStatus.ACCEPTED,type: DocType.DESIGN_DOCUMENT },
          { programmeId: programme.programmeId, status: DocumentStatus.ACCEPTED,type: DocType.METHODOLOGY_DOCUMENT},
        ]
      });
      let designDoc, designDocUrl, methodologyDoc, methodologyDocUrl;
      if(documents && documents.length > 0){
        designDoc = documents.find(d=>d.type === DocType.DESIGN_DOCUMENT);
        if(designDoc){
          designDocUrl = designDoc.url;
        }
        methodologyDoc = documents.find(d=>d.type === DocType.METHODOLOGY_DOCUMENT);
        if(methodologyDoc){
          methodologyDocUrl = methodologyDoc.url;
        }
      }
  
      const companyIds:FindOrganisationQueryDto={companyIds:[Number(actionProps.authOrganisationId)]}
      const authOrganisationName = (await this.companyService.findByCompanyIds(companyIds))[0].name
  
      const authLetterUrl = await this.authLetterGen.generateLetter(
        programme.programmeId,
        programme.title,
        authOrganisationName,
        orgData.map(e => e.name),
        designDocUrl,
        methodologyDocUrl
      );
  
      const dr = new ProgrammeDocument();
      dr.programmeId = programme.programmeId;
      dr.externalId = programme.externalId;
      dr.status = DocumentStatus.ACCEPTED;
      dr.type = DocType.AUTHORISATION_LETTER;
      dr.txTime = new Date().getTime();
      dr.url = authLetterUrl;
      await this.documentRepo.save(dr);

      const hostAddress = this.configService.get("host");
      let authDate = new Date(dr.txTime);
      let date = authDate.getDate().toString().padStart(2, "0");
      let month = authDate.toLocaleString("default", { month: "long" });
      let year = authDate.getFullYear();
      let formattedDate = `${date} ${month} ${year}`;


      programme.companyId.forEach(async (companyId) => {
        await this.emailHelperService.sendEmailToOrganisationAdmins(
          companyId,
          EmailTemplates.PROGRAMME_AUTHORISATION,
          {
            programmeName: programme.title,
            authorisedDate: formattedDate,
            serialNumber: actionProps.serialNo,
            programmePageLink:
              hostAddress + `/programmeManagement/view/${actionProps.programmeId}`,
          },undefined,undefined,undefined,
          {
            filename: 'AUTHORISATION_LETTER.pdf',
            path: authLetterUrl
          }
        );
      });
  
      return
    }
    else if(this.configService.get('systemType')==SYSTEM_TYPE.CARBON_REGISTRY){
      const resp = await this.sendHttpPut("/national/programme/authProgramme", actionProps);
      console.log(
        "Successfully authoirised programme on MRV",
        actionProps
      );
      return resp;
    }
  }

  public async rejectProgramme(reject) {
    const resp = await this.sendHttpPut("/national/programme/rejectProgramme", reject);
    console.log(
      "Successfully rejected programme on MRV",
      reject
    );
    return resp;
  }


  public async issueCredit(issue) {
    const resp = await this.sendHttpPut("/national/programme/issueCredit", issue);
    console.log(
      "Successfully issued programme on MRV",
      issue
    );
    return resp;
  }

  public async programmeAccept(document: any) {
    console.log('programme accept on registry', document)
    const resp = await this.sendHttp("/national/programme/acceptProgramme", document);
    console.log('Successfully programme accepted on registry', document.actionId)
    return resp;
  }

  public async addDocument(document: ProgrammeDocumentDto) {
    console.log('adding document on registry', document)
    const resp = await this.sendHttp("/national/programme/addDocument", document);
    console.log('Successfully create document on registry', document.actionId)
    return resp;
  }

  public async createProgramme(programme: ProgrammeDto) {

    const { includedInNDC, includedInNap, ndcScope, ...props } = programme.programmeProperties;
    // props['programmeMaterials'] = [ programme.designDocument ]
    const programmeReq =  {
        "title": programme.title,
        "externalId": programme.externalId,
        "sectoralScope": programme.sectoralScope,
        "sector": programme.sector,
        "startTime": programme.startTime,
        "endTime": programme.endTime,
        "proponentTaxVatId": programme.proponentTaxVatId,
        "proponentPercentage": programme.proponentPercentage,
        "programmeProperties": props,
        "creditEst": programme.creditEst,
        "environmentalAssessmentRegistrationNo": programme.environmentalAssessmentRegistrationNo
      }

    if (programme.ndcAction && (programme.ndcAction.action === NDCActionType.Mitigation || programme.ndcAction.action === NDCActionType.CrossCutting) && programme.ndcAction.typeOfMitigation) {
        programmeReq["mitigationActions"] = [this.createNDCReq(programme.ndcAction)]
    }
    console.log('Creating programme', JSON.stringify(programmeReq))
    const resp = await this.sendHttp("/national/programme/create", programmeReq);

    this.logger.log('Successfully create programme on registry', resp)
    return resp;
  }

  public async updateOwnership(req: any) {

    console.log('creating ownership update on registry', req)
    const resp = await this.sendHttp("/national/programme/updateOwnership", req);
    console.log('Successfully create updated ownership on registry')
    return resp;
  }

  public async addMitigation(ndc: NDCAction) {
    const mitigationReq = this.createNDCReq(ndc);
    console.log('creating mitigation action on registry', ndc, mitigationReq)
    const resp = await this.sendHttp("/national/programme/addMitigation", {
        "mitigation": mitigationReq,
        "externalId": ndc.externalId
    });
    console.log('Successfully create mitigation on registry', mitigationReq.actionId)
    return resp;
  }

  private createNDCReq(ndc: NDCAction | NDCActionDto) {
    return {
        typeOfMitigation: ndc.typeOfMitigation,
        subTypeOfMitigation: ndc.subTypeOfMitigation,
        userEstimatedCredits: ndc.ndcFinancing?.userEstimatedCredits,
        methodology: ndc?.methodology ? ndc?.methodology : '-',
        systemEstimatedCredits: ndc.ndcFinancing?.systemEstimatedCredits ? ndc.ndcFinancing?.systemEstimatedCredits : 0,
        actionId: ndc.id,
        constantVersion: '' + ndc.constantVersion,
        properties: (ndc.creditCalculationProperties ? ndc.creditCalculationProperties : undefined)
    };
  }
}
