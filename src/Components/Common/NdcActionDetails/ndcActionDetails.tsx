import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import "./ndcActionDetails.scss";
import "../../../Styles/common.table.scss";
import { RcFile } from "rc-upload/lib/interface";
import {
  AgricultureCreationRequest,
  SolarCreationRequest,
  calculateCredit,
} from "@undp/carbon-credit-calculator";
import {
  MitigationTypes,
  NdcActionTypes,
  Sector,
  addCommSepRound,
  consumerGroupList,
  energyGenerationUnitList,
  getBase64,
  landAreaUnitList,
  mitigationTypeList,
  ndcActionTypeList,
  sectorMitigationTypesListMapped,
} from "../../../Definitions";

export interface NdcActionDetailsProps {
  isBackBtnVisible: boolean;
  onFormSubmit: any;
  ndcActionDetails: any;
  translator: any;
  programmeDetails?: any;
  onClickedBackBtn?: any;
}

const NdcActionDetails = (props: NdcActionDetailsProps) => {
  const {
    isBackBtnVisible,
    onFormSubmit,
    ndcActionDetails,
    translator,
    programmeDetails,
    onClickedBackBtn,
  } = props;
  const [ndcActionType, setNdcActionType] = useState();
  const [mitigationType, setmitigationType] = useState();
  const [sector, setSector] = useState<any>("");
  const [ndcActionTypeListFiltered, setNdcActionTypeListFiltered] =
    useState<any[]>(ndcActionTypeList);
  const [form] = Form.useForm();
  translator.setDefaultNamespace('ndcAction');
  const t = translator.t;

  const maximumImageSize = process.env.REACT_APP_MAXIMUM_FILE_SIZE
    ? parseInt(process.env.REACT_APP_MAXIMUM_FILE_SIZE)
    : 5000000;

  useEffect(() => {
    if (programmeDetails) {
      setSector(programmeDetails?.sector);
    }
  }, [programmeDetails]);

  useEffect(() => {
    if (ndcActionDetails) {
      if (ndcActionDetails?.action) {
        setNdcActionType(ndcActionDetails?.action);
      }
      if (ndcActionDetails?.typeOfMitigation) {
        setmitigationType(ndcActionDetails?.typeOfMitigation);
      }

      form.setFieldsValue({
        ndcActionType: ndcActionDetails?.action,
        mitigationType: ndcActionDetails?.typeOfMitigation,
        energyGeneration: ndcActionDetails?.solarProperties?.energyGeneration,
        energyGenerationUnit:
          ndcActionDetails?.solarProperties?.energyGenerationUnit,
        consumerGroup: ndcActionDetails?.solarProperties?.consumerGroup,
        eligibleLandArea: ndcActionDetails?.agricultureProperties?.landArea,
        landAreaUnit: ndcActionDetails?.agricultureProperties?.landAreaUnit,
        implementingAgency:
          ndcActionDetails?.adaptationProperties?.implementingAgency,
        nationalPlanObjectives:
          ndcActionDetails?.adaptationProperties?.nationalPlanObjectives,
        nationalPlanCoverage:
          ndcActionDetails?.adaptationProperties?.nationalPlanCoverage,
        EnablementTitle: ndcActionDetails?.enablementProperties?.title,
        EnablementReport: ndcActionDetails?.enablementReportData,
        userEstimatedCredits:
          ndcActionDetails?.ndcFinancing?.userEstimatedCredits,
        methodologyEstimatedCredits: 0,
      });
    } else {
      form.setFieldsValue({
        methodologyEstimatedCredits: 0,
      });
    }
  }, []);

  const implementingAgencyList = [
    "Ministry of Agriculture, Water and Forestry (MAWF)",
    "Ministry of Defence (MoD)",
    "Ministry of Education, Arts and Culture (MoE)",
    "Ministry of Environment, Forestry and Tourism (MEFT)",
    "Ministry of Finance (MoF)",
    "Ministry of Fisheries and Marine Resources (MFMR)",
    "Ministry of Health and Social Services (MHSS)",
    "Ministry of Higher Education, Training and Innovation (MHETI)",
    "Ministry of Home Affairs, Immigration, Safety and Security (MHAISS)",
    "Ministry of Industrialisation and Trade (MIT)",
    "Ministry of International Relations and Cooperation (MIRCo)",
    "Ministry of Information and Communication Technology (MICT)",
    "Ministry of Justice (MoJ)",
    "Ministry of Labour, Industrial Relations and Employment Creation (MOL)",
    "Ministry of Mines and Energy (MME)",
    "Ministry of Public Enterprises (MPE)",
    "Ministry of Sport, Youth and National Service (MSYNS)",
    "Ministry of Works and Transport (MoW)",
    "Ministry of Urban and Rural Development (MURD)",
  ];

  const nationalPlanObjectives = [
    " Enhance value addition in key growth opportunities",
    "Strengthen the private sector to create jobs",
    "Consolidate and increase the stock and quality of productive infrastructure",
    "Enhance the productivity and social wellbeing of the population",
    "Strengthen the role of the state in guiding and facilitating development",
  ];

  const nationalPlanCoverageList = [
    "Agro-Industrialization",
    "Mineral-based Industrialization",
    "Petroleum Development",
    "Tourism Development",
    "Water, Climate Change and ENR Management",
    "Private Sector Development",
    "Manufacturing",
    "Digital Transformation ",
    "Integrated Transport Infrastructure and Services",
    "Sustainable Energy Development",
    "Sustainable Urban and Housing Development",
    "Human Capital Development",
    "Community Mobilization and Mindset Change",
    "Innovation, Technology Development and Transfer",
    "Regional Development",
    "Governance and Security",
    "Public Sector Transformation",
    "Development Plan Implementation",
    "Climate Hazard ",
  ];

  const calculateMethodologyEstimatedCredits = () => {
    try {
      let creditRequest: any = {};
      const formValues = form.getFieldsValue();
      if (
        formValues.ndcActionType === NdcActionTypes.Mitigation ||
        formValues.ndcActionType === NdcActionTypes.CrossCutting
      ) {
        if (formValues.mitigationType === MitigationTypes.AGRICULTURE) {
          creditRequest = new AgricultureCreationRequest();
          creditRequest.landArea = formValues.eligibleLandArea;
          creditRequest.landAreaUnit = formValues.landAreaUnit;
          creditRequest.duration =
            programmeDetails.endTime - programmeDetails.startTime;
          creditRequest.durationUnit = "s";
        } else if (formValues.mitigationType === MitigationTypes.SOLAR) {
          creditRequest = new SolarCreationRequest();
          creditRequest.buildingType = formValues.consumerGroup;
          creditRequest.energyGeneration = formValues.energyGeneration;
          creditRequest.energyGenerationUnit = formValues.energyGenerationUnit;
        }
      }
      const creditResponse = calculateCredit(creditRequest);
      if (!isNaN(creditResponse)) {
        form.setFieldsValue({
          methodologyEstimatedCredits: addCommSepRound(creditResponse),
        });
      } else {
        form.setFieldsValue({
          methodologyEstimatedCredits: 0,
        });
      }
    } catch (exception) {
      form.setFieldsValue({
        methodologyEstimatedCredits: 0,
      });
    }
  };

  const handleNdcActionChange = (selectedNdcType: any) => {
    setNdcActionType(selectedNdcType);
    calculateMethodologyEstimatedCredits();
  };

  const handleMitigationTypeChange = (selectedMitigationType: any) => {
    setmitigationType(selectedMitigationType);
    calculateMethodologyEstimatedCredits();
  };

  const onNdcActionDetailsFormSubmit = async (ndcActionFormvalues: any) => {
    const ndcActionDetailObj: any = {};
    ndcActionDetailObj.action = ndcActionFormvalues.ndcActionType;
    ndcActionDetailObj.methodology = t("ndcAction:goldStandard");

    if (
      ndcActionFormvalues.ndcActionType === NdcActionTypes.Mitigation ||
      ndcActionFormvalues.ndcActionType === NdcActionTypes.CrossCutting
    ) {
      ndcActionDetailObj.typeOfMitigation = ndcActionFormvalues.mitigationType;
      if (ndcActionFormvalues.mitigationType === MitigationTypes.AGRICULTURE) {
        ndcActionDetailObj.agricultureProperties = {
          landArea: ndcActionFormvalues.eligibleLandArea
            ? ndcActionFormvalues.eligibleLandArea
            : 0,
          landAreaUnit: ndcActionFormvalues.landAreaUnit,
        };
      } else if (ndcActionFormvalues.mitigationType === MitigationTypes.SOLAR) {
        ndcActionDetailObj.solarProperties = {
          energyGeneration: ndcActionFormvalues.energyGeneration
            ? ndcActionFormvalues.energyGeneration
            : 0,
          energyGenerationUnit: ndcActionFormvalues.energyGenerationUnit,
          consumerGroup: ndcActionFormvalues.consumerGroup,
        };
      }
      if (
        ndcActionFormvalues.mitigationType === MitigationTypes.SOLAR ||
        ndcActionFormvalues.mitigationType === MitigationTypes.AGRICULTURE
      ) {
        if (parseFloat(ndcActionFormvalues.methodologyEstimatedCredits) <= 0) {
          message.open({
            type: "error",
            content: t("methodologyEstimatedCreditsInvalid"),
            duration: 4,
            style: { textAlign: "right", marginRight: 15, marginTop: 10 },
          });
          return;
        }
      }

      if (
        ndcActionFormvalues.userEstimatedCredits > programmeDetails.creditEst
      ) {
        message.open({
          type: "error",
          content: t("userEstimatedCreditsInvalid"),
          duration: 4,
          style: { textAlign: "right", marginRight: 15, marginTop: 10 },
        });
        return;
      }
    }

    if (
      ndcActionFormvalues.ndcActionType === NdcActionTypes.Adaptation ||
      ndcActionFormvalues.ndcActionType === NdcActionTypes.CrossCutting
    ) {
      ndcActionDetailObj.adaptationProperties = {
        implementingAgency: ndcActionFormvalues.implementingAgency,
        nationalPlanObjectives: ndcActionFormvalues.nationalPlanObjectives,
        nationalPlanCoverage: ndcActionFormvalues.nationalPlanCoverage,
      };
    }

    if (ndcActionFormvalues.ndcActionType === NdcActionTypes.Enablement) {
      ndcActionDetailObj.enablementProperties = {
        title: ndcActionFormvalues.EnablementTitle,
      };

      if (
        ndcActionFormvalues.EnablementReport &&
        ndcActionFormvalues.EnablementReport.length > 0
      ) {
        const enablementReport = await getBase64(
          ndcActionFormvalues.EnablementReport[0]?.originFileObj as RcFile
        );
        const enablementReportData = enablementReport.split(",");
        ndcActionDetailObj.enablementProperties.report =
          enablementReportData[1];
      }
      ndcActionDetailObj.enablementReportData =
        ndcActionFormvalues.EnablementReport;
    }

    ndcActionDetailObj.ndcFinancing = {
      userEstimatedCredits: ndcActionFormvalues.userEstimatedCredits
        ? ndcActionFormvalues.userEstimatedCredits
        : 0,
      systemEstimatedCredits: Number(
        ndcActionFormvalues.methodologyEstimatedCredits
      ),
    };

    onFormSubmit(ndcActionDetailObj);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="ndc-action-details-container">
      <Form
        name="ndcActionDetails"
        layout="vertical"
        requiredMark={true}
        onFinish={onNdcActionDetailsFormSubmit}
        form={form}
      >
        <Row justify="start" align="middle">
          <Col>
            <Form.Item
              label={t("ndcAction:ndcAction")}
              name="ndcActionType"
              rules={[
                {
                  required: true,
                  message: `${t("ndcAction:ndcAction")} ${t(
                    "ndcAction:isRequired"
                  )}`,
                },
              ]}
            >
              <Select
                size="large"
                onChange={handleNdcActionChange}
                style={{
                  width: "249px",
                  borderRadius: "4px",
                }}
                dropdownStyle={{ color: "red" }}
                options={ndcActionTypeListFiltered}
              />
            </Form.Item>
          </Col>
          <Col style={{ marginLeft: "38px" }}>
            <Form.Item label={t("ndcAction:methodology")} name="methodology">
              <span
                style={{
                  display: "inline-block",
                  border: "1px solid #D9D9D9",
                  width: "154px",
                  height: "38px",
                  borderRadius: "4px",
                  padding: "7px 8px",
                  fontSize: "14px",
                  backgroundColor: "#F0F0F0",
                  color: "#8C8C8C",
                }}
              >
                {" "}
                {t("ndcAction:goldStandard")}
              </span>
            </Form.Item>
          </Col>
        </Row>

        {ndcActionType === NdcActionTypes.CrossCutting && (
          <Row>
            <label className="label-heading">{t("ndcAction:mitigation")}</label>
          </Row>
        )}

        {(ndcActionType === NdcActionTypes.Mitigation ||
          ndcActionType === NdcActionTypes.CrossCutting) && (
          <Row justify="start" align="middle">
            <Form.Item
              label={t("ndcAction:mitigationType")}
              name="mitigationType"
              rules={[
                {
                  required: true,
                  message: `${t("ndcAction:mitigationType")} ${t(
                    "ndcAction:isRequired"
                  )}`,
                },
              ]}
            >
              <Select
                size="large"
                onChange={handleMitigationTypeChange}
                style={{
                  width: "249px",
                  borderRadius: "4px",
                }}
                options={
                  programmeDetails?.sector === Sector.Health ||
                  programmeDetails?.sector === Sector.Education ||
                  programmeDetails?.sector === Sector.Hospitality
                    ? mitigationTypeList
                    : sectorMitigationTypesListMapped[sector]
                }
              ></Select>
            </Form.Item>
          </Row>
        )}

        {(ndcActionType === NdcActionTypes.Mitigation ||
          ndcActionType === NdcActionTypes.CrossCutting) &&
          mitigationType === MitigationTypes.SOLAR && (
            <>
              <Row justify="start" align="middle">
                <Col>
                  <Form.Item
                    label={t("ndcAction:energyGeneration")}
                    rules={[
                      {
                        required: true,
                        message: ``,
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
                              `${t("ndcAction:energyGeneration")} ${t(
                                "ndcAction:isRequired"
                              )}`
                            );
                          }
                        },
                      },
                    ]}
                    name="energyGeneration"
                  >
                    <InputNumber
                      style={{ width: 442, paddingRight: 12 }}
                      onChange={calculateMethodologyEstimatedCredits}
                    />
                  </Form.Item>
                </Col>
                <Col style={{ marginLeft: "38px" }}>
                  <Form.Item
                    label={t("ndcAction:energyGenerationUnit")}
                    name="energyGenerationUnit"
                    rules={[
                      {
                        required: true,
                        message: `${t("ndcAction:energyGenerationUnit")} ${t(
                          "ndcAction:isRequired"
                        )}`,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: 442 }}
                      options={energyGenerationUnitList}
                      onChange={calculateMethodologyEstimatedCredits}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label={t("ndcAction:consumerGroup")}
                name="consumerGroup"
                rules={[
                  {
                    required: true,
                    message: `${t("ndcAction:consumerGroup")} ${t(
                      "ndcAction:isRequired"
                    )}`,
                  },
                ]}
              >
                <Select
                  size="large"
                  style={{ width: 442 }}
                  onChange={calculateMethodologyEstimatedCredits}
                  options={consumerGroupList}
                />
              </Form.Item>
            </>
          )}

        {(ndcActionType === NdcActionTypes.Mitigation ||
          ndcActionType === NdcActionTypes.CrossCutting) &&
          mitigationType === MitigationTypes.AGRICULTURE && (
            <Row justify="start" align="middle">
              <Col>
                <Form.Item
                  label={t("ndcAction:eligibleLandArea")}
                  name="eligibleLandArea"
                  rules={[
                    {
                      required: true,
                      message: ``,
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
                            `${t("ndcAction:eligibleLandArea")} ${t(
                              "ndcAction:isRequired"
                            )}`
                          );
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: 442, paddingRight: 12 }}
                    onChange={calculateMethodologyEstimatedCredits}
                  />
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: "38px" }}>
                <Form.Item
                  label={t("ndcAction:landAreaUnit")}
                  name="landAreaUnit"
                  rules={[
                    {
                      required: true,
                      message: `${t("ndcAction:landAreaUnit")} ${t(
                        "ndcAction:isRequired"
                      )}`,
                    },
                  ]}
                >
                  <Select
                    onChange={calculateMethodologyEstimatedCredits}
                    size="large"
                    style={{ width: 442 }}
                    options={landAreaUnitList}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

        {(ndcActionType === NdcActionTypes.Mitigation ||
          ndcActionType === NdcActionTypes.CrossCutting) && (
          <Row justify="start" align="middle">
            <Col>
              <Form.Item
                name="userEstimatedCredits"
                label={t("ndcAction:userEstimatedCredits")}
                style={{ display: "inline-block", width: "calc(100% - 15px)" }}
              >
                <InputNumber style={{ width: 442, paddingRight: 12 }} />
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: "38px" }}>
              <Form.Item
                name="methodologyEstimatedCredits"
                label={t("ndcAction:methodologyEstimatedCredits")}
                style={{ display: "inline-block", width: "100%" }}
              >
                <InputNumber
                  disabled
                  style={{ width: 442, paddingRight: 12 }}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {ndcActionType === NdcActionTypes.CrossCutting && (
          <Row>
            <label className="label-heading">{t("ndcAction:adaptation")}</label>
          </Row>
        )}

        {(ndcActionType === NdcActionTypes.Adaptation ||
          ndcActionType === NdcActionTypes.CrossCutting) && (
          <>
            <Row justify="start" align="middle">
              <Form.Item
                label={t("ndcAction:implementingAgency")}
                name="implementingAgency"
              >
                <Select
                  style={{ width: 442 }}
                  size="large"
                  options={implementingAgencyList.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                />
              </Form.Item>
            </Row>
            <Row justify="start" align="middle">
              <Col>
                <Form.Item
                  label={t("ndcAction:nationalPlanObjectives")}
                  name="nationalPlanObjectives"
                >
                  <Select
                    size="large"
                    style={{ width: 442 }}
                    options={nationalPlanObjectives.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: "38px" }}>
                <Form.Item
                  label={t("ndcAction:nationalPlanCoverage")}
                  name="nationalPlanCoverage"
                >
                  <Select
                    style={{ width: 442 }}
                    size="large"
                    options={nationalPlanCoverageList.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {ndcActionType === NdcActionTypes.Enablement && (
          <>
            <Form.Item label={t("ndcAction:title")} name="EnablementTitle">
              <Input style={{ width: 442 }} />
            </Form.Item>
            <Row justify="space-between" align="middle">
              <Form.Item
                label={t("ndcAction:report")}
                name="EnablementReport"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                required={false}
                rules={[
                  {
                    validator: async (rule, file) => {
                      let isCorrectFormat = false;
                      if (file && file.length > 0) {
                        if (file[0]?.type === "application/pdf") {
                          isCorrectFormat = true;
                        }
                        if (!isCorrectFormat) {
                          throw new Error(
                            `${t("ndcAction:invalidFileFormat")}`
                          );
                        } else if (file[0]?.size > maximumImageSize) {
                          throw new Error(`${t("common:maxSizeVal")}`);
                        }
                      }
                    },
                  },
                ]}
              >
                <Upload
                  accept=".pdf"
                  beforeUpload={(file: any) => {
                    return false;
                  }}
                  className="design-upload-section"
                  name="design"
                  listType="picture"
                  multiple={false}
                  maxCount={1}
                >
                  <Button
                    className="upload-doc"
                    size="large"
                    icon={<UploadOutlined />}
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Row>
          </>
        )}

        <div className="steps-actions">
          <Row>
            {isBackBtnVisible && (
              <Button onClick={onClickedBackBtn}>{t("ndcAction:back")}</Button>
            )}
            <Button className="mg-left-1" type="primary" htmlType="submit">
              {t("ndcAction:next")}
            </Button>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default NdcActionDetails;