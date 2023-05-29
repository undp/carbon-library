import { FC } from "react";
export interface ChangePasswordProps {
    t: any;
    onPasswordChanged: any;
    onFieldsChanged: any;
    onCanceled: any;
    openModal: any;
    errorMsg: any;
    loadingBtn: boolean;
}
declare const ChangePasswordModel: FC<ChangePasswordProps>;
export default ChangePasswordModel;
