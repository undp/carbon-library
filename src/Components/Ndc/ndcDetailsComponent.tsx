import {
  Button,
  Col,
  DatePicker,
  Empty,
  List,
  PaginationProps,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  TabsProps,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  EditableRow,
  EditableCell,
} from "../Common/AntComponents/antTableComponents";
import "./ndcDetailsComponent.scss";
import { CompanyRole, Role, addSpaces } from "../../Definitions";
import {
  DateRange,
  NdcDetailsActionType,
  NdcDetail,
  NdcDetailsActionStatus,
  Period,
  getNdcActionStatusTagType,
  PopupInfo,
} from "../../Definitions/Definitions/ndcDetails.definitions";
import { TooltipColor } from "../../Styles";
import { EllipsisOutlined, LockOutlined } from "@ant-design/icons";
import * as Icon from "react-bootstrap-icons";
import UserActionConfirmationModel from "../Common/Models/userActionConfirmationModel";

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
  const [ministryOrgList, setMinistryOrgList] = useState([] as any);
  const [actionInfo, setActionInfo] = useState<any>({});
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const { userInfoState } = useUserContext();

  const loginMinistry =
    userInfoState?.companyRole === CompanyRole.GOVERNMENT
      ? process.env.REACT_APP_GOVERNMENT_MINISTRY
        ? process.env.REACT_APP_GOVERNMENT_MINISTRY
        : "Test ministryName"
      : userInfoState?.companyRole === CompanyRole.MINISTRY
      ? userInfoState?.companyName
      : undefined;

  const isGovernmentUser =
    userInfoState?.companyRole === CompanyRole.GOVERNMENT &&
    userInfoState?.userRole !== Role.ViewOnly;

  const ndcMainDetailsForPeriod =
    selectedPeriod.key !== "add_new"
      ? ndcDetailsData.filter((ndcDetail: NdcDetail) => {
          return (
            ndcDetail.periodId === parseInt(selectedPeriod.key) &&
            ndcDetail.actionType === NdcDetailsActionType.MainAction
          );
        })
      : [];

  const isMainNdcActionsEditable =
    !selectedPeriod.finalized &&
    userInfoState?.companyRole === CompanyRole.GOVERNMENT &&
    userInfoState?.userRole !== Role.ViewOnly;

  const isSubNdcActionsEditable = (record: NdcDetail) => {
    return (
      !selectedPeriod.finalized &&
      record.status !== NdcDetailsActionStatus.Approved &&
      (userInfoState?.companyRole === CompanyRole.GOVERNMENT ||
        (userInfoState?.companyRole === CompanyRole.MINISTRY &&
          userInfoState?.companyName === record.ministryName)) &&
      userInfoState?.userRole !== Role.ViewOnly
    );
  };

  const getSubNdcDetailsForPeriod = (id: number) => {
    const subNdcDetails = ndcDetailsData.filter((ndcDetail: NdcDetail) => {
      return (
        ndcDetail.parentActionId === id &&
        ndcDetail.actionType === NdcDetailsActionType.SubAction
      );
    });

    const emptySubNdcRow = {
      actionType: NdcDetailsActionType.SubAction,
      nationalPlanObjective: "",
      kpi: 0,
      ministryName: loginMinistry,
      status: NdcDetailsActionStatus.Pending,
      parentActionId: id,
    };

    return [...subNdcDetails, emptySubNdcRow];
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

  const actionMenu = (record: NdcDetail) => {
    if (record.status === NdcDetailsActionStatus.Pending && isGovernmentUser) {
      return (
        <List
          className="action-menu"
          size="small"
          dataSource={[
            {
              text: t("ndc:approve"),
              icon: <Icon.BoxArrowInDown />,
              click: () => {
                setActionInfo({
                  action: "Approve",
                  headerText: t("ndc:actionApproveTitle"),
                  type: "primary",
                  icon: <Icon.BoxArrowInDown />,
                  recordId: record.id,
                });
                setOpenConfirmationModal(true);
              },
            },
            {
              text: t("ndc:reject"),
              icon: <Icon.XOctagon />,
              click: () => {
                setActionInfo({
                  action: "Reject",
                  headerText: t("ndc:rejectApproveTitle"),
                  type: "danger",
                  icon: <Icon.BoxArrowInDown />,
                  recordId: record.id,
                });
                setOpenConfirmationModal(true);
              },
            },
          ]}
          renderItem={(item: any) => (
            <List.Item onClick={item.click}>
              <Typography.Text className="action-icon color-error">
                {item.icon}
              </Typography.Text>
              <span>{item.text}</span>
            </List.Item>
          )}
        ></List>
      );
    } else {
      return null;
    }
  };

  const defaultColumns: any = [
    {
      title: t("ndc:ndcColumnsNationalPlanObj"),
      dataIndex: "nationalPlanObjective",
      key: "nationalPlanObjective",
      align: "left" as const,
      width: "40%",
      editable: true,
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
      width: "15%",
      editable: true,
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
      title: t("ndc:ndcColumnsMinistry"),
      dataIndex: "ministryName",
      key: "ministryName",
      align: "left" as const,
      width: "30%",
      editable: false,
      render: (_: any, record: any) => (
        <>
          <Select
            disabled={!isSubNdcActionsEditable(record)}
            defaultValue={
              record.ministryName ? record.ministryName : loginMinistry
            }
            style={{ width: 320 }}
            onChange={() => {}}
            options={ministryOrgList}
          />
        </>
      ),
    },
    {
      title: t("ndc:ndcColumnsStatus"),
      dataIndex: "status",
      key: "status",
      align: "left" as const,
      width: "15%",
      editable: false,
      render: (_: any, record: any) => {
        const menu = actionMenu(record);
        return (
          <>
            {record.actionType === NdcDetailsActionType.SubAction ? (
              <Tooltip
                title={record.status}
                color={TooltipColor}
                key={TooltipColor}
              >
                <Tag
                  className="clickable"
                  color={getNdcActionStatusTagType(record.status)}
                >
                  {addSpaces(record.status)}
                </Tag>
              </Tooltip>
            ) : (
              ""
            )}
            {record.actionType === NdcDetailsActionType.SubAction && menu ? (
              <Popover placement="bottomRight" content={menu} trigger="click">
                <EllipsisOutlined
                  rotate={90}
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                />
              </Popover>
            ) : (
              <span></span>
            )}
          </>
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
      onCell: (record: NdcDetail) => {
        return {
          record,
          editable:
            record.actionType === NdcDetailsActionType.MainAction
              ? isMainNdcActionsEditable
              : isSubNdcActionsEditable(record),
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
        actionType: NdcDetailsActionType.MainAction,
        nationalPlanObjective: "",
        kpi: 0,
        ministryName: loginMinistry,
        periodId: periodId,
        status: NdcDetailsActionStatus.Pending,
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

  const onClickedDeletePeriod = async () => {
    setActionInfo({
      action: "Delete",
      headerText: t("ndc:periodDeleteConfirmTitle"),
      type: "danger",
      icon: <Icon.XCircle />,
      recordId: selectedPeriod.key,
    });
    setOpenConfirmationModal(true);
  };

  const onClickedFinalizePeriod = async () => {
    setActionInfo({
      action: "Finalize",
      headerText: t("ndc:finalizeApproveTitle"),
      text: t("ndc:finalizeApproveSubTitle"),
      type: "primary",
      icon: <Icon.Clipboard2Check />,
      recordId: selectedPeriod.key,
    });
    setOpenConfirmationModal(true);
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
                isGovernmentUser &&
                !selectedPeriod.finalized && (
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
        {isGovernmentUser && !selectedPeriod.finalized ? (
          <Row justify="end">
            <Button
              className="mg-left-1"
              type="primary"
              onClick={onClickedDeletePeriod}
              htmlType="submit"
              loading={loading}
            >
              {t("ndc:delete")}
            </Button>
            <Button
              className="mg-left-1"
              type="primary"
              onClick={onClickedFinalizePeriod}
              htmlType="submit"
              loading={loading}
            >
              {t("ndc:finalize")}
            </Button>
          </Row>
        ) : (
          ""
        )}
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

  const onActionConfirmed = async () => {
    if (actionInfo.action === "Approve") {
      const response = await get("national/programme/approveNdcDetailsAction", {
        id: actionInfo.recordId,
      });
      console.log("response", response);
    } else if (actionInfo.action === "Reject") {
      const response = await get("national/programme/rejectNdcDetailsAction", {
        id: actionInfo.recordId,
      });
      console.log("response", response);
    } else if (actionInfo.action === "Finalize") {
      const response = await post(
        "national/programme/finalizeNdcDetailsPeriod",
        {
          id: selectedPeriod.key,
        }
      );
      console.log("response", response);
      if (response) {
        fetchNdcDetailPeriods();
      }
    } else if (actionInfo.action === "Delete") {
      const result = await post("national/programme/deleteNdcDetailsPeriod", {
        id: selectedPeriod.key,
      });
      if (result) {
        fetchNdcDetailPeriods();
      }
    }
    setOpenConfirmationModal(false);
  };

  const onActionCanceled = () => {
    setOpenConfirmationModal(false);
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
          label: period.finalized ? (
            <span>
              <LockOutlined /> {period.startYear}-{period.endYear}{" "}
            </span>
          ) : (
            `${period.startYear}-${period.endYear}`
          ),
        };
      });
    }
    if (isGovernmentUser) {
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

  const fetchMinistries = async () => {
    const response = await get("national/organisation/getMinistries");
    console.log("fetchMinistries", response);
    if (response && response.data) {
      const ministryOrgDetails = response.data.map((value: any) => {
        return {
          value: value.company_companyId,
          label: value.company_name,
        };
      });
      setMinistryOrgList(ministryOrgDetails);
    }
  };

  useEffect(() => {
    fetchNdcDetailPeriods();
    fetchNdcDetailActions();
    fetchMinistries();
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
      <UserActionConfirmationModel
        t={t}
        actionInfo={actionInfo}
        onActionConfirmed={onActionConfirmed}
        onActionCanceled={onActionCanceled}
        openModal={openConfirmationModal}
        errorMsg=""
        loading={false}
      />
    </div>
  );
};
