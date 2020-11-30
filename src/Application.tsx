import { ConfigProvider } from 'antd'
import zhTW from 'antd/lib/locale-provider/zh_TW'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { AuthProvider } from './components/auth/AuthContext'
import { ApiProvider } from './components/common/ApiContext'
import { AppThemeProvider } from './components/common/AppThemeContext'
import { AppProvider } from './containers/common/AppContext'
import ErrorBoundary from './containers/common/ErrorBoundary'
import { CartProvider } from './contexts/CartContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { PodcastPlayerProvider } from './contexts/PodcastPlayerContext'
import { useApiHost } from './hooks/util'
import LoadingPage from './pages/LoadingPage'
import Routes, { RouteProps } from './Routes'

const Application: React.FC<{
  appId: string
  extraRouteProps?: { [routeKey: string]: RouteProps }
}> = ({ appId, extraRouteProps }) => {
  const apiHost = useApiHost(appId)

  if (!apiHost) {
    return <LoadingPage />
  }

  return (
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
        <AuthProvider apiHost={apiHost}>
          <ApiProvider appId={appId}>
            <AppProvider appId={appId}>
              <LanguageProvider>
                <CartProvider>
                  <NotificationProvider>
                    <PodcastPlayerProvider>
                      <AppThemeProvider>
                        <ErrorBoundary>
                          <ConfigProvider locale={zhTW}>
                            <Routes extra={extraRouteProps} />
                          </ConfigProvider>
                        </ErrorBoundary>
                      </AppThemeProvider>
                    </PodcastPlayerProvider>
                  </NotificationProvider>
                </CartProvider>
              </LanguageProvider>
            </AppProvider>
          </ApiProvider>
        </AuthProvider>
      </QueryParamProvider>
    </BrowserRouter>
  )
}

export default Application
