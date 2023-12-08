import React from "react";
import { ConnectionContextProvider, UserInformationContextProvider } from "../../Context";
import { useTranslation } from 'react-i18next';

export default function ConnectionContextDecorator(Story:any, context:any) {
  
  const { i18n, t } = useTranslation(['common']);

  return (
    <ConnectionContextProvider
      serverURL={
        process.env.REACT_APP_BACKEND
          ? process.env.REACT_APP_BACKEND
          : 'https://transparency-demo.carbreg.org:9000'
      }
      statServerUrl="https://transparency-demo.carbreg.org:9100"
      t={t}
    >
      <UserInformationContextProvider>
      <Story/>
      </UserInformationContextProvider>
    </ConnectionContextProvider>
  )
}