import { Injectable, Logger } from "@nestjs/common";
import { RegistryClientService } from "../shared/registry-client/registry-client.service";
import { EmailService } from "../shared/email/email.service";
import { AsyncActionType } from "../shared/enum/async.action.type.enum";

@Injectable()
export class AsyncOperationsHandlerService {
  constructor(
    private emailService: EmailService,
    private registryClient: RegistryClientService,
    private logger: Logger
  ) {}

  async handler(actionType: any, dataObject: any) {

    this.logger.log("AsyncOperationsHandlerService started", actionType.toString());
    if (actionType) {
      switch (actionType.toString()) {
        case AsyncActionType.Email.toString():
          return await this.emailService.sendEmail(dataObject);
        case AsyncActionType.RegistryCompanyCreate.toString():
          return await this.registryClient.createCompany(dataObject);
        case AsyncActionType.AuthProgramme.toString():
          return await this.registryClient.authProgramme(dataObject);
        case AsyncActionType.IssueCredit.toString():
          return await this.registryClient.issueCredit(dataObject);
        case AsyncActionType.RejectProgramme.toString():
          return await this.registryClient.rejectProgramme(dataObject);
        
        case AsyncActionType.ProgrammeCreate.toString():
          return this.registryClient.createProgramme(dataObject);
        case AsyncActionType.ProgrammeAccept.toString():
          return this.registryClient.programmeAccept(dataObject);
        case AsyncActionType.DocumentUpload.toString():
          return this.registryClient.addDocument(dataObject);
        case AsyncActionType.OwnershipUpdate.toString():
          return this.registryClient.updateOwnership(dataObject);
        case AsyncActionType.AddMitigation.toString():
          return this.registryClient.addMitigation(dataObject);
      }
    }
  }
}
