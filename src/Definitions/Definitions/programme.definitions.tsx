import { DateTime } from "luxon";
import { ProgrammeTransfer } from "../Entities/programmeTransfer";
import {
  GovBGColor,
  CertBGColor,
  DevBGColor,
} from "../../Styles/role.color.constants";

export enum ProgrammeStage {
  AwaitingAuthorization = "Pending",
  Authorised = "Authorised",
  // Transferred = 'Transferred',
  // Retired = 'Retired',
  Rejected = "Rejected",
  // Frozen = 'Frozen',
}

export enum ProgrammeStageMRV {
  AwaitingAuthorization = "Pending",
  Authorised = "Authorised",
  Approved = "Approved",
  Rejected = "Rejected",
}

// export enum ProgrammeTransferStage {
//   APPROVED = 'Approved',
//   REJECTED = 'Rejected',
//   PENDING = 'Pending',
//   // Frozen = 'Frozen',
// }

export enum Role {
  Root = "Root",
  Admin = "Admin",
  Manager = "Manager",
  ViewOnly = "ViewOnly",
}

export enum RetireType {
  CROSS_BORDER = "0",
  LEGAL_ACTION = "1",
  OTHER = "2",
}

export enum CreditTransferStage {
  Pending = "Pending",
  Approved = "Accepted",
  Rejected = "Rejected",
  Cancelled = "Cancelled",
  Recognised = "Recognised",
  NotRecognised = "NotRecognised",
}

export enum TxType {
  CREATE = "0",
  REJECT = "1",
  ISSUE = "2",
  TRANSFER = "3",
  CERTIFY = "4",
  RETIRE = "5",
  REVOKE = "6",
  FREEZE = "7",
  AUTH = "8",
  UNFREEZE = "9",
}

export enum SectoralScope {
  "Energy Industries (Renewable – / Non-Renewable Sources)" = "1",
  "Energy Distribution" = "2",
  "Energy Demand" = "3",
  "Manufacturing Industries" = "4",
  "Chemical Industries" = "5",
  "Construction" = "6",
  "Transport" = "7",
  "Mining/Mineral Production" = "8",
  "Metal Production" = "9",
  "Fugitive Emissions From Fuels (Solid, Oil and Gas)" = "10",
  "Fugitive Emissions From Production and Consumption of Halocarbons and Sulphur Hexafluoride" = "11",
  "Solvent Use" = "12",
  "Waste Handling and Disposal" = "13",
  "Afforestation and Reforestation" = "14",
  "Agriculture" = "15",
}

export enum TypeOfMitigation {
  AGRICULTURE = "Agriculture",
  SOLAR = "Solar",
}

export const getStageEnumVal = (value: string) => {
  const index = Object.keys(ProgrammeStage).indexOf(value);
  if (index < 0) {
    return value;
  }
  return Object.values(ProgrammeStage)[index];
};

export const getCreditStageVal = (value: string) => {
  const index = Object.keys(CreditTransferStage).indexOf(value);
  if (index < 0) {
    return value;
  }
  return Object.values(CreditTransferStage)[index];
};

export const getStageTransferEnumVal = (
  value: string,
  transfer: ProgrammeTransfer
) => {
  // if (transfer.isRetirement) {
  //   if (value === ProgrammeTransferStage.APPROVED) {
  //     return 'Recongnised';
  //   }
  //   if (value === ProgrammeTransferStage.REJECTED) {
  //     return 'Not Recongnised';
  //   }
  // }

  const index = Object.keys(CreditTransferStage).indexOf(value);
  if (index < 0) {
    return value;
  }
  return Object.values(CreditTransferStage)[index];
};

export const getStageTagType = (stage: ProgrammeStage) => {
  switch (getStageEnumVal(stage)) {
    case ProgrammeStage.AwaitingAuthorization:
      return "error";
    case ProgrammeStage.Authorised:
      return "processing";
    // case ProgrammeStage.Transferred:
    //   return 'success';
    default:
      return "default";
  }
};

export const getStageTagTypeMRV = (stage: ProgrammeStageMRV) => {
  switch (getStageEnumVal(stage)) {
    case ProgrammeStageMRV.AwaitingAuthorization:
      return "error";
    case ProgrammeStageMRV.Authorised:
      return "processing";
    case ProgrammeStageMRV.Approved:
      return "purple";
    default:
      return "default";
  }
};

export const getTransferStageTagType = (
  stage: CreditTransferStage,
  transfer: ProgrammeTransfer
) => {
  // if (transfer.isRetirement) {
  //   switch (getStageEnumVal(stage)) {
  //     case ProgrammeTransferStage.APPROVED:
  //       return 'purple';
  //     case ProgrammeTransferStage.REJECTED:
  //       return 'orange';
  //   }
  // }
  switch (getCreditStageVal(stage)) {
    case CreditTransferStage.Rejected:
      return "error";
    case CreditTransferStage.Approved:
      return "processing";
    case CreditTransferStage.Pending:
      return "success";
    case CreditTransferStage.Recognised:
      return "purple";
    case CreditTransferStage.NotRecognised:
      return "orange";
    default:
      return "default";
  }
};

export class UnitField {
  constructor(public unit: string, public value: any) {}
}

export enum CompanyRole {
  CERTIFIER = "Certifier",
  PROGRAMME_DEVELOPER = "ProgrammeDeveloper",
  MINISTRY = "Ministry",
  MRV = "MRV",
  GOVERNMENT = "Government",
  API = "API",
}

