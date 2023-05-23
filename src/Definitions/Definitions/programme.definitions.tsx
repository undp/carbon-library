export const addCommSep = (value: any) => {
  return (
    Number(value)
      // .toString()
      .toFixed(2)
      .replace(".00", "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
};

export enum CompanyRole {
  CERTIFIER = "Certifier",
  PROGRAMME_DEVELOPER = "ProgrammeDeveloper",
  MRV = "MRV",
  GOVERNMENT = "Government",
}
