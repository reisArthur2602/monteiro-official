# Padrões de Desenvolvimento — Next.js

Este documento define os padrões obrigatórios para desenvolvimento neste projeto.

O projeto utiliza:

- Next.js com App Router.
- TypeScript.
- Prisma ORM.
- Server Actions.
- React Hook Form.
- Zod.
- shadcn/ui.
- Sonner.
- Autenticação com cookie HTTP-only, JWT e bcrypt.

Este é um projeto Next.js único. Não utilize estrutura de monorepo, workspaces ou pacotes internos separados, salvo se isso for solicitado explicitamente no futuro.

---

## 1. Prioridade das regras

Ao implementar ou alterar código, siga esta ordem de prioridade:

1. Segurança e integridade dos dados.
2. Regras de negócio.
3. Autenticação e autorização.
4. Arquitetura do projeto.
5. Reutilização de componentes existentes.
6. Convenções de código e estilo.

Quando uma regra deste documento entrar em conflito com uma limitação técnica do projeto:

- Não contorne a regra silenciosamente.
- Não introduza uma solução insegura.
- Explique o conflito.
- Aplique a solução mais segura e compatível com a arquitetura existente.

---

## 2. Convenções de nomes

Use sempre `kebab-case` para nomes de arquivos e pastas criadas para features.

Exemplos corretos:

```text
upload-dialog.tsx
user-form.tsx
delete-upload.ts
upload-columns.tsx
process-row-actions.tsx
```

Evite:

```text
UploadDialog.tsx
userForm.tsx
DeleteUpload.ts
```

Para código TypeScript:

- Componentes React: `PascalCase`.
- Tipos e interfaces: `PascalCase`.
- Variáveis e funções: `camelCase`.
- Constantes globais imutáveis: `UPPER_SNAKE_CASE`, quando apropriado.
- Schemas Zod: `camelCase` com sufixo `Schema`.
- Tipos inferidos de schema: `PascalCase`.

Exemplo:

```ts
export const createUploadSchema = z.object({
  name: z.string().min(1, 'Informe o nome'),
})

export type CreateUploadInput = z.infer<typeof createUploadSchema>
```

---

## 3. Imports

Use o alias `@/` para imports fora da pasta atual.

Correto:

```ts
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth/verify-auth'
```

Evite cadeias longas:

```ts
import { prisma } from '../../../../lib/prisma'
```

Regras:

- Use `import type` quando o import for utilizado apenas como tipo.
- Evite arquivos `index.ts` usados apenas para reexportar tudo.
- Não crie barrel files que possam causar dependências circulares.
- Mantenha imports externos antes dos imports internos.
- Mantenha imports relativos da própria feature por último.

Exemplo:

```ts
import type { Upload } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

import { UploadTable } from './upload-table'
```

---

## 4. Organização por feature

Cada domínio funcional deve manter seus arquivos próximos da rota ou do grupo de rotas ao qual pertence.

Exemplo:

```text
src/
└── app/
    └── cases/
        ├── page.tsx
        ├── loading.tsx
        ├── error.tsx
        ├── actions/
        │   ├── create-case.ts
        │   ├── update-case.ts
        │   └── delete-case.ts
        ├── queries/
        │   ├── list-cases.ts
        │   ├── get-case.ts
        │   ├── count-cases.ts
        │   └── list-case-documents.ts
        ├── schemas/
        │   ├── create-case-schema.ts
        │   └── update-case-schema.ts
        ├── types/
        │   └── case-list-item.ts
        ├── utils/
        │   └── format-case-number.ts
        └── feature/
            ├── case-form.tsx
            ├── case-list.tsx
            ├── case-card.tsx
            └── case-actions-menu.tsx
```

Regras:

- Componentes específicos da rota devem ficar em `feature`.
- Server Actions da rota devem ficar em `actions`.
- Consultas de leitura devem ficar em `queries`.
- Schemas exclusivos da feature podem ficar em `schemas` dentro da própria rota.
- Tipos exclusivos da feature podem ficar em `types`.
- Utilitários exclusivos da feature podem ficar em `utils`.
- Componentes compartilhados entre várias features devem ir para `components/shared`.
- Componentes visuais básicos devem ir para `components/ui`.
- Schemas, tipos e utilitários só devem ser movidos para pastas globais quando forem realmente usados por vários domínios.
- Não crie pastas vazias para antecipar necessidades futuras.
- Não mova arquivos para pastas globais apenas para reduzir a quantidade de arquivos dentro da rota.
- Preserve a coesão da feature.

A estrutura é uma referência. Crie somente as pastas necessárias para cada domínio.

## 5. Estrutura principal do projeto

Estrutura de referência para uma aplicação Next.js única:

```text
src/
├── app/
│   ├── login/
│   │   ├── page.tsx
│   │   ├── actions/
│   │   │   └── login.ts
│   │   ├── schemas/
│   │   │   └── login-schema.ts
│   │   └── feature/
│   │       └── login-form.tsx
│   └── cases/
│       ├── page.tsx
│       ├── loading.tsx
│       ├── error.tsx
│       ├── actions/
│       │   ├── create-case.ts
│       │   ├── update-case.ts
│       │   └── delete-case.ts
│       ├── queries/
│       │   ├── list-cases.ts
│       │   ├── get-case.ts
│       │   └── count-cases.ts
│       ├── schemas/
│       │   ├── create-case-schema.ts
│       │   └── update-case-schema.ts
│       ├── types/
│       │   └── case-list-item.ts
│       └── feature/
│           ├── case-form.tsx
│           ├── case-list.tsx
│           └── case-actions-menu.tsx
├── components/
│   ├── ui/
│   └── shared/
├── lib/
│   ├── auth/
│   │   ├── get-session.ts
│   │   ├── redirect-auth.ts
│   │   ├── redirect-role.ts
│   │   ├── verify-auth.ts
│   │   ├── verify-role.ts
│   │   └── token.ts
│   ├── action-result.ts
│   ├── env.ts
│   └── prisma.ts
└── proxy.ts
```

Este projeto não usa:

- monorepo;
- workspaces;
- pacotes internos separados;
- pastas `packages`;
- configurações compartilhadas entre aplicações.

Adapte a estrutura à necessidade real da feature. Não crie arquivos ou diretórios sem uso.

## 6. Pages, layouts e Client Components

Toda `page.tsx` deve continuar sendo um Server Component.

Não use `"use client"` diretamente em:

```text
page.tsx
layout.tsx
loading.tsx
error.tsx
```

