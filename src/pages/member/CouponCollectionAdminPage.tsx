import { Tabs, Typography } from 'antd'
import { reverse } from 'ramda'
import React, { useState } from 'react'
import Icon from 'react-inlinesvg'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
import CouponAdminCard from '../../components/checkout/CouponAdminCard'
import CouponInsertionCard from '../../components/checkout/CouponInsertionCard'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { usersMessages } from '../../helpers/translation'
import { useCouponCollection } from '../../hooks/data'
import TicketIcon from '../../images/ticket.svg'

const CouponCollectionAdminPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { coupons } = useCouponCollection(currentMemberId || '')
  const [activeKey, setActiveKey] = useState('available')

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
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon src={TicketIcon} className="mr-3" />
        <span>{formatMessage(usersMessages.title.coupon)}</span>
      </Typography.Title>

      <div className="mb-5">
        <CouponInsertionCard onInsert={() => window.location.reload()} />
      </div>

      <Tabs activeKey={activeKey || 'available'} onChange={key => setActiveKey(key)}>
        {tabContents.map(tabContent => (
          <Tabs.TabPane key={tabContent.key} tab={tabContent.tab}>
            <div className="row">
              {reverse(tabContent.coupons).map(coupon => (
                <div className="mb-3 col-12 col-md-6" key={coupon.id}>
                  <CouponAdminCard coupon={coupon} outdated={coupon.status.outdated} />
                </div>
              ))}
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </MemberAdminLayout>
  )
}

export default CouponCollectionAdminPage
