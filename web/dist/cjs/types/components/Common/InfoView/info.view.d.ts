import { FC } from 'react';
import './info.view.scss';
export interface InfoViewProps {
    data: any;
    title: any;
    icon: any;
    hiddenColumns?: any;
}
declare const InfoView: FC<InfoViewProps>;
export default InfoView;