Exceção: `error.tsx` pode exigir Client Component conforme a necessidade do Next.js. Nesse caso, mantenha apenas a responsabilidade de tratamento da interface de erro.

Quando houver necessidade de:

- estado;
- eventos;
- hooks;
- React Hook Form;
- TanStack Table;
- APIs do navegador;
- `useTransition`;
- `useOptimistic`;
- `useEffect`;

crie um componente separado dentro de `feature`.

Exemplo:

```tsx
import { UploadData } from './feature/upload-data'

const UploadPage = async () => {
  return <UploadData />
}

export default UploadPage
```

As pages devem ser pequenas e responsáveis principalmente por:

- composição;
- autenticação;
- leitura de `params`;
- leitura de `searchParams`;
- carregamento inicial;
- definição de metadados, quando necessário.

Não faça uma page inteira virar Client Component apenas porque uma pequena parte da tela precisa de interação.

---

## 7. Componentização

Componentize quando o trecho possuir pelo menos uma destas características:

- responsabilidade própria;
- estado próprio;
- lógica relevante;
- reutilização real;
- comportamento de formulário;
- comportamento de diálogo;
- configuração complexa;
- melhora clara na leitura do arquivo pai.

Evite abstrações desnecessárias.

Não extraia componentes triviais que apenas adicionem indireção sem melhorar manutenção, legibilidade ou reutilização.

Considere dividir um arquivo quando:

- ele acumular múltiplas responsabilidades;
- tiver lógica de dados e apresentação misturadas;
- possuir células de tabela complexas;
- possuir formulários, diálogos ou filtros independentes;
- ficar difícil de entender ou testar.

Separe, quando necessário:

- apresentação;
- carregamento de dados;
- validação;
- mutations;
- autorização;
- serialização;
- configuração de tabela.

Use componentes existentes antes de criar novos.

---

## 8. Componentes de UI e uso obrigatório do shadcn/ui

O shadcn/ui é a biblioteca padrão de componentes visuais deste projeto.

Sempre use os componentes do shadcn/ui antes de criar componentes visuais próprios.

A prioridade obrigatória é:

1. Reutilizar um componente já existente em `components/ui`.
2. Verificar se o shadcn/ui oferece o componente necessário.
3. Adicionar o componente oficial do shadcn/ui ao projeto.
4. Adaptar o componente existente por composição, variantes ou propriedades.
5. Criar um componente compartilhado em `components/shared` quando houver regra de negócio ou composição reutilizável.
6. Criar um componente visual próprio somente quando nenhuma opção anterior atender à necessidade.

Todos os componentes visuais reutilizáveis e sem regra de negócio devem ficar em:

```text
src/components/ui/
```

Exemplos:

- button;
- input;
- textarea;
- select;
- checkbox;
- radio-group;
- switch;
- dialog;
- alert-dialog;
- drawer;
- sheet;
- dropdown-menu;
- popover;
- tooltip;
- table;
- badge;
- card;
- tabs;
- separator;
- skeleton;
- pagination;
- field.

Componentes reutilizáveis que possuem contexto, composição ou regra de negócio devem ficar em:

```text
src/components/shared/
```

Exemplos:

- seletor de cliente;
- seletor de processo;
- visualizador de documento;
- cabeçalho autenticado;
- menu do usuário;
- campo de busca reutilizado por várias features;
- seletor de responsável;
- seletor de área jurídica.

Regras obrigatórias:

- Não recrie manualmente um componente que já exista no shadcn/ui.
- Não crie versões paralelas como `custom-button`, `base-dialog` ou `my-select` sem necessidade real.
- Não use elementos HTML puros no lugar de componentes existentes do shadcn/ui quando o componente da biblioteca for aplicável.
- Não instale outra biblioteca de componentes para resolver algo já atendido pelo shadcn/ui.
- Não copie componentes de outras bibliotecas para `components/ui`.
- Preserve a API e a estrutura dos componentes do shadcn/ui sempre que possível.
- Personalizações devem priorizar composição, `className`, variantes e tokens do Design System.
- Não altere globalmente um componente de UI sem verificar o impacto nas telas que já o utilizam.
- Não coloque regra de negócio dentro de `components/ui`.
- Não coloque acesso ao banco, autenticação ou mutations em componentes de UI.
- Use Lucide para ícones, salvo se o Design System definir outra fonte.
- Botões somente com ícone devem possuir nome acessível com `aria-label` ou texto visualmente oculto.
- Consulte o Design System antes de adicionar estilos, tamanhos, espaçamentos ou variantes novos.

Antes de criar qualquer componente visual:

1. Pesquise em `components/ui`.
2. Pesquise na documentação do shadcn/ui.
3. Verifique se o componente pode ser composto a partir de componentes existentes.
4. Verifique se a necessidade é visual ou contém regra de negócio.
5. Crie um novo componente somente como último recurso.

### Instalação de componentes

Quando um componente oficial ainda não estiver no projeto, adicione-o pelo CLI do shadcn/ui conforme a configuração existente.

Exemplo:

```bash
npx shadcn@latest add field
```

Não sobrescreva silenciosamente componentes já modificados.

Antes de adicionar ou atualizar um componente:

- verifique se o arquivo já existe;
- preserve customizações compatíveis com o Design System;
- revise os arquivos modificados pelo CLI;
- não aceite alterações destrutivas automaticamente.

### Uso obrigatório de `Field` em formulários

Todos os campos de formulário devem utilizar a família de componentes `Field` do shadcn/ui.

Importe de:

```tsx
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
```

Estrutura padrão de um campo:

```tsx
<Field data-invalid={Boolean(error)}>
  <FieldLabel htmlFor="title">Título</FieldLabel>

  <Input
    id="title"
    aria-invalid={Boolean(error)}
    {...register('title')}
  />

  <FieldDescription>
    Informe um título que facilite a identificação.
  </FieldDescription>

  {error ? <FieldError>{error.message}</FieldError> : null}
</Field>
```

Responsabilidades:

- `Field`: agrupar um único controle, seu label, descrição e erro.
- `FieldLabel`: identificar o controle de forma acessível.
- `FieldDescription`: fornecer ajuda ou contexto adicional.
- `FieldError`: apresentar o erro de validação.
- `FieldGroup`: organizar campos relacionados.
- `FieldSet`: agrupar semanticamente uma seção do formulário.
- `FieldLegend`: nomear uma seção agrupada.
- `FieldSeparator`: separar visualmente grupos quando necessário.
- `FieldContent`: organizar label, descrição e controle em layouts específicos.
- `FieldTitle`: apresentar um título interno quando o padrão de label não for suficiente.

