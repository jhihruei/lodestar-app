import { notification } from 'antd'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { createHttpLink } from 'apollo-link-http'
import { v4 as uuidv4 } from 'uuid'

type ApolloClientOptions = {
  appId: string
  authToken: string | null
}
// create onError link
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  graphQLErrors &&
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`, extensions)
      if (extensions && extensions.code === 'invalid-jwt') {
        notification.info({ message: '連線已過期，將重新整理此畫面' })
        setTimeout(() => window.location.assign('/'), 3000)
      }
    })

  networkError && console.log(`[Network error]: ${JSON.stringify(networkError)}`)
})

// create auth context link
const withAuthTokenLink = ({ appId, authToken }: ApolloClientOptions) =>
  setContext(() =>
    authToken
      ? {
          headers: { authorization: `Bearer ${authToken}` },
        }
      : {
          headers: {
            'x-hasura-app-id': appId,
            'x-hasura-user-id': uuidv4(),
            'x-hasura-role': 'anonymous',
          },
        },
  )

// create http link:
const httpLink = createHttpLink({ uri: `${process.env.REACT_APP_GRAPHQL_ENDPOINT}/v1/graphql` })

// create ws link
// const wsLink = new WebSocketLink({
//   uri: `wss://${new URL(process.env.REACT_APP_GRAPHQL_ENDPOINT).host}/v1/graphql`,
//   options: {
//     reconnect: true,
//   },
// })

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query)
//     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
//   },
//   wsLink,
//   httpLink,
// )

export const createApolloClient = (options: ApolloClientOptions) => {
  const apolloClient = new ApolloClient({
    link: ApolloLink.from([onErrorLink, withAuthTokenLink(options), httpLink]),
    cache: new InMemoryCache(),
  })
  return apolloClient
}
