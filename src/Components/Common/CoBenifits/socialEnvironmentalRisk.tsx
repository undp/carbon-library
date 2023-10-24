import { Form, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { RadioButtonStatus } from "../../../Definitions";

const SocialEnvironmentalRisk = (props: any) => {
  const { onFormSubmit, translator } = props;
  translator.setDefaultNamespace("socialEnvironmentalRisk");
  const t = translator.t;
  const [form] = Form.useForm();
  const [socialEnvironmentalFormDetails, setSocialEnvironmentalFormDetails] =
    useState();

  useEffect(() => {
    onFormSubmit(socialEnvironmentalFormDetails);
  }, [socialEnvironmentalFormDetails]);

  const SocialEnvironmentalDetails: any[] = [
    {
      subHeader: t("humanRightsSubHeader"),
      title: t("humanRights"),
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
    {
      subHeader: t("standard1SubHeader"),
      title: t("standard1"),
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
  ];

  const SocialEnvironmentalDetailsChanged = async (changedValues: any) => {
    setSocialEnvironmentalFormDetails((pre: any) => ({
      ...pre,
      ...changedValues,
    }));
  };

  return (
    <div className="social-environment-tab-item">
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
        {SocialEnvironmentalDetails.map((section: any) => {
          return (
            <>
              {section.subHeader && (
                <div style={{ marginBottom: "15px" }}>
                  <label className="co-sub-header-text">
                    {section.subHeader}
                  </label>
                </div>
              )}
              <div style={{ marginBottom: "15px" }}>
                <label className="co-sub-title-text">{section.title}</label>
              </div>
              {section.subItems.map((element: any) => {
                return (
                  <Form.Item
                    className="mg-left-2"
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
      </Form>
    </div>
  );
};

export default SocialEnvironmentalRisk;
