import React from 'react';
import './organisationStatus.scss';
export interface OrganisationStatusProps {
    organisationStatus: number;
    t: any;
}
declare const OrganisationStatus: (props: OrganisationStatusProps) => React.JSX.Element;
export default OrganisationStatus;
