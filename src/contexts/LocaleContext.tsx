import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment'
import 'moment/locale/zh-tw'
import React, { createContext, useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import hasura from '../hasura'
import defaultLocaleMessages from '../translations/locales/en-us.json'

export const SUPPORTED_LOCALES = [
  { locale: 'zh-cn', label: '简体中文' },
  { locale: 'zh-tw', label: '繁體中文' },
  { locale: 'en-us', label: 'English' },
  { locale: 'vi', label: 'Tiếng việt' },
  { locale: 'id', label: 'Indonesia' },
]
type LocaleContextProps = {
  currentLocale: string
  setCurrentLocale?: (language: string) => void
}
const defaultLocaleContextValue: LocaleContextProps = {
  currentLocale: 'zh-tw',
}

export const LocaleContext = createContext<LocaleContextProps>(defaultLocaleContextValue)

export const LocaleProvider: React.FC = ({ children }) => {
  const { enabledModules, settings, id: appId } = useApp()
  const [currentLocale, setCurrentLocale] = useState(defaultLocaleContextValue.currentLocale)

  const { data } = useQuery<hasura.GET_APP_LANGUAGE, hasura.GET_APP_LANGUAGEVariables>(
    gql`
      query GET_APP_LANGUAGE($appId: String!) {
        app_language(where: { app_id: { _eq: $appId } }) {
          id
          language
          data
        }
      }
    `,
    { variables: { appId } },
  )
  const appLocaleMessages = data?.app_language.find(v => v.language === currentLocale)?.data || {}

  useEffect(() => {
    let currentLocale = defaultLocaleContextValue.currentLocale
    if (enabledModules.locale) {
      const browserLocale = settings['language'] || navigator.language
      const cachedLocale = localStorage.getItem('kolable.app.language')?.toLowerCase()
      if (cachedLocale && SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === cachedLocale)) {
        currentLocale = cachedLocale
      } else if (browserLocale && SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === browserLocale)) {
        currentLocale = browserLocale
      }
    }
    setCurrentLocale(currentLocale)
  }, [enabledModules, settings])

  moment.locale(currentLocale)
  let localeMessages: { [key: string]: string } = defaultLocaleMessages
  if (enabledModules.locale) {
    try {
      localeMessages = require(`../translations/locales/${currentLocale}.json`)
    } catch (error) {
      console.warn('cannot load the locale:', currentLocale, error)
    }
  }
  localeMessages = { ...localeMessages, ...appLocaleMessages }

  return (
    <LocaleContext.Provider
      value={{
        currentLocale,
        setCurrentLocale: (newLocale: string) => {
          if (SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === newLocale)) {
            localStorage.setItem('kolable.app.language', newLocale)
            setCurrentLocale(newLocale)
          }
        },
      }}
    >
      <IntlProvider defaultLocale="zh" locale={currentLocale} messages={localeMessages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}

export default LocaleContext
