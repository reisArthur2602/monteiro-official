import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}
