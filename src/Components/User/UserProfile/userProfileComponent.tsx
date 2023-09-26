import { Row, Col, Card, Button, Skeleton } from "antd";
import { UserOutlined, BankOutlined } from "@ant-design/icons";
import "./userProfileComponent.scss";
import { useEffect, useState } from "react";
import { UserRoleIcon } from "../../Common/UserRoleIcon/userRoleIcon";
import CompanyRoleIcon from "../../Common/CompanyRoleIcon/companyRoleIcon";
import LanguageSelection from "../../Common/LanguageSelection/languageSelection";
import React from "react";
import { SectoralScope, addCommSep } from "../../../Definitions";
import { CompanyRole } from "../../../Definitions/Enums/company.role.enum";

export const UserProfileComponent = (props: any) => {
  const {
    t,
    i18n,
    useConnection,
    onNavigateUpdateUser,
    onNavigateLogin,
    useUserContext,
  } = props;
  const { get } = useConnection();
  const [organisationDetails, setOrganisationDetails] =
    useState<any>(undefined);
  const [userDetails, setUserDetails] = useState<any>(undefined);
  const { updateToken } = useConnection();
  const { removeUserInfo } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const signOut = (): void => {
    updateToken();
    removeUserInfo();
    onNavigateLogin();
  };

  const getUserProfileDetails = async () => {
    try {
      setIsLoading(true);
      const response = await get("national/User/profile");
      if (response.data) {
        setOrganisationDetails(response.data.Organisation);
        setUserDetails(response.data.user);
        setIsLoading(false);
      }
    } catch (exception) {}
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

  useEffect(() => {
    getUserProfileDetails();
  }, []);

  return (
    <div className="content-container user-profile">
      <Row>
        <Col md={24} lg={8}>
          <div className="title-bar">
            <div>
              <div className="body-title">{t("userProfile:title")}</div>
              <div className="body-sub-title">{t("userProfile:subTitle")}</div>
            </div>
          </div>
        </Col>
        <Col md={24} lg={16}>
          <Row justify="end">
            <Button
              className="mg-left-1 btn-danger mg-bottom-1"
              onClick={() => signOut()}
            >
              {t("userProfile:logOut")}
            </Button>
            {userDetails && organisationDetails && (
              <Button
                className="mg-left-1 mg-bottom-1"
                type="primary"
                onClick={() => {
                  onNavigateUpdateUser(organisationDetails, userDetails);
                }}
              >
                {t("userProfile:edit")}
              </Button>
            )}
            <LanguageSelection i18n={i18n}></LanguageSelection>
          </Row>
        </Col>
      </Row>

      {(!userDetails || !organisationDetails) && (
        <div className="content-body">
          <Skeleton active loading={true}></Skeleton>
        </div>
      )}
      {userDetails && organisationDetails && (
        <div className="content-body">
          <Row gutter={16}>
            <Col md={24} lg={8}>
              <Card className="card-container">
                <Row justify="center">
                  <Skeleton loading={isLoading} active>
                    <img
                      className="profile-img"
                      alt="profile-img"
                      src={organisationDetails.logo}
                    />
                  </Skeleton>
                </Row>
                <Row justify="center">
                  <div className=" company-name mg-top-1">
                    {organisationDetails.name}
                  </div>
                </Row>
              </Card>
            </Col>
            <Col md={24} lg={16}>
              <Card className="card-container">
                <div className="info-view">
                  <div className="title">
                    <span className="title-icon">
                      <UserOutlined />
                    </span>
                    <span className="title-text">
                      {t("userProfile:userDetailsHeading")}
                    </span>
                  </div>
                  <Skeleton loading={isLoading} active>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:name")}
                      </Col>
                      <Col span={12} className="field-value">
                        {userDetails.name ? userDetails.name : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:email")}
                      </Col>
                      <Col span={12} className="field-value nextline-overflow">
                        {userDetails.email ? userDetails.email : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:role")}
                      </Col>
                      <Col span={12} className="field-value">
                        <UserRoleIcon role={userDetails.role} />
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:phoneNo")}
                      </Col>
                      <Col span={12} className="field-value">
                        {userDetails.phoneNo ? userDetails.phoneNo : "-"}
                      </Col>
                    </Row>
                  </Skeleton>
                </div>
              </Card>
              <Card className="card-container">
                <div className="info-view">
                  <div className="title">
                    <span className="title-icon">
                      <BankOutlined />
                    </span>
                    <span className="title-text">
                      {t("userProfile:organisationDetailsHeading")}
                    </span>
                  </div>
                  <Skeleton loading={isLoading} active>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:name")}
                      </Col>
                      <Col span={12} className="field-value">
                        {organisationDetails.name
                          ? organisationDetails.name
                          : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:taxId")}
                      </Col>
                      <Col span={12} className="field-value">
                        {organisationDetails.taxId
                          ? organisationDetails.taxId
                          : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:paymentId")}
                      </Col>
                      <Col span={12} className="field-value">
                        {organisationDetails.paymentId
                          ? organisationDetails.paymentId
                          : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:companyRole")}
                      </Col>
                      <Col span={12} className="field-value">
                        <CompanyRoleIcon
                          role={organisationDetails.companyRole}
                        />
                      </Col>
                    </Row>
                    {organisationDetails?.companyRole ===
                      CompanyRole.MINISTRY && (
                      <>
                        <Row className="field">
                          <Col span={12} className="field-key">
                            {t("userProfile:ministerName")}
                          </Col>
                          <Col span={12} className="field-value">
                            {organisationDetails.nameOfMinister
                              ? organisationDetails.nameOfMinister
                              : "-"}
                          </Col>
                        </Row>
                        <Row className="field">
                          <Col span={12} className="field-key">
                            {t("userProfile:sectoralScope")}
                          </Col>
                          <Col span={12} className="field-value">
                            {organisationDetails.sectoralScope
                              ? getEnumKeysFromValues(
                                  organisationDetails.sectoralScope
                                ).join(", ")
                              : "-"}
                          </Col>
                        </Row>
                      </>
                    )}
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:email")}
                      </Col>
                      <Col span={12} className="field-value nextline-overflow">
                        {organisationDetails.email
                          ? organisationDetails.email
                          : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:phoneNo")}
                      </Col>
                      <Col span={12} className="field-value">
                        {organisationDetails.phoneNo
                          ? organisationDetails.phoneNo
                          : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:website")}
                      </Col>
                      <Col span={12} className="field-value ellipsis-overflow">
                        {organisationDetails.website ? (
                          <a
                            target={"blank"}
                            href={organisationDetails.website}
                          >
                            {organisationDetails.website}
                          </a>
                        ) : (
                          "-"
                        )}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:address")}
                      </Col>
                      <Col span={12} className="field-value">
                        {organisationDetails.address
                          ? organisationDetails.address
                          : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:programmeCount")}
                      </Col>
                      <Col span={12} className="field-value">
                        {organisationDetails.programmeCount
                          ? organisationDetails.programmeCount
                          : "-"}
                      </Col>
                    </Row>
                    <Row className="field">
                      <Col span={12} className="field-key">
                        {t("userProfile:creditBalance")}
                      </Col>
                      <Col span={12} className="field-value">
                        {organisationDetails.creditBalance
                          ? addCommSep(organisationDetails.creditBalance)
                          : "-"}
                      </Col>
                    </Row>
                  </Skeleton>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
