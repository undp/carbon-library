import { DateTime } from "luxon";
import { ProgrammeTransfer } from '../Entities/programmeTransfer';
export declare enum ProgrammeStage {
    AwaitingAuthorization = "Pending",
    Authorised = "Authorised",
    Rejected = "Rejected"
}
export declare enum Role {
    Root = "Root",
    Admin = "Admin",
    Manager = "Manager",
    ViewOnly = "ViewOnly"
}
export declare enum RetireType {
    CROSS_BORDER = "0",
    LEGAL_ACTION = "1",
    OTHER = "2"
}
export declare enum CreditTransferStage {
    Pending = "Pending",
    Approved = "Accepted",
    Rejected = "Rejected",
    Cancelled = "Cancelled",
    Recognised = "Recognised",
    NotRecognised = "NotRecognised"
}
export declare enum TxType {
    CREATE = "0",
    REJECT = "1",
    ISSUE = "2",
    TRANSFER = "3",
    CERTIFY = "4",
    RETIRE = "5",
    REVOKE = "6",
    FREEZE = "7",
    AUTH = "8",
    UNFREEZE = "9"
}
export declare enum SectoralScope {
    "Energy Industry" = "1",
    "Energy Distribution" = "2",
    "Agriculture" = "15"
}
export declare enum TypeOfMitigation {
    AGRICULTURE = "Agriculture",
    SOLAR = "Solar"
}
export declare const getStageEnumVal: (value: string) => string;
export declare const getCreditStageVal: (value: string) => string;
export declare const getStageTransferEnumVal: (value: string, transfer: ProgrammeTransfer) => string;
export declare const getStageTagType: (stage: ProgrammeStage) => "error" | "processing" | "default";
export declare const getTransferStageTagType: (stage: CreditTransferStage, transfer: ProgrammeTransfer) => "orange" | "purple" | "error" | "processing" | "default" | "success";
export declare class UnitField {
    unit: string;
    value: any;
    constructor(unit: string, value: any);
}
export declare enum CompanyRole {
    CERTIFIER = "Certifier",
    PROGRAMME_DEVELOPER = "ProgrammeDeveloper",
    MRV = "MRV",
    GOVERNMENT = "Government"
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
export declare const getGeneralFields: (programme: Programme) => {
    title: string;
    serialNo: string;
    currentStatus: ProgrammeStage;
    applicationType: string;
    sector: string;
    sectoralScope: string;
    startDate: DateTime;
    endDate: DateTime;
    buyerCountry: string;
};
export declare const addCommSep: (value: any) => string;
export declare const addCommSepRound: (value: any) => string;
export declare const addRoundNumber: (value: any) => number;
export declare const addSpaces: (text: string) => string;
export declare const getFinancialFields: (programme: Programme) => {
    programmeCost: string;
    financingType: string;
    grantEquivalent: UnitField;
    carbonPrice: string;
};
export declare const getCompanyBgColor: (item: string) => "rgba(185, 226, 244, 0.56)" | "rgba(254, 241, 173, 0.55)" | "rgba(128, 255, 0, 0.12)";
export declare const getRetirementTypeString: (retirementType: string | null) => "-" | "CROSS BORDER TRANSFER" | "LEGAL ACTION" | "OTHER" | undefined;
export declare const sumArray: (arrList: any[]) => any;
