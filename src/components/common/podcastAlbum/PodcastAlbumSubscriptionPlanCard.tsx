import { Button } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages, podcastAlbumMessages } from '../../../helpers/translation'
import { PodcastAlbum } from '../../../types/podcastAlbum'
import { AuthModalContext } from '../../auth/AuthModal'
import AdminCard from '../AdminCard'

const StyledAdminCard = styled(AdminCard)`
  color: ${props => props.theme['@label-color']};

  header {
    margin-bottom: 24px;

    h2.title {
      margin-bottom: 16px;
      letter-spacing: 0.2px;
      font-size: 16px;
      font-weight: bold;
    }
  }
`
const PodcastAlbumSubscriptionPlanCard: React.VFC<{
  podcastAlbum: Pick<PodcastAlbum, 'isPublic' | 'id' | 'podcastPrograms'>
}> = ({ podcastAlbum }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)

  return (
    <StyledAdminCard key={podcastAlbum.isPublic ? podcastAlbum.id : ''}>
      <header>
        <h2 className="title">{podcastAlbum.isPublic ? formatMessage(podcastAlbumMessages.label.freePublic) : ''}</h2>
      </header>

      {isAuthenticated ? (
        <Button
          colorScheme="primary"
          isFullWidth
          onClick={() =>
            history.push(`/podcasts/${podcastAlbum.podcastPrograms[0].id}?podcastAlbumId=${podcastAlbum.id}`)
          }
        >
          {formatMessage(commonMessages.button.joinNow)}
        </Button>
      ) : podcastAlbum.isPublic ? (
        <Button
          colorScheme="primary"
          isFullWidth
          isDisabled={isAuthenticated}
          onClick={() => {
            setAuthModalVisible?.(true)
          }}
        >
          {podcastAlbum.isPublic
            ? formatMessage(commonMessages.button.joinNow)
            : formatMessage(commonMessages.ui.purchase)}
        </Button>
      ) : null}
    </StyledAdminCard>
  )
}

export default PodcastAlbumSubscriptionPlanCard
