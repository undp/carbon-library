import {
  Button,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
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
import { EditableCell } from "../Common/AntComponents/antTableComponents";
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
  const [ndcActionsList, setNdcActionsList] = useState([] as NdcDetail[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [periodItems, setPeriodItems] = useState([] as Period[]);
  const [selectedPeriod, setSelectedPeriod] = useState({} as Period);
  const selectedDateRangeRef = useRef({} as DateRange);
  const [tableKey, setTableKey] = useState(0);
  const { get, post, put } = useConnection();
  const [ministryOrgList, setMinistryOrgList] = useState([] as any);
  const [actionInfo, setActionInfo] = useState<any>({});
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number>(-1);
  const [nextAvailableActionId, setNextAvailableActionId] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState([] as any[]);
  const [subNdcActionsForPeriod, setSubNdcActionsForPeriod] = useState(
    [] as NdcDetail[]
  );

  const isEditing = (record: NdcDetail) => record.id === editingKey;

  const { userInfoState } = useUserContext();

  useEffect(() => {
    if (expandedRowKeys && expandedRowKeys.length > 0) {
      const expandedKey = expandedRowKeys[0];
      setNdcSubActionsForMainAction(expandedKey);
    }
  }, ndcActionsList);

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

  const isNdcActionEditable = (record: NdcDetail) => {
    if (record.actionType === NdcDetailsActionType.MainAction) {
      return isMainNdcActionsEditable;
    } else if (record.actionType === NdcDetailsActionType.SubAction) {
      return isSubNdcActionsEditable(record);
    }
  };

  const ndcMainDetailsForPeriod =
    selectedPeriod.key !== "add_new"
      ? ndcActionsList.filter((ndcDetail: NdcDetail) => {
          return (
            ndcDetail.periodId === parseInt(selectedPeriod.key) &&
            ndcDetail.actionType === NdcDetailsActionType.MainAction
          );
        })
      : [];

  const setNdcSubActionsForMainAction = (mainActionId: number) => {
    let subNdcDetails = ndcActionsList.filter((ndcDetail: NdcDetail) => {
      return (
        ndcDetail.parentActionId === mainActionId &&
        ndcDetail.actionType === NdcDetailsActionType.SubAction
      );
    });

    const emptySubNdcRow = {
      id: nextAvailableActionId,
      actionType: NdcDetailsActionType.SubAction,
      nationalPlanObjective: "",
      kpi: "",
      ministryName: loginMinistry,
      status: NdcDetailsActionStatus.New,
      parentActionId: mainActionId,
    };

    if (!selectedPeriod.finalized) {
      subNdcDetails = [...subNdcDetails, emptySubNdcRow];
      setEditingKey(nextAvailableActionId);
      setNextAvailableActionId((value) => value + 1);

      form.setFieldsValue({
        nationalPlanObjective: "",
        kpi: "",
      });
    }

    setSubNdcActionsForPeriod(subNdcDetails);
  };

  const inRange = (num: number, min: number, max: number) =>
    num >= min && num <= max;

  const handleSave = async (row: NdcDetail) => {
    try {
      let updatedFields;
      try {
        updatedFields = (await form.validateFields()) as NdcDetail;
      } catch (exception) {
        return;
      }
      const updatedItem = {
        ...row,
        ...updatedFields,
      };

      if (updatedItem.status === NdcDetailsActionStatus.New) {
        if (
          isGovernmentUser &&
          updatedItem.actionType === NdcDetailsActionType.SubAction
        ) {
          updatedItem.status = NdcDetailsActionStatus.Approved;
        } else {
          updatedItem.status = NdcDetailsActionStatus.Pending;
        }
        const response = await post("national/programme/addNdcDetailsAction", {
          ...updatedItem,
          kpi: parseInt(updatedItem.kpi.toString()),
        });
      } else {
        updatedItem.status = NdcDetailsActionStatus.Pending;
        const response = await put(
          "national/programme/updateNdcDetailsAction",
          {
            ...updatedItem,
            kpi: parseInt(updatedItem.kpi.toString()),
          }
        );
      }
      fetchNdcDetailActions();
      setEditingKey(-1);
    } catch (exception: any) {
      message.open({
        type: "error",
        content: exception.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    } finally {
      setEditingKey(-1);
    }
  };

  const actionMenu = (record: NdcDetail) => {
    if (
      record.status === NdcDetailsActionStatus.Pending &&
      isGovernmentUser &&
      !selectedPeriod.finalized
    ) {
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
      width: 300,
      editable: true,
      render: (_: any, record: NdcDetail) => (
        <Space size="middle">
          {record.nationalPlanObjective ? (
            <span>{record.nationalPlanObjective}</span>
          ) : (
            <Input placeholder="Enter National Plan Objective" />
          )}
        </Space>
      ),
    },
    {
      title: t("ndc:ndcColumnsKpi"),
      dataIndex: "kpi",
      key: "kpi",
      align: "left" as const,
      width: 100,
      editable: true,
      render: (_: any, record: NdcDetail) => (
        <Space size="middle">
          {record.kpi ? (
            <span>{record.kpi}</span>
          ) : (
            <Input placeholder="Enter Kpi" />
          )}
        </Space>
      ),
    },
    {
      title: t("ndc:ndcColumnsMinistry"),
      dataIndex: "ministryName",
      key: "ministryName",
      align: "left" as const,
      width: 200,
      editable: false,
      render: (_: any, record: any) => (
        <>
          <Select
            disabled={!(isSubNdcActionsEditable(record) && isEditing(record))}
            defaultValue={
              record.ministryName ? record.ministryName : loginMinistry
            }
            style={{ width: 320 }}
            onChange={(value: any, option: any) => {
              record.ministryName = option.label;
              handleSave(record);
            }}
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
          <div onClick={(event: any) => event.stopPropagation()}>
            {record.actionType === NdcDetailsActionType.SubAction &&
            record.status !== NdcDetailsActionStatus.New ? (
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
          </div>
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
          editing: isEditing(record),
          dataIndex: col.dataIndex,
          title: col.title,
          onBlurHandler: (record: NdcDetail) => {
            if (isEditing(record)) {
              handleSave(record);
            }
          },
        };
      },
    };
  });

  async function onClickedAddNewNdcDetail() {
    if (selectedPeriod.key !== "add_new") {
      form.setFieldsValue({
        nationalPlanObjective: "",
        kpi: "",
      });
      const periodId: number = parseInt(selectedPeriod.key);
      const newData: NdcDetail = {
        id: nextAvailableActionId,
        actionType: NdcDetailsActionType.MainAction,
        nationalPlanObjective: "",
        kpi: "",
        ministryName: loginMinistry,
        periodId: periodId,
        status: NdcDetailsActionStatus.New,
      };

      setEditingKey(nextAvailableActionId);

      setNextAvailableActionId((value) => value + 1);

      setNdcActionsList((ndcActionsList: NdcDetail[]) => [
        ...ndcActionsList,
        newData,
      ]);
      setTableKey((key: any) => key + 1);
    }
  }

  const components = {
    body: {
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
    const pendingActions = subNdcActionsForPeriod.filter(
      (action: NdcDetail) => {
        return action.status === NdcDetailsActionStatus.Pending;
      }
    );

    if (pendingActions && pendingActions.length > 0) {
      message.open({
        type: "error",
        content: t("ndc:finalizeErrorText"),
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    } else {
      setActionInfo({
        action: "Finalize",
        headerText: t("ndc:finalizeApproveTitle"),
        text: t("ndc:finalizeApproveSubTitle"),
        type: "primary",
        icon: <Icon.Clipboard2Check />,
        recordId: selectedPeriod.key,
      });
      setOpenConfirmationModal(true);
    }
  };

  const onMainTableRowExpand = (expanded: any, record: any) => {
    const keys = [];
    if (expanded) {
      keys.push(record.id);
    }

    setExpandedRowKeys(keys);
    setNdcSubActionsForMainAction(record.id);
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

  function mainNdcActionTableContent() {
    return (
      <div>
        <Row>
          <Col span={24}>
            <Form form={form} component={false}>
              <Table
                key={tableKey}
                rowKey="id"
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                loading={loading}
                dataSource={ndcMainDetailsForPeriod}
                columns={columns}
                expandedRowKeys={expandedRowKeys}
                onExpand={onMainTableRowExpand}
                expandable={{
                  expandedRowRender: (record) =>
                    subNdcActionTableContent(record),
                  indentSize: 30,
                  columnWidth: 30,
                }}
                onRow={(record: NdcDetail, rowIndex) => {
                  return {
                    onClick: (event: any) => {
                      if (
                        record.id &&
                        isNdcActionEditable(record) &&
                        !isEditing(record)
                      ) {
                        form.setFieldsValue({ ...record });
                        setEditingKey(record.id);
                      }
                    },
                    onMouseLeave: () => {
                      if (isEditing(record)) {
                        handleSave(record);
                      }
                    },
                  };
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
            </Form>
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

  function subNdcActionTableContent(record: any) {
    return (
      <Table
        rowKey="id"
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={subNdcActionsForPeriod}
        loading={loading}
        onRow={(record: NdcDetail, rowIndex) => {
          return {
            onClick: (event: any) => {
              if (
                record.id &&
                isNdcActionEditable(record) &&
                !isEditing(record)
              ) {
                form.setFieldsValue({ ...record });
                setEditingKey(record.id);
              }
            },
            onMouseLeave: () => {
              if (isEditing(record)) {
                handleSave(record);
              }
            },
          };
        }}
        columns={columns}
        showHeader={false}
        pagination={false}
      />
    );
  }

  const onAddNewPeriod = async () => {
    try {
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
          const response = await post(
            "national/programme/addNdcDetailsPeriod",
            {
              ...periodItem,
            }
          );

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
    } catch (exception: any) {
      message.open({
        type: "error",
        content: exception.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    }
  };

  const onDateRangeChanged = (range: any) => {
    const period = {
      startYear: Number(moment(range[0]).year()),
      endYear: Number(moment(range[1]).year()),
    };
    selectedDateRangeRef.current = period;
  };

  const onTabChange = (key: string) => {
    const selectedPeriod = periodItems.find((item: any) => item.key === key);
    if (selectedPeriod) {
      setSelectedPeriod(selectedPeriod);
    }
  };

  const onActionConfirmed = async () => {
    setLoading(true);
    let actionResponse;
    try {
      if (actionInfo.action === "Approve") {
        actionResponse = await post(
          "national/programme/approveNdcDetailsAction",
          {
            id: actionInfo.recordId,
          }
        );
      } else if (actionInfo.action === "Reject") {
        actionResponse = await post(
          "national/programme/rejectNdcDetailsAction",
          {
            id: actionInfo.recordId,
          }
        );
      } else if (actionInfo.action === "Finalize") {
        actionResponse = await post(
          "national/programme/finalizeNdcDetailsPeriod",
          {
            id: selectedPeriod.key,
          }
        );
      } else if (actionInfo.action === "Delete") {
        actionResponse = await post(
          "national/programme/deleteNdcDetailsPeriod",
          {
            id: selectedPeriod.key,
          }
        );
      }
    } catch (exception: any) {
      message.open({
        type: "error",
        content: exception.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    }
    if (
      actionResponse &&
      (actionInfo.action === "Delete" || actionInfo.action === "Finalize")
    ) {
      fetchNdcDetailPeriods();
    } else if (
      actionResponse &&
      (actionInfo.action === "Approve" || actionInfo.action === "Reject")
    ) {
      fetchNdcDetailActions();
    }
    setOpenConfirmationModal(false);
    setLoading(false);
  };

  const onActionCanceled = () => {
    setOpenConfirmationModal(false);
  };

  const fetchNdcDetailPeriods = async () => {
    setLoading(true);
    try {
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
      if (isGovernmentUser) {
        setSelectedPeriod(addNewTab);
      } else {
        setSelectedPeriod(periods[0]);
      }
      setLoading(false);
    } catch (exception: any) {
      message.open({
        type: "error",
        content: exception.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNdcDetailActions = async () => {
    setLoading(true);
    try {
      const response = await get("national/programme/queryNdcDetailsAction");
      if (response && response.data) {
        const maxActionId = Math.max(
          ...response.data.map((item: NdcDetail) => item.id)
        );
        setNextAvailableActionId(maxActionId + 1);
        setNdcActionsList(response.data);
      }
      setLoading(false);
    } catch (exception: any) {
      message.open({
        type: "error",
        content: exception.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMinistries = async () => {
    setLoading(true);
    try {
      const response = await get("national/organisation/getMinistries");
      if (response && response.data) {
        const ministryOrgDetails = response.data.map((value: any) => {
          return {
            value: value.company_companyId,
            label: value.company_name,
          };
        });
        setMinistryOrgList(ministryOrgDetails);
      }
      setLoading(false);
    } catch (exception: any) {
      message.open({
        type: "error",
        content: exception.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNdcDetailPeriods();
    fetchNdcDetailActions();
    fetchMinistries();
  }, []);

  return (
    <div className="ndc-details content-container">
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
          : mainNdcActionTableContent()}
      </div>
      <UserActionConfirmationModel
        t={t}
        actionInfo={actionInfo}
        onActionConfirmed={onActionConfirmed}
        onActionCanceled={onActionCanceled}
        openModal={openConfirmationModal}
        errorMsg=""
        loading={loading}
      />
    </div>
  );
};