Regras para formulários:

- Não monte campos repetindo manualmente `Label`, controle, descrição e texto de erro quando `Field` puder ser usado.
- Todo controle deve possuir `FieldLabel` ou outro nome acessível equivalente.
- Use o mesmo valor em `htmlFor` e `id`.
- Use `aria-invalid` no controle quando houver erro.
- Use `data-invalid` no `Field` quando houver erro.
- Renderize erros com `FieldError`.
- Use `FieldDescription` para instruções, formatos esperados e textos auxiliares.
- Não use placeholder como substituto de label.
- Use `FieldGroup` para conjuntos de campos relacionados.
- Use `FieldSet` e `FieldLegend` quando o agrupamento possuir significado semântico.
- Use `orientation="horizontal"` ou `orientation="responsive"` somente quando o layout justificar.
- Preserve navegação por teclado e leitura por tecnologias assistivas.
- Integre o `Field` com React Hook Form e Zod.
- Erros vindos da validação server-side também devem ser associados ao campo correspondente quando possível.

Exemplo com React Hook Form:

```tsx
const {
  register,
  formState: { errors },
} = useForm<CreateCaseInput>({
  resolver: zodResolver(createCaseSchema),
})

<Field data-invalid={Boolean(errors.title)}>
  <FieldLabel htmlFor="title">Título</FieldLabel>

  <Input
    id="title"
    aria-invalid={Boolean(errors.title)}
    {...register('title')}
  />

  {errors.title ? (
    <FieldError>{errors.title.message}</FieldError>
  ) : null}
</Field>
```

Para componentes controlados, como `Select`, `Combobox`, `DatePicker` ou controles complexos, use `Controller` do React Hook Form e mantenha a mesma estrutura com `Field`.

### Componentes específicos e componentes compartilhados

Use `components/ui` somente para primitives e componentes visuais genéricos.

Use `components/shared` para composições reutilizáveis com significado no sistema.

Exemplo:

```text
components/
├── ui/
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── field.tsx
│   └── select.tsx
└── shared/
    ├── client-select.tsx
    ├── case-status-badge.tsx
    └── user-menu.tsx
```

Um componente específico de uma única feature deve continuar dentro de:

```text
app/<feature>/feature/
```

Não mova um componente para `components/shared` até existir reutilização real em mais de uma feature.

## 9. Carregamento e estados de erro

Use os recursos do App Router quando forem úteis:

```text
loading.tsx
error.tsx
not-found.tsx
```

Regras:

- Use `loading.tsx` para estados de carregamento da rota.
- Use Skeletons em vez de textos genéricos como “Carregando...”, quando fizer sentido visual.
- Use `notFound()` para recursos inexistentes.
- Não revele detalhes internos de erro para o usuário.

---

## 10. Listagens e apresentação de dados

Não existe, por enquanto, uma biblioteca obrigatória para tabelas ou listagens.

Escolha a solução mais simples compatível com a necessidade real da interface.

Uma listagem pode ser apresentada com:

- tabela HTML;
- componentes de tabela do shadcn/ui;
- cards;
- lista;
- grid;
- outro componente já existente no projeto.

Regras:

- Não introduza TanStack Table sem solicitação explícita.
- Não crie automaticamente arquivos com sufixos `data`, `table` e `columns`.
- Não force uma estrutura de tabela quando uma lista ou conjunto de cards for mais adequado.
- Separe componentes apenas quando houver responsabilidade própria.
- Extraia ações complexas de cada item para um componente dedicado quando necessário.
- Mantenha busca, filtro, ordenação e paginação coerentes com o volume de dados.
- Não faça consultas ao banco dentro de componentes Client.
- As consultas devem estar em arquivos separados dentro de `queries`.

Exemplo simples:

```text
feature/
├── case-list.tsx
├── case-card.tsx
└── case-actions-menu.tsx
```

A adoção futura de uma biblioteca de tabela deve ser registrada neste documento antes de se tornar um padrão obrigatório.

## 11. Paginação e filtros

Não carregue todos os registros do banco quando a quantidade puder crescer significativamente.

Use `searchParams` quando busca, filtro, ordenação ou paginação precisarem ser refletidos na URL.

A page deve interpretar os parâmetros e chamar uma query separada.

Exemplo:

```tsx
import { listCases } from './queries/list-cases'

type CasesPageProps = {
  searchParams: Promise<{
    page?: string
    query?: string
  }>
}

const CasesPage = async ({ searchParams }: CasesPageProps) => {
  const params = await searchParams

  const result = await listCases({
    page: params.page,
    query: params.query,
  })

  return <CaseList result={result} />
}

export default CasesPage
```

A consulta Prisma deve permanecer no arquivo de query:

```ts
const page = Math.max(Number(input.page ?? 1), 1)
const pageSize = 20

const [cases, total] = await prisma.$transaction([
  prisma.case.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  }),
  prisma.case.count({
    where,
  }),
])
```

Regras:

- Use paginação server-side quando o conjunto puder crescer.
- Use `skip` e `take` em listagens administrativas comuns.
- Considere paginação por cursor para grandes volumes ou carregamento contínuo.
- Valide e normalize todos os parâmetros recebidos pela URL.
- Defina limites máximos de `pageSize`.
- Não permita que o cliente escolha uma quantidade ilimitada de registros.
- A query deve retornar dados e metadados de paginação já preparados.

## 12. Queries e acesso de leitura ao banco

Toda consulta de leitura ao banco deve ficar em um arquivo separado dentro da pasta `queries` da feature correspondente.

Exemplo:

```text
src/
└── app/
    └── cases/
        └── queries/
            ├── list-cases.ts
            ├── get-case.ts
            ├── count-cases.ts
            ├── get-case-summary.ts
            └── list-case-documents.ts
```

Use nomes que expressem uma única responsabilidade:

- `list-cases.ts`;
- `get-case.ts`;
- `count-cases.ts`;
- `find-client-by-cpf.ts`;
- `exists-user-by-email.ts`;
- `list-case-deadlines.ts`.

Evite nomes genéricos:

```text
case-data.ts
case-service.ts
queries.ts
database.ts
helpers.ts
```

Regras:

