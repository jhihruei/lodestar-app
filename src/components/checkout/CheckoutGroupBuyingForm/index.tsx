import { ListItem, OrderedList, Stat } from '@chakra-ui/react'
import { update } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { notEmpty } from '../../../helpers'
import { checkoutMessages } from '../../../helpers/translation'
import { CommonLargeTextMixin } from '../../common'
import GroupBuyingPartnerInput from './GroupBuyingPartnerInput'
import GroupBuyingRuleModal from './GroupBuyingRuleModal'

const StyledPlanTitle = styled.h3`
  ${CommonLargeTextMixin}
  line-height: 1.5;
  font-family: NotoSansCJKtc;
`

const CheckoutGroupBuyingForm: React.FC<{
  title: string
  partnerCount: number
  onChange?: (newValue: string[]) => void
}> = ({ title, partnerCount, onChange }) => {
  const { formatMessage } = useIntl()
  const [memberIds, setMemberIds] = useState<(string | null)[]>(Array(partnerCount).fill(null))

  return (
    <Stat>
      <OrderedList className="mb-4">
        <ListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription1)}</ListItem>
        <ListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription2)}</ListItem>
        <ListItem>
          {formatMessage(checkoutMessages.text.groupBuyingDescription3_1)}
          <GroupBuyingRuleModal />
          {formatMessage(checkoutMessages.text.groupBuyingDescription3_2)}
        </ListItem>
      </OrderedList>

      <div className="mb-4">
        <StyledPlanTitle className="mb-3">
          {formatMessage(checkoutMessages.label.groupBuyingPlan, { title })}
        </StyledPlanTitle>

        {memberIds.map((_, i) => (
          <div key={i} className="col-12 col-lg-6 px-0 mb-3">
            <GroupBuyingPartnerInput
              existingMemberIds={memberIds.slice(0, i).filter(notEmpty)}
              onVerified={memberId => {
                setMemberIds(prevMemberIds => {
                  const newMemberIds = update(i, memberId, prevMemberIds)
                  onChange?.(newMemberIds.filter(notEmpty))
                  return newMemberIds
                })
              }}
            />
          </div>
        ))}
      </div>
    </Stat>
  )
}

export default CheckoutGroupBuyingForm
