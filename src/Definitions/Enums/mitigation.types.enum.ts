export enum MitigationTypes {
  AGRICULTURE = "Agriculture",
  BIOMASS_ENERGY = "BiomassEnergy",
  CCS = "CCS",
  CEMENT = "Cement",
  COAL_MINE = "Coal/Mine",
  EE_HOUSEHOLDS = "EEHouseholds",
  EE_INDUSTRY = "EEIndustry",
  EE_OWN_GENERATION = "EEOwnGeneration",
  EE_SERVICE = "EEService",
  EE_SUPPLY_SIDE = "EESupplySide",
  ENERGY_DISTRIBUTION = "EnergyDistribution",
  FORESTRY = "Forestry",
  FOSSIL_FUEL = "FossilFuel",
  FUGITIVE = "Fugitive",
  GEOTHERMAL = "Geothermal",
  HFC_PFCS_SF6 = "HFC_PFCs_SF6",
  HYDRO = "Hydro",
  LANDFILLS = "Landfills",
  MARINE = "Marine",
  METHANE_AVOIDANCE = "MethaneAvoidance",
  N20 = "N20",
  SOLAR = "Solar",
  TRANSPORT = "Transport",
  WIND = "Wind",
}

export const mitigationTypeList = [
  { value: MitigationTypes.AGRICULTURE.valueOf(), label: "Agriculture" },
  { value: MitigationTypes.SOLAR.valueOf(), label: "Solar" },
  { value: MitigationTypes.BIOMASS_ENERGY.valueOf(), label: "Biomass energy" },
  { value: MitigationTypes.CCS.valueOf(), label: "CCS" },
  { value: MitigationTypes.CEMENT.valueOf(), label: "Cement" },
  {
    value: MitigationTypes.COAL_MINE.valueOf(),
    label: "Coal bed/mine methane",
  },
  { value: MitigationTypes.EE_HOUSEHOLDS.valueOf(), label: "EE households" },
  { value: MitigationTypes.EE_INDUSTRY.valueOf(), label: "EE industry" },
  {
    value: MitigationTypes.EE_OWN_GENERATION.valueOf(),
    label: "EE own generation",
  },
  { value: MitigationTypes.EE_SERVICE.valueOf(), label: "EE service" },
  { value: MitigationTypes.EE_SUPPLY_SIDE.valueOf(), label: "EE supply side" },
  {
    value: MitigationTypes.ENERGY_DISTRIBUTION.valueOf(),
    label: "Energy distribution",
  },
  { value: MitigationTypes.FORESTRY.valueOf(), label: "Forestry" },
  {
    value: MitigationTypes.FOSSIL_FUEL.valueOf(),
    label: "Fossil fuel switch",
  },
  { value: MitigationTypes.FUGITIVE.valueOf(), label: "Fugitive" },
  { value: MitigationTypes.GEOTHERMAL.valueOf(), label: "Geothermal" },
  { value: MitigationTypes.HFC_PFCS_SF6.valueOf(), label: "HFCs, PFCs, SF6" },
  { value: MitigationTypes.HYDRO.valueOf(), label: "Hydro" },
  { value: MitigationTypes.LANDFILLS.valueOf(), label: "Landfills" },
  { value: MitigationTypes.MARINE.valueOf(), label: "Marine" },
  {
    value: MitigationTypes.METHANE_AVOIDANCE.valueOf(),
    label: "Methane avoidance",
  },
  { value: MitigationTypes.N20.valueOf(), label: "N2O" },
  { value: MitigationTypes.TRANSPORT.valueOf(), label: "Transport" },
  { value: MitigationTypes.WIND.valueOf(), label: "Wind" },
];

export const sectorMitigationTypesListMapped: any = {
  Energy: [
    {
      value: MitigationTypes.BIOMASS_ENERGY.valueOf(),
      label: "Biomass energy",
    },
    {
      value: MitigationTypes.COAL_MINE.valueOf(),
      label: "Coal bed/mine methane",
    },
    { value: MitigationTypes.EE_HOUSEHOLDS.valueOf(), label: "EE households" },
    { value: MitigationTypes.EE_INDUSTRY.valueOf(), label: "EE industry" },
    {
      value: MitigationTypes.EE_OWN_GENERATION.valueOf(),
      label: "EE own generation",
    },
    { value: MitigationTypes.EE_SERVICE.valueOf(), label: "EE service" },
    {
      value: MitigationTypes.EE_SUPPLY_SIDE.valueOf(),
      label: "EE supply side",
    },
    {
      value: MitigationTypes.ENERGY_DISTRIBUTION.valueOf(),
      label: "Energy distribution",
    },
    {
      value: MitigationTypes.FOSSIL_FUEL.valueOf(),
      label: "Fossil fuel switch",
    },
    { value: MitigationTypes.GEOTHERMAL.valueOf(), label: "Geothermal" },
    { value: MitigationTypes.HYDRO.valueOf(), label: "Hydro" },
    { value: MitigationTypes.SOLAR.valueOf(), label: "Solar" },
    { value: MitigationTypes.WIND.valueOf(), label: "Wind" },
  ],
  Health: [],
  Education: [],
  Transport: [
    { value: MitigationTypes.TRANSPORT.valueOf(), label: "Transport" },
  ],
  Manufacturing: [
    { value: MitigationTypes.CEMENT.valueOf(), label: "Cement" },
    { value: MitigationTypes.CCS.valueOf(), label: "CCS" },
    { value: MitigationTypes.HFC_PFCS_SF6.valueOf(), label: "HFCs, PFCs, SF6" },
  ],
  Hospitality: [],
  Forestry: [{ value: MitigationTypes.FORESTRY.valueOf(), label: "Forestry" }],
  Waste: [
    { value: MitigationTypes.LANDFILLS.valueOf(), label: "Landfills" },
    { value: MitigationTypes.FUGITIVE.valueOf(), label: "Fugitive" },
    {
      value: MitigationTypes.METHANE_AVOIDANCE.valueOf(),
      label: "Methane avoidance",
    },
  ],
  Agriculture: [
    { value: MitigationTypes.AGRICULTURE.valueOf(), label: "Agriculture" },
  ],
  Other: [
    { value: MitigationTypes.MARINE.valueOf(), label: "Marine" },
    { value: MitigationTypes.N20.valueOf(), label: "N2O" },
  ],
};
