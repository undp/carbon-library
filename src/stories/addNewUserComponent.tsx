import React, { FC, useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  message,
  Radio,
  Tooltip,
  Skeleton,
} from "antd";
import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./addNewUserComponent.scss";
import "../Styles/app.scss";
import { EyeOutlined, StarOutlined, ToolOutlined } from "@ant-design/icons";
// import { User } from "../../../Definitions/Entities/user";
import * as Icon from "react-bootstrap-icons";
// import { plainToClass } from "class-transformer";
// import { Action } from "../../../Definitions/Enums/action.enum";
// import UserActionConfirmationModel from "../../Common/Models/userActionConfirmationModel";
// import ChangePasswordModel from "../../Common/Models/changePasswordModel";
import { Role } from "../Definitions";

export interface AddNewUserComponent {
  onNavigateToUserManagement?: any,
  onNavigateLogin?: any,
  themeColor?: any,
}


export const AddNewUserComponent: FC = (props: AddNewUserComponent) => {
  const {
    onNavigateToUserManagement,
    onNavigateLogin,
    themeColor,
  } = props;
  // const { post, put, delete: del, get } = useConnection();
  const [formOne] = Form.useForm();
  // const { state } = useLocation();
  const state: any = {}
  // const { updateToken } = useConnection();
  // const { removeUserInfo } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [actionInfo, setActionInfo] = useState<any>({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    useState(false);
  const [openPasswordChangeModal, setopenPasswordChangeModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<any>("");
  const userInfoState = { id: 12, userRole: "Root" }
  // const { userInfoState } = useUserContext();
  const ability = true;
  const [countries, setCountries] = useState<any[]>(['usa', 'srilanka']);
  const [isCountryListLoading, setIsCountryListLoading] = useState(false);

  const getCountryList = async () => {
    setIsCountryListLoading(true);
    try {
      const response: any = {}
      // const response = await get("national/organisation/countries");
      if (response.data) {
        const alpha2Names = response.data.map((item: any) => {
          return item.alpha2;
        });
        setCountries(alpha2Names);
      }
    } catch (error: any) {
      console.log("Error in getCountryList", error);
      message.open({
        type: "error",
        content: `${error.message}`,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    } finally {
      setIsCountryListLoading(false);
    }
  };

  const onAddUser = async (values: any) => {
    setLoading(true);
    try {
      if (values.phoneNo) {
        values.phoneNo = formatPhoneNumberIntl(values.phoneNo);
      } else {
        values.phoneNo = undefined;
      }
      const response: any = {}
      // const response = await post("national/user/add", values);
      if (response.status === 200 || response.status === 201) {
        message.open({
          type: "success",
          content: "success",
          duration: 3,
          style: { textAlign: "right", marginRight: 15, marginTop: 10 },
        });
        onNavigateToUserManagement();
        setLoading(false);
      }
    } catch (error: any) {
      console.log("Error in user creation", error);
      message.open({
        type: "error",
        content: `${error.message}`,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    } finally {
      setLoading(false);
    }
  };

  const onUpdateUser = async () => {
    setLoading(true);
    const formOneValues = formOne.getFieldsValue();
    formOneValues.phoneNo = formatPhoneNumberIntl(formOneValues.phoneNo);
    try {
      const values: any = {
        id: state?.record?.id,
        name: formOneValues?.name,
        phoneNo: formOneValues?.phoneNo,
      };

      // if (ability.can(Action.Update, plainToClass(User, state?.record), "role"))
      //   values.role = formOneValues?.role;

      // if (
      //   ability.can(Action.Update, plainToClass(User, state?.record), "email")
      // )
      //   values.email = formOneValues?.email;

      console.log("form one values   -- > ", values, state.record);
      const response: any = {}
      // const response = await put("national/user/update", values);
      if (response.status === 200 || response.status === 201) {
        message.open({
          type: "success",
          content: "update success",
          duration: 3,
          style: { textAlign: "right", marginRight: 15, marginTop: 10 },
        });
        onNavigateToUserManagement();
        state.record = {};
        setLoading(false);
      }
    } catch (error: any) {
      console.log("Error in user update", error);
      message.open({
        type: "error",
        content: `failed ${error.message}`,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
    }
  };

  const onSubmitData = async (values: any) => {
    if (isUpdate) onUpdateUser();
    else onAddUser(values);
  };

  const signOut = (): void => {
    onNavigateLogin();
    // updateToken();
    // removeUserInfo();
  };

  const onDeleteProfileUser = () => {
    setActionInfo({
      action: "Delete",
      headerText: `header`,
      text: `$delete text`,
      type: "danger",
      icon: <Icon.PersonDash />,
    });
    setErrorMsg("");
    setOpenDeleteConfirmationModal(true);
  };

  const onDeleteProfileUserCanceled = () => {
    setOpenDeleteConfirmationModal(false);
    setErrorMsg("");
  };

  const onDeleteProfileUserConfirmed = async () => {
    try {
      setIsLoading(true);
      const userId = userInfoState?.id;
      const response: any = {}
      // const response = await del(`national/user/delete?userId=${userId}`);
      setOpenDeleteConfirmationModal(false);
      message.open({
        type: "success",
        content: "content",
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      setErrorMsg("");
      signOut();
    } catch (exception: any) {
      setErrorMsg(exception.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordChangeCompleted = async (props: any) => {
    setIsLoading(true);
    try {
      const response: any = {}
      // const response = await put("national/user/resetPassword", {
      //   newPassword: props.newPassword,
      //   oldPassword: props.oldPassword,
      // });
      const responseMsg = response.message;
      setopenPasswordChangeModal(false);
      message.open({
        type: "success",
        content: responseMsg,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      setErrorMsg("");
      signOut();
    } catch (exception: any) {
      setErrorMsg(exception.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangedPassword = () => {
    setErrorMsg("");
    setopenPasswordChangeModal(true);
  };

  const onPasswordChangeCanceled = () => {
    setopenPasswordChangeModal(false);
  };

  const onFormsValueChanged = async () => {
    setErrorMsg("");
  };

  useEffect(() => {
    console.log("state -- val --- ", { ...state });
    getCountryList();
    setIsUpdate(state?.record ? true : false);
  }, []);

  return (
    <div className="add-user-main-container">
      <div className="title-container">
        <div className="titles">
          <div className="main">
            {isUpdate ? "edit" : "Add User1"}
          </div>
          <div className="sub">
            {state?.record?.name
              ? "editUserSub"
              : "Add user to  Carbon registry"}
          </div>
        </div>
        {isUpdate && (
          <div className="actions">
            {userInfoState?.userRole !== Role.Root && (
              <Button
                className="mg-left-1 btn-danger"
                onClick={() => onDeleteProfileUser()}
              >
                Delete
              </Button>
            )}
            <Button
              className="mg-left-1"
              type="primary"
              onClick={onChangedPassword}
            >
              Change password
            </Button>
          </div>
        )}
      </div>
      <div className="content-card user-content-card">
        <Form
          name="user-details"
          className="user-details-form"
          layout="vertical"
          form={formOne}
          requiredMark={true}
          onFinish={onSubmitData}
        >
          <Row className="row" gutter={[16, 16]}>
            <Col xl={12} md={24}>
              <div className="details-part-one">
                <Form.Item
                  label="Name"
                  initialValue={state?.record?.name}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                    {
                      validator: async (rule, value) => {
                        if (
                          String(value).trim() === "" ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error(
                            `name is required`
                          );
                        }
                      },
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  initialValue={state?.record?.email}
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                    {
                      validator: async (rule, value) => {
                        if (
                          String(value).trim() === "" ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error(
                            `Email is required`
                          );
                        } else {
                          const val = value.trim();
                          const reg =
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                          const matches = val.match(reg) ? val.match(reg) : [];
                          if (matches.length === 0) {
                            throw new Error(
                              `Email is invalid`
                            );
                          }
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    disabled={
                      isUpdate
                    }
                    size="large"
                  />
                </Form.Item>
              </div>
            </Col>
            <Col xl={12} md={24}>
              <div className="details-part-two">
                <Form.Item
                  className="role-group"
                  label="User role"
                  initialValue={state?.record?.role}
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: `User role is required"
                      )}`,
                    },
                  ]}
                >
                  <Radio.Group
                    value={state?.record?.role}
                    size="large"
                    disabled={
                      isUpdate
                    }
                  >
                    <div className="admin-radio-container">
                      <Tooltip
                        placement="top"
                        title="text"
                      >
                        <Radio.Button className="admin" value="Admin">
                          <StarOutlined className="role-icons" />
                          Admin
                        </Radio.Button>
                      </Tooltip>
                    </div>
                    <div className="manager-radio-container">
                      <Tooltip
                        placement="top"
                        title="text"
                      >
                        <Radio.Button className="manager" value="Manager">
                          <ToolOutlined className="role-icons" />
                          Manager
                        </Radio.Button>
                      </Tooltip>
                    </div>
                    <div className="view-only-radio-container">
                      <Tooltip
                        placement="top"
                        title="text"
                      >
                        <Radio.Button className="view-only" value="ViewOnly">
                          <EyeOutlined className="role-icons" />
                          Viewer
                        </Radio.Button>
                      </Tooltip>
                    </div>
                  </Radio.Group>
                </Form.Item>
                <Skeleton loading={isCountryListLoading} active>
                  {countries.length > 0 && (
                    <Form.Item
                      name="phoneNo"
                      label="Phone No"
                      initialValue={state?.record?.phoneNo}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <PhoneInput
                        placeholder="Phone No"
                        international
                        // value={contactNoInput}
                        defaultCountry="LK"
                        countryCallingCodeEditable={false}
                        onChange={(v) => { }}
                        countries={countries}
                      />
                    </Form.Item>
                  )}
                </Skeleton>
              </div>
            </Col>
          </Row>
          <div className="actions">
            <Form.Item>
              <div className="create-user-btn-container">
                <Button type="primary" htmlType="submit" loading={loading}>
                  {isUpdate ? "Update" : "SUBMIT"}
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
      {/* <UserActionConfirmationModel
        t={t}
        actionInfo={actionInfo}
        onActionConfirmed={onDeleteProfileUserConfirmed}
        onActionCanceled={onDeleteProfileUserCanceled}
        openModal={openDeleteConfirmationModal}
        errorMsg={errorMsg}
        loading={isLoading}
      />
      <ChangePasswordModel
        t={t}
        onPasswordChanged={onPasswordChangeCompleted}
        onFieldsChanged={onFormsValueChanged}
        onCanceled={onPasswordChangeCanceled}
        openModal={openPasswordChangeModal}
        errorMsg={errorMsg}
        loadingBtn={isLoading}
        themeColor={themeColor}
      ></ChangePasswordModel> */}
    </div>
  );
};
