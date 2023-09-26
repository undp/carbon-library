/* eslint-disable @typescript-eslint/no-unused-expressions */
import { EllipsisOutlined } from "@ant-design/icons";
import {
  Row,
  Checkbox,
  message,
  Tag,
  PaginationProps,
  Col,
  Input,
  Table,
  Empty,
  Popover,
  List,
  Typography,
  Form,
  Tooltip,
} from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import "./programmeTransferManagement.scss";
import "./creditTransfer.scss";
import "../../Styles/common.table.scss";
import * as Icon from "react-bootstrap-icons";
import { TooltipColor } from "../../Styles/role.color.constants";
import { CircleFlag } from "react-circle-flags";
import { PauseCircle, PlayCircle } from "react-bootstrap-icons";
import {
  CompanyRole,
  ConfigurationSettingsType,
  CreditTransferStage,
  ProgrammeTransfer,
  Role,
  addCommSepRound,
  addSpaces,
  getCompanyBgColor,
  getStageTransferEnumVal,
  getTransferStageTagType,
} from "../../Definitions";
import { ProfileIcon } from "../Common/ProfileIcon/profile.icon";
import { creditUnit } from "../../Definitions/Definitions/common.definitions";
import { TransferActionModel } from "../Common/Models/transferActionModel";

type CompanyInfo = {
  name: string;
  credit: number;
};

type PopupInfo = {
  title: string;
  icon: any;
  actionBtnText: string;
  okAction: any;
  type: "primary" | "danger";
  remarkRequired: boolean;
};

