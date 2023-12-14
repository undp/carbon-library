import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Tooltip,
  Upload,
  message,
} from "antd";
import PhoneInput, {
  formatPhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";
import {
  AuditOutlined,
  BankOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./addNewCompanyComponent.scss";
import "../../../Styles/app.scss";
import { RcFile, UploadFile } from "antd/lib/upload";
import { UserProps } from "../../../Definitions/Definitions/userInformationContext.definitions";
import validator from "validator";
import {
  CarbonSystemType,
  SectoralScope,
  getBase64,
} from "../../../Definitions";
import { CompanyRole } from "../../../Definitions/Enums/company.role.enum";

export const AddNewCompanyComponent = (props: any) => {
  const {
    t,
    onNavigateToCompanyManagement,
    maximumImageSize,
    useConnection,
    useUserContext,
    useLocation,
    regionField,
    isGuest,
    onNavigateToHome,
    systemType,
  } = props;
  const [formOne] = Form.useForm();
  const [formTwo] = Form.useForm();
  const [stepOneData, setStepOneData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [contactNoInput] = useState<any>();
  const [current, setCurrent] = useState<number>(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const { put, get, post } = useConnection();
  const { setUserInfo, userInfoState } = useUserContext();
  const { state } = useLocation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [countries, setCountries] = useState<[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [regionsList, setRegionsList] = useState<any[]>([]);
  const [companyRole, setCompanyRole] = useState<any>(
    state?.record?.companyRole
  );

  const getCountryList = async () => {
    const response = await get("national/organisation/countries");
    if (response.data) {
      const alpha2Names = response.data.map((item: any) => {
        return item.alpha2;
      });
      setCountries(alpha2Names);
    }
  };

  const getRegionList = async () => {
    setLoadingList(true);
    try {
      const response = await post("national/organisation/regions", {
        page: 1,
        size: 100,
        filterAnd: [
          {
            key: "lang",
            operation: "=",
            value: "en",
          },
        ],
      });
      if (response.data) {
        const regionNames = response.data.map((item: any) => item.regionName);
        setRegionsList([t("national"), ...regionNames]);
      }
    } catch (error: any) {
      console.log("Error in getting regions list", error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    setIsUpdate(state?.record ? true : false);
    getCountryList();
    getRegionList();
    if (state?.record?.logo) {
      setFileList([
        {
          uid: "1",
          name: `${state?.record?.name}.png`,
          status: "done",
          url: state?.record?.logo,
          type: "image/png",
        },
      ]);
    }
  }, []);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const nextOne = (val: any) => {
    setCurrent(current + 1);
    setStepOneData(val);
  };

  const prevOne = () => {
    setCurrent(current - 1);
  };

  const onFinishStepOne = (values: any) => {
    nextOne(values);
  };

  const onChangeRegion = (values: any[]) => {
    if (values.includes(t("national"))) {
      const buyerCountryValues = regionsList;
      const newBuyerValues = buyerCountryValues?.filter(
        (item: any) => item !== t("national")
      );
      formOne.setFieldValue("regions", [...newBuyerValues]);
    }
  };

  const onFinishStepTwo = async (values: any) => {
    const requestData = {
      ...values,
      role: "Admin",
      company: { ...stepOneData },
    };
    setLoading(true);
    try {
      if (requestData.phoneNo) {
        requestData.phoneNo = formatPhoneNumberIntl(requestData.phoneNo);
      } else {
        requestData.phoneNo = undefined;
      }
      requestData.company.phoneNo = formatPhoneNumberIntl(
        requestData.company.phoneNo
      );
      if (requestData.company.website) {
        requestData.company.website = "https://" + requestData.company.website;
      } else {
        requestData.company.website = undefined;
      }
      const logoBase64 = await getBase64(
        requestData?.company?.logo[0]?.originFileObj as RcFile
      );
      const logoUrls = logoBase64.split(",");
      requestData.company.logo = logoUrls[1];

      if (isGuest) {
        const response = await post("national/user/register", requestData);
        if (response.status === 200 || response.status === 201) {
          message.open({
            type: "success",
            content: t("companyRegisteredSuccess"),
            duration: 3,
            style: { textAlign: "right", marginRight: 15, marginTop: 10 },
          });
          onNavigateToHome();
          setLoading(false);
        }
      } else {
        const response = await post("national/user/add", requestData);
        if (response.status === 200 || response.status === 201) {
          if (isUpdate) {
            setUserInfo({
              companyLogo: response.data.logo,
            } as UserProps);
          }
          message.open({
            type: "success",
            content: t("companyAddedSuccess"),
            duration: 3,
            style: { textAlign: "right", marginRight: 15, marginTop: 10 },
          });
          onNavigateToCompanyManagement();
          setLoading(false);
        }
      }
    } catch (error: any) {
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

  const onUpdateCompany = async () => {
    setLoading(true);
    const formOneValues = formOne.getFieldsValue();
    formOneValues.phoneNo = formatPhoneNumberIntl(formOneValues.phoneNo);

    try {
      let values: any = {};
      if (regionField) {
        values = {
          companyId: state?.record?.companyId,
          name: formOneValues.name,
          email: formOneValues.email,
          phoneNo: formOneValues.phoneNo,
          address: formOneValues.address,
          regions: formOneValues.regions,
          companyRole: state?.record?.companyRole,
        };
      } else {
        values = {
          companyId: state?.record?.companyId,
          name: formOneValues.name,
          email: formOneValues.email,
          phoneNo: formOneValues.phoneNo,
          address: formOneValues.address,
          companyRole: state?.record?.companyRole,
        };
      }

      if (
        state?.record?.companyRole !== CompanyRole.GOVERNMENT &&
        state?.record?.companyRole !== CompanyRole.MINISTRY
      ) {
        values.taxId = formOneValues.taxId;
        values.paymentId = formOneValues.paymentId;
      }

      if (state?.record?.companyRole === CompanyRole.MINISTRY) {
        values.sectoralScope = formOneValues.sectoralScope;
        values.nameOfMinister = formOneValues.nameOfMinister;
      }
      if (state?.record?.companyRole === CompanyRole.GOVERNMENT) {
        values.omgePercentage = Math.round(
          Number(formOneValues.omgePercentage)
        );
      }
      if (state?.record?.companyRole === CompanyRole.GOVERNMENT) {
        values.nationalSopValue = Math.floor(
          Number(formOneValues.nationalSopValue)
        );
      }

      if (formOneValues.website) {
        values.website = "https://" + formOneValues.website;
      } else {
        values.website = undefined;
      }

      if (formOneValues.logo) {
        if (formOneValues.logo.length !== 0) {
          const logoBase64 = await getBase64(
            formOneValues.logo[0]?.originFileObj as RcFile
          );
          const logoUrls = logoBase64.split(",");
          values.logo = logoUrls[1];
        }
      }

      const response = await put("national/organisation/update", values);
      if (response.status === 200 || response.status === 201) {
        setUserInfo({
          companyLogo: response.data.logo,
        } as UserProps);
        message.open({
          type: "success",
          content: t("companyUpdatedSuccess"),
          duration: 3,
          style: { textAlign: "right", marginRight: 15, marginTop: 10 },
        });
        onNavigateToCompanyManagement();
      }
      setLoading(false);
    } catch (error: any) {
      message.open({
        type: "error",
        content: `${t("errorInUpdatingCompany")} ${error.message}`,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
    }
  };

  const onCancel = () => {
    onNavigateToCompanyManagement();
  };

  const onChangeCompanyRole = (event: any) => {
    const value = event.target.value;
    setCompanyRole(value);
  };

  const CompanyDetailsForm = () => {
    const companyRoleClassName =
      companyRole === CompanyRole.CERTIFIER
        ? "certifier"
        : companyRole === CompanyRole.PROGRAMME_DEVELOPER
        ? "dev"
        : companyRole === CompanyRole.MINISTRY
        ? "minister"
        : "gov";
    return (
      <div className="company-details-form-container">
        <div className="company-details-form">
          <Form
            name="company-details"
            className="company-details-form"
            layout="vertical"
            requiredMark={true}
            form={formOne}
            onFinish={isUpdate ? onUpdateCompany : onFinishStepOne}
          >
            <Row className="row" gutter={[16, 16]}>
              <Col xl={12} md={24}>
                <div className="details-part-one">
                  <Form.Item
                    label="Name"
                    name="name"
                    initialValue={state?.record?.name}
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
                            throw new Error(`Name ${t("isRequired")}`);
                          }
                        },
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                  {companyRole !== CompanyRole.MINISTRY
                    ? (!isUpdate ||
                        (isUpdate &&
                          companyRole !== CompanyRole.GOVERNMENT)) && (
                        <Form.Item
                          label="Tax ID"
                          initialValue={state?.record?.taxId}
                          name="taxId"
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
                                  throw new Error(`Tax ID ${t("isRequired")}`);
                                }
                              },
                            },
                          ]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      )
                    : null}
                  {companyRole !== CompanyRole.MINISTRY
                    ? (!isUpdate ||
                        (isUpdate &&
                          companyRole !== CompanyRole.GOVERNMENT)) && (
                        <Form.Item
                          label="Registration Payment ID"
                          initialValue={state?.record?.paymentId}
                          name="paymentId"
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
                                    `Registration Payment ID ${t("isRequired")}`
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      )
                    : null}
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
                            throw new Error(`Email ${t("isRequired")}`);
                          } else {
                            const val = value.trim();
                            const reg =
                              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            const matches = val.match(reg)
                              ? val.match(reg)
                              : [];
                            if (matches.length === 0) {
                              throw new Error(`Email ${t("isInvalid")}`);
                            }
                          }
                        },
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item
                    className="website"
                    label="Website"
                    initialValue={state?.record?.website?.split("://")[1]}
                    name="website"
                    rules={[
                      {
                        required: false,
                        validator: async (rule, value) => {
                          if (
                            String(value).trim() !== "" ||
                            String(value).trim() !== undefined ||
                            value !== null ||
                            value !== undefined
                          ) {
                            if (value && !validator.isURL("https://" + value))
                              throw new Error(`Website ${t("isInvalid")}`);
                          }
                        },
                      },
                    ]}
                    getValueFromEvent={(event: any) =>
                      event?.target?.value.trim()
                    }
                  >
                    <Input addonBefore="https://" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="logo"
                    label="Organisation Logo (File Type : JPEG , PNG)"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    required={true}
                    rules={[
                      {
                        validator: async (rule, file) => {
                          if (file === null || file === undefined) {
                            if (!state?.record?.logo)
                              throw new Error(
                                `Organisation Logo ${t("isRequired")}`
                              );
                          } else {
                            if (file.length === 0) {
                              throw new Error(
                                `Organisation Logo ${t("isRequired")}`
                              );
                            } else {
                              let isCorrectFormat = false;
                              if (file[0]?.type === "image/png") {
                                isCorrectFormat = true;
                              } else if (file[0]?.type === "image/jpeg") {
                                isCorrectFormat = true;
                              } else if (file[0]?.type === "image/svg") {
                                isCorrectFormat = true;
                              }
                              if (!isCorrectFormat) {
                                throw new Error(`${t("unsupportedFormat")}`);
                              } else if (file[0]?.size > maximumImageSize) {
                                // default size format of files would be in bytes -> 1MB = 1000000bytes
                                throw new Error(`${t("maxUploadSize")}`);
                              }
                            }
                          }
                        },
                      },
                    ]}
                  >
                    <Upload
                      beforeUpload={(file) => {
                        return false;
                      }}
                      className="logo-upload-section"
                      name="logo"
                      action="/upload.do"
                      listType="picture"
                      multiple={false}
                      defaultFileList={fileList}
                      maxCount={1}
                    >
                      <Button size="large" icon={<UploadOutlined />}>
                        Upload
                      </Button>
                    </Upload>
                  </Form.Item>
                  {companyRole === CompanyRole.MINISTRY && (
                    <Form.Item
                      name="address"
                      label="Address"
                      initialValue={state?.record?.address}
                      rules={[
                        { required: true, message: "" },
                        {
                          validator: async (rule, value) => {
                            if (
                              String(value).trim() === "" ||
                              String(value).trim() === undefined ||
                              value === null ||
                              value === undefined
                            ) {
                              throw new Error(`Address ${t("isRequired")}`);
                            }
                          },
                        },
                      ]}
                    >
                      <Input.TextArea rows={3} maxLength={100} />
                    </Form.Item>
                  )}
                  {companyRole === CompanyRole.GOVERNMENT && (
                    <div className="space-container" style={{ width: "100%" }}>
                      <Space
                        wrap={true}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                        }}
                        align="center"
                        size={"large"}
                      >
                        <Form.Item
                          style={{ width: "100%" }}
                          name="nationalSopValue"
                          label="National Share of Proceeds"
                          initialValue={state?.record?.nationalSopValue}
                          rules={[
                            { required: true, message: "" },
                            {
                              validator: async (rule, value) => {
                                if (
                                  String(value).trim() === "" ||
                                  String(value).trim() === undefined ||
                                  value === null ||
                                  value === undefined
                                ) {
                                  throw new Error(
                                    `National Share of Proceeds  ${t(
                                      "isRequired"
                                    )}`
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            size="large"
                            min={0}
                            max={99}
                            formatter={(value) => `${value}%`}
                            parser={(value: any) => value.replace("%", "")}
                            disabled={systemType == CarbonSystemType.REGISTRY}
                          />
                        </Form.Item>
                      </Space>
                    </div>
                  )}
                </div>
              </Col>
              <Col xl={12} md={24}>
                <div className="details-part-two">
                  <Form.Item
                    className="role-group"
                    label="Role"
                    name="companyRole"
                    initialValue={companyRole}
                    rules={[
                      {
                        required: true,
                        message: `Role ${t("isRequired")}`,
                      },
                    ]}
                  >
                    <Radio.Group
                      size="large"
                      disabled={isUpdate}
                      onChange={onChangeCompanyRole}
                      style={isGuest && { justifyContent: "start" }}
                    >
                      {isUpdate ? (
                        <div
                          className={`${companyRoleClassName}-radio-container`}
                        >
                          <Radio.Button
                            className={companyRoleClassName}
                            value={companyRole}
                          >
                            {companyRole === CompanyRole.CERTIFIER ? (
                              <SafetyOutlined className="role-icons" />
                            ) : companyRole ===
                              CompanyRole.PROGRAMME_DEVELOPER ? (
                              <ExperimentOutlined className="role-icons" />
                            ) : companyRole === CompanyRole.MINISTRY ? (
                              <AuditOutlined className="role-icons" />
                            ) : (
                              <BankOutlined className="role-icons" />
                            )}
                            {companyRole}
                          </Radio.Button>
                        </div>
                      ) : (
                        <>
                          <div
                            className="certifier-radio-container"
                            style={
                              userInfoState?.companyRole ===
                              CompanyRole.MINISTRY
                                ? {
                                    width: "45%",
                                  }
                                : {}
                            }
                          >
                            <Tooltip
                              placement="top"
                              title="Permitted to certify and revoke certifications of projects"
                            >
                              <Radio.Button
                                className="certifier"
                                value="Certifier"
                              >
                                <SafetyOutlined className="role-icons" />
                                Certifier
                              </Radio.Button>
                            </Tooltip>
                          </div>
                          <div
                            className="dev-radio-container"
                            style={
                              userInfoState?.companyRole ===
                              CompanyRole.MINISTRY
                                ? {
                                    width: "45%",
                                    marginLeft: isGuest ? "30px" : 0,
                                  }
                                : { marginLeft: isGuest ? "30px" : 0 }
                            }
                          >
                            <Tooltip
                              placement="top"
                              title="Permitted to own projects and transfer carbon credits"
                            >
                              <Radio.Button
                                className="dev"
                                value="ProgrammeDeveloper"
                              >
                                <ExperimentOutlined className="role-icons" />
                                Developer
                              </Radio.Button>
                            </Tooltip>
                          </div>
                          {userInfoState?.companyRole !==
                            CompanyRole.MINISTRY &&
                            !isGuest && (
                              <div className="minister-radio-container">
                                <Tooltip
                                  placement="top"
                                title="Permitted to perform all project-related actions within the Ministry"
                                >
                                  <Radio.Button
                                    className="minister"
                                    value="Ministry"
                                  >
                                    <AuditOutlined className="role-icons" />
                                    Ministry
                                  </Radio.Button>
                                </Tooltip>
                              </div>
                            )}
                        </>
                      )}
                    </Radio.Group>
                  </Form.Item>
                  {companyRole === CompanyRole.MINISTRY && (
                    <Form.Item
                      label="Name of the Minister"
                      name="nameOfMinister"
                      initialValue={state?.record?.nameOfMinister}
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
                                `Name of the Minister ${t("isRequired")}`
                              );
                            }
                          },
                        },
                      ]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  )}
                  {companyRole === CompanyRole.MINISTRY && (
                    <Form.Item
                      label="Sectoral Scope"
                      name="sectoralScope"
                      rules={[
                        {
                          required: true,
                          message: `Sectoral Scope ${t("isRequired")}`,
                        },
                      ]}
                      initialValue={state?.record?.sectoralScope}
                    >
                      <Select
                        mode="multiple"
                        size="large"
                        maxTagCount={2}
                        allowClear
                      >
                        {Object.entries(SectoralScope).map(([key, value]) => (
                          <Select.Option key={value} value={value}>
                            {key}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  <Form.Item
                    name="phoneNo"
                    label="Phone Number"
                    initialValue={state?.record?.phoneNo}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                      {
                        validator: async (rule: any, value: any) => {
                          if (
                            String(value).trim() === "" ||
                            String(value).trim() === undefined ||
                            value === null ||
                            value === undefined
                          ) {
                            throw new Error(`Phone Number ${t("isRequired")}`);
                          } else {
                            const phoneNo = formatPhoneNumber(String(value));
                            if (String(value).trim() !== "") {
                              if (
                                phoneNo === null ||
                                phoneNo === "" ||
                                phoneNo === undefined
                              ) {
                                throw new Error(
                                  `Phone Number ${t("isRequired")}`
                                );
                              }
                            }
                          }
                        },
                      },
                    ]}
                  >
                    <PhoneInput
                      placeholder="Phone number"
                      international
                      value={formatPhoneNumberIntl(contactNoInput)}
                      defaultCountry="LK"
                      countryCallingCodeEditable={false}
                      onChange={(v) => {}}
                      countries={countries}
                    />
                  </Form.Item>
                  {regionField && (
                    <Form.Item
                      label={t("region")}
                      name="regions"
                      initialValue={state?.record?.regions}
                      rules={[
                        {
                          required: true,
                          message: `${t("region")} ${t("isRequired")}`,
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        size="large"
                        maxTagCount={2}
                        onChange={onChangeRegion}
                        loading={loadingList}
                        allowClear
                      >
                        {regionsList.map((region: any) => (
                          <Select.Option value={region}>{region}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  {companyRole !== CompanyRole.MINISTRY && (
                    <Form.Item
                      name="address"
                      label="Address"
                      initialValue={state?.record?.address}
                      rules={[
                        { required: true, message: "" },
                        {
                          validator: async (rule, value) => {
                            if (
                              String(value).trim() === "" ||
                              String(value).trim() === undefined ||
                              value === null ||
                              value === undefined
                            ) {
                              throw new Error(`Address ${t("isRequired")}`);
                            }
                          },
                        },
                      ]}
                    >
                      <Input.TextArea rows={3} maxLength={100} />
                    </Form.Item>
                  )}
                  {companyRole === CompanyRole.GOVERNMENT &&
                    systemType !== CarbonSystemType.MRV && (
                      <div
                        className="space-container"
                        style={{ width: "100%" }}
                      >
                        <Space
                          wrap={true}
                          style={{
                            display: "flex",
                            marginBottom: 8,
                          }}
                          align="center"
                          size={"large"}
                        >
                          <Form.Item
                            style={{ width: "100%" }}
                            name="omgePercentage"
                            label="Overall Mitigation in Global Emissions (OMGE) Account"
                            initialValue={state?.record?.omgePercentage}
                            rules={[
                              { required: true, message: "" },
                              {
                                validator: async (rule, value) => {
                                  if (
                                    String(value).trim() === "" ||
                                    String(value).trim() === undefined ||
                                    value === null ||
                                    value === undefined
                                  ) {
                                    throw new Error(
                                      `Overall Mitigation in Global Emissions (OMGE) Account  ${t(
                                        "isRequired"
                                      )}`
                                    );
                                  }
                                },
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              size="large"
                              min={1}
                              max={99}
                              formatter={(value) => `${Math.round(value)}%`}
                              parser={(value: any) => value.replace("%", "")}
                            />
                          </Form.Item>
                        </Space>
                      </div>
                    )}
                </div>
              </Col>
            </Row>
            <div className="steps-actions">
              {isUpdate ? (
                <Row>
                  <Button loading={loading} onClick={onCancel}>
                    {t("addCompany:cancel")}
                  </Button>
                  <Button
                    loading={loading}
                    className="mg-left-1"
                    type="primary"
                    htmlType="submit"
                  >
                    {t("addCompany:submit")}
                  </Button>
                </Row>
              ) : (
                current === 0 && (
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                )
              )}
            </div>
          </Form>
        </div>
      </div>
    );
  };

  const CompanyAdminDetailsForm = () => {
    return (
      <div className="company-details-form-container">
        <Form
          name="company-admin-details"
          className="company-details-form"
          layout="vertical"
          requiredMark={true}
          form={formTwo}
          onFinish={onFinishStepTwo}
        >
          <Row className="row" gutter={[16, 16]}>
            <Col xl={12} md={24}>
              <div className="details-part-one">
                <Form.Item
                  label="Name"
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
                          throw new Error(`Name ${t("isRequired")}`);
                        }
                      },
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="phoneNo"
                  label="Phone Number"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <PhoneInput
                    placeholder="Phone number"
                    international
                    value={formatPhoneNumberIntl(contactNoInput)}
                    defaultCountry="LK"
                    countryCallingCodeEditable={false}
                    onChange={(v) => {}}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col xl={12} md={24}>
              <div className="details-part-two">
                <Form.Item
                  label="Email"
                  name="email"
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
                          throw new Error(`Email ${t("isRequired")}`);
                        } else {
                          const val = value.trim();
                          const reg =
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                          const matches = val.match(reg) ? val.match(reg) : [];
                          if (matches.length === 0) {
                            throw new Error(`Email ${t("isInvalid")}`);
                          }
                        }
                      },
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="steps-actions">
            {current === 1 && state?.record ? (
              <Button
                className="mg-left-1"
                type="primary"
                onClick={onUpdateCompany}
                loading={loading}
              >
                UPDATE
              </Button>
            ) : (
              <Button
                className="mg-left-1"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                SUBMIT
              </Button>
            )}
            {current === 1 && (
              <Button onClick={() => prevOne()} loading={loading}>
                BACK
              </Button>
            )}
          </div>
        </Form>
      </div>
    );
  };

  return (
    <div className="add-company-main-container">
      <div className="title-container">
        <div className="main">
          {isUpdate
            ? t("addCompany:editCompany")
            : t("addCompany:addNewCompany")}
        </div>
        <div className="sub">
          {isUpdate
            ? t("addCompany:editCompanySub")
            : t("addCompany:addCompanySub")}
        </div>
      </div>
      <div className="adding-section">
        {isUpdate ? (
          <>
            <div className="step-title-container">
              <div className="title">{t("addCompany:companyDetailsTitle")}</div>
            </div>
            <CompanyDetailsForm />
          </>
        ) : (
          <div className="form-section">
            <Steps
              progressDot
              direction="vertical"
              current={current}
              items={[
                {
                  title: (
                    <div className="step-title-container">
                      <div className="step-count">01</div>
                      <div className="title">
                        {t("addCompany:companyDetailsTitle")}
                      </div>
                    </div>
                  ),
                  description: current === 0 && <CompanyDetailsForm />,
                },
                {
                  title: (
                    <div className="step-title-container">
                      <div className="step-count">02</div>
                      <div className="title">
                        {t("addCompany:companyAdminDetailsTitle")}
                      </div>
                    </div>
                  ),
                  description: current === 1 && <CompanyAdminDetailsForm />,
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
