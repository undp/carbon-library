import { DataExportDto } from "./data.export.dto";

export class DataExportNdcActionDto extends DataExportDto {
    id;
    programmeId;
    programmeName;
    action;
    methodology;
    typeOfMitigation;
    agricultureLandArea;
    agricultureLandAreaUnit;
    solarEnergyGeneration;
    solarEnergyGenerationUnit;
    solarConsumerGroup;
    adaptationImplementingAgency;
    adaptationNationalPlanObjectives;
    adaptationNationalPlanCoverage;
    adaptationGhgEmissionsAvoidedCO2;
    adaptationGhgEmissionsAvoidedCH4;
    adaptationGhgEmissionsAvoidedN2O;
    adaptationGhgEmissionsAvoidedHFCs;
    adaptationGhgEmissionsAvoidedPFCs;
    adaptationGhgEmissionsAvoidedSF6;
    adaptationGhgEmissionsReducedCO2;
    adaptationGhgEmissionsReducedCH4;
    adaptationGhgEmissionsReducedN2O;
    adaptationGhgEmissionsReducedHFCs;
    adaptationGhgEmissionsReducedPFCs;
    adaptationGhgEmissionsReducedSF6;
    adaptationIncludedInNAP;
    ndcFinancingUserEstimatedCredits;
    ndcFinancingSystemEstimatedCredits;
    coBenefitsProperties;
    enablementTitle;
    enablementType;
    enablementReport;
    txTime;
    createdTime;
    constantVersion;
    sector;
    status;
    companyId;
    emissionReductionExpected;
    emissionReductionAchieved;
}