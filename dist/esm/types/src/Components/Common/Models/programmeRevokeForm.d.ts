import { FC } from 'react';
import { Programme } from '../../../Definitions/Definitions/programme.definitions';
export interface ProgrammeRevokeFormProps {
    programme: Programme;
    onCancel: any;
    actionBtnText: string;
    onFinish: any;
    subText: string;
    showCertifiers: boolean;
    t: any;
}
declare const ProgrammeRevokeForm: FC<ProgrammeRevokeFormProps>;
export default ProgrammeRevokeForm;
