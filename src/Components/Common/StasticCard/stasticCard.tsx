import React, { FC } from 'react';
import './stasticCard.scss';
import { Skeleton, Tooltip } from 'antd';
import { addCommSep } from '../../../Definitions/Definitions/programme.definitions';
import { ClockHistory, BoxArrowRight, Diamond, Gem, InfoCircle } from 'react-bootstrap-icons';
import { toolTipTextGen } from '../../../Definitions/Definitions/dashboard.definitions';

export interface StasticCardItemProps {
  value: number;
  title: string;
  updatedDate: any;
  icon: any;
  loading: boolean;
  companyRole: any;
}

const StasticCard: FC<StasticCardItemProps> = (props: StasticCardItemProps) => {
  const { value, title, updatedDate, icon, loading, companyRole } = props;

  return (
    <div className="stastic-card-main-container">
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <div className="title-section">
            <div className="title">{title}</div>
            <div className="info-container">
              <Tooltip
                arrowPointAtCenter
                placement="bottomRight"
                trigger="hover"
                title={toolTipTextGen(companyRole, title)}
              >
                <InfoCircle color="#000000" size={17} />
              </Tooltip>
            </div>
          </div>
          <div className="values-section">
            <div className="values-and-unit">
              {title.includes('Credit') && <div className="unit">ITMOs</div>}
              <div className="value">
                {title.includes('Credit')
                  ? value === 0 || String(value) === 'NaN'
                    ? 0
                    : addCommSep(value)
                  : value}
              </div>
            </div>
            <div className="icon-section">{icon}</div>
          </div>
          {updatedDate !== '0' && <div className="updated-on">{updatedDate}</div>}
        </>
      )}
    </div>
  );
};

export default StasticCard;