- Uma query por arquivo.
- Uma responsabilidade principal por query.
- Não coloque mutations em `queries`.
- Não coloque consultas Prisma diretamente em pages, layouts ou componentes React.
- Pages, layouts e Server Components devem chamar funções exportadas por `queries`.
- Server Actions podem chamar queries quando precisarem ler dados, mas mutations continuam em `actions`.
- Não duplique a mesma consulta em vários arquivos.
- Não crie uma query genérica que busque dados não relacionados apenas para reduzir chamadas.
- Aplique autenticação e autorização dentro da query quando os dados forem protegidos.
- Se uma query depender do usuário autenticado, derive o usuário da sessão no servidor.
- Nunca receba `userId` do cliente como substituto da sessão.
- Use `select` para buscar somente os campos necessários.
- Retorne DTOs serializáveis quando o resultado for enviado ao cliente.

Exemplo:

```ts
import { cache } from 'react'

import { verifyAuth } from '@/lib/auth/verify-auth'
import { prisma } from '@/lib/prisma'

type ListCasesInput = {
  page?: string
  query?: string
}

export const listCases = cache(async (input: ListCasesInput) => {
  const user = await verifyAuth()

  const page = Math.max(Number(input.page ?? 1), 1)
  const pageSize = 20
  const query = input.query?.trim()

  const where = {
    createdById: user.id,
    ...(query
      ? {
          title: {
            contains: query,
            mode: 'insensitive' as const,
          },
        }
      : {}),
  }

  const [cases, total] = await prisma.$transaction([
    prisma.case.findMany({
      where,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.case.count({
      where,
    }),
  ])

  return {
    data: cases.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
    pagination: {
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize),
    },
  }
})
```

### Uso de `cache()`

Por padrão, envolva queries server-side reutilizáveis com `cache()` do React:

```ts
import { cache } from 'react'

export const getCase = cache(async (caseId: string) => {
  // autenticação, autorização e consulta
})
```

Use `cache()` para:

- deduplicar chamadas equivalentes durante uma renderização no servidor;
- permitir que page, layout, metadata e Server Components reutilizem a mesma query;
- centralizar autenticação e autorização sem repetir consultas idênticas desnecessariamente.

Regras importantes:

- Importe `cache` de `react`.
- Defina a função memoizada no escopo do módulo.
- Não crie `cache()` dentro de componentes ou dentro de outra função.
- Passe argumentos simples e estáveis.
- Quando usar objetos como argumento, evite criar múltiplos objetos equivalentes em pontos diferentes esperando deduplicação automática.
- `cache()` não deve ser tratado como cache persistente entre usuários ou requisições.
- Não use `cache()` para compartilhar dados privados entre sessões.
- A query continua responsável por autenticação e autorização.
- Mutations não devem ser envolvidas com `cache()`.
- Após mutations, use a estratégia de revalidação adequada para a interface.

Quando a necessidade for cache persistente entre requisições, siga a estratégia de cache definida especificamente para o projeto. Não substitua essa decisão silenciosamente por `cache()`.

## 13. Autenticação

Use:

- Cookie HTTP-only.
- JWT.
- `bcrypt` para hash e comparação de senha.
- Segredo JWT em variável de ambiente.
- Expiração definida para a sessão.
- Validação server-side em toda operação protegida.

Nunca:

- salve senha em texto puro;
- exponha hash de senha;
- exponha o token ao JavaScript do navegador;
- coloque dados sensíveis no payload JWT;
- confie apenas no proxy;
- retorne mensagens que revelem se um usuário existe.

Estrutura:

```text
src/
└── lib/
    └── auth/
        ├── get-session.ts
        ├── redirect-auth.ts
        ├── verify-auth.ts
        └── token.ts
```

### Cookie

O cookie de autenticação deve usar configurações seguras:

```ts
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}
```

A duração deve ser ajustada conforme a regra real do projeto.

### JWT

O token deve conter apenas o mínimo necessário.

Exemplo:

```ts
{
  sub: user.id,
}
```

Evite incluir:

- senha;
- hash da senha;
- CPF;
- endereço;
- documentos;
- informações desnecessárias do usuário.

### Login

Use uma mensagem genérica para falha de autenticação:

```text
Email ou senha inválidos
```

Não use mensagens que permitam enumeração:

```text
Usuário não encontrado
Senha incorreta
```

Considere proteção contra tentativas excessivas de login.

---

## 14. `getSession`

Responsabilidades:

- Ler o cookie HTTP-only.
- Validar assinatura e expiração do JWT.
- Extrair o ID do usuário.
- Buscar o usuário atualizado no banco.
- Retornar o usuário ou `null`.
- Não retornar senha nem hash.
- Tratar token inválido como sessão inexistente.

Não confie apenas nos dados armazenados no token para obter informações atualizadas do usuário.

---

## 15. `redirectAuth`

Use em pages e layouts Server Components.

Responsabilidades:

- Redirecionar usuários deslogados para `/login`.
- Redirecionar usuários autenticados para a página principal ao acessarem rotas públicas de autenticação.
- Ser baseada em `getSession`.
- Não substituir autorização por recurso.
- Não ser chamada em Client Components.

Exemplo de uso:

```tsx
import { redirectAuth } from '@/lib/auth/redirect-auth'

const ProtectedPage = async () => {
  const user = await redirectAuth()

  return <div>{user.name}</div>
}

export default ProtectedPage
```

## 16. `verifyAuth`

Use em:

- Server Actions;
- Route Handlers;
- queries protegidas;
- funções server-side protegidas.

Responsabilidades:

- Buscar a sessão com `getSession`.
- Interromper a operação se o usuário não estiver autenticado.
- Retornar o usuário autenticado.
- Não substituir autorização por recurso.
- Não ser chamado em Client Components.

Exemplo:

```ts
const user = await verifyAuth()
```

## 17. `redirectRole`

Use em pages e layouts Server Components quando uma rota exigir uma ou mais roles específicas.

Ele cumpre, para roles, o mesmo papel que `redirectAuth` cumpre para autenticação.

Responsabilidades:

- Validar primeiro se existe uma sessão autenticada.
- Ler a role atual do usuário no banco por meio da sessão.
- Permitir acesso quando a role estiver na lista autorizada.
- Redirecionar quando o usuário não possuir permissão.
- Retornar o usuário autorizado.
- Não ser usado em Server Actions.
- Não ser usado em Client Components.
- Não substituir autorização sobre um recurso específico.

Exemplo:

```ts
import type { Role } from '@prisma/client'
import { redirect } from 'next/navigation'

import { getSession } from './get-session'

export const redirectRole = async (allowedRoles: Role[]) => {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized')
  }

  return user
}
```

Uso em page:

