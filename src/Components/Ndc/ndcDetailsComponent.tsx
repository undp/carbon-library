import {
  Button,
  Col,
  DatePicker,
  Empty,
  Form,
  PaginationProps,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
  TabsProps,
  Typography,
  message,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { EditableCell } from "../Common/AntComponents/antTableComponents";
import "./ndcDetailsComponent.scss";
import { CompanyRole, Role } from "../../Definitions";

type NdcPeriod = {
  start: number;
  end: number;
};

type NdcDetail = {
  key: string;
  ndcActionId: string;
  startDate: Date;
  endDate: Date;
  nationalPlanObj: string;
  kpi: number;
  ministry: string;
  subNdcDetails?: [];
};

enum NdcActionType {
  main,
  sub,
}

export const NdcDetailsComponent = (props: any) => {
  const { t, useConnection, useUserContext } = props;
  const { RangePicker } = DatePicker;
  const [ndcDetailsData, setNdcDetailsData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const periodItemsRef = useRef([] as any[]);
  const [periodItems, setPeriodItems] = useState([] as any[]);
  const [selectedTab, setSelectedTab] = useState("add_new");
  const selectedPeriod = useRef({} as NdcPeriod);
  const addedNdcDetailId = useRef(0);
  const selectedNdcDetail = useRef({} as NdcDetail);
  const [tableKey, setTableKey] = useState(0);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const { userInfoState } = useUserContext();

  const isEditing = (record: NdcDetail) => record.key === editingKey;

  const onEditRow = (record: Partial<NdcDetail> & { key: React.Key }) => {
    form.setFieldsValue({
      nationalPlanObj: "",
      kpi: "",
      ministry: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const onEditCancel = () => {
    setEditingKey("");
  };

  const isAddRangeVisible = () => {
    return (
      (userInfoState?.companyRole === CompanyRole.MINISTRY ||
        userInfoState?.companyRole === CompanyRole.GOVERNMENT) &&
      userInfoState?.userRole !== Role.ViewOnly
    );
  };

  const isAddNdcActionVisible = () => {
    return (
      userInfoState?.companyRole === CompanyRole.GOVERNMENT &&
      userInfoState?.userRole !== Role.ViewOnly
    );
  };

  const isAddSubNdcActionVisible = () => {
    return (
      userInfoState?.companyRole === CompanyRole.MINISTRY &&
      userInfoState?.userRole !== Role.ViewOnly
    );
  };

  const inRange = (num: number, min: number, max: number) =>
    num >= min && num <= max;

  const onHandleSave = async (record: any) => {
    try {
      const updatedNdcDetails = [...ndcDetailsData];
      const editedData = (await form.validateFields()) as NdcDetail;
      if (record) {
        if (record.type === NdcActionType.main) {
          const index = updatedNdcDetails.findIndex(
            (item) => record.key === item.key
          );
          updatedNdcDetails.splice(index, 1, {
            ...record,
            ...editedData,
          });
          setNdcDetailsData(updatedNdcDetails);
        } else {
          const parentIndex = updatedNdcDetails.findIndex(
            (item: any) => record.ndcActionId === item.key
          );
          const parentItem = updatedNdcDetails[parentIndex];
          if (parentItem) {
            if (parentItem.subNdcDetails) {
              const itemIndex = parentItem.subNdcDetails.findIndex(
                (item: any) => record.key === item.key
              );
              if (itemIndex !== -1) {
                parentItem.subNdcDetails.splice(itemIndex, 1, {
                  ...record,
                  ...editedData,
                });
              }
              if (itemIndex + 1 === parentItem.subNdcDetails.length) {
                parentItem.subNdcDetails.push({
                  key: ++addedNdcDetailId.current,
                  ndcActionId: parentItem.key,
                  type: NdcActionType.sub,
                  startDate: new Date("2019-03-25"),
                  endDate: new Date("2020-03-25"),
                  nationalPlanObj: "",
                  kpi: "",
                  ministry: "",
                });
              }
            }

            updatedNdcDetails.splice(parentIndex, 1, {
              ...parentItem,
            });
            setNdcDetailsData(updatedNdcDetails);
          }
        }
        setEditingKey("");
        setTableKey((key) => key + 1);
      } else {
        throw new Error("Save failed");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const getNdcDetailsForPeriod = () => {
    const range = selectedTab.split("-");
    if (range.length > 1) {
      const filteredData = ndcDetailsData.filter((item: NdcDetail) => {
        return inRange(
          Number(moment(item.startDate).year()),
          Number(range[0]),
          Number(range[1])
        );
      });
      return filteredData;
    } else {
      return [];
    }
  };

  const getSubNdcDetails = (key: string) => {
    const ndcDetail = ndcDetailsData.find(
      (item: NdcDetail) => item.key === key
    );
    if (ndcDetail) {
      return ndcDetail.subNdcDetails;
    } else {
      return [];
    }
  };

  const defaultColumns: any = [
    {
      title: t("ndc:ndcColumnsNationalPlanObj"),
      dataIndex: "nationalPlanObj",
      key: "nationalPlanObj",
      align: "left" as const,
      editable: true,
      width: "50%",
      render: (_: any, record: any) => (
        <>
          {record.nationalPlanObj ? (
            <Space size="middle">
              <span>{record.nationalPlanObj}</span>
            </Space>
          ) : (
            <input
              placeholder="Please add the National Plan Objective"
              className="ant-input"
              disabled
              type="text"
            ></input>
          )}
        </>
      ),
    },
    {
      title: t("ndc:ndcColumnsKpi"),
      dataIndex: "kpi",
      key: "kpi",
      align: "left" as const,
      editable: true,
      width: "10%",
      render: (_: any, record: any) => (
        <>
          {record.nationalPlanObj ? (
            <Space size="middle">
              <span>{record.kpi}</span>
            </Space>
          ) : (
            <input
              placeholder="Enter Kpi"
              className="ant-input"
              disabled
              type="text"
            ></input>
          )}
        </>
      ),
    },
    {
      title: "Ministry",
      dataIndex: "ministry",
      key: "ministry",
      align: "left" as const,
      editable: true,
      width: "30%",
      render: (_: any, record: any) => (
        <>
          {record.nationalPlanObj ? (
            <Space size="middle">
              <span>{record.ministry}</span>
            </Space>
          ) : (
            <input
              placeholder="Please add the Ministry name"
              className="ant-input"
              disabled
              type="text"
            ></input>
          )}
        </>
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: "10%",
      render: (_: any, record: NdcDetail) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => onHandleSave(record)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={onEditCancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => onEditRow(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const columns = defaultColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  function onAddNewNdcDetail() {
    const range = selectedTab.split("-");
    const ndcActionId = ++addedNdcDetailId.current;
    const newData = {
      key: ndcActionId,
      type: NdcActionType.main,
      startDate: new Date(`${Number(range[0])}-01-24 23:12:00`),
      endDate: new Date(`${Number(range[0])}-12-24 23:12:00`),
      nationalPlanObj: "",
      kpi: "",
      ministry: "",
      subNdcDetails: [
        {
          key: ++addedNdcDetailId.current,
          ndcActionId: ndcActionId,
          type: NdcActionType.sub,
          startDate: new Date("2019-03-25"),
          endDate: new Date("2020-03-25"),
          nationalPlanObj: "",
          kpi: "",
          ministry: "",
        },
      ],
    };

    setNdcDetailsData([...ndcDetailsData, newData]);
  }

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  function ndcDetailsTableContent() {
    return <div></div>;
  }

  const onCancelPeriod = () => {};

  const onAddNewPeriod = () => {
    if (selectedPeriod && selectedPeriod.current) {
      const newPeriodItem = {
        key: `${selectedPeriod.current.start}-${selectedPeriod.current.end}`,
        label: `${selectedPeriod.current.start}-${selectedPeriod.current.end}`,
        start: selectedPeriod.current.start,
        end: selectedPeriod.current.end,
        children: ndcDetailsTableContent(),
      };

      const existingIndex = periodItemsRef.current.findIndex(
        (item: any) =>
          inRange(newPeriodItem.start, item.start, item.end) ||
          inRange(newPeriodItem.end, item.start, item.end)
      );

      if (existingIndex === -1) {
        setPeriodItems((items: any) => [...items, newPeriodItem]);
        periodItemsRef.current = [...periodItemsRef.current, newPeriodItem];
      } else {
        message.open({
          type: "error",
          content: t("ndc:rangeAlreadyExists"),
          duration: 3,
          style: { textAlign: "right", marginRight: 15, marginTop: 10 },
        });
      }
    }
  };

  useEffect(() => {
    if (periodItems && periodItems.length > 3) {
      setSelectedTab(periodItems[periodItems.length - 1].key);
    }
  }, [periodItems]);

  const onDateRangeChanged = (range: any) => {
    const period = {
      start: Number(moment(range[0]).year()),
      end: Number(moment(range[1]).year()),
    };
    selectedPeriod.current = period;
  };

  function addNewPeriodContent() {
    return (
      <div>
        <Row>
          <RangePicker onChange={onDateRangeChanged} picker="year" />
        </Row>
        <Row className="mg-top-1">
          <div className="ndc-steps-actions">
            <Button
              type="primary"
              onClick={onAddNewPeriod}
              htmlType="submit"
              loading={loading}
            >
              {t("ndc:submit")}
            </Button>
            <Button
              className="back-btn"
              onClick={onCancelPeriod}
              loading={loading}
            >
              {t("ndc:back")}
            </Button>
          </div>
        </Row>
      </div>
    );
  }

  function getSubNdcActionContent(record: any) {
    selectedNdcDetail.current = record;
    return (
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={getSubNdcDetails(record.key)}
        columns={columns}
        showHeader={false}
        pagination={false}
      />
    );
  }

  const onTabChange = (key: string) => {
    setSelectedTab(key);
  };

  useEffect(() => {
    const defaultNdcDetails = [
      {
        key: 1,
        type: NdcActionType.main,
        startDate: new Date("2019-03-25"),
        endDate: new Date("2020-03-25"),
        nationalPlanObj: "Enhance value addition in key growth opportunities",
        kpi: 25,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 6,
            ndcActionId: 1,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj:
              "Enhance value addition in key growth opportunities sub details",
            kpi: 25,
            ministry: "Ministry of Agriculture, Water and Forestry (MAWF)",
          },
          {
            key: 7,
            ndcActionId: 1,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "",
            kpi: "",
            ministry: "",
          },
        ],
      },
      {
        key: 2,
        type: NdcActionType.main,
        startDate: new Date("2019-03-25"),
        endDate: new Date("2019-08-25"),
        nationalPlanObj: "Strengthen the private sector to create 10,000 jobs",
        kpi: 10500,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 8,
            ndcActionId: 2,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "",
            kpi: "",
            ministry: "",
          },
        ],
      },
      {
        key: 12,
        type: NdcActionType.main,
        startDate: new Date("2019-03-25"),
        endDate: new Date("2019-08-25"),
        nationalPlanObj: "Other",
        kpi: 10500,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 8,
            ndcActionId: 12,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "",
            kpi: "",
            ministry: "",
          },
        ],
      },
      {
        key: 3,
        type: NdcActionType.main,
        startDate: new Date("2021-03-25"),
        endDate: new Date("2022-03-25"),
        nationalPlanObj:
          "Consolidate and increase the stock and quality of productive infrastructure by 50%",
        kpi: 48,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 9,
            ndcActionId: 3,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "",
            kpi: "",
            ministry: "",
          },
        ],
      },
      {
        key: 4,
        type: NdcActionType.main,
        startDate: new Date("2022-03-25"),
        endDate: new Date("2022-05-25"),
        nationalPlanObj:
          "Enhance the productivity and social wellbeing of the population",
        kpi: 20,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 10,
            ndcActionId: 4,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "",
            kpi: "",
            ministry: "",
          },
        ],
      },
      {
        key: 5,
        type: NdcActionType.main,
        startDate: new Date("2022-03-25"),
        endDate: new Date("2023-03-25"),
        nationalPlanObj:
          "Strengthen the role of the state in guiding and facilitating development",
        kpi: 10,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 11,
            ndcActionId: 5,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "",
            kpi: "",
            ministry: "",
          },
        ],
      },
      {
        key: 13,
        type: NdcActionType.main,
        startDate: new Date("2022-03-25"),
        endDate: new Date("2023-03-25"),
        nationalPlanObj: "Other",
        kpi: 10,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 11,
            ndcActionId: 13,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "",
            kpi: "",
            ministry: "",
          },
        ],
      },
    ];
    const initialPeriods = [
      {
        key: `2019-2020`,
        label: `2019-2020`,
        start: 2019,
        end: 2020,
        children: ndcDetailsTableContent(),
      },
      {
        key: `2021-2023`,
        label: `2021-2023`,
        start: 2021,
        end: 2021,
        children: ndcDetailsTableContent(),
      },
    ];

    if (isAddRangeVisible()) {
      initialPeriods.unshift({
        key: "add_new",
        label: "Add New",
        start: 0,
        end: 0,
        children: addNewPeriodContent(),
      });
    }

    addedNdcDetailId.current = 5;
    setPeriodItems(initialPeriods);
    periodItemsRef.current = initialPeriods;
    setNdcDetailsData(defaultNdcDetails);
  }, []);

  return (
    <div className="ndc-management content-container">
      <div className="title-bar">
        <Row justify="space-between" align="middle">
          <Col span={20}>
            <div className="body-title">{t("ndc:ndcTitle")}</div>
            <div className="body-sub-title">{t("ndc:ndcSubTitle")}</div>
          </Col>
        </Row>
      </div>
      <div>
        <Tabs
          centered={false}
          defaultActiveKey="1"
          items={periodItems}
          activeKey={selectedTab}
          onChange={onTabChange}
        />
      </div>
      {selectedTab !== "add_new" && (
        <div>
          <div>
            <Form form={form} component={false}>
              <Table
                key={tableKey}
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={getNdcDetailsForPeriod()}
                columns={columns}
                expandable={{
                  expandedRowRender: (record) => getSubNdcActionContent(record),
                  indentSize: 0,
                  defaultExpandedRowKeys: [selectedNdcDetail.current.key],
                }}
                footer={() =>
                  isAddNdcActionVisible() && (
                    <Row justify={"center"}>
                      <Button
                        onClick={onAddNewNdcDetail}
                        type="default"
                        style={{
                          marginBottom: 16,
                          width: "100%",
                        }}
                      >
                        {t("ndc:addNdcAction")}
                      </Button>
                    </Row>
                  )
                }
              />
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};
