'use client'

import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from './react-query'

type QueryProviderProps = {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
