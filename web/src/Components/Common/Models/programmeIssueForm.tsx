import { Alert, Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import react, { FC, useState } from 'react';
import { addCommSep, Programme } from '../../../Definitions/Definitions/programme.definitions';
import { creditUnit } from '../../../Definitions/Definitions/common.definitions';
import React from 'react';

export interface ProgrammeIssueFormProps {
  programme: Programme;
  onCancel: any;
  actionBtnText: string;
  onFinish: any;
  subText: string;
  enableIssue: boolean;
  t:any;
}

const ProgrammeIssueForm: FC<ProgrammeIssueFormProps> = (props: ProgrammeIssueFormProps) => {
  const { programme, onFinish, onCancel, actionBtnText, subText, enableIssue, t } = props;
  const [popupError, setPopupError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="transfer-form">
      <Row>
        <Col span={24} className="sub-text">
          {subText}
        </Col>
      </Row>
      <Form
        name="transfer_init_popup"
        layout="vertical"
        initialValues={{
          issueAmount: 0,
        }}
        onChange={() => setPopupError(undefined)}
        onFinish={async (d) => {
          if (d.issueAmount === 0) {
            setPopupError('Issue amount should be greater than 0');
            setLoading(false);
            return;
          }
          setLoading(true);
          const res = await onFinish(d);
          setPopupError(res);
          setLoading(false);
        }}
      >
        {enableIssue ? (
          <Row>
            <Col lg={11} md={24}>
              <div className="label">{`${t('view:issueCreditText')} (${creditUnit})`}</div>
            </Col>

            <Col lg={6} md={12}>
              <Form.Item
                className="popup-credit-input"
                name={'issueAmount'}
                rules={[
                  {
                    pattern: new RegExp(/^[+]?([.]\d+|\d+[.]?\d*)$/g),
                    message: 'Credit Should be a positive number',
                  },
                  {
                    required: true,
                    message: 'Required field',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (
                        getFieldValue('issueAmount') &&
                        parseFloat(getFieldValue('issueAmount')) >
                          programme.creditEst - programme.creditIssued
                      ) {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject('Amount > Authorised');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  placeholder=""
                  controls={false}
                  onKeyPress={(event) => {
                    if (!/[0-9\.]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col lg={1} md={1} className="seperator">
              {'/'}
            </Col>
            <Col lg={6} md={12}>
              <Form.Item className="popup-credit-input">
                <InputNumber
                  placeholder={addCommSep(programme.creditEst - programme.creditIssued)}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col lg={18} md={20}>
              <div className="label">{`${t('view:authCreditText')} (${creditUnit})`}</div>
            </Col>
            <Col lg={6} md={6}>
              <Form.Item className="popup-credit-input">
                <InputNumber
                  placeholder={addCommSep(programme.creditEst - programme.creditIssued)}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row>
          <Col span={24}>
            <Form.Item
              className="remarks-label"
              label="Remarks"
              name="comment"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Required field',
              //   },
              // ]}
            >
              <Input.TextArea placeholder="" />
            </Form.Item>
          </Col>
        </Row>

        {popupError ? <Alert className="error" message={popupError} type="error" showIcon /> : ''}

        <Form.Item className="footer">
          <Button htmlType="button" onClick={onCancel}>
            {t('view:cancel')}
          </Button>
          <Button className="mg-left-2" type="primary" htmlType="submit" loading={loading}>
            {actionBtnText}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProgrammeIssueForm;
