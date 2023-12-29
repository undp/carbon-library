import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { NdcDetailsActionType } from "../enum/ndc.details.action.type.enum";
import { NdcDetailsActionStatus } from "../enum/ndc.details.action.status.enum";

@Entity()
export class NdcDetailsAction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nationalPlanObjective: string;

    @Column()
    kpi: number;

    @Column()
    ministryName: string;

    @Column({nullable: true})
    periodId: number;

    @Column({nullable: true})
    parentActionId: number;

    @Column({
        type: "enum",
        enum: NdcDetailsActionType,
        array: false,
        default: NdcDetailsActionType.MainAction,
    })
    actionType: NdcDetailsActionType;

    @Column({
        type: "enum",
        enum: NdcDetailsActionStatus,
        array: false,
        default: NdcDetailsActionStatus.Pending,
    })
    status: NdcDetailsActionStatus;
}
