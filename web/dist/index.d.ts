import React from 'react';

declare const CompanyManagementComponent: (props: any) => React.JSX.Element;

declare const AddNewCompanyComponent: (props: any) => React.JSX.Element;

declare const CompanyProfileComponent: (props: any) => React.JSX.Element;

declare const UserManagementComponent: (props: any) => React.JSX.Element;

declare const ProgrammeManagementComponent: (props: any) => React.JSX.Element;

declare const ProgrammeViewComponent: (props: any) => React.JSX.Element;

declare const AddNewUserComponent: (props: any) => React.JSX.Element;

declare const UserProfileComponent: (props: any) => React.JSX.Element;

declare enum CompanyManagementColumns {
    logo = 0,
    name = 1,
    taxId = 2,
    companyRole = 3,
    programmeCount = 4,
    creditBalance = 5
}

declare enum UserManagementColumns {
    logo = 0,
    name = 1,
    email = 2,
    phoneNo = 3,
    company = 4,
    companyRole = 5,
    role = 6,
    actions = 7
}

declare enum ProgrammeManagementColumns {
    title = 0,
    company = 1,
    sector = 2,
    currentStage = 3,
    creditIssued = 4,
    creditBalance = 5,
    creditTransferred = 6,
    certifierId = 7,
    serialNo = 8
}

export { AddNewCompanyComponent, AddNewUserComponent, CompanyManagementColumns, CompanyManagementComponent, CompanyProfileComponent, ProgrammeManagementColumns, ProgrammeManagementComponent, ProgrammeViewComponent, UserManagementColumns, UserManagementComponent, UserProfileComponent };
