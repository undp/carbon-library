import { FC } from 'react';
import { Programme } from '../../../Definitions/Definitions/programme.definitions';
export interface ProgrammeIssueFormProps {
    programme: Programme;
    onCancel: any;
    actionBtnText: string;
    onFinish: any;
    subText: string;
    enableIssue: boolean;
    t: any;
}
declare const ProgrammeIssueForm: FC<ProgrammeIssueFormProps>;
export default ProgrammeIssueForm;
