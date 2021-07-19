import { Icon } from '@chakra-ui/icons'
import { SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { dateRangeFormatter } from '../../helpers'
import { activityMessages, commonMessages, productMessages } from '../../helpers/translation'
import { useActivitySession } from '../../hooks/activity'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import { ReactComponent as MapOIcon } from '../../images/map-o.svg'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import { ReactComponent as VideoIcon } from '../../images/video.svg'

const StyledWrapper = styled.div`
  padding: 1.5rem 0;
  background: #f7f8f8;
  border-radius: 4px;
  color: #585858;
`
const StyledTitle = styled.h2`
  padding-left: 1.5rem;
  border-left: 2px solid ${props => props.theme['@primary-color']};
  font-size: 16px;
`
const StyledContent = styled.div`
  line-height: 1.5;
  padding: 0 1.5rem;

  > div + div {
    margin-top: 0.75rem;
  }
`

const ActivitySessionItem: React.VFC<{
  activitySessionId: string
  renderAttend?: React.ReactNode
}> = ({ activitySessionId, renderAttend }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { loadingSession, errorSession, session } = useActivitySession(activitySessionId)

  if (loadingSession) {
    return (
      <StyledWrapper>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </StyledWrapper>
    )
  }

  if (errorSession || !session) {
    return <StyledWrapper>{formatMessage(commonMessages.status.loadingError)}</StyledWrapper>
  }

  return (
    <StyledWrapper>
      <StyledTitle className="mb-3">{session.title}</StyledTitle>
      <StyledContent>
        <div>
          <Icon as={CalendarOIcon} className="mr-2" />
          <span>{dateRangeFormatter({ startedAt: session.startedAt, endedAt: session.endedAt })}</span>
        </div>

        {!enabledModules.activity_online ||
          (session.location && (
            <div>
              <Icon as={MapOIcon} className="mr-2" />
              <span>{session.location}</span>
            </div>
          ))}

        {enabledModules.activity_online && session.onlineLink && (
          <div>
            <Icon as={VideoIcon} className="mr-2" />
            {formatMessage(activityMessages.ui.live)}
          </div>
        )}

        {(session.isParticipantsVisible || !!session.threshold) && (
          <div>
            <Icon as={UserOIcon} className="mr-2" />
            {session.isParticipantsVisible && (
              <span className="mr-3">
                {session.enrollments} / {session.maxAmount}
              </span>
            )}
            {session.threshold && (
              <span>
                {formatMessage(productMessages.activity.content.least)}
                {session.threshold}
              </span>
            )}
          </div>
        )}

        {renderAttend && <div className="pt-2">{renderAttend}</div>}
      </StyledContent>
    </StyledWrapper>
  )
}

export default ActivitySessionItem
