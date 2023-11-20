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
import {
  DateRange,
  NdcActionType,
  NdcDetail,
  NdcDetailsActionStatus,
  Period,
} from "../../Definitions/Definitions/ndcDetails.definitions";

export const NdcDetailsComponent = (props: any) => {
  const { t, useConnection, useUserContext } = props;
  const { RangePicker } = DatePicker;
  const [ndcDetailsData, setNdcDetailsData] = useState([] as NdcDetail[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [periodItems, setPeriodItems] = useState([] as Period[]);
  const [selectedPeriod, setSelectedPeriod] = useState({} as Period);
  const selectedDateRangeRef = useRef({} as DateRange);
  const selectedNdcDetail = useRef({} as NdcDetail);
  const [tableKey, setTableKey] = useState(0);
  const { get, post, put } = useConnection();

  const { userInfoState } = useUserContext();

  const governmentMinistry = process.env.REACT_APP_GOVERNMENT_MINISTRY
    ? process.env.REACT_APP_GOVERNMENT_MINISTRY
    : "Test ministryName";

  const isAddRangeVisible =
    (userInfoState?.companyRole === CompanyRole.MINISTRY ||
      userInfoState?.companyRole === CompanyRole.GOVERNMENT) &&
    userInfoState?.userRole !== Role.ViewOnly;

  const ndcMainDetailsForPeriod =
    selectedPeriod.key !== "add_new"
      ? ndcDetailsData.filter((ndcDetail: NdcDetail) => {
          return (
            ndcDetail.periodId === parseInt(selectedPeriod.key) &&
            ndcDetail.actionType === NdcActionType.mainAction
          );
        })
      : [];

  const isNdcActionsEditable = !selectedPeriod.finalized;

  const getSubNdcDetailsForPeriod = (id: number) => {
    const subNdcDetails = ndcDetailsData.filter((ndcDetail: NdcDetail) => {
      return (
        ndcDetail.parentActionId === id &&
        ndcDetail.actionType === NdcActionType.subAction
      );
    });

    const emptySubNdcRow = {
      actionType: NdcActionType.subAction,
      nationalPlanObjective: "",
      kpi: 0,
      ministryName: governmentMinistry,
      status: NdcDetailsActionStatus.pending,
      parentActionId: id,
    };

    return [...subNdcDetails, emptySubNdcRow];
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

  const handleSave = async (row: any) => {
    const updatedItemIndex = ndcDetailsData.findIndex(
      (item: NdcDetail) => item.id === row.id
    );
    if (updatedItemIndex === -1) {
      const response = await post("national/programme/addNdcDetailsAction", {
        ...row,
        kpi: parseInt(row.kpi),
      });
    } else {
      const response = await put("national/programme/updateNdcDetailsAction", {
        ...row,
        kpi: parseInt(row.kpi),
      });
    }
    fetchNdcDetailActions();
  };

  const defaultColumns: any = [
    {
      title: t("ndc:ndcColumnsNationalPlanObj"),
      dataIndex: "nationalPlanObjective",
      key: "nationalPlanObjective",
      align: "left" as const,
      editable: true,
      width: "50%",
      render: (_: any, record: any) => (
        <>
          {record.nationalPlanObjective ? (
            <Space size="middle">
              <span>{record.nationalPlanObjective}</span>
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
          {record.kpi ? (
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
      title: "ministryName",
      dataIndex: "ministryName",
      key: "ministryName",
      align: "left" as const,
      editable: true,
      width: "40%",
      render: (_: any, record: any) => (
        <>
          {record.ministryName ? (
            <Space size="middle">
              <span>{record.ministryName}</span>
            </Space>
          ) : (
            <input
              placeholder="Please add the ministryName name"
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
      onCell: (record: any) => {
        console.log('record', record);
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        };
      },
    };
  });

  async function onClickedAddNewNdcDetail() {
    if (selectedPeriod.key !== "add_new") {
      const periodId: number = parseInt(selectedPeriod.key);
      const newData: NdcDetail = {
        actionType: NdcActionType.mainAction,
        nationalPlanObjective: "",
        kpi: 0,
        ministryName: governmentMinistry,
        periodId: periodId,
        status: NdcDetailsActionStatus.pending,
      };

      const response = await post("national/programme/addNdcDetailsAction", {
        ...newData,
      });

      if (response && response.data) {
        const newlyCreatedNdcAction = response.data;
        setNdcDetailsData((ndcDetailsData: NdcDetail[]) => [
          ...ndcDetailsData,
          newlyCreatedNdcAction,
        ]);
        setTableKey((key: any) => key + 1);
      }
    }
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const onDeletePeriod = async () => {
    const result = await post("national/programme/deleteNdcDetailsPeriod", {
      id: selectedPeriod.key,
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
              rowKey="id"
              components={components}
              rowClassName={() => "editable-row"}
              bordered
              dataSource={ndcMainDetailsForPeriod}
              columns={columns}
              expandable={{
                expandedRowRender: (record) => getSubNdcActionContent(record),
                indentSize: 0,
                //defaultExpandedRowKeys: [parseInt(selectedNdcDetail.current.id)],
              }}
              footer={() =>
                isAddNdcActionVisible() && (
                  <Row justify={"center"}>
                    <Button
                      onClick={onClickedAddNewNdcDetail}
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
        <Row justify="end">
          <Button
            className="mg-left-1"
            type="primary"
            onClick={onDeletePeriod}
            htmlType="submit"
            loading={loading}
          >
            {t("ndc:delete")}
          </Button>
          <Button
            className="mg-left-1"
            type="primary"
            onClick={onFinalizePeriod}
            htmlType="submit"
            loading={loading}
          >
            {t("ndc:finalize")}
          </Button>
        </Row>
      </div>
    );
  }

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
        rowKey="id"
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={getSubNdcDetailsForPeriod(record.id)}
        columns={columns}
        showHeader={false}
        pagination={false}
      />
    );
  }

  const onTabChange = (key: string) => {
    const selectedPeriod = periodItems.find((item: any) => item.key === key);
    if (selectedPeriod) {
      setSelectedPeriod(selectedPeriod);
    }
  };

  const fetchNdcDetailPeriods = async () => {
    let periods = [];
    let addNewTab: Period = {
      key: "add_new",
      label: "Add New",
      startYear: 0,
      endYear: 0,
      finalized: false,
      deleted: false,
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

  const fetchNdcDetailActions = async () => {
    const response = await get("national/programme/queryNdcDetailsAction");
    if (response && response.data) {
      setNdcDetailsData(response.data);
    }
  };

  useEffect(() => {
    fetchNdcDetailPeriods();
    fetchNdcDetailActions();
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
          activeKey={selectedPeriod.key}
          onChange={onTabChange}
        />
      </div>
      <div>
        {selectedPeriod.key === "add_new"
          ? addNewPeriodContent()
          : ndcDetailsTableContent()}
      </div>
    </div>
  );
};
