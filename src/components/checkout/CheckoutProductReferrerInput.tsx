import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
import { commonMessages } from '../../helpers/translation'
import { Input } from '../common/CommonForm'

const CheckoutProductReferrerInput: React.VFC<{
  referrerStatus: 'success' | 'error' | 'validating' | undefined
  referrerId: string | null
  onEmailSet: (email: string) => void
}> = ({ referrerStatus, referrerId, onEmailSet }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  return (
    <FormControl isInvalid={referrerStatus === 'error'}>
      <Input
        type="email"
        status={referrerStatus}
        placeholder={formatMessage(commonMessages.form.placeholder.referrerEmail)}
        onBlur={e => onEmailSet(e.target.value)}
      />
      <FormErrorMessage>
        {referrerStatus === 'error'
          ? referrerId === currentMemberId
            ? formatMessage(commonMessages.text.selfReferringIsNotAllowed)
            : formatMessage(commonMessages.text.notFoundMemberEmail)
          : undefined}
      </FormErrorMessage>
    </FormControl>
  )
}

export default CheckoutProductReferrerInput
