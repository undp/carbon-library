import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { NdcDetailsActionStatus } from "../enum/ndc.details.action.status.enum";
import { NdcDetailsActionType } from "../enum/ndc.details.action.type.enum";
import { IsOptional, IsString, IsNumber, ValidateIf, IsEnum } from "class-validator";

export class NdcDetailsActionDto {
    @ApiPropertyOptional()
    @IsOptional()
    id: number;

    @ApiProperty()
    @IsString()
    nationalPlanObjective: string;

    @ApiProperty()
    @IsNumber()
    kpi: number;

    @ApiProperty()
    @IsString()
    ministryName: string;

    @ValidateIf(o => o.actionType === NdcDetailsActionType.mainAction)
    @ApiProperty()
    @IsNumber()
    periodId: number;

    @ValidateIf(o => o.actionType === NdcDetailsActionType.subAction)
    @ApiProperty()
    @IsNumber()
    parentActionId: number;

    @ApiProperty()
    @IsEnum(NdcDetailsActionType, {
        message: 'Invalid action type'
    })
    actionType: NdcDetailsActionType;

    @ApiProperty()
    @IsEnum(NdcDetailsActionStatus, {
        message: 'Invalid action status'
    })
    status: NdcDetailsActionStatus;
}