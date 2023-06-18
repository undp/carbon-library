import {
  Button,
  Checkbox,
  Col,
  Empty,
  Input,
  message,
  PaginationProps,
  Row,
  Table,
  Tag,
  Tooltip,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import "./programmeManagementComponent.scss";
import "../../../Styles/common.table.scss";
import { UserTableDataType } from "../../../Definitions/Definitions/userManagement.definitions";
import { TooltipColor } from "../../../Styles/role.color.constants";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import {
  addCommSep,
  getCompanyBgColor,
  getStageEnumVal,
  getStageTagType,
  ProgrammeStage,
  sumArray,
} from "../../../Definitions/Definitions/programme.definitions";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { ProgrammeManagementColumns } from "../../../Definitions/Enums/programme.management.columns.enum";
import { User } from "../../../Definitions/Entities/user";
import { Action } from "../../../Definitions/Enums/action.enum";
import { PlusOutlined } from "@ant-design/icons";
import { ProfileIcon } from "../../Common/ProfileIcon/profile.icon";

const { Search } = Input;

export const ProgrammeManagementComponent = (props: any) => {
  const {
    t,
    visibleColumns,
    useUserContext,
    useConnection,
    onNavigateToProgrammeView,
    onClickAddProgramme,
  } = props;
  const { get, delete: del, post } = useConnection();
  const [totalProgramme, setTotalProgramme] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<UserTableDataType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>();
  const [searchText, setSearchText] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<any>();
  const [dataFilter, setDataFilter] = useState<any>();
  const [sortOrder, setSortOrder] = useState<string>();
  const [sortField, setSortField] = useState<string>();
  const { userInfoState } = useUserContext();

  const statusOptions = Object.keys(ProgrammeStage).map((k, index) => ({
    label: Object.values(ProgrammeStage)[index],
    value: k,
  }));

  const [selectedStatus, setSelectedStatus] = useState<any>(
    statusOptions.map((e) => e.value)
  );

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  const onStatusQuery = async (checkedValues: CheckboxValueType[]) => {
    console.log(checkedValues);

    if (checkedValues !== selectedStatus) {
      setSelectedStatus(checkedValues);

      setIndeterminate(
        !!checkedValues.length &&
          checkedValues.length < Object.keys(statusOptions).length
      );
      setCheckAll(checkedValues.length === Object.keys(statusOptions).length);
    }

    if (checkedValues.length === 0) {
      setTableData([]);
      setTotalProgramme(0);
      return;
    }
    // setFilter([
    //   {
    //     key: 'currentStage',
    //     operation: 'in',
    //     value: checkedValues,
    //   },
    // ]);

    setStatusFilter({
      key: "currentStage",
      operation: "in",
      value: checkedValues,
    });
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const nw = e.target.checked ? statusOptions.map((el) => el.value) : [];
    setSelectedStatus(nw);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onStatusQuery(nw);
  };

  const columns = [
    {
      title: t("programme:title"),
      dataIndex: "title",
      key: ProgrammeManagementColumns.title,
      sorter: true,
      align: "left" as const,
      render: (item: any) => {
        return <span className="clickable">{item}</span>;
      },
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            onNavigateToProgrammeView(record);
          },
        };
      },
    },
    {
      title: t("common:company"),
      dataIndex: "company",
      key: ProgrammeManagementColumns.company,
      align: "left" as const,
      render: (item: any, itemObj: any) => {
        const elements = item.map((obj: any) => {
          return (
            <Tooltip title={obj.name} color={TooltipColor} key={TooltipColor}>
              <div>
                <ProfileIcon
                  icon={obj.logo}
                  bg={getCompanyBgColor(obj.companyRole)}
                  name={obj.name}
                />
              </div>
            </Tooltip>
          );
        });
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {elements}
          </div>
        );
      },
    },
    {
      title: t("programme:sector"),
      dataIndex: "sector",
      sorter: true,
      key: ProgrammeManagementColumns.sector,
      align: "left" as const,
    },
    {
      title: t("programme:status"),
      dataIndex: "currentStage",
      key: ProgrammeManagementColumns.currentStage,
      sorter: true,
      align: "center" as const,
      render: (item: any) => {
        return (
          <Tag className="clickable" color={getStageTagType(item)}>
            {getStageEnumVal(item)}
          </Tag>
        );
      },
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            setSelectedStatus([record.currentStage]);
            onStatusQuery([record.currentStage]);
          },
        };
      },
    },
    {
      title: t("programme:issued"),
      dataIndex: "creditIssued",
      key: ProgrammeManagementColumns.creditIssued,
      sorter: true,
      align: "right" as const,
      render: (item: any) => {
        return item ? addCommSep(Number(item)) : "-";
      },
    },
    {
      title: t("programme:balance"),
      dataIndex: "creditBalance",
      key: ProgrammeManagementColumns.creditBalance,
      sorter: true,
      align: "right" as const,
      render: (item: any) => {
        return item ? addCommSep(Number(item)) : "-";
      },
    },
    {
      title: t("programme:transferred"),
      dataIndex: "creditTransferred",
      key: ProgrammeManagementColumns.creditTransferred,
      sorter: true,
      align: "right" as const,
      render: (item: any) => {
        return item ? addCommSep(sumArray(item)) : "-";
      },
    },

    {
      title: t("programme:emissionsReductionExpected"),
      dataIndex: "emissionsReductionExpected",
      key: ProgrammeManagementColumns.emissionsReductionExpected,
      align: "right" as const,
      render: (item: any) => {
        return item ? item : "-";
      },
    },
    {
      title: t("programme:emissionsReductionAchieved"),
      dataIndex: "emissionsReductionAchieved",
      key: ProgrammeManagementColumns.emissionsReductionAchieved,
      align: "right" as const,
      render: (item: any) => {
        return item ? item : "-";
      },
    },
    {
      title: t("programme:certifiers"),
      dataIndex: "certifierId",
      key: ProgrammeManagementColumns.certifierId,
      align: "left" as const,
      sorter: true,
      render: (item: any, itemObj: any) => {
        if (item === null) {
          return "-";
        }
        const cMap: any = {};
        for (const c of itemObj.certifier) {
          cMap[c.companyId] = c;
        }

        const elements = item.map((id: any) => {
          const obj = cMap[id];
          if (!obj) {
            return;
          }
          return (
            <Tooltip title={obj.name} color={TooltipColor} key={TooltipColor}>
              <div>
                <ProfileIcon
                  icon={obj.logo}
                  bg={getCompanyBgColor(obj.companyRole)}
                  name={obj.name}
                />
              </div>
            </Tooltip>
          );
        });
        return <div className="certify-list">{elements}</div>;
      },
    },
    {
      title: t("programme:serialNoh"),
      dataIndex: "serialNo",
      key: ProgrammeManagementColumns.serialNo,
      align: "left" as const,
    },
  ].filter((column) => visibleColumns.includes(column.key));

  const getAllProgramme = async () => {
    setLoading(true);

    const filter: any[] = [];

    if (dataFilter) {
      filter.push(dataFilter);
    }
    if (statusFilter) {
      filter.push(statusFilter);
    }
    if (search && search !== "") {
      filter.push({
        key: "title",
        operation: "like",
        value: `${search}%`,
      });
    }

    let sort: any;
    if (sortOrder && sortField) {
      sort = {
        key: sortField === "certifierId" ? "certifierId[1]" : sortField,
        order: sortOrder,
        nullFirst: false,
      };
    } else {
      sort = {
        key: "programmeId",
        order: "DESC",
      };
    }

    try {
      const response: any = await post("national/programme/query", {
        page: currentPage,
        size: pageSize,
        filterAnd: filter,
        sort: sort,
      });
      setTableData(response.data);
      setTotalProgramme(response.response.data.total);
      setLoading(false);
    } catch (error: any) {
      console.log("Error in getting programme", error);
      message.open({
        type: "error",
        content: error.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
    }
  };

  const onSearch = async () => {
    setSearch(searchText);
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      getAllProgramme();
    }
  }, [statusFilter, dataFilter]);

  useEffect(() => {
    getAllProgramme();
  }, [currentPage, pageSize, sortField, sortOrder, search]);

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

  return (
    <div className="content-container programme-management">
      <div className="programme-title-bar">
        <div className="title-bar">
          <div className="body-title">{t("programme:viewProgrammes")}</div>
          <div className="body-sub-title">{t("programme:desc")}</div>
        </div>
        <div className="actions">
          <div className="action-bar">
            <Button
              type="primary"
              size="large"
              block
              icon={<PlusOutlined />}
              onClick={onClickAddProgramme}
            >
              {t("programme:addProgramme")}
            </Button>
          </div>
        </div>
      </div>
      <div className="content-card">
        <Row className="table-actions-section">
          <Col lg={{ span: 16 }} md={{ span: 16 }}>
            <div className="action-bar">
              <Checkbox
                className="all-check"
                disabled={loading}
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                defaultChecked={true}
              >
                {t("programme:all")}
              </Checkbox>
              <Checkbox.Group
                disabled={loading}
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
                        ? {
                            key: "companyId",
                            operation: "ANY",
                            value: userInfoState?.companyId,
                          }
                        : undefined
                    )
                  }
                >
                  {t("view:seeMine")}
                </Checkbox>
              </div>
              <div className="search-bar">
                <Search
                  onPressEnter={onSearch}
                  placeholder={`${t("programme:searchByName")}`}
                  allowClear
                  // onChange={(e) => setSearchText(e.target.value)}
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
                // scroll={{ x: 1500 }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        tableData.length === 0
                          ? t("programme:noProgrammes")
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
    </div>
  );
};