export const CreditTransferComponent = (props: any) => {
  const {
    useConnection,
    useUserContext,
    useSettingsContext,
    translator,
    onNavigateToProgrammeView,
  } = props;
  const { userInfoState } = useUserContext();
  const t = translator.t;

  const statusOptions = Object.keys(CreditTransferStage).map((k, index) => ({
    label: addSpaces(Object.values(CreditTransferStage)[index]),
    value: k,
  }));

  const [selectedStatus, setSelectedStatus] = useState<any>(
    statusOptions.map((e) => e.value)
  );
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  const { post, get } = useConnection();
  const [totalProgramme, setTotalProgramme] = useState<number>();
  const [dataFilter, setDataFilter] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>();
  const [searchText, setSearchText] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<any>();
  const [sortOrder, setSortOrder] = useState<string>();
  const [sortField, setSortField] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedReq, setSelectedReq] = useState<ProgrammeTransfer>();
  const [popupInfo, setPopupInfo] = useState<PopupInfo>();
  const [companiesInfo, setCompaniesInfo] = useState<CompanyInfo[]>();
  const [totalComCredits, setTotalComCredits] = useState<number>(0);
  const [companyIdsVal, setCompanyIdsVal] = useState<number[]>();
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const { isTransferFrozen, setTransferFrozen } = useSettingsContext();
  const [ministrySectoralScope, setMinistrySectoralScope] = useState<any[]>([]);
  const [ministryLevelFilter, setMinistryLevelFilter] =
    useState<boolean>(false);

  const onStatusQuery = async (checkedValues: CheckboxValueType[]) => {
    console.log(checkedValues);

    if (checkedValues !== selectedStatus) {
      setSelectedStatus(checkedValues);
    }

    if (checkedValues.length === 0) {
      setTableData([]);
      setTotalProgramme(0);
      return;
    }
    setStatusFilter({
      key: "status",
      operation: "in",
      value: checkedValues,
    });
  };
  const [formModal] = Form.useForm();
  const { Search } = Input;

  const onCheckAllChange = (e: any) => {
    const nw = e.target.checked ? statusOptions.map((el) => el.value) : [];
    setSelectedStatus(nw);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onStatusQuery(nw);
  };

  const getAllTransfers = async () => {
    setLoading(true);
    const filter: any[] = [];
    if (statusFilter) {
      filter.push(statusFilter);
    }

    if (search && search !== "") {
      const interFilterOr = [
        {
          key: "programmeTitle",
          operation: "like",
          value: `${search}%`,
        },
      ];
      if (!isNaN(Number(search))) {
        interFilterOr.push({
          key: "requestId",
          operation: "=",
          value: `${search}`,
        });
      }
      filter.push({
        value: {
          page: currentPage,
          size: pageSize,
          filterOr: interFilterOr,
        },
      });
    }

    let sort: any;
    if (sortOrder && sortField) {
      sort = {
        key:
          sortField === "programmeCertifierId"
            ? "programmeCertifierId[1]"
            : sortField,
        order: sortOrder,
        nullFirst: false,
      };
    } else {
      sort = {
        key: "requestId",
        order: "DESC",
      };
    }

    let filterBy: any;
    if (ministryLevelFilter) {
      filterBy = {
        key: "ministryLevel",
        value: ministrySectoralScope,
      };
    }

    try {
      const response: any = await post("national/programme/transferQuery", {
        page: currentPage,
        size: pageSize,
        filterAnd: filter,
        filterOr: dataFilter,
        sort: sort,
        filterBy: filterBy,
      });

      console.log(response);
      setTableData(response.data);
      setTotalProgramme(response.response.data.total);
      setLoading(false);
    } catch (error: any) {
      console.log("Error in getting programme transfers", error);
      message.open({
        type: "error",
        content: error.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
    }
  };

    const getUserDetails = async () => {
    setLoading(true);
    try {
      const response: any = await post("national/user/query", {
        page: 1,
        size: 10,
        filterAnd: [
          {
            key: "id",
            operation: "=",
            value: userInfoState?.id,
          },
        ],
      });
      if (response && response.data) {
        if (
          response?.data[0]?.companyRole === CompanyRole.MINISTRY &&
          response?.data[0]?.company &&
          response?.data[0]?.company?.sectoralScope
        ) {
          setMinistrySectoralScope(response?.data[0]?.company?.sectoralScope);
        }
      }
      setLoading(false);
    } catch (error: any) {
      console.log("Error in getting users", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      getAllTransfers();
    }
  }, [statusFilter, dataFilter]);

  useEffect(() => {
    getAllTransfers();
  }, [currentPage, pageSize, sortField, sortOrder, search, ministryLevelFilter]);

  useEffect(() => {
    if (userInfoState?.companyRole === CompanyRole.MINISTRY) {
      getUserDetails();
    }
  }, []);

  const handleRequestOk = async (
    reqId: number,
    remarks: string,
    endpoint: string,
    successText?: string,
    isRetire?: boolean
  ) => {
    setLoading(true);
    try {
      const response: any = await post("national/programme/" + endpoint, {
        requestId: reqId,
        comment: remarks,
      });
      let successMsg = response.message;
      if (isRetire) {
        successMsg = t("creditTransfer:internationalTransferReqCancelled");
      }
      console.log(response);
      message.open({
        type: "success",
        content: successText ? successText : successMsg,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
      getAllTransfers();
      setModalVisible(false);
    } catch (error: any) {
      console.log("Error in Cancelling transfer request", error);
      setLoading(false);
      return error.message;
    }
  };

  const showModalOnAction = (record: any, info: PopupInfo) => {
    setSelectedReq(record);
    setModalVisible(true);
    setPopupInfo(info);
  };

  const getSendCreditBalance = (record: ProgrammeTransfer) => {
    const idx = record
      .companyId!.map((e) => Number(e))
      .indexOf(record.fromCompanyId!);
    if (idx < 0) {
      return 0;
    }
    if (!record.creditOwnerPercentage) {
      return record.creditBalance;
    }
    return (
      (Number(record.creditBalance!) *
        Number(record.creditOwnerPercentage![idx])) /
      100
    );
  };

  const actionMenu = (record: any) => {
    let isRetire = false;
    if (record.isRetirement === true) {
      isRetire = true;
    }
    if (
      record.status === "Pending" &&
      userInfoState?.userRole !== Role.ViewOnly
    ) {
      return userInfoState?.companyId === record.initiatorCompanyId ? (
        <List
          className="action-menu"
          size="small"
          dataSource={[
            {
              text: t("creditTransfer:cancel"),
              icon: <Icon.ExclamationOctagon />,
              click: () => {
                showModalOnAction(record, {
                  title: t("creditTransfer:cancelTitle"),
                  icon: <Icon.ExclamationOctagon />,
                  actionBtnText: t("creditTransfer:proceed"),
                  okAction: (requestId: any, comment: any) =>
                    handleRequestOk(
                      requestId,
                      comment,
                      "transferCancel",
                      undefined,
                      isRetire
                    ),
                  type: "danger",
                  remarkRequired: true,
                });
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
        />
      ) : !record.isRetirement &&
        record.fromCompanyId === userInfoState?.companyId ? (
        <List
          className="action-menu"
          size="small"
          dataSource={[
            {
              text: t("creditTransfer:accept"),
              icon: <Icon.ClipboardCheck />,
              style: "color-primary",
              click: () => {
                showModalOnAction(record, {
                  title: t("creditTransfer:acceptTitle"),
                  icon: <Icon.ClipboardCheck />,
                  actionBtnText: t("creditTransfer:proceed"),
                  okAction: (requestId: any, comment: any) =>
                    handleRequestOk(
                      requestId,
                      comment,
                      "transferApprove",
                      `${t("creditTransfer:transferReqApproved")}`
                    ),
                  type: "primary",
                  remarkRequired: false,
                });
              },
            },
            {
              text: t("creditTransfer:reject"),
              icon: <Icon.XOctagon />,
              style: "color-error",
              click: () => {
                showModalOnAction(record, {
                  title: t("creditTransfer:rejectTitle"),
                  icon: <Icon.XOctagon />,
                  actionBtnText: t("creditTransfer:reject"),
                  okAction: (requestId: any, comment: any) =>
                    handleRequestOk(requestId, comment, "transferReject"),
                  type: "danger",
                  remarkRequired: true,
                });
              },
            },
          ]}
          renderItem={(item: any) => (
            <List.Item onClick={item.click}>
              <Typography.Text className={`action-icon ${item.style}`}>
                {item.icon}
              </Typography.Text>
              <span>{item.text}</span>
            </List.Item>
          )}
        />
      ) : record.isRetirement &&
        userInfoState?.companyRole === CompanyRole.GOVERNMENT ? (
        <List
          className="action-menu"
          size="small"
          dataSource={[
            {
              text: t("creditTransfer:recognise"),
              icon: <Icon.Save />,
              style: "color-primary",
              click: () => {
                showModalOnAction(record, {
                  title: t("creditTransfer:recogniseTitle"),
                  icon: <Icon.Save />,
                  actionBtnText: t("creditTransfer:recognise"),
                  okAction: (requestId: any, comment: any) =>
                    handleRequestOk(
                      requestId,
                      comment,
                      "transferApprove",
                      `${t("creditTransfer:internationalTranferReqAccepted")}`
                    ),
                  type: "primary",
                  remarkRequired: false,
                });
              },
            },
            {
              text: t("creditTransfer:notrecognise"),
              icon: <Icon.XOctagon />,
              style: "color-error",
              click: () => {
                showModalOnAction(record, {
                  title: t("creditTransfer:notRecogniseTitle"),
                  icon: <Icon.XOctagon />,
                  actionBtnText: t("creditTransfer:notrecognise"),
                  okAction: (requestId: any, comment: any) =>
                    handleRequestOk(
                      requestId,
                      comment,
                      "transferReject",
                      `${t("creditTransfer:internationalTranferReqAccepted")}`
                    ),
                  type: "danger",
                  remarkRequired: true,
                });
              },
            },
          ]}
          renderItem={(item: any) => (
            <List.Item onClick={item.click}>
              <Typography.Text className={`action-icon ${item.style}`}>
                {item.icon}
              </Typography.Text>
              <span>{item.text}</span>
            </List.Item>
          )}
        />
      ) : null;
    }
  };

  const columns = [
    {
      title: t("creditTransfer:requestID"),
      dataIndex: "requestId",
      key: "requestId",
      sorter: true,
    },
    {
      title: t("creditTransfer:date"),
      key: "txTime",
      sorter: true,
      align: "left" as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {DateTime.fromMillis(parseInt(itemObj.txTime)).toFormat(
              "dd LLLL yyyy"
            )}
          </div>
        );
      },
    },
    {
      title: t("creditTransfer:pName"),
      dataIndex: "programmeTitle",
      key: "programmeTitle",
      sorter: true,
      align: "left" as const,
      render: (item: any) => {
        return <span className="clickable">{item}</span>;
      },
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            onNavigateToProgrammeView(record.programmeId);
          },
        };
      },
    },
    {
      title: t("creditTransfer:sector"),
      dataIndex: "programmeSector",
      key: "programmeSector",
      sorter: true,
      align: "left" as const,
    },
    {
      title: t("creditTransfer:certifier"),
      dataIndex: "programmeCertifierId",
      key: "programmeCertifierId",
      sorter: true,
      align: "left" as const,
      render: (item: any, itemObj: any) => {
        if (item === null) {
          return;
        }
        const cMap: any = {};
        for (const c of itemObj.certifier) {
          cMap[c.companyId] = c;
        }

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {itemObj.programmeCertifierId &&
              itemObj.programmeCertifierId.map((id: any, i: any) => {
                const v = cMap[id];
                if (!v) {
                  return;
                }
                return (
                  <Tooltip
                    title={v.name}
                    color={TooltipColor}
                    key={TooltipColor}
                  >
                    <div>
                      <ProfileIcon
                        icon={v.logo}
                        bg="rgba(128, 255, 0, 0.12)"
                        name={v.name}
                      />
                    </div>
                  </Tooltip>
                );
              })}
          </div>
        );
      },
    },
    {
      title: t("creditTransfer:initiator"),
      key: "initiatorCompanyId",
      sorter: true,
      align: "left" as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {itemObj.requester &&
              itemObj.requester.map((v: any, i: any) => {
                return (
                  <Tooltip
                    title={v.name}
                    color={TooltipColor}
                    key={TooltipColor}
                  >
                    <div>
                      <ProfileIcon
                        icon={v.logo}
                        bg={getCompanyBgColor(v.companyRole)}
                        name={v.name}
                      />
                    </div>
                  </Tooltip>
                );
              })}
          </div>
        );
      },
    },
    {
      title: t("creditTransfer:cSender"),
      key: "fromCompanyId",
      sorter: true,
      align: "left" as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {itemObj.sender &&
              itemObj.sender.map((v: any, i: any) => {
                return (
                  <Tooltip
                    title={v.name}
                    color={TooltipColor}
                    key={TooltipColor}
                  >
                    <div>
                      <ProfileIcon
                        icon={v.logo}
                        bg={getCompanyBgColor(v.companyRole)}
                        name={v.name}
                      />
                    </div>
                  </Tooltip>
                );
              })}
          </div>
        );
      },
    },
    {
      title: t("creditTransfer:cReceiver"),
      dataIndex: "toCompanyId",
      key: "toCompanyId",
      sorter: true,
      align: "left" as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {itemObj.receiver &&
              itemObj.receiver.map((v: any, i: any) => {
                return !itemObj.isRetirement ? (
                  <Tooltip
                    title={v.name}
                    color={TooltipColor}
                    key={TooltipColor}
                  >
                    <div>
                      <ProfileIcon
                        icon={v.logo}
                        bg={getCompanyBgColor(v.companyRole)}
                        name={v.name}
                      />
                    </div>
                  </Tooltip>
                ) : itemObj.retirementType === "0" ? (
                  <Tooltip
                    title={
                      t("creditTransfer:iaccount") +
                      `${
                        itemObj.toCompanyMeta &&
                        itemObj.toCompanyMeta.countryName
                          ? " - " + itemObj.toCompanyMeta.countryName
                          : ""
                      }`
                    }
                    color={TooltipColor}
                    key={TooltipColor}
                  >
                    {itemObj.toCompanyMeta && itemObj.toCompanyMeta.country && (
                      <CircleFlag
                        className="profile-icon flag-ret-icon"
                        countryCode={itemObj.toCompanyMeta.country.toLowerCase()}
                      />
                    )}
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={t("creditTransfer:laccount")}
                    color={TooltipColor}
                    key={TooltipColor}
                  >
                    <div className="ret-icon profile-icon">
                      <Icon.Save />
                    </div>
                  </Tooltip>
                );
              })}
          </div>
        );
      },
    },
    {
      title: t("creditTransfer:cRequested") + ` (${creditUnit})`,
      dataIndex: "creditAmount",
      key: "creditAmount",
      sorter: true,
      align: "right" as const,
      render: (item: any) => {
        return <span className="clickable">{addCommSepRound(item)}</span>;
      },
    },
    {
      title: t("programme:status"),
      key: "status",
      sorter: true,
      align: "center" as const,
      render: (item: any, Obj: any) => {
        return (
          <Tooltip title={Obj.serialNo} color={TooltipColor} key={TooltipColor}>
            <Tag
              className="clickable"
              color={getTransferStageTagType(Obj.status, Obj)}
            >
              {addSpaces(getStageTransferEnumVal(Obj.status, Obj))}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      align: "right" as const,
      render: (_: any, record: any) => {
        const menu = actionMenu(record);
        return menu && !isTransferFrozen ? (
          <Popover placement="bottomRight" content={menu} trigger="click">
            <EllipsisOutlined
              rotate={90}
              style={{ fontWeight: 600, fontSize: "1rem", cursor: "pointer" }}
            />
          </Popover>
        ) : (
          <span></span>
        );
      },
      // render: () => {
      //   return (
      //     <div className="clickable">
      //       <MoreOutlined style={{ fontSize: '20px' }} />
      //     </div>
      //   );
      // },
    },
  ];

  const onSearch = async () => {
    setSearch(searchText);
  };

  const onChange: PaginationProps["onChange"] = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleTableChange = (pag: any, sorter: any) => {
    console.log(pag, sorter);
    setSortOrder(
      sorter.order === "ascend"
        ? "ASC"
        : sorter.order === "descend"
        ? "DESC"
        : undefined
    );
    setSortField(sorter.columnKey);
    // setCurrentPage(1);
  };

  const onFreezeTransfer = async () => {
    const response = await post("national/Settings/update", {
      id: ConfigurationSettingsType.isTransferFrozen,
      settingValue: `${!isTransferFrozen}`,
    });
    if (response) {
      setTransferFrozen(!isTransferFrozen);
    }
  };

  return (
    <div className="credit-transfer-management content-container">
      <div className="title-bar">
        <Row justify="space-between" align="middle">
          <Col span={20}>
            <div className="body-title">
              {t("creditTransfer:viewCreditsTransfers")}
            </div>
            <div className="body-sub-title">{t("creditTransfer:desc")}</div>
          </Col>
          <Col span={4}>
            {((userInfoState?.companyRole === CompanyRole.GOVERNMENT &&
              userInfoState?.userRole === Role.Admin) ||
              userInfoState?.userRole === Role.Root) && (
              <div className="transfer-freeze-icon" onClick={onFreezeTransfer}>
                {isTransferFrozen ? (
                  <PlayCircle className="play-circle" size={35}></PlayCircle>
                ) : (
                  <PauseCircle className="pause-circle" size={35}></PauseCircle>
                )}
              </div>
            )}
          </Col>
        </Row>
      </div>
      <div className="content-card">
        <Row>
          <Col lg={{ span: 16 }} md={{ span: 16 }}>
            <div className="action-bar">
              <Checkbox
                className="all-check"
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                defaultChecked={true}
              >
                All
              </Checkbox>
              <Checkbox.Group
                options={statusOptions}
                defaultValue={statusOptions.map((e) => e.value)}
                value={selectedStatus}
                onChange={onStatusQuery}
              />
            </div>
          </Col>
          <Col lg={{ span: 8 }} md={{ span: 8 }}>
            <div className="filter-section">
              <div className="search-filter">
                <Checkbox
                  className="label"
                  onChange={(v) =>
                    setDataFilter(
                      v.target.checked
                        ? [
                            {
                              key: "initiatorCompanyId",
                              operation: "=",
                              value: userInfoState?.companyId,
                            },
                            {
                              key: "fromCompanyId",
                              operation: "=",
                              value: userInfoState?.companyId,
                            },
                            {
                              key: "toCompanyId",
                              operation: "=",
                              value: userInfoState?.companyId,
                            },
                            {
                              key: "programmeCertifierId",
                              operation: "ANY",
                              value: userInfoState?.companyId,
                            },
                          ]
                        : undefined
                    )
                  }
                >
                  {t("view:seeMine")}
                </Checkbox>

                {userInfoState?.companyRole === CompanyRole.MINISTRY && (
                  <Checkbox
                    className="label"
                    onChange={(v) => {
                      if (v.target.checked) {
                        setMinistryLevelFilter(true);
                      } else {
                        setMinistryLevelFilter(false);
                      }
                    }}
                  >
                    {t("ndcAction:ministryLevel")}
                  </Checkbox>
                )}
              </div>
              <div className="search-bar">
                <Search
                  onPressEnter={onSearch}
                  placeholder={"Search"}
                  allowClear
                  onChange={(e) =>
                    e.target.value === ""
                      ? setSearch(e.target.value)
                      : setSearchText(e.target.value)
                  }
                  onSearch={setSearch}
                  style={{ width: 265 }}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="programmeManagement-table-container">
              <Table
                dataSource={tableData}
                columns={columns}
                className="common-table-class"
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalProgramme,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  onChange: onChange,
                }}
                onChange={(val: any, filter: any, sorter: any) =>
                  handleTableChange(val, sorter)
                }
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        tableData.length === 0
                          ? t("creditTransfer:noTransfer")
                          : null
                      }
                    />
                  ),
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
      {popupInfo && selectedReq && (
        <TransferActionModel
          transfer={selectedReq!}
          onCancel={() => {
            setModalVisible(false);
            setSelectedReq(undefined);
          }}
          actionBtnText={popupInfo!.actionBtnText}
          onFinish={popupInfo?.okAction}
          subText={""}
          openModal={modalVisible}
          icon={popupInfo!.icon}
          title={popupInfo!.title}
          type={popupInfo!.type}
          remarkRequired={popupInfo.remarkRequired}
          translator={translator}
        />
      )}
    </div>
  );
};
