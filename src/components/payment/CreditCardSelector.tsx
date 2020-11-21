import { useQuery } from '@apollo/react-hooks'
import { Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import gql from 'graphql-tag'
import React from 'react'
import styled from 'styled-components'
import * as types from '../../types'

const StyledRadio = styled(Radio)`
  display: block !important;
  height: 48px;
  line-height: 48px !important;
`

export type CardHolder = {
  phoneNumber: string
  name: string
  email: string
  zipCode?: string
  address?: string
  nationalId?: string
}
type CreditCardSelectorProps = {
  memberId: string
  value?: string | null
  onChange?: (value: string | null) => void
}
const CreditCardSelector: React.FC<CreditCardSelectorProps> = ({ memberId, value, onChange }) => {
  const { memberCreditCards } = useMemberCreditCards(memberId)

  const handleCreditCardChange = (e: RadioChangeEvent) => {
    const value = e.target.value
    onChange && onChange(value === 'new' ? null : value)
  }

  return (
    <Radio.Group onChange={handleCreditCardChange} value={value === null ? 'new' : value}>
      {memberCreditCards.map(memberCreditCard => {
        return (
          <StyledRadio key={memberCreditCard.cardIdentifier} value={memberCreditCard.id}>
            末四碼：{memberCreditCard.cardInfo['last_four']}
          </StyledRadio>
        )
      })}
      <StyledRadio value="new">新增信用卡</StyledRadio>
    </Radio.Group>
  )
}

const useMemberCreditCards = (memberId: string) => {
  const { data } = useQuery<types.GET_MEMBER_CREDIT_CARDS, types.GET_MEMBER_CREDIT_CARDSVariables>(
    gql`
      query GET_MEMBER_CREDIT_CARDS($memberId: String!) {
        member_card(where: { member_id: { _eq: $memberId } }) {
          id
          card_identifier
          card_info
          card_holder
        }
      }
    `,
    { variables: { memberId } },
  )
  const memberCreditCards =
    data?.member_card.map(memberCreditCard => ({
      id: memberCreditCard.id,
      cardInfo: memberCreditCard.card_info,
      cardIdentifier: memberCreditCard.card_identifier,
      cardHolder: memberCreditCard.card_holder,
    })) || []

  return { memberCreditCards }
}

export default CreditCardSelector
