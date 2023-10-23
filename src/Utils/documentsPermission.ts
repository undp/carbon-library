import { CompanyRole, DocType, DocumentStatus, ProgrammeStageUnified, Role } from "../Definitions";

export const linkDocVisible = (docStatus: DocumentStatus) => {
  let visible = false;
  if (
    docStatus === DocumentStatus.PENDING ||
    docStatus === DocumentStatus.ACCEPTED ||
    docStatus === DocumentStatus.REJECTED
  ) {
    visible = true;
  }
  return visible;
};

export const uploadDocUserPermission = (
  userInfoState: any,
  docType: DocType,
  programmeOwnerId: any[],
  ministryLevelPermission?: boolean,
  programmeStatus?: any
) => {
  let permission = false;
  if(programmeStatus && programmeStatus === ProgrammeStageUnified.Rejected){
    return false;
  }
  if (docType === DocType.DESIGN_DOCUMENT) {
    if (
      (userInfoState?.companyRole === CompanyRole.GOVERNMENT ||
        (userInfoState?.companyRole === CompanyRole.MINISTRY && ministryLevelPermission)) &&
      userInfoState?.userRole !== Role.ViewOnly
    ) {
      permission = true;
    } else if (
      userInfoState?.companyRole === CompanyRole.PROGRAMME_DEVELOPER &&
      userInfoState?.userRole !== Role.ViewOnly
    ) {
      if (programmeOwnerId.includes(String(userInfoState?.companyId))) {
        permission = true;
      }
    }
  } else if (docType === DocType.METHODOLOGY_DOCUMENT || docType === DocType.MONITORING_REPORT || docType === DocType.ENVIRONMENTAL_IMPACT_ASSESSMENT) {
    if (
      (userInfoState?.companyRole === CompanyRole.GOVERNMENT ||
        userInfoState?.companyRole === CompanyRole.CERTIFIER ||
        (userInfoState?.companyRole === CompanyRole.MINISTRY && ministryLevelPermission)) &&
      userInfoState?.userRole !== Role.ViewOnly
    ) {
      permission = true;
    } else if (
      userInfoState?.companyRole === CompanyRole.PROGRAMME_DEVELOPER &&
      userInfoState?.userRole !== Role.ViewOnly
    ) {
      if (programmeOwnerId.includes(String(userInfoState?.companyId))) {
        permission = true;
      }
    }
  } else if (docType === DocType.VERIFICATION_REPORT) {
    if (
      (userInfoState?.companyRole === CompanyRole.GOVERNMENT ||
        userInfoState?.companyRole === CompanyRole.CERTIFIER ||
        (userInfoState?.companyRole === CompanyRole.MINISTRY && ministryLevelPermission)) &&
      userInfoState?.userRole !== Role.ViewOnly
    ) {
      permission = true;
    }
  }
  return permission;
};
