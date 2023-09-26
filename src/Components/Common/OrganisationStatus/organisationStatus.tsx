import React from 'react';
import './organisationStatus.scss';

export interface OrganisationStatusProps {
  organisationStatus: number;
  t: any;
}

export const OrganisationStatus = (props: OrganisationStatusProps) => {
  const { organisationStatus, t } = props;

  return organisationStatus === 1 ? (
    <div className="mg-top-1 organisation-status-active">{t('companyProfile:activeStatus')}</div>
  ) : (
    <div className="mg-top-1 organisation-status-deauthorised">
      {t('companyProfile:deauthorisedStatus')}
    </div>
  );
};

