import { FC } from 'react';
import './timelineBody.scss';
export interface TimelineBodyProps {
    text: string;
    remark?: string | null;
    via?: string | null;
    t: any;
}
declare const TimelineBody: FC<TimelineBodyProps>;
export default TimelineBody;
