# Integrations — TanStack Query

Configuração centralizada de cache e sincronização de estado para requisições HTTP.

## Estrutura

Esta pasta contém:

- `react-query.ts` - Configuração central do QueryClient
- `query-provider.tsx` - Provider para envolver a aplicação
- `index.ts` - Exports centralizados

## Configurações padrão

- **staleTime**: 5 minutos - Tempo que os dados permanecem frescos
- **gcTime** (formerly cacheTime): 10 minutos - Tempo até limpeza de cache
- **retry**: 1 tentativa em caso de falha
- **retryDelay**: Backoff exponencial até 30 segundos

## Setup inicial

Integre o `QueryProvider` no `app/layout.tsx`:

```tsx
import { QueryProvider } from '@/integrations'

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={cn(...)}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
```

## Usando useQuery

Em qualquer Client Component, use `useQuery` para buscar dados:

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { getCase } from '@/app/cases/queries/get-case'

export const CaseDetail = ({ caseId }: { caseId: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => getCase(caseId),
  })

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar</div>

  return <div>{data?.title}</div>
}
```

## Usando useMutation

Para operações que modificam dados (POST, PUT, DELETE):

```tsx
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCase } from '@/app/cases/actions/update-case'

export const UpdateCaseForm = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })

  const handleSubmit = async (data) => {
    await mutation.mutateAsync(data)
  }

  return (
    // form aqui
  )
}
```

## Query Keys

Use nomes descritivos e consistent para `queryKey`:

- `['cases']` - lista de todos os casos
- `['case', id]` - um caso específico
- `['case-documents', caseId]` - documentos de um caso
- `['users', userId]` - um usuário específico
- `['users', userId, 'profile']` - perfil de um usuário

Hierarquize as chaves para facilitar invalidação:

```tsx
// Invalida apenas um caso específico
queryClient.invalidateQueries({ queryKey: ['case', caseId] })

// Invalida todos os casos
queryClient.invalidateQueries({ queryKey: ['cases'] })
```

## Padrão de query + action

Combine queries (leitura) com Server Actions (escrita):

```tsx
// query: app/cases/queries/get-case.ts
export const getCase = async (caseId: string) => {
  return await prisma.case.findUnique({
    where: { id: caseId },
  })
}

// action: app/cases/actions/update-case.ts
'use server'
export const updateCase = async (input: UpdateCaseInput) => {
  // validar, atualizar, etc
  return result
}

// component: app/cases/feature/update-case-form.tsx
'use client'
export const UpdateCaseForm = ({ caseId }: { caseId: string }) => {
  const { data: caseData } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => getCase(caseId),
  })

  const mutation = useMutation({
    mutationFn: updateCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case', caseId] })
    },
  })
}
```

## Observações importantes

- Queries sempre vêm de funções em `queries/`
- Mutations sempre vêm de Server Actions em `actions/`
- Sempre use `queryClient.invalidateQueries()` após mutações bem-sucedidas
- Mantenha as query keys consistentes entre componentes
- Não use query keys genéricas como `['data']` ou `['result']`

## Referências

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [useQuery API](https://tanstack.com/query/latest/docs/react/useQuery)
- [useMutation API](https://tanstack.com/query/latest/docs/react/useMutation)
- [Query Invalidation](https://tanstack.com/query/latest/docs/react/guides/important-defaults#_default-side-effects)
