import React, { FC } from 'react';
import './timelineBody.scss';

export interface TimelineBodyProps {
  text: string;
  remark?: string | null;
  via?: string | null;
  t:any;
}

const TimelineBody: FC<TimelineBodyProps> = (props: TimelineBodyProps) => {
  const { text, remark, via, t } = props;
  return (
    <div>
      <div>
        {text}
        {via && <span>{` ${t('view:via')} ${via}`}</span>}
      </div>
      {remark && remark !== 'undefined' && remark !== 'null' && (
        <div className="remark">
          <div className="remark-title">{t('view:remarks')}</div>
          <div className="remark-body">{remark}</div>
        </div>
      )}
    </div>
  );
};

export default TimelineBody;