```tsx
import { Role } from '@prisma/client'

import { redirectRole } from '@/lib/auth/redirect-role'

const UsersPage = async () => {
  const user = await redirectRole([Role.ADMIN])

  return <UsersScreen currentUser={user} />
}

export default UsersPage
```

Regras:

- Receba uma lista de roles permitidas.
- Use o enum de role gerado pelo Prisma ou uma fonte única equivalente.
- Não compare roles com strings espalhadas pelo projeto.
- Não use a role recebida por props, formulário, query string ou localStorage como fonte de autorização.
- O redirecionamento deve apontar para uma rota definida pelo projeto, como `/unauthorized`.
- Uma Client Component pode ocultar elementos com base na role recebida do servidor, mas isso é apenas comportamento visual.
- A proteção real deve continuar no servidor.

---

## 18. `verifyRole`

Use em Server Actions, Route Handlers, queries e funções server-side que exijam roles específicas.

Ele cumpre, para roles, o mesmo papel que `verifyAuth` cumpre para autenticação.

Responsabilidades:

- Validar a sessão.
- Validar a role do usuário.
- Interromper a operação quando a role não for permitida.
- Retornar o usuário autenticado e autorizado.
- Não redirecionar dentro de Server Actions.
- Não confiar em verificações feitas pela interface.
- Não substituir autorização sobre o recurso específico.

Exemplo:

```ts
import type { Role } from '@prisma/client'

import { verifyAuth } from './verify-auth'

export const verifyRole = async (allowedRoles: Role[]) => {
  const user = await verifyAuth()

  if (!allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN')
  }

  return user
}
```

Uso em uma action:

```ts
'use server'

import { Role } from '@prisma/client'

import { verifyRole } from '@/lib/auth/verify-role'

export const deleteUser = async (userId: string) => {
  try {
    const currentUser = await verifyRole([Role.ADMIN])

    // Validar também se o recurso pode ser alterado.
    // Exemplo: impedir que o administrador remova a própria conta.

    return {
      ok: true,
      message: 'Usuário removido com sucesso',
      data: null,
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Você não possui permissão para realizar esta operação',
    }
  }
}
```

Regras:

- Receba uma lista de roles permitidas.
- Use o enum de role central do projeto.
- Não aceite uma role enviada pelo cliente.
- Não use apenas verificações visuais da interface.
- Não revele detalhes desnecessários sobre permissões internas.
- Diferencie, no código server-side, falha de autenticação e falha de autorização quando isso for necessário.
- Mesmo após `verifyRole`, valide propriedade, organização, privacidade e demais regras do recurso.

---

## 19. Autorização

Autenticação confirma quem é o usuário.

Autorização confirma se esse usuário pode acessar ou alterar determinado recurso.

Toda operação sensível deve validar as duas coisas.

Exemplo incorreto:

```ts
const user = await verifyAuth()

await prisma.process.delete({
  where: {
    id: input.id,
  },
})
```

Exemplo correto:

```ts
const user = await verifyAuth()

const process = await prisma.process.findFirst({
  where: {
    id: input.id,
    createdById: user.id,
  },
})

if (!process) {
  return {
    ok: false,
    message: 'Processo não encontrado ou acesso negado',
  }
}

await prisma.process.delete({
  where: {
    id: process.id,
  },
})
```

Regras:

- Nunca aceite um `userId` vindo do cliente como fonte de autorização.
- Sempre derive o usuário da sessão.
- Sempre filtre recursos pelo usuário, organização ou regra de permissão aplicável.
- Não revele a existência de um recurso que o usuário não pode acessar.
- Verifique autorização novamente dentro da mutation.
- Não considere a ocultação de botões como proteção suficiente.

---

## 20. Proxy

Crie:

```text
src/proxy.ts
```

Responsabilidades:

- Fazer uma verificação inicial de acesso.
- Redirecionar usuários sem token ao acessarem rotas protegidas.
- Evitar trabalho desnecessário em requisições obviamente inválidas.
- Aplicar regras simples baseadas na requisição.

O proxy:

- não substitui `verifyAuth`;
- não substitui autorização;
- não deve executar consultas pesadas;
- não deve ser a única camada de proteção;
- não deve conter regras complexas de negócio.

Toda Server Action, Route Handler ou consulta protegida deve validar a sessão novamente no servidor.

---

## 21. Formulários

Use obrigatoriamente os componentes do shadcn/ui e a família `Field` para estruturar campos, labels, descrições, agrupamentos e erros.

Use sempre:

- React Hook Form.
- Zod.
- `zodResolver`.
- Componentes de `components/ui`.
- Sonner para feedback visual.

A validação no cliente existe para melhorar a experiência do usuário.

A validação na Server Action existe para segurança e integridade dos dados.

Nunca remova a validação server-side pelo fato de o formulário já validar no cliente.

Regras:

- Desabilite submissões enquanto a operação estiver pendente.
- Evite submissões duplicadas.
- Exiba erros por campo quando disponíveis.
- Preserve os valores do formulário em caso de erro.
- Limpe ou feche o formulário somente após sucesso.
- Não confie em IDs, permissões ou campos ocultos vindos do cliente.

---

## 22. Schemas

Use a pasta:

```text
src/schemas/
```

Organize por domínio quando a quantidade crescer:

```text
src/
└── schemas/
    ├── auth/
    │   └── login-schema.ts
    ├── clients/
    │   ├── create-client-schema.ts
    │   └── update-client-schema.ts
    ├── processes/
    │   ├── create-process-schema.ts
    │   └── update-process-schema.ts
    └── uploads/
        ├── create-upload-schema.ts
        └── update-upload-schema.ts
```

Regras:

- Cada schema deve ficar em seu próprio arquivo.
- Exporte o schema.
- Exporte o tipo inferido com `z.infer`.
- Não duplique tipos manualmente.
- Use nomes em `kebab-case`.
- Use schemas diferentes para operações diferentes quando os campos ou permissões forem diferentes.
- Não use o schema de criação cegamente para atualização.
- Normalize strings quando necessário.
- Valide IDs, datas, enums, tamanhos e formatos.

Exemplo:

```ts
import { z } from 'zod'

export const createUploadSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome').max(120),
})

export type CreateUploadInput = z.infer<typeof createUploadSchema>
```

---

## 23. Resultado das Server Actions

Use um contrato discriminado para resultados de actions.

Crie:

```text
src/lib/action-result.ts
```

Exemplo:

