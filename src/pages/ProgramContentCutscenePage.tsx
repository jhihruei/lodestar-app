import { Box, Button, Icon, Spinner } from '@chakra-ui/react'
import { Layout, PageHeader } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { flatten } from 'ramda'
import React from 'react'
import { AiOutlineProfile } from 'react-icons/ai'
import { BsStar } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { StyledLayoutContent } from '../components/layout/DefaultLayout/DefaultLayout.styled'
import ProgramContentMenu from '../components/program/ProgramContentMenu'
import ProgramContentNoAuthBlock from '../components/program/ProgramContentNoAuthBlock'
import { hasJsonStructure } from '../helpers'
import { useProgram } from '../hooks/program'
import pageMessages from './translation'

const StyledPCPageHeader = styled(PageHeader)`
  && {
    padding: 10px 24px;
    height: 64px;
    background: white;
  }

  .ant-page-header-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ant-page-header-heading-title {
    display: block;
    flex-grow: 1;
    overflow: hidden;
    font-size: 16px;
    line-height: 44px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ant-page-header-heading-extra {
    padding: 0;
  }
`
const StyledButton = styled(Button)`
  && {
    border: none;
  }
  &&:hover {
    background: initial;
  }
`

const ProgramContentCutscenePage: React.VFC = () => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { id: appId } = useApp()
  const { isAuthenticating, isAuthenticated } = useAuth()
  const { currentMemberId } = useAuth()
  const { programId } = useParams<{ programId: string }>()
  const [productId] = useQueryParam('back', StringParam)
  const { loadingProgram, program, errorProgram } = useProgram(programId)

  if (loadingProgram || isAuthenticating || !program) {
    return (
      <Box className="d-flex justify-content-center align-items-center" h="100vh">
        <Spinner />
      </Box>
    )
  }
  if (!isAuthenticated) return <ProgramContentNoAuthBlock />

  if (errorProgram) return <>fetch program data error</>

  let lastProgramContent: { [key: string]: string } = {}

  if (hasJsonStructure(localStorage.getItem(`${appId}.program.info`) || '')) {
    lastProgramContent = JSON.parse(localStorage.getItem(`${appId}.program.info`) || '')
  }

  // ProgramContentPage
  if (flatten(program?.contentSections.map(v => v.contents) || []).length === 0) {
    return (
      <Layout>
        <StyledPCPageHeader
          className="d-flex align-items-center"
          title={program && program.title}
          extra={
            <div>
              {enabledModules.customer_review && (
                <StyledButton
                  variant="outline"
                  onClick={() => window.open(`/programs/${programId}?visitIntro=1&moveToBlock=customer-review`)}
                  leftIcon={<Icon as={BsStar} />}
                >
                  {formatMessage(pageMessages['*'].review)}
                </StyledButton>
              )}
              <StyledButton
                variant="outline"
                onClick={() => history.push(`/programs/${programId}?visitIntro=1`)}
                leftIcon={<Icon as={AiOutlineProfile} />}
              >
                {formatMessage(pageMessages['*'].intro)}
              </StyledButton>
            </div>
          }
          onBack={() => {
            if (productId) {
              const [productType, id] = productId.split('_')
              if (productType === 'program-package') {
                history.push(`/program-packages/${id}/contents`)
              }
              if (productType === 'project') {
                history.push(`/projects/${id}`)
              }
            } else {
              history.push(`/members/${currentMemberId}`)
            }
            history.push(`/`)
          }}
        />
        <StyledLayoutContent>
          <div className="container py-5">
            <ProgramContentMenu program={program} />
          </div>
        </StyledLayoutContent>
      </Layout>
    )
  } else if (
    Object.keys(lastProgramContent).includes(programId) &&
    flatten(program?.contentSections.map(v => v.contents.map(w => w.id)) || []).includes(lastProgramContent[programId])
  ) {
    return <Redirect to={`/programs/${programId}/contents/${lastProgramContent[programId]}?back=${productId}`} />
  } else {
    return (
      <Redirect
        to={`/programs/${programId}/contents/${program?.contentSections[0].contents[0].id}?back=${productId}`}
      />
    )
  }
}

export default ProgramContentCutscenePage
