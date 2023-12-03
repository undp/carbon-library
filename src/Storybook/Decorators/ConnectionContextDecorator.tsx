import React from "react";
import { ConnectionContextProvider } from "../../Context";
import { useTranslation } from 'react-i18next';

export default function ConnectionContextDecorator(Story:any, context:any) {
  
  const { i18n, t } = useTranslation(['common']);

  return (
    <ConnectionContextProvider
      serverURL={
        process.env.REACT_APP_BACKEND
          ? process.env.REACT_APP_BACKEND
          : 'http://localhost:3000'
      }
      t={t}
    >
      <Story/>
    </ConnectionContextProvider>
  )
}