import { BankOutlined } from "@ant-design/icons";
import { Button, Card, Col, message, Row, Skeleton } from "antd";
import { plainToClass } from "class-transformer";
import React, { useEffect, useState } from "react";
import { Action } from "../../../Definitions/Enums/action.enum";
import { Company } from "../../../Definitions/Entities/company";
import CompanyRoleIcon from "../../Common/CompanyRoleIcon/companyRoleIcon";
import UserActionConfirmationModel from "../../Common/Models/userActionConfirmationModel";
import "./companyProfileComponent.scss";
import * as Icon from "react-bootstrap-icons";
import OrganisationStatus from "../../Common/OrganisationStatus/organisationStatus";

export const CompanyProfileComponent = (props: any) => {
  const {
    t,
    useAbilityContext,
    useLocation,
    useConnection,
    onNavigateToCompanyManagement,
    onNavigateToCompanyEdit,
  } = props;
  const { get, put } = useConnection();
  const [companyDetails, setCompanyDetails] = useState<any>([]);
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [actionInfo, setActionInfo] = useState<any>({});
  const [openDeauthorisationModal, setOpenDeauthorisationModal] =
    useState(false);
  const [openReactivateModal, setOpenReactivateModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<any>("");
  const [userRole, setUserRole] = useState<any>("");
  const [companyRole, setCompanyRole] = useState<any>("");
  const ability = useAbilityContext();

  const getCompanyDetails = async (companyId: string) => {
    try {
      setIsLoading(true);
      const response = await get(
        `national/organisation/profile?id=${companyId}`
      );
      if (response.data) {
        setCompanyDetails(response.data);
        setIsLoading(false);
      }
    } catch (exception) {}
  };

  useEffect(() => {
    if (!state) {
      onNavigateToCompanyManagement();
    } else {
      getCompanyDetails(state.record.companyId);
      const userRoleValue = localStorage.getItem("userRole") as string;
      setUserRole(userRoleValue);
      setCompanyRole(localStorage.getItem("companyRole") as string);
    }
  }, []);

  const onDeauthoriseOrgConfirmed = async (remarks: string) => {
    try {
      setIsLoading(true);
      const response: any = await put(
        `national/organisation/suspend?id=${companyDetails.companyId}`,
        {
          remarks: remarks,
        }
      );
      setOpenDeauthorisationModal(false);
      message.open({
        type: "success",
        content: t("companyProfile:deauthorisationSuccess"),
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      getCompanyDetails(companyDetails.companyId);
    } catch (exception: any) {
      setErrorMsg(exception.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onReactivateOrgConfirmed = async (remarks: string) => {
    try {
      setIsLoading(true);
      const response: any = await put(
        `national/organisation/activate?id=${companyDetails.companyId}`,
        {
          remarks: remarks,
        }
      );
      setOpenReactivateModal(false);
      message.open({
        type: "success",
        content: t("companyProfile:reactivationSuccess"),
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      getCompanyDetails(companyDetails.companyId);
    } catch (exception: any) {
      setErrorMsg(exception.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onDeauthoriseOrgCanceled = () => {
    setOpenDeauthorisationModal(false);
  };

  const onReactivateOrgCanceled = () => {
    setOpenReactivateModal(false);
  };

  const onDeauthoriseOrganisation = () => {
    setActionInfo({
      action: `${t("companyProfile:deauthorise")}`,
      headerText: `${t("companyProfile:deauthoriseConfirmHeaderText")}`,
      text: `${t("companyProfile:deauthoriseConfirmText")}`,
      type: "danger",
      icon: <Icon.BuildingDash />,
    });
    setErrorMsg("");
    setOpenDeauthorisationModal(true);
  };

  const onReActivateOrganisation = () => {
    setActionInfo({
      action: `${t("companyProfile:reActivate")}`,
      headerText: `${t("companyProfile:reActivateConfirmHeaderText")}`,
      text: `${t("companyProfile:reActivateConfirmText")}`,
      type: "primary",
      icon: <Icon.BuildingCheck />,
    });
    setErrorMsg("");
    setOpenReactivateModal(true);
  };

  return (
    <div className="content-container company-profile">
      <div className="title-bar">
        <div>
          <div className="body-title">{t("companyProfile:title")}</div>
          <div className="body-sub-title">{t("companyProfile:subTitle")}</div>
        </div>
        <div className="flex-display">
          {ability.can(Action.Delete, plainToClass(Company, companyDetails)) &&
          !isLoading &&
          parseInt(companyDetails.state) !== 0 ? (
            <Button
              danger
              className="btn-danger"
              onClick={onDeauthoriseOrganisation}
            >
              {t("companyProfile:deauthorise")}
            </Button>
          ) : (
            ""
          )}

          {ability.can(Action.Delete, plainToClass(Company, companyDetails)) &&
          !isLoading &&
          parseInt(companyDetails.state) !== 1 ? (
            <Button className="btn-activate" onClick={onReActivateOrganisation}>
              {t("companyProfile:reActivate")}
            </Button>
          ) : (
            ""
          )}

          {ability.can(Action.Update, plainToClass(Company, companyDetails)) &&
            !isLoading && (
              <Button
                className="mg-left-1"
                type="primary"
                onClick={() => onNavigateToCompanyEdit(companyDetails)}
              >
                {t("common:edit")}
              </Button>
            )}
        </div>
      </div>

      <div className="content-body">
        <Row gutter={16}>
          <Col md={24} lg={8}>
            <Card className="card-container">
              <Skeleton loading={isLoading} active>
                <Row justify="center">
                  <img
                    className="profile-img"
                    alt="profile image"
                    src={companyDetails.logo}
                  />
                </Row>
                <Row justify="center">
                  <div className="padding-top-1 company-name">
                    {companyDetails.name}
                  </div>
                </Row>
                <Row justify="center">
                  <OrganisationStatus
                    t={t}
                    organisationStatus={parseInt(companyDetails.state)}
                  ></OrganisationStatus>
                </Row>
              </Skeleton>
            </Card>
          </Col>
          <Col md={24} lg={16}>
            <Card className="card-container">
              <div className="info-view">
                <div className="title">
                  <span className="title-icon">
                    <BankOutlined />
                  </span>
                  <span className="title-text">
                    {t("companyProfile:organisationDetailsHeading")}
                  </span>
                </div>
                <Skeleton loading={isLoading} active>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:name")}
                    </Col>
                    <Col span={12} className="field-value">
                      {companyDetails.name ? companyDetails.name : "-"}
                    </Col>
                  </Row>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:taxId")}
                    </Col>
                    <Col span={12} className="field-value nextline-overflow">
                      {companyDetails.taxId ? companyDetails.taxId : "-"}
                    </Col>
                  </Row>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:companyRole")}
                    </Col>
                    <Col span={12} className="field-value">
                      <CompanyRoleIcon role={companyDetails.companyRole} />
                    </Col>
                  </Row>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:email")}
                    </Col>
                    <Col span={12} className="field-value nextline-overflow">
                      {companyDetails.email ? companyDetails.email : "-"}
                    </Col>
                  </Row>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:phoneNo")}
                    </Col>
                    <Col span={12} className="field-value">
                      {companyDetails.phoneNo ? companyDetails.phoneNo : "-"}
                    </Col>
                  </Row>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:website")}
                    </Col>
                    <Col span={12} className="field-value ellipsis-overflow">
                      {companyDetails.website ? (
                        <a target={"blank"} href={companyDetails.website}>
                          {companyDetails.website}
                        </a>
                      ) : (
                        "-"
                      )}
                    </Col>
                  </Row>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:address")}
                    </Col>
                    <Col span={12} className="field-value">
                      {companyDetails.address ? companyDetails.address : "-"}
                    </Col>
                  </Row>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:programmeCount")}
                    </Col>
                    <Col span={12} className="field-value">
                      {companyDetails.programmeCount
                        ? companyDetails.programmeCount
                        : "-"}
                    </Col>
                  </Row>
                  <Row className="field">
                    <Col span={12} className="field-key">
                      {t("companyProfile:creditBalance")}
                    </Col>
                    <Col span={12} className="field-value">
                      {companyDetails.creditBalance
                        ? companyDetails.creditBalance
                        : "-"}
                    </Col>
                  </Row>
                  {parseInt(companyDetails.state) === 0 ? (
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("companyProfile:remarks")}
                      </Col>
                      <Col span={12} className="field-value">
                        {companyDetails.remarks ? companyDetails.remarks : "-"}
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </Skeleton>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <UserActionConfirmationModel
        t={t}
        actionInfo={actionInfo}
        onActionConfirmed={onDeauthoriseOrgConfirmed}
        onActionCanceled={onDeauthoriseOrgCanceled}
        openModal={openDeauthorisationModal}
        errorMsg={errorMsg}
        loading={isLoading}
      />

      <UserActionConfirmationModel
        t={t}
        actionInfo={actionInfo}
        onActionConfirmed={onReactivateOrgConfirmed}
        onActionCanceled={onReactivateOrgCanceled}
        openModal={openReactivateModal}
        errorMsg={errorMsg}
        loading={isLoading}
      />
    </div>
  );
};
