export type Period = {
  key: string;
  label: string;
  startYear: number;
  endYear: number;
  finalized: boolean;
  deleted: boolean;
};

export type NdcDetail = {
  id?: number;
  actionType: NdcActionType;
  nationalPlanObjective: string;
  kpi: number;
  ministryName: string;
  periodId?: number;
  status: NdcDetailsActionStatus;
  parentActionId?: number,

};

export type DateRange = {
  startYear: number,
  endYear: number
}

export enum NdcActionType {
  mainAction,
  subAction,
}

export enum NdcDetailsActionStatus {
  pending,
  approved
}
