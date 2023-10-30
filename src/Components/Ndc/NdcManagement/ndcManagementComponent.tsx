import { Col, Empty, PaginationProps, Row, Table, message } from "antd";
import React, { useEffect, useState } from "react";

const ndcDetailManagementComponent = (props: any) => {
  const { t, useConnection } = props;
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalNdcDetails, setTotalNdcDetails] = useState<number>();

  const { post } = useConnection();
  const columns: any = [
    {
      title: t("ndc:ndcColumnsDateRange"),
      dataIndex: "dateRange",
      key: "dateRange",
      align: "left" as const,
    },
    {
      title: t("ndc:ndcColumnsNationalPlanObj"),
      dataIndex: "nationalPlanObj",
      key: "nationalPlanObj",
      align: "left" as const,
    },
  ];

  const onChange: PaginationProps["onChange"] = (page: any, size: any) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const getNdcDetails = async () => {
    try {
      const response: any = await post("national/programme/queryNdcDetails", {
        page: currentPage,
        size: pageSize,
      });

      setTableData(response.data);
      setTotalNdcDetails(response.response.data.total);
      setLoading(false);
    } catch (error: any) {
      message.open({
        type: "error",
        content: error.message,
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getNdcDetails();
  }, []);

  return (
    <div className="ndc-management content-container">
      <div className="title-bar">
        <Row justify="space-between" align="middle">
          <Col span={20}>
            <div className="body-title">{t("ndc:NdcTitle")}</div>
            <div className="body-sub-title">{t("ndc:NdcSubTitle")}</div>
          </Col>
        </Row>
      </div>
      <div className="content-card">
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
                  total: totalNdcDetails,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  onChange: onChange,
                }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        tableData.length === 0 ? t("ndc:noNdcDetails") : null
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

export default ndcDetailManagementComponent;
