import { FC } from 'react';
import { Programme } from '../../../Definitions/Definitions/programme.definitions';
export interface ProgrammeRetireFormProps {
    programme: Programme;
    onCancel: any;
    actionBtnText: string;
    onFinish: any;
    subText?: string;
    hideType: boolean;
    myCompanyId?: number;
    t: any;
    useConnection: any;
}
declare const ProgrammeRetireForm: FC<ProgrammeRetireFormProps>;
export default ProgrammeRetireForm;
