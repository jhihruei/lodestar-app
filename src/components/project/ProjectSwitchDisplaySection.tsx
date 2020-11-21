import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { useEffect } from 'react'
import types from '../../types'
import { useAuth } from '../auth/AuthContext'

const ProjectSwitchDisplaySection: React.FC<{
  projectId: string
  onDisplayProjectSectionTypesSet: React.Dispatch<React.SetStateAction<string[]>>
}> = ({ onDisplayProjectSectionTypesSet, projectId }) => {
  const { currentMemberId } = useAuth()
  const apolloClient = useApolloClient()

  useEffect(() => {
    apolloClient
      .query<types.GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENT, types.GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENTVariables>(
        {
          query: gql`
            query GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENT($projectId: uuid!, $memberId: String!) {
              project_plan_enrollment(
                where: { project_plan: { project: { id: { _eq: $projectId } } }, member_id: { _eq: $memberId } }
              ) {
                member_id
              }
            }
          `,
          variables: {
            memberId: currentMemberId || '',
            projectId,
          },
        },
      )
      .then(({ data }) => {
        const isEnrolled = !!data.project_plan_enrollment.length
        const displayProjectTypes = isEnrolled
          ? ['programSearch', 'programCollection', 'modularBriefFooter']
          : [
              'messenger',
              'banner',
              'statistics',
              'static',
              'card',
              'comparison',
              'promotion',
              'comment',
              'callout',
              'instructor',
            ]

        onDisplayProjectSectionTypesSet(displayProjectTypes)
      })
  }, [apolloClient, currentMemberId, onDisplayProjectSectionTypesSet, projectId])

  return <></>
}

export default ProjectSwitchDisplaySection
