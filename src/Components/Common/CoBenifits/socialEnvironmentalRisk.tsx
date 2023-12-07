import { Col, Empty, Form, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { RadioButtonStatus } from "../../../Definitions";

const SocialEnvironmentalRisk = (props: any) => {
  const { onFormSubmit, SocialEnvironmentalRiskData, viewOnly, translator } =
    props;
  translator.setDefaultNamespace("socialEnvironmentalRisk");
  const t = translator.t;
  const [form] = Form.useForm();
  const [socialEnvironmentalFormDetails, setSocialEnvironmentalFormDetails] =
    useState();
  const [socialEnvironmentalDetails, setSocialEnvironmentalDetails] = useState([
    {
      title: t("humanRightsSubHeader"),
      isTitleVisible: true,
      subItems: [
        {
          title: t("humanRights"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("humanRightsQ1"),
              name: "humanRightsQ1",
            },
            {
              label: t("humanRightsQ2"),
              name: "humanRightsQ2",
            },
            {
              label: t("humanRightsQ3"),
              name: "humanRightsQ3",
            },
            {
              label: t("humanRightsQ4"),
              name: "humanRightsQ4",
            },
            {
              label: t("humanRightsQ5"),
              name: "humanRightsQ5",
            },
            {
              label: t("humanRightsQ6"),
              name: "humanRightsQ6",
            },
            {
              label: t("humanRightsQ7"),
              name: "humanRightsQ7",
            },
          ],
        },
        {
          title: t("genderEqalityWomenEmpower"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("genderEqalityWomenEmpowerQ1"),
              name: "genderEqalityWomenEmpowerQ1",
            },
            {
              label: t("genderEqalityWomenEmpowerQ2"),
              name: "genderEqalityWomenEmpowerQ2",
            },
            {
              label: t("genderEqalityWomenEmpowerQ3"),
              name: "genderEqalityWomenEmpowerQ3",
            },
            {
              label: t("genderEqalityWomenEmpowerQ4"),
              name: "genderEqalityWomenEmpowerQ4",
            },
            {
              label: t("genderEqalityWomenEmpowerQ5"),
              name: "genderEqalityWomenEmpowerQ5",
            },
          ],
        },
        {
          title: t("accountability"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("accountabilityQ1"),
              name: "accountabilityQ1",
            },
            {
              label: t("accountabilityQ2"),
              name: "AccountabilityQ2",
            },
            {
              label: t("accountabilityQ3"),
              name: "accountabilityQ3",
            },
          ],
        },
      ],
    },
    {
      title: t("standardSubHeader"),
      isTitleVisible: true,
      subItems: [
        {
          title: t("standard1"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("standard1Q1"),
              name: "standard1Q1",
            },
            {
              label: t("standard1Q2"),
              name: "standard1Q2",
            },
            {
              label: t("standard1Q3"),
              name: "standard1Q3",
            },
            {
              label: t("standard1Q4"),
              name: "standard1Q4",
            },
            {
              label: t("standard1Q5"),
              name: "standard1Q5",
            },
            {
              label: t("standard1Q6"),
              name: "standard1Q6",
            },
            {
              label: t("standard1Q7"),
              name: "standard1Q7",
            },
            {
              label: t("standard1Q8"),
              name: "standard1Q8",
            },
            {
              label: t("standard1Q9"),
              name: "standard1Q9",
            },
            {
              label: t("standard1Q10"),
              name: "standard1Q10",
            },
            {
              label: t("standard1Q11"),
              name: "standard1Q11",
            },
            {
              label: t("standard1Q12"),
              name: "standard1Q12",
            },
            {
              label: t("standard1Q13"),
              name: "standard1Q13",
            },
            {
              label: t("standard1Q14"),
              name: "standard1Q14",
            },
          ],
        },
        {
          title: t("standard2"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("standard2Q1"),
              name: "standard2Q1",
            },
            {
              label: t("standard2Q2"),
              name: "standard2Q2",
            },
            {
              label: t("standard2Q3"),
              name: "standard2Q3",
            },
            {
              label: t("standard2Q4"),
              name: "standard2Q4",
            },
          ],
        },
        {
          title: t("standard3"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("standard3Q1"),
              name: "standard3Q1",
            },
            {
              label: t("standard3Q2"),
              name: "standard3Q2",
            },
            {
              label: t("standard3Q3"),
              name: "standard3Q3",
            },
            {
              label: t("standard3Q4"),
              name: "standard3Q4",
            },
            {
              label: t("standard3Q5"),
              name: "standard3Q5",
            },
            {
              label: t("standard3Q6"),
              name: "standard3Q6",
            },
            {
              label: t("standard3Q7"),
              name: "standard3Q7",
            },
            {
              label: t("standard3Q8"),
              name: "standard3Q8",
            },
          ],
        },
        {
          title: t("standard4"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("standard4Q1"),
              name: "standard4Q1",
            },
            {
              label: t("standard4Q2"),
              name: "standard4Q2",
            },
            {
              label: t("standard4Q3"),
              name: "standard4Q3",
            },
            {
              label: t("standard4Q4"),
              name: "standard4Q4",
            },
            {
              label: t("standard4Q5"),
              name: "standard4Q5",
            },
          ],
        },
        {
          title: t("standard5"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("standard5Q1"),
              name: "standard5Q1",
            },
            {
              label: t("standard5Q2"),
              name: "standard5Q2",
            },
            {
              label: t("standard5Q3"),
              name: "standard5Q3",
            },
            {
              label: t("standard5Q4"),
              name: "standard5Q4",
            },
          ],
        },
        {
          title: t("standard6"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("standard6Q1"),
              name: "standard6Q1",
            },
            {
              label: t("standard6Q2"),
              name: "standard6Q2",
            },
            {
              label: t("standard6Q3"),
              name: "standard6Q3",
            },
            {
              label: t("standard6Q4"),
              name: "standard6Q4",
            },
            {
              label: t("standard6Q5"),
              name: "standard6Q5",
            },
            {
              label: t("standard6Q6"),
              name: "standard6Q6",
            },
            {
              label: t("standard6Q7"),
              name: "standard6Q7",
            },
            {
              label: t("standard6Q8"),
              name: "standard6Q8",
            },
            {
              label: t("standard6Q9"),
              name: "standard6Q9",
            },
          ],
        },
        {
          title: t("standard7"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("standard7Q1"),
              name: "standard7Q1",
            },
            {
              label: t("standard7Q2"),
              name: "standard7Q2",
            },
            {
              label: t("standard7Q3"),
              name: "standard7Q3",
            },
            {
              label: t("standard7Q4"),
              name: "standard7Q4",
            },
            {
              label: t("standard7Q5"),
              name: "standard7Q5",
            },
            {
              label: t("standard7Q6"),
              name: "standard7Q6",
            },
          ],
        },
        {
          title: t("standard8"),
          isTitleVisible: true,
          subItems: [
            {
              label: t("standard8Q1"),
              name: "standard8Q1",
            },
            {
              label: t("standard8Q2"),
              name: "standard8Q2",
            },
            {
              label: t("standard8Q3"),
              name: "standard8Q3",
            },
            {
              label: t("standard8Q4"),
              name: "standard8Q4",
            },
            {
              label: t("standard8Q5"),
              name: "standard8Q5",
            },
            {
              label: t("standard8Q6"),
              name: "standard8Q6",
            },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    onFormSubmit(socialEnvironmentalFormDetails);
  }, [socialEnvironmentalFormDetails]);

  useEffect(() => {
    if (SocialEnvironmentalRiskData && !viewOnly) {
      setSocialEnvironmentalFormDetails(SocialEnvironmentalRiskData);
      form.setFieldsValue(SocialEnvironmentalRiskData);
    } else if (SocialEnvironmentalRiskData && viewOnly) {
      checkHeaderAvailability();
    }
  }, [SocialEnvironmentalRiskData]);

  const checkHeaderAvailability = () => {
    socialEnvironmentalDetails.forEach((section: any) => {
      section.isTitleVisible = false;
      section.subItems.forEach((subSection: any) => {
        subSection.isTitleVisible = false;
        subSection.subItems.forEach((element: any) => {
          if (SocialEnvironmentalRiskData.hasOwnProperty(element?.name)) {
            subSection.isTitleVisible = true;
          }
        });
        if (subSection.isTitleVisible) {
          section.isTitleVisible = true;
        }
      });
    });
    setSocialEnvironmentalDetails(socialEnvironmentalDetails);
  };

  const SocialEnvironmentalDetailsChanged = async (changedValues: any) => {
    setSocialEnvironmentalFormDetails((pre: any) => ({
      ...pre,
      ...changedValues,
    }));
  };

  return (
    <div className="social-environment-tab-item">
      {viewOnly && !SocialEnvironmentalRiskData && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {((viewOnly && SocialEnvironmentalRiskData) || !viewOnly) && (
        <Form
          name="SocialEnvironmentalDetails"
          labelWrap={true}
          form={form}
          labelAlign="left"
          labelCol={{ md: 16, lg: 18, xl: 18 }}
          wrapperCol={{ md: 8, lg: 6, xl: 6 }}
          layout="horizontal"
          onValuesChange={SocialEnvironmentalDetailsChanged}
        >
          {!viewOnly &&
            socialEnvironmentalDetails.map((section: any) => {
              return (
                <>
                  <div className="social-environment-risk-title-section">
                    <Row
                      justify="center"
                      align="middle"
                      style={{ width: "100%" }}
                    >
                      <Col span={24} className="social-environment-risk-title">
                        <span>{section.title}</span>
                      </Col>
                    </Row>
                  </div>
                  {section.subItems.map((subSection: any) => {
                    return (
                      <>
                        <div style={{ marginBottom: "15px" }}>
                          <label className="co-sub-title-text">
                            {subSection.title}
                          </label>
                        </div>
                        {subSection.subItems.map((element: any) => {
                          return (
                            <Form.Item
                              className="mg-left-2 form-item"
                              label={element.label}
                              name={element.name}
                            >
                              <Radio.Group size="middle">
                                <div className="radio-container">
                                  <Radio.Button
                                    className="radio"
                                    value={RadioButtonStatus.YES}
                                  >
                                    {t("yes")}
                                  </Radio.Button>
                                </div>
                                <div className="radio-container">
                                  <Radio.Button
                                    className="radio"
                                    value={RadioButtonStatus.NO}
                                  >
                                    {t("no")}
                                  </Radio.Button>
                                </div>
                              </Radio.Group>
                            </Form.Item>
                          );
                        })}
                      </>
                    );
                  })}
                </>
              );
            })}
          {viewOnly &&
            SocialEnvironmentalRiskData &&
            socialEnvironmentalDetails.map((section: any) => {
              return (
                <>
                  {section.isTitleVisible && (
                    <div className="social-environment-risk-title-section">
                      <Row
                        justify="center"
                        align="middle"
                        style={{ width: "100%" }}
                      >
                        <Col
                          span={24}
                          className="social-environment-risk-title"
                        >
                          <span>{section.title}</span>
                        </Col>
                      </Row>
                    </div>
                  )}
                  {section.subItems.map((subSection: any) => {
                    return (
                      <>
                        {subSection.isTitleVisible && (
                          <div style={{ marginBottom: "15px" }}>
                            <label className="co-sub-title-text">
                              {subSection.title}
                            </label>
                          </div>
                        )}
                        {subSection.subItems.map((element: any) => {
                          return (
                            <>
                              {SocialEnvironmentalRiskData.hasOwnProperty(
                                element?.name
                              ) && (
                                <div className="view-section">
                                  <Form.Item
                                    className="mg-left-2 form-item"
                                    label={element.label}
                                    name={element.name}
                                  >
                                    <Radio.Group size="middle" disabled>
                                      <div className="radio-container">
                                        <Radio.Button className="radio">
                                          {
                                            SocialEnvironmentalRiskData[
                                              element.name
                                            ]
                                          }
                                        </Radio.Button>
                                      </div>
                                    </Radio.Group>
                                  </Form.Item>
                                </div>
                              )}
                            </>
                          );
                        })}
                      </>
                    );
                  })}
                </>
              );
            })}
        </Form>
      )}
    </div>
  );
};

export default SocialEnvironmentalRisk;
