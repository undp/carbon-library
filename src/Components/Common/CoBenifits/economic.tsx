import { Col, Empty, Form, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import { RadioButtonStatus } from "../../../Definitions";

const Economic = (props: any) => {
  const { onFormSubmit, economicViewData, viewOnly, translator } = props;
  const t = translator;
  const economicDetailsInitial: any[] = [
    {
      section: t("coBenifits:growth"),
      fields: [
        {
          name: "growthQ1",
          label: t("coBenifits:growthQ1"),
          hide: false,
          required: false,
        },
        {
          name: "growthQ2",
          label: t("coBenifits:growthQ2"),
          hide: true,
          required: true,
        },
        {
          name: "growthQ3",
          label: t("coBenifits:growthQ3"),
          hide: true,
          required: true,
        },
        {
          name: "growthQ4",
          label: t("coBenifits:growthQ4"),
          hide: true,
          required: true,
        },
        {
          name: "growthQ5",
          label: t("coBenifits:growthQ5"),
          hide: true,
          required: true,
        },
        {
          name: "growthQ6",
          label: t("coBenifits:growthQ6"),
          hide: true,
          required: true,
        },
        {
          name: "growthQ7",
          label: t("coBenifits:growthQ7"),
          hide: true,
          required: true,
        },
        {
          name: "growthQ8",
          label: t("coBenifits:growthQ8"),
          hide: true,
          required: true,
        },
      ],
    },
    {
      section: t("coBenifits:energy"),
      fields: [
        {
          name: "energyQ1",
          label: t("coBenifits:energyQ1"),
          hide: false,
          required: false,
        },
        {
          name: "energyQ2",
          label: t("coBenifits:energyQ2"),
          hide: true,
          required: true,
        },
        {
          name: "energyQ3",
          label: t("coBenifits:energyQ3"),
          hide: true,
          required: true,
        },
        {
          name: "energyQ4",
          label: t("coBenifits:energyQ4"),
          hide: true,
          required: true,
        },
        {
          name: "energyQ5",
          label: t("coBenifits:energyQ5"),
          hide: true,
          required: true,
        },
      ],
    },
    {
      section: t("coBenifits:techTransfer"),
      fields: [
        {
          name: "techTransferQ1",
          label: t("coBenifits:techTransferQ1"),
          hide: false,
          required: false,
        },
        {
          name: "techTransferQ2",
          label: t("coBenifits:techTransferQ2"),
          hide: true,
          required: true,
        },
        {
          name: "techTransferQ3",
          label: t("coBenifits:techTransferQ3"),
          hide: true,
          required: true,
        },
        {
          name: "techTransferQ4",
          label: t("coBenifits:techTransferQ4"),
          hide: true,
          required: true,
        },
        {
          name: "techTransferQ5",
          label: t("coBenifits:techTransferQ5"),
          hide: true,
          required: true,
        },
        {
          name: "techTransferQ6",
          label: t("coBenifits:techTransferQ6"),
          hide: true,
          required: true,
        },
      ],
    },
    {
      section: t("coBenifits:balanceOfPayments"),
      fields: [
        {
          name: "balanceOfPaymentsQ1",
          label: t("coBenifits:balanceOfPaymentsQ1"),
          hide: false,
          required: false,
        },
        {
          name: "balanceOfPaymentsQ2",
          label: t("coBenifits:balanceOfPaymentsQ2"),
          hide: true,
          required: true,
        },
        {
          name: "balanceOfPaymentsQ3",
          label: t("coBenifits:balanceOfPaymentsQ3"),
          hide: true,
          required: true,
        },
      ],
    },
    {
      section: t("coBenifits:furtherInfo"),
      fields: [
        {
          name: "furtherInfoQ1",
          label: t("coBenifits:furtherInfoQ1"),
          hide: false,
          required: false,
        },
      ],
    },
  ];
  const [formOne] = Form.useForm();
  const [economicDetails, setEconomicDetails] = useState<any[]>(
    economicDetailsInitial
  );
  const [economicFormDetails, setEconomicFormDetails] = useState<any>();
  const onFieldsChange = (changedFields: any) => {
    const changedFieldName = changedFields[0]?.name[0];
    const changedFieldValue = changedFields[0]?.value;
    if (changedFieldName.includes("1")) {
      const sectionName = changedFieldName.replace(/\d/g, "").replace("Q", "");
      const updatedEconomicDetails = [...economicDetails];
      const sectionIndex = updatedEconomicDetails.findIndex(
        (section) => section.section === t(sectionName)
      );

      updatedEconomicDetails[sectionIndex].fields.forEach((field: any) => {
        if (field.name !== changedFieldName) {
          field.hide = changedFieldValue !== RadioButtonStatus.YES;
        }
      });

      setEconomicDetails(updatedEconomicDetails);
    }
  };

  useEffect(() => {
    onFormSubmit(economicFormDetails);
  }, [economicFormDetails]);

  const onEconomicValuesChanged = (changedValues: any) => {
    setEconomicFormDetails((pre: any) => ({ ...pre, ...changedValues }));
  };

  useEffect(() => {
    if (economicViewData && viewOnly === true) {
      const updatedEconomicData: any[] = [
        {
          section: t("coBenifits:growth"),
          fields: [],
        },
        {
          section: t("coBenifits:energy"),
          fields: [],
        },
        {
          section: t("coBenifits:techTransfer"),
          fields: [],
        },
        {
          section: t("coBenifits:balanceOfPayments"),
          fields: [],
        },
        {
          section: t("coBenifits:furtherInfo"),
          fields: [],
        },
      ];
      for (const key in economicViewData) {
        let section = "";
        if (String(key).includes("growth")) {
          section = t("coBenifits:growth");
        } else if (String(key).includes("energy")) {
          section = t("coBenifits:energy");
        } else if (String(key).includes("techTransfer")) {
          section = t("coBenifits:techTransfer");
        } else if (String(key).includes("balanceOfPayments")) {
          section = t("coBenifits:balanceOfPayments");
        } else if (String(key).includes("furtherInfo")) {
          section = t("coBenifits:furtherInfo");
        }

        const economicItem = updatedEconomicData.find(
          (item) => item.section === section
        );

        if (economicItem) {
          economicItem.fields.push({
            name: key,
            label: t(key),
            hide: false,
            value: economicViewData[key],
          });
        }
      }
      const filteredEconomicData = updatedEconomicData.filter(
        (item) => item.fields.length > 0
      );
      setEconomicDetails(filteredEconomicData);
      console.log(updatedEconomicData);
    }
  }, []);

  return (
    <div className="co-benifits-tab-item">
      <Form
        name="economic-details"
        className="benifits-details-economic"
        labelCol={{ md: 16, lg: 19, xl: 17 }}
        wrapperCol={{ md: 8, lg: 5, xl: 7 }}
        layout="horizontal"
        requiredMark={true}
        form={formOne}
        onFieldsChange={onFieldsChange}
        onValuesChange={onEconomicValuesChanged}
      >
        <div className={economicViewData ? "section view-section" : "section"}>
          <div className="unfccSdTool-section-wrapper">
            <Row justify="center" align="middle" style={{ width: '100%' }}>
              <Col span={24}>
                <div className="unfccSdTool-section-divider" />
              </Col>
              <Col span={24} className="unfcccSdTool-section-title">
                <span>
                  {t("coBenifits:economic")}
                </span>
              </Col>
            </Row>
          </div>
          {economicDetails?.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          {economicDetails?.map((environmentalDetail: any) => (
            <>
              <div className="title">{environmentalDetail?.section}</div>
              {environmentalDetail?.fields?.map(
                (field: any, index: any) =>
                  !field?.hide && (
                    <Form.Item
                      label={field?.label}
                      className={`form-item ${
                        index !== 0 ? "field-margin" : ""
                      }`}
                      name={field?.name}
                      rules={[
                        {
                          required: field?.required,
                          message:
                            field?.required &&
                            `${t(field?.name)} ${t("coBenifits:isRequired")}`,
                        },
                      ]}
                    >
                      <Radio.Group
                        size="middle"
                        onChange={() => {}}
                        disabled={economicViewData && true}
                      >
                        {economicViewData ? (
                          <>
                            {field?.value === RadioButtonStatus.YES && (
                              <div className="yes-no-radio-container">
                                <Radio.Button
                                  className="yes-no-radio"
                                  value={RadioButtonStatus.YES}
                                >
                                  {t("coBenifits:yes")}
                                </Radio.Button>
                              </div>
                            )}
                            {field?.value === RadioButtonStatus.NO && (
                              <div className="yes-no-radio-container">
                                <Radio.Button
                                  className="yes-no-radio"
                                  value={RadioButtonStatus.NO}
                                >
                                  {t("coBenifits:no")}
                                </Radio.Button>
                              </div>
                            )}
                            {field?.value === RadioButtonStatus.NA && (
                              <div className="yes-no-radio-container">
                                <Radio.Button
                                  className="yes-no-radio"
                                  value={RadioButtonStatus.NA}
                                >
                                  {t("coBenifits:na")}
                                </Radio.Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="yes-no-radio-container">
                              <Radio.Button
                                className="yes-no-radio"
                                value={RadioButtonStatus.YES}
                              >
                                {t("coBenifits:yes")}
                              </Radio.Button>
                            </div>
                            <div className="yes-no-radio-container">
                              <Radio.Button
                                className="yes-no-radio"
                                value={RadioButtonStatus.NO}
                              >
                                {t("coBenifits:no")}
                              </Radio.Button>
                            </div>
                            <div className="yes-no-radio-container">
                              <Radio.Button
                                className="yes-no-radio"
                                value={RadioButtonStatus.NA}
                              >
                                {t("coBenifits:na")}
                              </Radio.Button>
                            </div>
                          </>
                        )}
                      </Radio.Group>
                    </Form.Item>
                  )
              )}
            </>
          ))}
        </div>
      </Form>
    </div>
  );
};

export default Economic;
