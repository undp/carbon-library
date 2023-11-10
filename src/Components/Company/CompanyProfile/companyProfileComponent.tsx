import { BankOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, message, Row, Skeleton } from "antd";
import { plainToClass } from "class-transformer";
import React, { useEffect, useState } from "react";
import { Action } from "../../../Definitions/Enums/action.enum";
import { Company } from "../../../Definitions/Entities/company";
import CompanyRoleIcon from "../../Common/CompanyRoleIcon/companyRoleIcon";
import UserActionConfirmationModel from "../../Common/Models/userActionConfirmationModel";
import "./companyProfileComponent.scss";
import * as Icon from "react-bootstrap-icons";
import { OrganisationStatus } from "../../Common/OrganisationStatus/organisationStatus";
import { addCommSep, CompanyState, SectoralScope } from "../../../Definitions";
import { CompanyRole } from "../../../Definitions/Enums/company.role.enum";

export const CompanyProfileComponent = (props: any) => {
  const {
    t,
    useAbilityContext,
    useLocation,
    useConnection,
    onNavigateToCompanyManagement,
    onNavigateToCompanyEdit,
    regionField,
  } = props;
  const { get, put, post } = useConnection();
  const [companyDetails, setCompanyDetails] = useState<any>(undefined);
  const [userDetails, setUserDetails] = useState<any>(undefined);
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [actionInfo, setActionInfo] = useState<any>({});
  const [openDeauthorisationModal, setOpenDeauthorisationModal] =
    useState(false);
  const [openReactivateModal, setOpenReactivateModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
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

  const getUserDetails = async (companyId: string) => {
    setIsLoading(true);
    try {
      const response: any = await post("national/user/query", {
        page: 1,
        size: 10,
        filterAnd: [
          {
            key: "companyId",
            operation: "=",
            value: companyId,
          },
          {
            key: "isPending",
            operation: "=",
            value: true,
          },
        ],
      });
      if (response && response.data) {
        setUserDetails(response.data[0]);
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log("Error in getting users", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!state) {
      onNavigateToCompanyManagement();
    } else {
      getCompanyDetails(state.record.companyId);
      const userRoleValue = localStorage.getItem("userRole") as string;
      setUserRole(userRoleValue);
      setCompanyRole(localStorage.getItem("companyRole") as string);
      if (state.record?.state == "2" || state.record?.state == "3") {
        getUserDetails(state.record.companyId);
      }
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

  const onApproveOrgConfirmed = async (remarks: string) => {
    try {
      setIsLoading(true);
      const response: any = await put(
        `national/organisation/approve?id=${companyDetails.companyId}`,
        {
          remarks: remarks,
        }
      );
      setOpenApproveModal(false);
      message.open({
        type: "success",
        content: t("companyProfile:approvedSuccessfully"),
        duration: 3,
        style: { textAlign: "right", marginRight: 15, marginTop: 10 },
      });
      getCompanyDetails(companyDetails.companyId);
      getUserDetails(companyDetails.companyId);
    } catch (exception: any) {
      setErrorMsg(exception.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onApproveOrgCanceled = () => {
    setOpenApproveModal(false);
  };

  const onRejectOrgConfirmed = async (remarks: string) => {
    try {
      setIsLoading(true);
      const response: any = await put(
        `national/organisation/reject?id=${companyDetails.companyId}`,
        {
          remarks: remarks,
        }
      );
      setOpenRejectModal(false);
      message.open({
        type: "success",
        content: t("companyProfile:rejectedSuccessfully"),
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

  const onRejectOrgCanceled = () => {
    setOpenRejectModal(false);
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

  const onApproveOrganisation = () => {
    setActionInfo({
      action: `${t("companyProfile:approve")}`,
      headerText: `${t("companyProfile:approveConfirmHeaderText")}`,
      text: `${t("companyProfile:approveConfirmText")}`,
      type: "primary",
      icon: <Icon.ClipboardCheck />,
    });
    setErrorMsg("");
    setOpenApproveModal(true);
  };

  const onRejectOrganisation = () => {
    setActionInfo({
      action: `${t("companyProfile:reject")}`,
      headerText: `${t("companyProfile:rejectConfirmHeaderText")}`,
      text: `${t("companyProfile:rejectConfirmText")}`,
      type: "danger",
      icon: <Icon.ClipboardX />,
    });
    setErrorMsg("");
    setOpenRejectModal(true);
  };

  const getEnumKeysFromValues = (values: string[]): string[] => {
    const enumKeys: string[] = [];
    for (const key in SectoralScope) {
      if (values.includes(SectoralScope[key as keyof typeof SectoralScope])) {
        enumKeys.push(key);
      }
    }

    return enumKeys;
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
          parseInt(companyDetails?.state) === 1 ? (
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
          parseInt(companyDetails?.state) === 0 ? (
            <Button className="btn-activate" onClick={onReActivateOrganisation}>
              {t("companyProfile:reActivate")}
            </Button>
          ) : (
            ""
          )}

          {ability.can(Action.Update, plainToClass(Company, companyDetails)) &&
            !isLoading &&
            companyDetails && (
              <Button
                className="mg-left-1"
                type="primary"
                onClick={() => onNavigateToCompanyEdit(companyDetails)}
              >
                {t("common:edit")}
              </Button>
            )}
          {parseInt(companyDetails?.state) === 2 &&
            ability.can(Action.Reject, plainToClass(Company, companyDetails)) &&
            !isLoading &&
            companyDetails && (
              <Button
                className="btn-danger"
                onClick={onRejectOrganisation}
              >
                {t("common:reject")}
              </Button>
            )}
          {(parseInt(companyDetails?.state) === 2 ||
            parseInt(companyDetails?.state) === 3) &&
            ability.can(
              Action.Approve,
              plainToClass(Company, companyDetails)
            ) &&
            !isLoading &&
            companyDetails && (
              <Button
                className="mg-left-1"
                type="primary"
                onClick={onApproveOrganisation}
              >
                {t("common:approve")}
              </Button>
            )}
        </div>
      </div>
      {!companyDetails && (
        <div className="content-body">
          <Skeleton active loading={true}></Skeleton>
        </div>
      )}
      {companyDetails && (
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
                        {companyDetails.taxId &&
                        companyDetails?.companyRole !== CompanyRole.GOVERNMENT
                          ? companyDetails.taxId
                          : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("companyProfile:paymentId")}
                      </Col>
                      <Col span={12} className="field-value nextline-overflow">
                        {companyDetails.paymentId
                          ? companyDetails.paymentId
                          : "-"}
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
                    {companyDetails?.companyRole === CompanyRole.MINISTRY && (
                      <>
                        <Row className="field">
                          <Col span={12} className="field-key">
                            {t("companyProfile:ministerName")}
                          </Col>
                          <Col span={12} className="field-value">
                            {companyDetails.nameOfMinister
                              ? companyDetails.nameOfMinister
                              : "-"}
                          </Col>
                        </Row>
                        <Row className="field">
                          <Col span={12} className="field-key">
                            {t("companyProfile:sectoralScope")}
                          </Col>
                          <Col span={12} className="field-value">
                            {companyDetails.sectoralScope
                              ? getEnumKeysFromValues(
                                  companyDetails.sectoralScope
                                ).join(", ")
                              : "-"}
                          </Col>
                        </Row>
                      </>
                    )}
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
                    {regionField && (
                      <Row className="field">
                        <Col span={12} className="field-key">
                          {t("companyProfile:region")}
                        </Col>
                        <Col span={12} className="field-value">
                          {companyDetails.regions
                            ? companyDetails.regions.join(", ")
                            : "-"}
                        </Col>
                      </Row>
                    )}
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
                          ? addCommSep(companyDetails.creditBalance)
                          : "-"}
                      </Col>
                    </Row>
                    {parseInt(companyDetails.state) === 0 ? (
                      <Row className="field">
                        <Col span={12} className="field-key">
                          {t("companyProfile:remarks")}
                        </Col>
                        <Col span={12} className="field-value">
                          {companyDetails.remarks
                            ? companyDetails.remarks
                            : "-"}
                        </Col>
                      </Row>
                    ) : (
                      ""
                    )}
                    {companyDetails?.companyRole === CompanyRole.GOVERNMENT && (
                      <>
                        <Row className="field">
                          <Col span={12} className="field-key">
                            {t("companyProfile:nationalSopValue")}
                          </Col>
                          <Col span={12} className="field-value">
                            {companyDetails.nationalSopValue
                              ? companyDetails.nationalSopValue
                              : "-"}
                          </Col>
                        </Row>
                      </>
                    )}
                  </Skeleton>
                </div>
              </Card>
              {(companyDetails?.state == "2" ||
                companyDetails?.state == "3") && (
                <Card className="card-container">
                  <div className="info-view">
                    <div className="title">
                      <span className="title-icon">
                        <UserOutlined />
                      </span>
                      <span className="title-text">
                        {t("companyProfile:adminDetailsHeading")}
                      </span>
                    </div>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("companyProfile:adminName")}
                      </Col>
                      <Col span={12} className="field-value">
                        {userDetails?.name ? userDetails?.name : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("companyProfile:adminEmail")}
                      </Col>
                      <Col span={12} className="field-value">
                        {userDetails?.email ? userDetails?.email : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("companyProfile:adminPhone")}
                      </Col>
                      <Col span={12} className="field-value">
                        {userDetails?.phoneNo
                          ? userDetails?.phoneNo
                          : "-"}
                      </Col>
                    </Row>

                  </div>
                </Card>
              )}
            </Col>
          </Row>
        </div>
      )}

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

      <UserActionConfirmationModel
        t={t}
        actionInfo={actionInfo}
        onActionConfirmed={onApproveOrgConfirmed}
        onActionCanceled={onApproveOrgCanceled}
        openModal={openApproveModal}
        errorMsg={errorMsg}
        loading={isLoading}
      />

      <UserActionConfirmationModel
        t={t}
        actionInfo={actionInfo}
        onActionConfirmed={onRejectOrgConfirmed}
        onActionCanceled={onRejectOrgCanceled}
        openModal={openRejectModal}
        errorMsg={errorMsg}
        loading={isLoading}
      />
    </div>
  );
};
