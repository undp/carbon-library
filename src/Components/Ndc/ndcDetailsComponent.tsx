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
} from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { EditableRow, EditableCell } from '../Common/AntComponents/antTableComponents';

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

const NdcDetailsComponent = (props: any) => {
  const { t, useConnection } = props;
  const { RangePicker } = DatePicker;
  const [ndcDetailsData, setNdcDetailsData] = useState<NdcDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [periodItems, setPeriodItems] = useState([] as any[]);
  const [selectedTab, setSelectedTab] = useState('add_new');
  const selectedPeriod = useRef({} as Period);

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

  const defaultColumns: any = [
    {
      title: t('ndc:ndcColumnsStartDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'left' as const,
      editable: true,
      render: (record: any) => {
        return (
          <div>
            <p>{moment(record.startDate).format('DD-MM-YYYY')}</p>
          </div>
        );
      },
    },
    {
      title: t('ndc:ndcColumnsEndDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      align: 'left' as const,
      editable: true,
      render: (record: any) => {
        return (
          <div>
            <p>{moment(record.endDate).format('DD-MM-YYYY')}</p>
          </div>
        );
      },
    },
    {
      title: t('ndc:ndcColumnsNationalPlanObj'),
      dataIndex: 'nationalPlanObj',
      key: 'nationalPlanObj',
      align: 'left' as const,
      editable: true,
    },
    {
      title: t('ndc:ndcColumnsKpi'),
      dataIndex: 'kpi',
      key: 'kpi',
      align: 'left' as const,
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
    const newData = {
      startDate: new Date('2014-12-24 23:12:00'),
      endDate: new Date('2014-12-24 23:12:00'),
      nationalPlanObj: 'sample text2',
      kpi: 34,
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
        children: ndcDetailsTableContent(),
      };
      setPeriodItems((items: any) => [...items, newPeriodItem]);
    }
  };

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
        <Row>
          <div className="steps-actions">
            <Button type="primary" onClick={onAddNewPeriod} htmlType="submit" loading={loading}>
              {t('ndc:submit')}
            </Button>
            <Button className="back-btn" onClick={onCancelPeriod} loading={loading}>
              {t('ndc:back')}
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
        startDate: new Date('2022-03-25'),
        endDate: new Date('2023-03-25'),
        nationalPlanObj: 'sample text1',
        kpi: 23,
      },
      {
        startDate: new Date('2023-03-25'),
        endDate: new Date('2024-03-25'),
        nationalPlanObj: 'sample text2',
        kpi: 34,
      },
      {
        startDate: new Date('2024-03-25'),
        endDate: new Date('2025-03-25'),
        nationalPlanObj: 'sample text3',
        kpi: 25,
      },
    ];
    const addNewItem = {
      key: 'add_new',
      label: 'Add New',
      children: addNewPeriodContent(),
    };
    setPeriodItems([addNewItem]);
    setNdcDetailsData(defaultNdcDetails);
  }, []);

  return (
    <div className="ndc-management content-container">
      <div className="title-bar">
        <Row justify="space-between" align="middle">
          <Col span={20}>
            <div className="body-title">{t('ndc:NdcTitle')}</div>
            <div className="body-sub-title">{t('ndc:NdcSubTitle')}</div>
          </Col>
        </Row>
      </div>
      <div>
        <Tabs defaultActiveKey="1" items={periodItems} onChange={onTabChange} />
      </div>
      {selectedTab !== 'add_new' && (
        <div>
          <div>
            <Button
              onClick={onAddNewNdcDetail}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Add a row
            </Button>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={ndcDetailsData}
              columns={columns}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NdcDetailsComponent;