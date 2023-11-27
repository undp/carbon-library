import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Table, InputRef, InputNumber } from "antd";
import type { FormInstance } from "antd/es/form";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

export const EditableRow: React.FC<EditableRowProps> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
  onBlurHandler: any;
  t: any;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  onBlurHandler,
  t,
  ...restProps
}) => {
  let inputNode;

  if (dataIndex === "nationalPlanObjective") {
    inputNode = (
      <Input
        onBlur={() => onBlurHandler(record)}
        placeholder={t("ndc:nationalPlanObjectivePlaceHolder")}
      />
    );
  } else if (dataIndex === "kpi") {
    inputNode = (
      <InputNumber
        onBlur={() => onBlurHandler(record)}
        placeholder={t("ndc:kpiPlaceHolder")}
      />
    );
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `${title} ${t("ndc:isRequired")}`,
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

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
