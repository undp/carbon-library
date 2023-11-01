export enum EnablementTypes {
    CapacityBuilding = 'Capacity Building',
    // // InstitutionalArrangement = 'Institutional Arrangement',
    // StakeholderFramework = 'Stakeholder Framework',
    TechnologyTransfer = 'Technology Transfer',
    Financial = 'FInancial',
  }
  
  export const enablementTypesAndValues = [
    { type: EnablementTypes.CapacityBuilding.valueOf(), col: 4 },
    {
      type: EnablementTypes.TechnologyTransfer.valueOf(),
      col: 5,
    },
    { type: EnablementTypes.Financial.valueOf(), col: 4 },
    // { type: EnablementTypes.TechnologyTransfer.valueOf(), col: 4 },
  ];
  