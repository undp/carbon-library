import { FC } from "react";
export interface UserActionProps {
    t: any;
    actionInfo: any;
    onActionConfirmed: any;
    onActionCanceled: any;
    openModal: any;
    errorMsg: any;
    loading: any;
}
declare const UserActionConfirmationModel: FC<UserActionProps>;
export default UserActionConfirmationModel;