```ts
export type ActionResult<T = undefined> =
  | {
      ok: true
      message: string
      data: T
    }
  | {
      ok: false
      message: string
      errors?: Record<string, string[] | undefined>
    }
```

Para actions sem dados de retorno relevantes, use `null`:

```ts
ActionResult<null>
```

O objetivo é permitir narrowing seguro:

```ts
if (result.ok) {
  toast.success(result.message)
  return
}

toast.error(result.message)
```

---

## 24. Server Actions

As actions devem ficar dentro da própria rota, em uma pasta chamada `actions`.

```text
src/
└── app/
    └── uploads/
        ├── page.tsx
        ├── actions/
        │   ├── create-upload.ts
        │   ├── update-upload.ts
        │   └── delete-upload.ts
        └── feature/
```

Regras:

- Cada action deve ficar em seu próprio arquivo.
- Use `"use server"` no início do arquivo.
- Use arrow functions.
- Valide os dados com Zod dentro da action.
- Verifique autenticação com `verifyAuth`.
- Verifique autorização sobre o recurso.
- Não confie em dados de permissão enviados pelo cliente.
- Não exponha stack trace ao usuário.
- Retorne um contrato consistente.
- Revalide apenas os caminhos ou tags necessários.
- Não use `revalidatePath('/')` sem necessidade.
- Não execute consultas ao banco em Client Components.

Exemplo:

```ts
'use server'

import { revalidatePath } from 'next/cache'

import type { ActionResult } from '@/lib/action-result'
import { verifyAuth } from '@/lib/auth/verify-auth'
import { prisma } from '@/lib/prisma'
import {
  createUploadSchema,
  type CreateUploadInput,
} from '@/schemas/uploads/create-upload-schema'

export const createUpload = async (
  input: CreateUploadInput,
): Promise<ActionResult<{ id: string }>> => {
  try {
    const user = await verifyAuth()

    const parsed = createUploadSchema.safeParse(input)

    if (!parsed.success) {
      return {
        ok: false,
        message: 'Revise os campos informados',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

    const upload = await prisma.upload.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
      select: {
        id: true,
      },
    })

    revalidatePath('/uploads')

    return {
      ok: true,
      message: 'Upload criado com sucesso',
      data: upload,
    }
  } catch {
    return {
      ok: false,
      message: 'Não foi possível criar o upload',
    }
  }
}
```

Observação:

O retorno explícito com `ActionResult<T>` é permitido e recomendado para garantir um contrato estável entre servidor e cliente.

---

## 25. Tratamento de erros

Não exponha detalhes técnicos ou mensagens internas para o usuário.

Exemplo:

```ts
try {
  // operação
} catch {
  return {
    ok: false,
    message: 'Não foi possível concluir a operação',
  }
}
```

Regras:

- Não exponha mensagens internas do Prisma.
- Não exponha stack traces.
- Não exponha tokens, cookies, senhas ou dados sensíveis.
- Use mensagens claras e seguras para o usuário.
- Diferencie erros esperados de erros inesperados quando isso for necessário para a regra de negócio.
- Não envie o objeto de erro bruto para Client Components.
- Ferramentas externas de observabilidade ou logging só devem ser adicionadas quando forem definidas como padrão do projeto.


## 26. Prisma

Centralize o Prisma Client em:

```text
src/lib/prisma.ts
```

Evite criar uma nova instância do Prisma Client em cada arquivo.

Use `select` para buscar somente os campos necessários quando apropriado.

Evite retornar modelos completos para o cliente quando apenas poucos campos forem usados.

Exemplo:

```ts
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
})
```

Não selecione:

```ts
passwordHash: true
```

salvo em um fluxo server-side de autenticação estritamente necessário.

---

## 27. Transações

Use `prisma.$transaction` quando uma operação depender de múltiplas alterações que precisam ser atômicas.

Exemplo:

```ts
await prisma.$transaction(async (tx) => {
  const serviceRecord = await tx.serviceRecord.create({
    data: serviceRecordData,
  })

  await tx.process.create({
    data: {
      ...processData,
      serviceRecordId: serviceRecord.id,
    },
  })
})
```

Use transações quando:

- uma etapa não puder existir sem a outra;
- múltiplos registros precisarem ser gravados juntos;
- uma falha parcial puder deixar dados inconsistentes;
- houver atualização de registros relacionados.

Não use transação sem necessidade para uma única operação simples.

---

## 28. Serialização de dados

Antes de enviar dados de um Server Component para um Client Component, garanta que eles sejam serializáveis.

Atenção especial para:

- `Date`;
- `Decimal`;
- `BigInt`;
- objetos complexos;
- classes;
- dados do Prisma.

Exemplo:

```ts
const data = uploads.map((upload) => ({
  id: upload.id,
  name: upload.name,
  createdAt: upload.createdAt.toISOString(),
}))
```

Crie DTOs ou tipos específicos para tabelas e formulários quando necessário.

Não envie modelos completos do Prisma para o cliente por conveniência.

---

## 29. Variáveis de ambiente

Centralize e valide variáveis de ambiente em:

```text
src/lib/env.ts
```

Exemplo:

```ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
})

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
})
```

Regras:

- Não acesse `process.env` de forma espalhada pelo projeto.
- Não coloque segredos em variáveis com prefixo `NEXT_PUBLIC_`.
- Variáveis com `NEXT_PUBLIC_` podem ser enviadas ao navegador.
- Não importe `env.ts` server-only em Client Components.
- Não comite arquivos `.env` com credenciais reais.
- Mantenha um `.env.example` sem segredos.
- Documente todas as variáveis necessárias.
- Valide as variáveis ao iniciar a aplicação.

Exemplo de `.env.example`:

```env
DATABASE_URL=
JWT_SECRET=
```

---

## 30. Cache e revalidação

Existem duas necessidades diferentes:

1. Deduplicar chamadas equivalentes durante a renderização server-side.
2. Persistir resultados entre requisições.

Use `cache()` do React nas queries para a primeira necessidade, conforme definido na seção de queries.

```ts
import { cache } from 'react'

export const getCase = cache(async (caseId: string) => {
  // consulta protegida
})
```

Não trate `cache()` como armazenamento persistente entre requisições.

Para revalidar a interface após mutations, use `revalidatePath` ou `revalidateTag` somente quando necessário.

Regras:

