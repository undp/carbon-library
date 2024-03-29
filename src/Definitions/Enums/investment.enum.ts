export enum InvestmentLevel {
  NATIONAL = "National",
  INTERNATIONAL = "International",
}

export enum InvestmentStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
}

export const getInvestmentStatusEnumVal = (value: string) => {
  const index = Object.keys(InvestmentStatus).indexOf(value);
  if (index < 0) {
    return value;
  }
  return Object.values(InvestmentStatus)[index];
};

export const getStatusTagType = (status: InvestmentStatus) => {
  switch (getInvestmentStatusEnumVal(status)) {
    case InvestmentStatus.REJECTED:
      return "error";
    case InvestmentStatus.PENDING:
      return "processing";
    case InvestmentStatus.APPROVED:
      return "success";
    default:
      return "default";
  }
};

export enum InvestmentType {
  PUBLIC = "Public",
  PRIVATE = "Private",
}

export enum InvestmentStream {
  CLIMATE_FINANCE = "ClimateFinance",
  CARBON_MARKET = "CarbonMarket",
}
