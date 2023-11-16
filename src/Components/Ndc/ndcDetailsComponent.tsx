import {
  Button,
  Col,
  DatePicker,
  Empty,
  PaginationProps,
  Row,
  Space,
  Table,
  Tabs,
  TabsProps,
  message,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  EditableRow,
  EditableCell,
} from "../Common/AntComponents/antTableComponents";
import "./ndcDetailsComponent.scss";
import { CompanyRole, Role } from "../../Definitions";
import { Period } from "../../Definitions/Definitions/ndcDetails.definitions";

type NdcDetail = {
  key: number;
  startDate: Date;
  endDate: Date;
  nationalPlanObj: string;
  kpi: number;
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
  const [periodItems, setPeriodItems] = useState([] as any[]);
  const [selectedPeriod, setSelectedPeriod] = useState({} as any);
  const selectedDateRangeRef = useRef({} as any);
  const addedNdcDetailId = useRef(0);
  const selectedNdcDetail = useRef({} as NdcDetail);
  const [tableKey, setTableKey] = useState(0);
  const { get, post } = useConnection();

  const { userInfoState } = useUserContext();

  const isAddRangeVisible =
    (userInfoState?.companyRole === CompanyRole.MINISTRY ||
      userInfoState?.companyRole === CompanyRole.GOVERNMENT) &&
    userInfoState?.userRole !== Role.ViewOnly;

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

  function onAddNewSubNdcDetail() {
    //const range = selectedPeriod.split("-");
    const range: any = [];
    const ndcDetail = ndcDetailsData.find(
      (item: NdcDetail) => item.key === selectedNdcDetail.current.key
    );
    const ndcDetailItemIndex = ndcDetailsData.findIndex(
      (item: NdcDetail) => item.key === selectedNdcDetail.current.key
    );

    if (ndcDetail) {
      addedNdcDetailId.current = addedNdcDetailId.current + 1;
      const newData = {
        key: addedNdcDetailId.current,
        startDate: new Date(`${Number(range[0])}-01-24 23:12:00`),
        endDate: new Date(`${Number(range[0])}-12-24 23:12:00`),
        ndcActionId: ndcDetail?.key,
        nationalPlanObj: "",
        kpi: "",
        ministry: "",
      };
      if (!ndcDetail.subNdcDetails) {
        ndcDetail.subNdcDetails = [];
      }
      ndcDetail.subNdcDetails.push(newData);
    }

    ndcDetailsData[ndcDetailItemIndex] = ndcDetail;
    setNdcDetailsData(ndcDetailsData);
    setTableKey((key: any) => key + 1);
  }

  const handleSave = (row: any) => {
    setNdcDetailsData((prevData: any) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (row.type === NdcActionType.main) {
        const index = newData.findIndex((item: any) => row.key === item.key);
        if (index !== -1) {
          newData[index] = { ...newData[index], ...row };
        }
      } else {
        const parentIndex = newData.findIndex(
          (item: any) => row.ndcActionId === item.key
        );
        const parentItem = newData[parentIndex];

        if (parentItem) {
          if (parentItem.subNdcDetails) {
            const itemIndex = parentItem.subNdcDetails.findIndex(
              (item: any) => row.key === item.key
            );

            if (itemIndex === -1) {
              parentItem.subNdcDetails.push(row);
            } else {
              parentItem.subNdcDetails[itemIndex] = { ...row };
            }
          } else {
            parentItem.subNdcDetails = [row];
          }
        }

        newData[parentIndex] = { ...parentItem };
        setTableKey((key: any) => key + 1);
      }
      return newData;
    });
  };

  const getNdcDetailsForPeriod = () => {
    //const range = selectedPeriod.split("-");
    const range: any = [];
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

  const getSubNdcDetails = (key: number) => {
    const ndcDetail = ndcDetailsData.find(
      (item: NdcDetail) => item.key === key
    );
    if (ndcDetail) {
      if (
        ndcDetail?.subNdcDetails[
          ndcDetail?.subNdcDetails?.length - 1
        ]?.ministry.trim() !== "" &&
        ndcDetail?.subNdcDetails[ndcDetail?.subNdcDetails?.length - 1]
          ?.ministry &&
        ndcDetail?.subNdcDetails[
          ndcDetail?.subNdcDetails?.length - 1
        ]?.nationalPlanObj.trim() !== "" &&
        ndcDetail?.subNdcDetails[ndcDetail?.subNdcDetails?.length - 1]
          ?.nationalPlanObj &&
        String(
          ndcDetail?.subNdcDetails[ndcDetail?.subNdcDetails?.length - 1]?.kpi
        ).trim() !== "" &&
        String(
          ndcDetail?.subNdcDetails[ndcDetail?.subNdcDetails?.length - 1]?.kpi
        )
      ) {
        onAddNewSubNdcDetail();
      }
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
      width: "40%",
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
              type="text"
            ></input>
          )}
        </>
      ),
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
        handleSave,
      }),
    };
  });

  function onAddNewNdcDetail() {
    //const range = selectedPeriod.split("-");
    const range: any = [];
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
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const onDeletePeriod = async () => {
    const result = await post("national/programme/deleteNdcDetailsPeriod", {
      id: selectedPeriod.id,
    });
    if (result) {
      fetchNdcDetailPeriods();
    }
  };

  const onFinalizePeriod = () => {
    //
  };

  function ndcDetailsTableContent() {
    return (
      <div>
        <Row>
          <Col span={24}>
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
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Button
              type="primary"
              onClick={onDeletePeriod}
              htmlType="submit"
              loading={loading}
            >
              {t("ndc:delete")}
            </Button>
            <Button
              type="primary"
              onClick={onFinalizePeriod}
              htmlType="submit"
              loading={loading}
            >
              {t("ndc:finalize")}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  const onCancelPeriod = () => {};

  const onAddNewPeriod = async () => {
    if (selectedDateRangeRef && selectedDateRangeRef.current) {
      const periodItem = {
        startYear: selectedDateRangeRef.current.startYear,
        endYear: selectedDateRangeRef.current.endYear,
        finalized: false,
      };

      const existingIndex = periodItems.findIndex(
        (item: any) =>
          inRange(periodItem.startYear, item.startYear, item.endYear) ||
          inRange(periodItem.endYear, item.startYear, item.endYear)
      );

      if (existingIndex === -1) {
        const response = await post("national/programme/addNdcDetailsPeriod", {
          ...periodItem,
        });

        if (response && response.data) {
          const addedPeriodItem = response.data;
          const updatedPeriodItem = {
            ...addedPeriodItem,
            key: addedPeriodItem.id,
            label: `${addedPeriodItem.startYear}-${addedPeriodItem.endYear}`,
          };
          setPeriodItems((items: any) => [...items, updatedPeriodItem]);
          setSelectedPeriod(updatedPeriodItem);
        }
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

  const onDateRangeChanged = (range: any) => {
    const period = {
      startYear: Number(moment(range[0]).year()),
      endYear: Number(moment(range[1]).year()),
    };
    selectedDateRangeRef.current = period;
  };

  function addNewPeriodContent() {
    return (
      <div>
        <Row justify="start" align="middle" gutter={[16, 16]}>
          <Col flex="340px">
            <RangePicker onChange={onDateRangeChanged} picker="year" />
          </Col>
          <Col flex="auto">
            <Button
              type="primary"
              onClick={onAddNewPeriod}
              htmlType="submit"
              loading={loading}
            >
              {t("ndc:submit")}
            </Button>
          </Col>
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
        // footer={() =>
        //   isAddSubNdcActionVisible() && (
        //     <Row justify={"center"}>
        //       <Button
        //         onClick={onAddNewSubNdcDetail}
        //         type="default"
        //         style={{
        //           marginBottom: 16,
        //           width: "100%",
        //         }}
        //       >
        //         {t("ndc:addSubNdcAction")}
        //       </Button>
        //     </Row>
        //   )
        // }
      />
    );
  }

  const onTabChange = (key: string) => {
    const selectedPeriod = periodItems.find((item: any) => item.key === key);
    setSelectedPeriod(selectedPeriod);
  };

  const fetchNdcDetailPeriods = async () => {
    let periods = [];
    let addNewTab = {
      id: "add_new",
      key: "add_new",
      label: "Add New",
      startYear: 0,
      endYear: 0,
    };
    const response = await get("national/programme/queryNdcDetailsPeriod");
    if (response && response.data) {
      periods = response.data.map((period: any) => {
        return {
          ...period,
          key: period.id,
          label: `${period.startYear}-${period.endYear}`,
        };
      });
    }
    if (isAddRangeVisible) {
      periods.unshift(addNewTab);
    }

    setPeriodItems(periods);
    setSelectedPeriod(addNewTab);
  };

  useEffect(() => {
    fetchNdcDetailPeriods();

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
        nationalPlanObj: "Convert to solar energy",
        kpi: 50000,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 11,
            ndcActionId: 13,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "Convert to solar energy",
            kpi: "3000",
            ministry: "Ministry of Agriculture, Water and Forestry (MAWF)",
          },
          {
            key: 14,
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
      {
        key: 15,
        type: NdcActionType.main,
        startDate: new Date("2022-03-25"),
        endDate: new Date("2023-03-25"),
        nationalPlanObj: "Strengthen the private sector to create jobs",
        kpi: 10000,
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 16,
            ndcActionId: 15,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "Strengthen the private sector to create jobs",
            kpi: "7200",
            ministry: "Ministry of Tourism (MoT)",
          },
          {
            key: 17,
            ndcActionId: 15,
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
        key: 18,
        type: NdcActionType.main,
        startDate: new Date("2022-03-25"),
        endDate: new Date("2023-03-25"),
        nationalPlanObj: "Other",
        kpi: "",
        ministry: "Ministry of Environment",
        subNdcDetails: [
          {
            key: 19,
            ndcActionId: 18,
            type: NdcActionType.sub,
            startDate: new Date("2019-03-25"),
            endDate: new Date("2020-03-25"),
            nationalPlanObj: "Strengthen the private sector to create jobs",
            kpi: "",
            ministry: "Ministry of Agriculture, Water and Forestry (MAWF)",
          },
          {
            key: 20,
            ndcActionId: 18,
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

    addedNdcDetailId.current = 20;
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
          activeKey={selectedPeriod}
          onChange={onTabChange}
        />
      </div>
      <div>
        {selectedPeriod.id === "add_new"
          ? addNewPeriodContent()
          : ndcDetailsTableContent()}
      </div>
    </div>
  );
};