- Revalide o caminho mais específico possível.
- Evite revalidar `/` sem necessidade.
- Use tags quando os mesmos dados aparecerem em várias rotas e a estratégia do projeto exigir cache persistente.
- Não dependa apenas de `router.refresh()` quando o cache do servidor precisar ser invalidado.
- Não aplique cache persistente a dados sensíveis sem avaliar isolamento entre usuários.
- Não compartilhe acidentalmente dados privados entre sessões.
- Não envolva Server Actions de mutation com `cache()`.
- Não use uma solução de cache persistente sem que ela esteja definida como padrão do projeto.

Exemplo:

```ts
revalidatePath('/cases')
```

## 31. Uploads e arquivos

Toda implementação de upload deve validar no servidor:

- autenticação;
- autorização;
- tipo permitido;
- tamanho máximo;
- extensão;
- nome seguro;
- destino do arquivo;
- vínculo com o registro correto.

Nunca confie apenas no atributo `accept` do input.

Regras:

- Gere nomes internos seguros e únicos.
- Não use diretamente o nome original como caminho final.
- Evite path traversal.
- Não permita execução de arquivos enviados.
- Não exponha caminhos internos do servidor.
- Remova o arquivo físico apenas depois de validar autorização.
- Quando banco e arquivo precisarem permanecer consistentes, trate falhas parciais.
- Armazene metadados necessários no banco.
- Restrinja tipos conforme a regra real do projeto.

Exemplo de metadados:

```ts
{
  originalName: string
  storedName: string
  mimeType: string
  size: number
  path: string
}
```

---

## 32. Route Handlers

Use Route Handlers quando houver necessidade real de endpoint HTTP, por exemplo:

- upload via `multipart/form-data`;
- download de arquivo;
- webhook;
- integração externa;
- endpoint consumido por outro cliente.

Para mutations internas de formulários do próprio projeto, prefira Server Actions quando elas forem adequadas.

Route Handlers protegidos devem:

- validar autenticação;
- validar autorização;
- validar entrada;
- limitar dados retornados;
- usar códigos HTTP adequados;
- não confiar no proxy como única proteção.

---

## 33. Toasts

Use sempre Sonner.

```ts
import { toast } from 'sonner'

toast.success('Registro criado com sucesso')
toast.error('Não foi possível concluir a operação')
```

Não use:

- `alert`;
- toasts implementados manualmente;
- bibliotecas alternativas sem necessidade;
- mensagens técnicas do servidor diretamente no toast.

Evite disparar múltiplos toasts para a mesma operação.

---

## 34. Estados de submissão

Toda operação assíncrona acionada pela interface deve possuir feedback visual.

Exemplos:

- botão desabilitado;
- texto de processamento;
- spinner;
- estado pendente;
- confirmação por toast;
- erro por campo.

Evite submissão duplicada.

Exemplo:

```tsx
const [isPending, startTransition] = useTransition()

const onSubmit = (values: CreateUploadInput) => {
  startTransition(async () => {
    const result = await createUpload(values)

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
  })
}
```

---

## 35. Exclusões

Toda exclusão deve:

- validar autenticação;
- validar autorização;
- confirmar a intenção na interface quando houver risco relevante;
- verificar dependências;
- tratar arquivos relacionados;
- impedir exclusão parcial;
- retornar mensagem clara.

Use exclusão lógica quando houver exigência de histórico ou auditoria.

Não implemente exclusão em cascata sem avaliar seus efeitos.

---


## 36. Exclusão lógica (Soft Delete)

Neste projeto, os dados nunca devem ser removidos fisicamente como comportamento padrão.

Toda exclusão deve ser implementada através de uma flag de atividade.

Estratégia padrão:

```prisma
isActive Boolean @default(true)
```

Regras:

- Nunca utilize `delete()` ou `deleteMany()` por padrão.
- Toda exclusão deve ser um `update()` alterando `isActive` para `false`.
- Todas as queries devem filtrar `isActive: true` por padrão.
- Consultas de registros inativos devem ser explícitas.
- Sempre que possível, registros ocultos devem poder ser restaurados.
- Nunca quebre relacionamentos por causa de uma ocultação.

Exemplo:

```ts
await prisma.case.update({
  where: { id },
  data: { isActive: false },
})
```

Query padrão:

```ts
const cases = await prisma.case.findMany({
  where: { isActive: true },
})
```

## 37. Datas

Defina uma estratégia consistente para datas.

Regras:

- Armazene datas no banco em formato apropriado ao banco.
- Evite formatar datas diretamente em múltiplos componentes.
- Centralize formatações reutilizadas.
- Considere timezone em datas com horário.
- Não envie objetos não serializáveis para Client Components.
- Use `toISOString()` quando precisar transferir uma data ao cliente.
- Diferencie data civil de timestamp quando necessário.

---

## 38. Testes

Priorize testes para fluxos críticos.

### Testes unitários

Use para:

- schemas Zod;
- funções puras;
- formatação;
- transformação;
- regras de negócio isoladas.

### Testes de integração

Use para:

- Server Actions;
- autorização;
- operações Prisma;
- fluxos que usam transações;
- uploads;
- validações server-side.

## 39. Acessibilidade

Ao implementar interfaces:

- associe labels aos campos;
- preserve navegação por teclado;
- use elementos semânticos;
- não use `div` clicável quando um `button` for adequado;
- forneça texto acessível para botões apenas com ícone;
- preserve foco em dialogs;
- exiba erros de formulário de forma acessível;
- não dependa apenas de cor para transmitir estado.

---

## 40. Arrow functions

Use arrow functions para funções criadas no projeto.

Correto:

```ts
export const createUpload = async () => {
  // ...
}
```

Evite:

```ts
export async function createUpload() {
  // ...
}
```

Essa regra é uma convenção de estilo do projeto e não possui prioridade sobre segurança, compatibilidade do framework ou exigências técnicas.

---

## 41. Checklist obrigatório

Antes de concluir qualquer implementação, confirme:

### Estrutura

- [ ] O projeto continua sendo uma aplicação Next.js única, sem monorepo.
- [ ] Os arquivos usam `kebab-case`.
- [ ] A `page.tsx` continua sendo Server Component.
- [ ] Componentes client estão separados dentro de `feature`.
- [ ] Componentes específicos não foram colocados em pastas globais.
- [ ] Componentes de UI estão em `components/ui`.
- [ ] Componentes existentes do shadcn/ui foram priorizados antes da criação de componentes próprios.
- [ ] Nenhum componente do shadcn/ui foi duplicado manualmente.
- [ ] Componentes visuais próprios foram criados somente como último recurso.
- [ ] Componentes compartilhados estão em `components/shared`.
- [ ] Não foram criadas abstrações ou pastas sem necessidade.