export interface ProgrammeProperties {
  maxInternationalTransferAmount: string;
  creditingPeriodInYears: number;
  programmeCostUSD: number;
  sourceOfFunding: any;
  grantEquivalentAmount: number;
  carbonPriceUSDPerTon: number;
  buyerCountryEligibility: string;
  geographicalLocation: string[];
  greenHouseGasses: any[];
  creditYear: number;
  programmeMaterials: [];
  projectMaterial: [];
}

export interface ProgrammePropertiesT {
  maxInternationalTransferAmount: string;
  creditingPeriodInYears: number;
  estimatedProgrammeCostUSD: number;
  sourceOfFunding: any;
  grantEquivalentAmount: number;
  carbonPriceUSDPerTon: number;
  buyerCountryEligibility: string;
  geographicalLocation: string[];
  greenHouseGasses: any[];
  creditYear: number;
  programmeMaterials: [];
  projectMaterial: [];
}

export interface Programme {
  programmeId: string;
  serialNo: string;
  title: string;
  sectoralScope: string;
  sector: string;
  countryCodeA2: string;
  currentStage: ProgrammeStage;
  startTime: number;
  endTime: number;
  creditChange: number;
  creditIssued: number;
  creditEst: number;
  creditBalance: number;
  creditTransferred: number[];
  creditRetired: number[];
  creditFrozen: number[];
  constantVersion: string;
  proponentTaxVatId: string[];
  companyId: number[];
  proponentPercentage: number[];
  creditOwnerPercentage: number[];
  certifierId: any[];
  certifier: any[];
  company: any[];
  creditUnit: string;
  programmeProperties: ProgrammeProperties;
  agricultureProperties: any;
  solarProperties: any;
  txTime: number;
  createdTime: number;
  txRef: string;
  typeOfMitigation: TypeOfMitigation;
  geographicalLocationCordintes: any;
}

export interface ProgrammeT {
  programmeId: string;
  serialNo: string;
  title: string;
  sectoralScope: string;
  sector: string;
  countryCodeA2: string;
  currentStage: ProgrammeStageMRV;
  startTime: number;
  endTime: number;
  creditChange: number;
  creditIssued: number;
  creditEst: number;
  creditBalance: number;
  creditTransferred: number[];
  creditRetired: number[];
  creditFrozen: number[];
  constantVersion: string;
  proponentTaxVatId: string[];
  companyId: number[];
  proponentPercentage: number[];
  creditOwnerPercentage: number[];
  certifierId: any[];
  certifier: any[];
  company: any[];
  creditUnit: string;
  programmeProperties: ProgrammePropertiesT;
  agricultureProperties: any;
  solarProperties: any;
  txTime: number;
  createdTime: number;
  txRef: string;
  typeOfMitigation: TypeOfMitigation;
  geographicalLocationCordintes: any;
  emissionReductionExpected: number;
  emissionReductionAchieved: number;
}

export const getGeneralFields = (programme: Programme) => {
  return {
    title: programme.title,
    serialNo: programme.serialNo,
    currentStatus: programme.currentStage,
    applicationType: "Programme Developer",
    sector: programme.sector,
    sectoralScope:
      Object.keys(SectoralScope)[
        Object.values(SectoralScope).indexOf(
          programme.sectoralScope as SectoralScope
        )
      ],
    startDate: DateTime.fromSeconds(Number(programme.startTime)),
    endDate: DateTime.fromSeconds(Number(programme.endTime)),
    buyerCountry: programme.programmeProperties.buyerCountryEligibility,
  };
};

export const addCommSep = (value: any) => {
  return (
    Number(value)
      // .toString()
      .toFixed(2)
      .replace(".00", "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
};

export const addCommSepRound = (value: any) => {
  return Number(value)
    .toFixed(2)
    .replace(".00", "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const addRoundNumber = (value: any) => {
  return Number(value.toFixed(2).replace(".00", ""));
};

export const addSpaces = (text: string) => {
  if (!text) {
    return text;
  }
  if (text === text.toUpperCase()) {
    return text;
  }
  return text.replace(/([A-Z])/g, " $1").trim();
};

export const getFinancialFields = (programme: Programme) => {
  return {
    programmeCost: addCommSep(programme.programmeProperties.programmeCostUSD),
    financingType: addSpaces(programme.programmeProperties.sourceOfFunding),
    grantEquivalent: new UnitField(
      "USD",
      addCommSep(programme.programmeProperties.grantEquivalentAmount)
    ),
    carbonPrice: addCommSep(programme.programmeProperties.carbonPriceUSDPerTon),
  };
};

export const getCompanyBgColor = (item: string) => {
  if (item === "Government") {
    return GovBGColor;
  } else if (item === "Certifier") {
    return CertBGColor;
  }
  return DevBGColor;
};

export const getRetirementTypeString = (retirementType: string | null) => {
  if (retirementType === null) {
    return "-";
  }

  switch (retirementType) {
    case "0":
      return "CROSS BORDER TRANSFER";
    case "1":
      return "LEGAL ACTION";
    case "2":
      return "OTHER";
  }
};

export const sumArray = (arrList: any[]) => {
  if (arrList === undefined || arrList === null) {
    return 0;
  }

  return arrList.reduce((a, b) => Number(a) + Number(b), 0);
};
