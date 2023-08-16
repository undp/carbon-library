export enum NdcActionStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
}

export const getNdcActionStatusEnumVal = (value: string) => {
  const index = Object.keys(NdcActionStatus).indexOf(value);
  if (index < 0) {
    return value;
  }
  return Object.values(NdcActionStatus)[index];
};

export const getNdcStatusTagType = (status: NdcActionStatus) => {
  switch (getNdcActionStatusEnumVal(status)) {
    case NdcActionStatus.PENDING:
      return "processing";
    case NdcActionStatus.APPROVED:
      return "success";
    default:
      return "default";
  }
};
