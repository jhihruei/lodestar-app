import { useQuery } from '@apollo/react-hooks'
import { Button, Icon, Typography } from 'antd'
import gql from 'graphql-tag'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { notEmpty } from 'lodestar-app-element/src/helpers'
import { checkoutMessages } from 'lodestar-app-element/src/helpers/translation'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { getResourceByProductId } from 'lodestar-app-element/src/hooks/util'
import React, { useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import { BooleanParam, useQueryParam } from 'use-query-params'
import AdminCard from '../components/common/AdminCard'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { commonMessages } from '../helpers/translation'
import LoadingPage from './LoadingPage'
import NotFoundPage from './NotFoundPage'

const messages = defineMessages({
  orderSuccessHint: {
    id: 'common.text.orderSuccessHint',
    defaultMessage: '若你選擇「{method}」需於付款完成後，{waitingDays} 個工作日才會開通。',
  },
  orderTracking: { id: 'common.text.orderTracking', defaultMessage: '訂單查詢' },
})

const OrderPage: CustomVFC<{}, { order: hasura.GET_ORDERS_PRODUCT['order_log_by_pk'] }> = ({ render }) => {
  const { formatMessage } = useIntl()
  const { orderId } = useParams<{ orderId: string }>()
  const [withTracking] = useQueryParam('tracking', BooleanParam)
  const { settings, id: appId, loading: isAppLoading } = useApp()
  const { currentMemberId, isAuthenticating } = useAuth()
  const { loading: isOrderLoading, data } = useQuery<hasura.GET_ORDERS_PRODUCT, hasura.GET_ORDERS_PRODUCTVariables>(
    GET_ORDERS_PRODUCT,
    { variables: { orderId: orderId } },
  )
  const order = data?.order_log_by_pk

  const { resourceCollection: productResourceCollection } = useResourceCollection(
    order?.order_products.map(v => {
      const { type, target } = getResourceByProductId(v.product_id)
      return `${appId}:${type}:${target}`
    }) || [],
  )

  useEffect(() => {
    if (order && order.status === 'SUCCESS' && withTracking) {
      const productPrice = order.order_products_aggregate?.aggregate?.sum?.price || 0
      const discountPrice = order.order_discounts_aggregate?.aggregate?.sum?.price || 0
      const shippingFee = (order.shipping && order.shipping['fee']) || 0
      if (settings['tracking.fb_pixel_id']) {
        ReactPixel.track('Purchase', {
          value: productPrice - discountPrice - shippingFee,
          currency: 'TWD',
          content_type: order.order_products.length > 1 ? 'product_group' : 'product',
          contents: order.order_products.map(order_product => {
            const [productType, productId] = order_product.product_id.split('_')
            return {
              id: productId,
              content_type: productType,
              content_name: order_product.name,
              quantity: order_product.options ? order_product.options['quantity'] || 1 : 1,
              price: order_product.price,
            }
          }),
        })
      }
    }
  }, [order, settings, withTracking])

  if (isAppLoading || isOrderLoading || isAuthenticating) {
    return <LoadingPage />
  }
  if (!order) {
    return <NotFoundPage />
  }

  const orderSuccessHintFormat = (paymentMethod?: string) => {
    switch (paymentMethod) {
      case 'vacc':
        return (
          <Typography.Text className="mb-4">
            {formatMessage(messages.orderSuccessHint, {
              method: formatMessage(checkoutMessages.label.vacc),
              waitingDays: '1-2',
            })}
          </Typography.Text>
        )
      case 'cvs':
        return (
          <Typography.Text className="mb-4">
            {formatMessage(messages.orderSuccessHint, {
              method: formatMessage(checkoutMessages.label.cvs),
              waitingDays: '1-2',
            })}
          </Typography.Text>
        )
      case 'barcode':
        return (
          <Typography.Text className="mb-4">
            {formatMessage(messages.orderSuccessHint, {
              method: formatMessage(checkoutMessages.label.barcode),
              waitingDays: '等待 3-5',
            })}
          </Typography.Text>
        )
    }
  }

  return (
    render?.({ order }) || (
      <DefaultLayout noFooter>
        {order.status === 'SUCCESS' && withTracking && (
          <Tracking.Purchase
            orderId={order.id}
            products={productResourceCollection.filter(notEmpty).map((resource, idx) => ({
              ...resource,
              quantity: Number(order.order_products[idx].options?.quantity) || 1,
            }))}
            discounts={order.order_discounts.map(v => ({ name: v.name, price: v.price }))}
          />
        )}
        <div
          className="container d-flex align-items-center justify-content-center"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          <AdminCard style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
            <div className="d-flex flex-column align-items-center justify-content-center px-sm-5">
              {!order.status ? (
                <>
                  <Icon
                    className="mb-5"
                    type="check-circle"
                    theme="twoTone"
                    twoToneColor="#4ed1b3"
                    style={{ fontSize: '4rem' }}
                  />
                  <Typography.Title level={4} className="mb-3">
                    {formatMessage(commonMessages.title.purchasedItemPreparing)}
                  </Typography.Title>
                  <Typography.Text className="mb-4">{formatMessage(commonMessages.content.prepare)}</Typography.Text>
                  <Link to="/">
                    <Button>{formatMessage(commonMessages.button.home)}</Button>
                  </Link>
                </>
              ) : order.status === 'SUCCESS' ? (
                <>
                  <Icon
                    className="mb-5"
                    type="check-circle"
                    theme="twoTone"
                    twoToneColor="#4ed1b3"
                    style={{ fontSize: '4rem' }}
                  />
                  <Typography.Title level={4} className="mb-3">
                    {formatMessage(commonMessages.title.purchasedItemAvailable)}
                  </Typography.Title>
                  {orderSuccessHintFormat(order.payment_model?.method)}
                  <div className="d-flex justify-content-center flex-column flex-sm-row mt-2">
                    <Link to={`/members/${currentMemberId}`} className="mb-3 mb-sm-0 mr-sm-2">
                      <Button>{formatMessage(commonMessages.button.myPage)}</Button>
                    </Link>
                    <Link to="/settings/orders" className="ml-sm-2">
                      <Button>{formatMessage(messages.orderTracking)}</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Icon
                    className="mb-5"
                    type="close-circle"
                    theme="twoTone"
                    twoToneColor="#ff7d62"
                    style={{ fontSize: '4rem' }}
                  />
                  <Typography.Title level={4} className="mb-3">
                    {formatMessage(commonMessages.title.paymentFail)}
                  </Typography.Title>
                  <Typography.Title level={4} className="mb-3">
                    {formatMessage(commonMessages.title.creditCardConfirm)}
                  </Typography.Title>
                  <div className="d-flex justify-content-center flex-column flex-sm-row mt-2">
                    <Link to="/" className="mb-3 mb-sm-0 mr-sm-2">
                      <Button>{formatMessage(commonMessages.button.home)}</Button>
                    </Link>
                    <Link to="/settings/orders" className="ml-sm-2">
                      <Button>{formatMessage(commonMessages.ui.repay)}</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </AdminCard>
        </div>
      </DefaultLayout>
    )
  )
}

const GET_ORDERS_PRODUCT = gql`
  query GET_ORDERS_PRODUCT($orderId: String!) {
    order_log_by_pk(id: $orderId) {
      id
      message
      status
      payment_model
      custom_id
      order_discounts_aggregate {
        aggregate {
          sum {
            price
          }
        }
      }
      order_products_aggregate {
        aggregate {
          sum {
            price
          }
        }
      }
      order_products {
        id
        product_id
        name
        price
        options
      }
      order_discounts {
        type
        target
        name
        price
      }
      shipping
      invoice
    }
  }
`

export default OrderPage
