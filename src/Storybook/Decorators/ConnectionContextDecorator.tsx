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
          : 'http://3.232.219.197:3000'
      }
      t={t}
    >
      <UserInformationContextProvider>
      <Story/>
      </UserInformationContextProvider>
    </ConnectionContextProvider>
  )
}