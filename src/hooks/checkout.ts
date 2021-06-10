import { useQuery } from '@apollo/react-hooks'
import Axios from 'axios'
import gql from 'graphql-tag'
import { prop, sum } from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { useAuth } from '../components/auth/AuthContext'
import { InvoiceProps } from '../components/checkout/InvoiceInput'
import { PaymentProps } from '../components/checkout/PaymentSelector'
import { ShippingProps } from '../components/checkout/ShippingInput'
import { useApp } from '../containers/common/AppContext'
import hasura from '../hasura'
import { CheckProps, OrderDiscountProps, OrderProductProps, shippingOptionProps } from '../types/checkout'
import { MemberShopProps } from '../types/merchandise'

export const useCheck = ({
  productIds,
  discountId,
  shipping,
  options,
}: {
  productIds: string[]
  discountId: string | null
  shipping: ShippingProps | null
  options: { [ProductId: string]: any }
}) => {
  const { authToken, apiHost } = useAuth()
  const { id: appId } = useApp()
  const [check, setCheck] = useState<CheckProps>({ orderProducts: [], orderDiscounts: [], shippingOption: null })
  const [orderChecking, setOrderChecking] = useState(false)
  const [orderPlacing, setOrderPlacing] = useState(false)
  const [checkError, setCheckError] = useState<Error | null>(null)

  useEffect(() => {
    setOrderChecking(true)
    Axios.post<{
      code: string
      message: string
      result: {
        orderProducts: OrderProductProps[]
        orderDiscounts: OrderDiscountProps[]
        shippingOption: shippingOptionProps
      }
    }>(
      `https://${apiHost}/payment/checkout-order`,
      {
        appId,
        productIds,
        discountId,
        shipping,
        options,
      },
      {
        headers: { authorization: `Bearer ${authToken}` },
      },
    )
      .then(({ data: { code, message, result } }) => {
        if (code === 'SUCCESS') {
          setCheck(result)
        } else {
          setCheckError(new Error(message))
        }
      })
      .catch(setCheckError)
      .finally(() => setOrderChecking(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appId,
    authToken,
    apiHost,
    discountId,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(productIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(shipping),
  ])

  const placeOrder = useCallback(
    async (
      paymentType: 'perpetual' | 'subscription' | 'groupBuying',
      invoice: InvoiceProps,
      payment?: PaymentProps,
    ) => {
      setOrderPlacing(true)
      return Axios.post<{ code: string; message: string; result: { id: string } }>(
        `https://${apiHost}/tasks/order`,
        {
          paymentModel: { type: paymentType, gateway: payment?.gateway, method: payment?.method },
          productIds,
          discountId,
          shipping,
          invoice,
          options,
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
        .then(({ data: { code, result, message } }) => {
          if (code === 'SUCCESS') {
            ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 4 })
            ReactGA.ga('send', 'pageview')

            return result.id
          } else {
            throw new Error(message)
          }
        })
        .finally(() => setOrderPlacing(false))
    },
    [authToken, apiHost, discountId, options, productIds, shipping],
  )

  return {
    check,
    checkError,
    orderPlacing,
    orderChecking,
    placeOrder,
    totalPrice:
      sum(check.orderProducts.map(prop('price'))) -
      sum(check.orderDiscounts.map(prop('price'))) +
      (check.shippingOption?.fee || 0),
  }
}

export const useOrderProduct = (orderProductId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_ORDER_PRODUCT, hasura.GET_ORDER_PRODUCTVariables>(
    gql`
      query GET_ORDER_PRODUCT($orderProductId: uuid!) {
        order_product_by_pk(id: $orderProductId) {
          id
          name
          description
          created_at
          product {
            id
            type
            target
          }
          order_log {
            id
            member_id
            invoice
          }
        }
      }
    `,
    { variables: { orderProductId } },
  )

  const orderProduct: {
    id: string
    name: string
    description: string
    createAt: Date | null
    product: {
      id: string
      type: string
      target: string
    }
    memberId: string
    invoice: any
  } =
    loading || error || !data || !data.order_product_by_pk
      ? {
          id: '',
          name: '',
          description: '',
          createAt: null,
          product: {
            id: '',
            type: '',
            target: '',
          },
          memberId: '',
          invoice: {},
        }
      : {
          id: data.order_product_by_pk.id,
          name: data.order_product_by_pk.name,
          description: data.order_product_by_pk.description || '',
          createAt: new Date(data.order_product_by_pk.created_at),
          product: data.order_product_by_pk.product,
          memberId: data.order_product_by_pk.order_log.member_id,
          invoice: data.order_product_by_pk.order_log.invoice,
        }

  return {
    loadingOrderProduct: loading,
    errorOrderProduct: error,
    orderProduct,
    refetchOrderProduct: refetch,
  }
}

export const useMemberShop = (id: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_MEMBER_SHOP, hasura.GET_MEMBER_SHOPVariables>(
    gql`
      query GET_MEMBER_SHOP($shopId: uuid!) {
        member_shop_by_pk(id: $shopId) {
          id
          title
          shipping_methods
          member {
            id
            picture_url
          }
        }
      }
    `,
    { variables: { shopId: id } },
  )

  const memberShop: MemberShopProps | null =
    loading || error || !data || !data.member_shop_by_pk
      ? null
      : {
          id: data.member_shop_by_pk.id,
          title: data.member_shop_by_pk.title,
          shippingMethods: data.member_shop_by_pk.shipping_methods,
          pictureUrl: data.member_shop_by_pk.member?.picture_url,
        }

  return {
    loadingMemberShop: loading,
    errorMemberShop: error,
    memberShop,
    refetchMemberShop: refetch,
  }
}

export const useCartProjectPlanCollection = (cartProjectPlanIds: string[]) => {
  const { loading, error, data } = useQuery<
    hasura.GET_CART_PROJECT_PLAN_COLLECTION,
    hasura.GET_CART_PROJECT_PLAN_COLLECTIONVariables
  >(
    gql`
      query GET_CART_PROJECT_PLAN_COLLECTION($cartProjectPlanIds: [uuid!]!) {
        project_plan(where: { id: { _in: $cartProjectPlanIds } }) {
          id
          is_physical
        }
      }
    `,
    {
      variables: {
        cartProjectPlanIds,
      },
    },
  )

  const cartProjectPlans =
    loading || error || !data
      ? []
      : data.project_plan.map(projectPlan => ({
          id: projectPlan.id,
          isPhysical: projectPlan.is_physical,
        }))

  return {
    loading,
    error,
    cartProjectPlans,
  }
}

export const usePhysicalProductCollection = (productIds: string[]) => {
  const { loading, error, data } = useQuery<hasura.GET_PHYSICAL_PRODUCTS, hasura.GET_PHYSICAL_PRODUCTSVariables>(
    gql`
      query GET_PHYSICAL_PRODUCTS($productIds: [uuid!]!) {
        project_plan_aggregate(where: { id: { _in: $productIds }, is_physical: { _eq: true } }) {
          aggregate {
            count
          }
        }
        merchandise_spec_aggregate(where: { id: { _in: $productIds }, merchandise: { is_physical: { _eq: true } } }) {
          aggregate {
            count
          }
        }
      }
    `,
    {
      variables: {
        productIds,
      },
    },
  )

  const hasPhysicalProduct =
    loading || error || !data
      ? false
      : !!data?.project_plan_aggregate?.aggregate?.count || !!data?.merchandise_spec_aggregate?.aggregate?.count

  return {
    loading,
    error,
    hasPhysicalProduct,
  }
}
