import {
  Button,
  Col,
  DatePicker,
  Empty,
  PaginationProps,
  Row,
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

type Period = {
  start: number;
  end: number;
};

type NdcDetail = {
  key?: number;
  startDate: Date;
  endDate: Date;
  nationalPlanObj: string;
  kpi: number;
};

export const NdcDetailsComponent = (props: any) => {
  const { t, useConnection, useUserContext } = props;
  const { RangePicker } = DatePicker;
  const [ndcDetailsData, setNdcDetailsData] = useState<NdcDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const periodItemsRef = useRef([] as any[]);
  const [periodItems, setPeriodItems] = useState([] as any[]);
  const [selectedTab, setSelectedTab] = useState("add_new");
  const selectedPeriod = useRef({} as Period);
  const addedNdcDetailId = useRef(0);

  const { userInfoState } = useUserContext();

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

  const inRange = (num: number, min: number, max: number) =>
    num >= min && num <= max;

  const handleSave = (row: any) => {
    const newData = [...ndcDetailsData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setNdcDetailsData(newData);
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

  const defaultColumns: any = [
    {
      title: t("ndc:ndcColumnsNationalPlanObj"),
      dataIndex: "nationalPlanObj",
      key: "nationalPlanObj",
      align: "left" as const,
      editable: true,
    },
    {
      title: t("ndc:ndcColumnsKpi"),
      dataIndex: "kpi",
      key: "kpi",
      align: "left" as const,
      editable: true,
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
    const range = selectedTab.split("-");
    addedNdcDetailId.current = addedNdcDetailId.current + 1;
    const newData = {
      key: addedNdcDetailId.current,
      startDate: new Date(`${Number(range[0])}-01-24 23:12:00`),
      endDate: new Date(`${Number(range[0])}-12-24 23:12:00`),
      nationalPlanObj: t("ndc:enterNewPlanTxt"),
      kpi: 0,
    };

    setNdcDetailsData([...ndcDetailsData, newData]);
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  //commented because rendering issue
  function ndcDetailsTableContent() {
    return (
      <div></div>
      // <div>
      //   <Button
      //     onClick={onAddNewNdcDetail}
      //     type="primary"
      //     style={{
      //       marginBottom: 16,
      //     }}
      //   >
      //     Add a row
      //   </Button>
      //   <Table
      //     components={components}
      //     rowClassName={() => 'editable-row'}
      //     bordered
      //     dataSource={ndcDetailsData}
      //     columns={columns}
      //   />
      // </div>
    );
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
    if (periodItems && periodItems.length > 1) {
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
          <div className="steps-actions">
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

  const onTabChange = (key: string) => {
    setSelectedTab(key);
  };

  useEffect(() => {
    const defaultNdcDetails = [
      {
        key:1,
        startDate: new Date("2019-03-25"),
        endDate: new Date("2020-03-25"),
        nationalPlanObj: "Enhance value addition in key growth opportunities",
        kpi: 25,
      },
      {
        key:2,
        startDate: new Date("2019-03-25"),
        endDate: new Date("2019-08-25"),
        nationalPlanObj: "Strengthen the private sector to create 10,000 jobs",
        kpi: 10500,
      },
      {
        key:3,
        startDate: new Date("2021-03-25"),
        endDate: new Date("2022-03-25"),
        nationalPlanObj:
          "Consolidate and increase the stock and quality of productive infrastructure by 50%",
        kpi: 48,
      },
      {
        key:4,
        startDate: new Date("2022-03-25"),
        endDate: new Date("2022-05-25"),
        nationalPlanObj:
          "Enhance the productivity and social wellbeing of the population",
        kpi: 20,
      },
      {
        key:5,
        startDate: new Date("2022-03-25"),
        endDate: new Date("2023-03-25"),
        nationalPlanObj:
          "Strengthen the role of the state in guiding and facilitating development",
        kpi: 10,
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
            <Table
              components={components}
              rowClassName={() => "editable-row"}
              bordered
              dataSource={getNdcDetailsForPeriod()}
              columns={columns}
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
          </div>
        </div>
      )}
    </div>
  );
};
