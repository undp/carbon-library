import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AsyncActionType } from "../enum/async.action.type.enum";
import { HelperService } from "../util/helpers.service";
import {
  AsyncAction,
  AsyncOperationsInterface,
} from "./async-operations.interface";

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

@Injectable()
export class AsyncOperationsQueueService implements AsyncOperationsInterface {
  private emailDisabled: boolean;
  private sqs = new SQSClient({});

  constructor(
    private configService: ConfigService,
    private logger: Logger,
    private helperService: HelperService
  ) {
    this.emailDisabled = this.configService.get<boolean>("email.disabled");
  }

  public async AddAction(action: AsyncAction): Promise<boolean> {
    // var params = {};

    if ([AsyncActionType.AuthProgramme, AsyncActionType.DocumentUpload, AsyncActionType.IssueCredit, AsyncActionType.RegistryCompanyCreate, AsyncActionType.RejectProgramme,AsyncActionType.AddMitigation,AsyncActionType.ProgrammeAccept,AsyncActionType.ProgrammeCreate,AsyncActionType.OwnershipUpdate].includes(action.actionType) && !this.configService.get("registry.syncEnable")) {
      this.logger.log(`Dropping sync event ${action.actionType} due to sync disabled`)
      return false;
    }

    if (action.actionType === AsyncActionType.Email) {
      if (this.emailDisabled) {
        return false;
      }
    }

    // params = {
    //   MessageAttributes: {
    //     actionType: {
    //       DataType: "Number",
    //       StringValue: action.actionType.toString(),
    //     },
    //   },
    //   MessageBody: JSON.stringify(action.actionProps),
    //   MessageGroupId: action.actionType.toString() + new Date().getTime(),
    //   QueueUrl: this.configService.get("asyncQueueName"),
    // };

    const params = new SendMessageCommand({
      QueueUrl: this.configService.get("asyncQueueName"),
      DelaySeconds: 10,
      MessageAttributes: {
        actionType: {
          DataType: "Number",
          StringValue: action.actionType.toString(),
        },
      },
      MessageBody: JSON.stringify(action.actionProps),
    });

    try {
      await this.sqs.send(params);
      this.logger.log("Succefully added to the queue", action.actionType);
    } catch (error) {
      this.logger.error("Failed when adding to queue", action.actionType);
      this.logger.error("Error",error)
      throw new HttpException(
        this.helperService.formatReqMessagesString(
          "common.addAsyncActionQueueFailed",
          ["Email"]
        ),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }
}
