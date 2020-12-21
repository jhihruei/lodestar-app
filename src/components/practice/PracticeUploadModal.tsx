import { QuestionIcon } from '@chakra-ui/icons'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import BraftEditor, { EditorState } from 'braft-editor'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import CommonModal from '../common/CommonModal'
import FileUploader from '../common/FileUploader'
import ImageUploader from '../common/ImageUploader'

const messages = defineMessages({
  practice: { id: 'program.term.practice', defaultMessage: '作業' },
  uploadPractice: { id: 'program.ui.uploadPractice', defaultMessage: '上傳作業' },
  practiceAttachment: { id: 'program.label.practiceAttachment', defaultMessage: '作品檔案' },
  practiceAttachmentNotice: { id: 'program.label.practiceAttachmentNotice', defaultMessage: '檔案大小不超過 5GB' },
  cover: { id: 'program.label.cover', defaultMessage: '封面圖片' },
  coverNotice: { id: 'program.label.coverNotice', defaultMessage: '建議上傳圖片尺寸為 1600*900px' },
  description: { id: 'program.label.description', defaultMessage: '描述' },
  fillTitleNotice: { id: 'program.text.fillTitleNotice', defaultMessage: '請填入標題' },
  fillDescriptionPlease: { id: 'program.text.fillDescriptionPlease', defaultMessage: '輸入內容描述...' },
})

const StyledButton = styled(Button)`
  && {
    width: 100%;
  }
`

const PracticeUploadModal: React.FC = () => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { register, control, handleSubmit, setError, errors } = useForm<{
    title: string
    description?: EditorState
  }>()
  const [attachments, setAttachments] = useState<File[]>([])
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const handleUpload = handleSubmit(({ title, description }) => {
    if (!title) {
      setError('title', {
        message: formatMessage(messages.fillTitleNotice),
      })
    }
    console.log(title, attachments, coverImage, description?.toRAW())
    toast({
      title: `${formatMessage(messages.practice)}${formatMessage(commonMessages.event.successfullyUpload)}`,
      status: 'success',
      duration: 1500,
      position: 'top',
    })
    onClose()
  })

  return (
    <CommonModal
      isFullWidth
      title={formatMessage(messages.uploadPractice)}
      isOpen={isOpen}
      onClose={onClose}
      renderCloseButtonBlock={() => (
        <ButtonGroup>
          <Button onClick={onClose} variant="outline">
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button onClick={handleUpload} variant="primary">
            {formatMessage(commonMessages.ui.upload)}
          </Button>
        </ButtonGroup>
      )}
      renderTrigger={() => (
        <StyledButton variant="primary" onClick={onOpen}>
          {formatMessage(messages.uploadPractice)}
        </StyledButton>
      )}
    >
      <div className="row">
        <div className="col-12 col-lg-8 mb-4">
          <FormControl isRequired isInvalid={!!errors?.title?.message} className="mb-4">
            <FormLabel>{formatMessage(commonMessages.label.title)}</FormLabel>

            <Input name="title" ref={register} variant="outline" />
            <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
          </FormControl>

          <FormLabel>
            <span className="mr-1">{formatMessage(messages.practiceAttachment)}</span>
            <Tooltip label={formatMessage(messages.practiceAttachmentNotice)} placement="top" hasArrow>
              <QuestionIcon />
            </Tooltip>
          </FormLabel>
          <FileUploader multiple showUploadList fileList={attachments} onChange={files => setAttachments(files)} />
        </div>
        <div className="col-12 col-lg-4 mb-4">
          <FormLabel>
            <span className="mr-1">{formatMessage(messages.cover)}</span>
            <Tooltip label={formatMessage(messages.coverNotice)} placement="top" hasArrow>
              <QuestionIcon />
            </Tooltip>
          </FormLabel>
          <ImageUploader file={coverImage} onChange={file => setCoverImage(file)} />
        </div>
      </div>

      <FormLabel>{formatMessage(messages.description)}</FormLabel>
      <Controller
        name="description"
        as={<BraftEditor placeholder={formatMessage(messages.fillDescriptionPlease)} />}
        control={control}
      />
    </CommonModal>
  )
}

export default PracticeUploadModal
