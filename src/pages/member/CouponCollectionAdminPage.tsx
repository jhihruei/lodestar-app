import { Tab, TabPanels, Tabs } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { reverse } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import CouponAdminCard from '../../components/checkout/CouponAdminCard'
import CouponInsertionCard from '../../components/checkout/CouponInsertionCard'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { usersMessages } from '../../helpers/translation'
import { useCouponCollection } from '../../hooks/data'
import { ReactComponent as TicketIcon } from '../../images/ticket.svg'
import { StyledTabList, StyledTabPanel } from '../GroupBuyingCollectionPage'

const CouponCollectionAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { currentMemberId, isAuthenticated, isAuthenticating } = useAuth()
  const { coupons } = useCouponCollection(currentMemberId || '')
  const [activeKey, setActiveKey] = useState('available')

  useEffect(() => {
    if (!isAuthenticating && !isAuthenticated && !currentMemberId) {
      history.push('/')
    }
  }, [currentMemberId, isAuthenticated, isAuthenticating, history])

  const tabContents = [
    {
      key: 'available',
      tab: formatMessage(usersMessages.tab.available),
      coupons: coupons.filter(coupon => !coupon.status.outdated && !coupon.status.used),
    },
    {
      key: 'notYet',
      tab: formatMessage(usersMessages.tab.notYet),
      coupons: coupons.filter(
        coupon =>
          coupon.couponCode.couponPlan.startedAt &&
          coupon.couponCode.couponPlan.startedAt.getTime() > Date.now() &&
          !coupon.status.used,
      ),
    },
    {
      key: 'expired',
      tab: formatMessage(usersMessages.tab.expired),
      coupons: coupons.filter(
        coupon =>
          (coupon.couponCode.couponPlan.endedAt && coupon.couponCode.couponPlan.endedAt.getTime() < Date.now()) ||
          coupon.status.used,
      ),
    },
  ]

  return (
    <MemberAdminLayout content={{ icon: TicketIcon, title: formatMessage(usersMessages.title.coupon) }}>
      <div className="mb-5">
        <CouponInsertionCard onInsert={() => window.location.reload()} />
      </div>

      <Tabs colorScheme="primary">
        <StyledTabList>
          {tabContents.map(v => (
            <Tab key={v.key} onClick={() => setActiveKey(v.key)} isSelected={v.key === activeKey}>
              {v.tab}
            </Tab>
          ))}
        </StyledTabList>

        <TabPanels>
          {tabContents.map(v => (
            <StyledTabPanel className="row">
              {reverse(v.coupons).map(coupon => (
                <div className="mb-3 col-12 col-md-6" key={coupon.id}>
                  <CouponAdminCard coupon={coupon} outdated={coupon.status.outdated} />
                </div>
              ))}
            </StyledTabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </MemberAdminLayout>
  )
}

export default CouponCollectionAdminPage
