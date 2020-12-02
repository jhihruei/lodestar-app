import { useMutation } from '@apollo/react-hooks'
import { Button, ButtonGroup, Icon, useToast } from '@chakra-ui/react'
import BraftEditor from 'braft-editor'
import gql from 'graphql-tag'
import moment from 'moment'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { useApp } from '../../containers/common/AppContext'
import { createUploadFn } from '../../helpers'
import { commonMessages, reviewMessages } from '../../helpers/translation'
import { ReactComponent as StarGrayIcon } from '../../images/star-gray.svg'
import { ReactComponent as StarIcon } from '../../images/star.svg'
import types from '../../types'
import { ReviewProps } from '../../types/review'
import { useAuth } from '../auth/AuthContext'
import MemberAvatar from '../common/MemberAvatar'
import { BraftContent } from '../common/StyledBraftEditor'
import ReviewReplyItem from './ReviewReplyItem'

const ReviewContentBlock = styled.div`
  padding-left: 48px;
`
const StyledTitle = styled.div`
  font-weight: bold;
  color: var(--gray-darker);
`
export const StyledButton = styled(Button)`
  &&& {
    color: ${props => props.theme['@primary-color']};
  }
`
const ReviewPrivateBlock = styled.div`
  padding: 12px;
  font-size: 14px;
  letter-spacing: 0.4px;
  border: solid 1px var(--gray-light);
  border-radius: 4px;
`
const ReviewPrivateTitle = styled.div`
  color: var(--gray-dark);
`
const StyledEditor = styled(BraftEditor)`
  .bf-controlbar {
    box-shadow: initial;
  }
  .bf-content {
    border: 1px solid #cdcdcd;
    border-radius: 4px;
    height: initial;
  }
`
const ReviewPrivateContent = styled(BraftContent)`
  color: var(--gray-darker);
`
const ReviewItem: React.FC<ReviewProps & { onRefetch?: () => void }> = ({
  isAdmin,
  id,
  memberId,
  score,
  title,
  content,
  createdAt,
  updatedAt,
  privateContent,
  reviewReplies,
  labelRole,
  onRefetch,
}) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken, backendEndpoint, currentMemberId } = useAuth()
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      replyContent: BraftEditor.createEditorState((reviewReplies.length !== 0 && reviewReplies[0].content) || ''),
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyEditing, setReplyEditing] = useState(false)

  const [insertReviewReply] = useMutation<types.INSERT_REVIEW_REPLY, types.INSERT_REVIEW_REPLYVariables>(
    INSERT_REVIEW_REPLY,
  )
  const toast = useToast()

  const starAmount = (score: number) => {
    let starLists = []
    for (let i = 0; i < score; i++) {
      starLists.push(<Icon key={uuid()} style={{ marginRight: '2px' }} as={StarIcon} />)
    }
    if (starLists.length < 5) {
      for (let i = starLists.length; i < 5; i++) {
        starLists.push(<Icon key={uuid()} style={{ marginRight: '2px' }} as={StarGrayIcon} />)
      }
    }
    return <div className="d-flex mb-3">{starLists}</div>
  }

  const handleSave = (data: { replyContent: any }) => {
    setIsSubmitting(true)
    insertReviewReply({
      variables: {
        reviewId: id,
        memberId: currentMemberId,
        content: data.replyContent.toRAW(),
      },
    })
      .then(() => {
        toast({
          title: formatMessage(reviewMessages.event.isSubmitReview),
          status: 'success',
          duration: 3000,
          isClosable: false,
          position: 'top',
        })
        onRefetch?.()
      })
      .finally(() => {
        setIsSubmitting(false)
        setReplyEditing(false)
      })
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-start">
        <MemberAvatar memberId={memberId || ''} withName size={36} />
        <span className="ml-2 flex-grow-1" style={{ fontSize: '12px', color: '#9b9b9b' }}>
          <span>{updatedAt ? moment(updatedAt).fromNow() : moment(createdAt).fromNow()}</span>
          {updatedAt && updatedAt > createdAt && (
            <span className="ml-2">{updatedAt && formatMessage(reviewMessages.status.edited)}</span>
          )}
        </span>
      </div>
      <ReviewContentBlock>
        {starAmount(score)}
        <StyledTitle className="mb-2">{title}</StyledTitle>
        <BraftContent>{content}</BraftContent>

        {privateContent && !BraftEditor.createEditorState(privateContent).isEmpty() && (
          <ReviewPrivateBlock className="mt-3">
            <ReviewPrivateTitle className="mb-2">私下給老師的訊息</ReviewPrivateTitle>
            <ReviewPrivateContent>{privateContent}</ReviewPrivateContent>
          </ReviewPrivateBlock>
        )}

        {isAdmin && reviewReplies.length === 0 && (
          <>
            <StyledButton className="mt-2" variant="ghost" onClick={() => setReplyEditing(true)}>
              {formatMessage(reviewMessages.button.reply)}
            </StyledButton>
            {replyEditing && (
              <>
                <div className="d-flex align-items-center justify-content-start mt-4">
                  <MemberAvatar memberId={currentMemberId || ''} withName size={36} />
                </div>
                <form onSubmit={handleSubmit(handleSave)}>
                  <Controller
                    name="replyContent"
                    as={
                      <StyledEditor
                        language="zh-hant"
                        controls={['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media']}
                        media={{ uploadFn: createUploadFn(appId, authToken, backendEndpoint) }}
                      />
                    }
                    control={control}
                  />
                  <ButtonGroup mt={4} className="d-flex justify-content-end">
                    <StyledButton
                      type="reset"
                      variant="ghost"
                      onClick={() => {
                        setReplyEditing(false)
                        reset()
                      }}
                    >
                      {formatMessage(commonMessages.button.cancel)}
                    </StyledButton>
                    <Button isLoading={isSubmitting} type="submit" colorScheme="primary" className="apply-btn">
                      {formatMessage(reviewMessages.button.submitReview)}
                    </Button>
                  </ButtonGroup>
                </form>
              </>
            )}
          </>
        )}
        <div>
          {reviewReplies?.map(v => (
            <ReviewReplyItem
              key={v.id}
              id={v.id}
              reviewReplyMemberId={v.reviewReplyMemberId}
              memberRole={v.memberRole}
              content={v.content}
              createdAt={v.createdAt}
              updatedAt={v.updatedAt}
              labelRole={labelRole}
              onRefetch={onRefetch}
            />
          ))}
        </div>
      </ReviewContentBlock>
    </>
  )
}

const INSERT_REVIEW_REPLY = gql`
  mutation INSERT_REVIEW_REPLY($reviewId: uuid, $memberId: String, $content: String) {
    insert_review_reply(objects: { review_id: $reviewId, member_id: $memberId, content: $content }) {
      affected_rows
    }
  }
`

export default ReviewItem
