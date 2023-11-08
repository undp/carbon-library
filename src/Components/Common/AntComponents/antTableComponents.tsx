import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Table, InputRef, InputNumber } from "antd";
import type { FormInstance } from "antd/es/form";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

type NdcDetail = {
  key: string;
  startDate: Date;
  endDate: Date;
  nationalPlanObj: string;
  kpi: number;
  subNdcDetails?: [];
};

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: NdcDetail;
  index: number;
  children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