### Dados e componentes

- [ ] Não existem consultas Prisma em Client Components.
- [ ] Os dados enviados ao cliente são serializáveis.
- [ ] Somente os campos necessários são retornados.
- [ ] Listagens usam a apresentação mais simples adequada à interface.
- [ ] Não foi introduzido TanStack Table sem solicitação explícita.
- [ ] Paginação server-side foi utilizada quando a quantidade de dados pode crescer.
- [ ] Todas as queries Prisma de leitura estão em arquivos separados dentro de `queries`.
- [ ] Queries reutilizáveis usam `cache()` do React.

### Formulários e validação

- [ ] Formulários usam React Hook Form, Zod e `zodResolver`.
- [ ] Todos os campos de formulário utilizam `Field` do shadcn/ui.
- [ ] Labels, descrições e erros usam `FieldLabel`, `FieldDescription` e `FieldError`.
- [ ] Campos inválidos usam `aria-invalid` e `data-invalid` quando aplicável.
- [ ] A validação também ocorre no servidor.
- [ ] Erros por campo são retornados quando apropriado.
- [ ] Submissões duplicadas são impedidas.
- [ ] Toasts usam Sonner.

### Schemas e actions

- [ ] Schemas ficam em `schemas`, organizados por domínio.
- [ ] Cada schema fica em seu próprio arquivo.
- [ ] Tipos dos schemas usam `z.infer`.
- [ ] Actions ficam dentro da rota em `actions`.
- [ ] Cada action está em um arquivo separado.
- [ ] Actions possuem contrato consistente com `ActionResult`.
- [ ] Funções usam arrow functions.
- [ ] Revalidação ocorre apenas no caminho ou tag necessária.

### Segurança

- [ ] Rotas protegidas usam `redirectAuth` ou `verifyAuth`.
- [ ] Toda mutation protegida valida autenticação.
- [ ] Toda operação por recurso valida autorização.
- [ ] Rotas restritas por role usam `redirectRole` quando aplicável.
- [ ] Actions, Route Handlers e queries restritas por role usam `verifyRole` quando aplicável.
- [ ] A role usada para autorização vem da sessão e do banco, nunca do cliente.
- [ ] O cookie de autenticação é HTTP-only.
- [ ] O cookie usa configurações seguras.
- [ ] Senhas usam bcrypt.
- [ ] O token usa JWT.
- [ ] O payload JWT contém apenas dados mínimos.
- [ ] O proxy não é usado como única camada de segurança.
- [ ] Dados sensíveis não são enviados ao cliente.
- [ ] IDs enviados pelo cliente não são usados como autorização.
- [ ] Uploads são validados no servidor.

### Banco e consistência

- [ ] Operações relacionadas usam transação quando necessário.
- [ ] Exclusões verificam dependências.
- [ ] Não existem gravações parciais que possam deixar dados inconsistentes.
- [ ] Consultas selecionam somente os campos necessários quando apropriado.

### Qualidade

- [ ] Estados de loading e erro foram tratados.
- [ ] A interface possui feedback durante operações assíncronas.
- [ ] A acessibilidade básica foi preservada.
- [ ] Fluxos críticos possuem testes ou foram preparados para teste.
- [ ] O lint e o TypeScript passam sem erros.
- [ ] O build foi executado quando a alteração justificar.

---


## 42. Consistência arquitetural

Ao criar uma nova feature:

- Preserve a arquitetura existente.
- Preserve o padrão de `actions`, `queries`, `feature`, `schemas`, `types` e `utils`.
- Não introduza novas arquiteturas sem solicitação explícita.
- Não misture padrões diferentes no mesmo projeto.
- A consistência da arquitetura existente possui prioridade sobre preferências do modelo.

## 43. Comportamento esperado do Claude Code

Ao criar ou alterar código neste projeto:

1. Leia este arquivo antes de implementar.
2. Leia os documentos funcionais e o Design System aplicáveis.
3. Preserve a estrutura existente.
4. Não introduza monorepo.
5. Organize cada domínio por feature.
6. Não mova componentes entre pastas sem necessidade.
7. Não transforme pages inteiras em Client Components.
8. Use sempre os componentes existentes do shadcn/ui antes de criar componentes próprios.
9. Pesquise na documentação do shadcn/ui quando o componente ainda não existir no projeto.
10. Crie componentes visuais próprios somente como último recurso.
11. Não duplique componentes do shadcn/ui.
12. Use obrigatoriamente `Field` do shadcn/ui em todos os campos de formulário.
13. Use `FieldLabel`, `FieldDescription` e `FieldError` quando aplicáveis.
14. Não use placeholder como substituto de label.
15. Não crie tipos redundantes.
16. Não crie componentes de UI duplicados.
17. Não crie abstrações antecipadas.
18. Não introduza TanStack Table sem solicitação explícita.
19. Não crie automaticamente arquivos `data`, `table` e `columns`.
20. Não coloque várias actions no mesmo arquivo.
21. Não coloque várias queries sem relação no mesmo arquivo.
22. Coloque toda consulta de leitura em um arquivo separado dentro de `queries`.
23. Use nomes explícitos como `list-cases.ts`, `get-case.ts` e `count-cases.ts`.
24. Envolva queries server-side reutilizáveis com `cache()` do React.
25. Não faça consultas Prisma diretamente em pages, layouts ou componentes React.
26. Não faça consultas ao banco em Client Components.
27. Não confie no proxy como única proteção.
28. Não implemente apenas autenticação quando também for necessária autorização.
29. Use `redirectRole` em pages e layouts restritos por role.
30. Use `verifyRole` em actions, Route Handlers e queries restritas por role.
31. Nunca aceite role, `userId` ou permissões do cliente como fonte de autorização.
32. Não retorne modelos completos do Prisma ao cliente sem necessidade.
33. Não carregue todos os registros quando a listagem puder crescer.
34. Não exponha mensagens internas, tokens, senhas ou dados sensíveis.
35. Não finalize uma implementação que viole este documento.
36. Execute as verificações disponíveis antes de concluir.
37. Informe claramente qualquer limitação, conflito ou regra não atendida.
## 44. Critério final

Uma implementação só pode ser considerada concluída quando:

- funciona;
- respeita as regras de negócio;
- está protegida por autenticação e autorização;
- mantém a organização por feature;
- não expõe dados sensíveis;
- possui validação server-side;
- mantém consistência no banco;
- trata loading e erro;
- passa nas verificações do projeto;
- não viola este documento.
