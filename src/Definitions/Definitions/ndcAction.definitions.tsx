import { BuildingType } from "@undp/carbon-credit-calculator";
import { NdcActionTypes } from "../Enums/ndcActionTypes.enum";
import { MitigationTypes } from "../Enums/mitigation.types.enum";
import { NdcActionStatus } from "../Enums/ndcAction.status.enum";

export interface AgricultureProperties {
  landArea: number;
  landAreaUnit: string;
}

export interface SolarProperties {
  energyGeneration: number;
  energyGenerationUnit: string;
  consumerGroup: BuildingType;
}

export interface AdaptationProperties {
  implementingAgency: string;
  nationalPlanObjectives: string;
  nationalPlanCoverage: string;
  ghgEmissionsReduced: any;
  ghgEmissionsAvoided: any;
}

export interface CoBenefitsProperties {}

export interface EnablementProperties {
  title: string;
  type?: any[];
  report?: string;
}

export interface NdcFinancing {
  userEstimatedCredits: number;
  systemEstimatedCredits: number;
}

export interface NdcAction {
  programmeId: string;
  programmeName: string;
  action: NdcActionTypes;
  methodology: string;
  typeOfMitigation: MitigationTypes;
  agricultureProperties?: AgricultureProperties;
  solarProperties?: SolarProperties;
  adaptationProperties: AdaptationProperties;
  ndcFinancing?: NdcFinancing;
  monitoringReport?: string;
  coBenefitsProperties?: CoBenefitsProperties;
  enablementProperties?: EnablementProperties;
  constantVersion: string;
  id?: string;
  externalId?: string;
  status: NdcActionStatus;
  sector: string;
}
