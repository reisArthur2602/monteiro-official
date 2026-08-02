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
import { verifyAuth } from '@/utils/auth/verify-auth'
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
app/
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
│   ├── env.ts
│   └── prisma.ts
├── utils/
│   ├── action-result.ts
│   └── auth/
│       ├── get-session.ts
│       ├── redirect-auth.ts
│       ├── redirect-role.ts
│       ├── verify-auth.ts
│       ├── has-role.ts
│       └── token.ts
└── proxy.ts
```

## Estrutura de diretórios

- `app/` - rotas e pages do Next.js
- `components/ui/` - componentes visuais primitivos do shadcn/ui
- `components/shared/` - componentes reutilizáveis com lógica de negócio
- `lib/` - apenas bibliotecas externas (Prisma, env)
- `utils/` - funções utilitárias e helpers globais (autenticação, action-result, etc.)
- `schemas/` - schemas Zod para validação
- `integrations/` - integrações de bibliotecas (TanStack Query, etc.)

Este projeto não usa:

- monorepo;
- workspaces;
- pacotes internos separados;
- pastas `packages`;
- configurações compartilhadas entre aplicações.

Adapte a estrutura à necessidade real da feature. Não crie arquivos ou diretórios sem uso.

---

## 5a. Pasta `utils/` — Utilitários globais

A pasta `utils/` centraliza helpers e funções utilitárias reutilizáveis em todo o projeto que não são bibliotecas externas.

Exemplos:

- `utils/action-result.ts` - Contrato discriminado para respostas de Server Actions
- `utils/auth/` - Autenticação e autorização (getSession, redirectAuth, verifyAuth, hasRole, etc.)

Regras:

- Prefira imports diretos, como `@/utils/auth/has-role`, em vez de um barrel global obrigatório.
- Use `index.ts` somente quando ele representar uma API pública pequena e deliberada, sem criar dependências circulares.
- Não coloque lógica específica de features em `utils/`
- Evite crescimento desorganizado: só mova para `utils/` quando for reutilizado em múltiplas features
- Manter `utils/` limpo ajuda a distinguir do `lib/` (bibliotecas externas)

---

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
- leitura de `params`;
- leitura de `searchParams`;
- chamada de queries da feature;
- definição de metadados, quando necessário.

Não faça uma page inteira virar Client Component apenas porque uma pequena parte da tela precisa de interação.

### Proteção de grupos de rotas

Rotas autenticadas devem ficar dentro de um grupo com layout protegido, por exemplo:

```text
app/
├── (public)/
│   └── login/
│       └── page.tsx
└── (protected)/
    ├── layout.tsx
    ├── page.tsx
    ├── clients/
    │   └── page.tsx
    └── cases/
        └── page.tsx
```

O layout compartilhado deve executar `redirectAuth()` uma única vez:

```tsx
import type { ReactNode } from 'react'

import { redirectAuth } from '@/utils/auth/redirect-auth'

type ProtectedLayoutProps = {
  children: ReactNode
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const user = await redirectAuth()

  return <>{children}</>
}

export default ProtectedLayout
```

Regras:

- Pages filhas de um layout já protegido não devem repetir `redirectAuth()`.
- Não coloque `redirectAuth()` em toda page por padrão.
- Use um layout protegido aninhado quando um conjunto inteiro de rotas exigir uma role específica.
- Uma page só pode chamar `redirectAuth()` diretamente quando estiver fora de um layout protegido ou quando houver uma necessidade arquitetural explícita.
- A proteção do layout controla navegação e composição da interface, mas não substitui `verifyAuth()` nas queries, Server Actions e Route Handlers.
- Autorização por recurso deve continuar próxima da consulta ou mutation.

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
components/ui/
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
components/shared/
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

---

## 8a. Hierarquia, propriedade e deduplicação de ações

Toda tela deve possuir uma hierarquia de ações definida antes da implementação.

O Claude Code deve identificar cada ação como uma destas categorias:

- **ação primária da página**: principal próximo passo do usuário;
- **ação secundária da página**: edição, impressão, exportação ou operação complementar;
- **ação contextual de seção**: afeta somente uma seção ou card;
- **ação de item**: afeta uma linha, registro ou elemento específico;
- **ação destrutiva**: desativação, arquivamento ou outra operação de risco.

### Regra de propriedade da ação

Cada ação deve possuir um único local principal de renderização por breakpoint.

Use:

- cabeçalho da página para ações que afetam o recurso ou a página inteira;
- cabeçalho de uma seção para ações que afetam somente aquela seção;
- menu de ações do item para ações de uma linha, card ou registro específico;
- `AlertDialog` para confirmar ações destrutivas;
- alertas e banners somente para comunicar estado, restrição ou próximo passo excepcional.

Não crie um card chamado “Ações” apenas para repetir botões que já existem no cabeçalho.

### Ações repetidas

É proibido renderizar a mesma ação em múltiplos lugares visíveis da mesma tela.

Considere a ação repetida quando possuir o mesmo:

- destino (`href`);
- handler;
- efeito de negócio;
- diálogo aberto;
- mutation executada;
- resultado esperado pelo usuário.

Exemplos proibidos:

- “Editar ficha” no cabeçalho e novamente em um card lateral;
- “Imprimir” no cabeçalho e novamente na área de ações;
- “Abrir fichas” em um banner e “Ver fichas finalizadas” no cabeçalho quando ambos levam à mesma tela;
- botão “Voltar” repetindo uma navegação já fornecida por breadcrumb, tabs ou link principal;
- botão “Novo” no cabeçalho e novamente no estado vazio sem diferença de contexto.

Antes de adicionar um botão, pesquise a árvore da página e confirme que a ação ainda não existe.

### Página de detalhes

O padrão principal deste projeto é manter ações que afetam a página inteira no cabeçalho.

Sidebars devem priorizar informações, resumo, navegação contextual e conteúdo auxiliar. Não crie um card genérico de ações na sidebar por padrão.

Um painel lateral de ações só pode ser utilizado quando o Design System ou o fluxo funcional exigir explicitamente esse padrão. Nesse caso, remova as mesmas ações do cabeçalho.

Nunca use cabeçalho e painel lateral simultaneamente para as mesmas ações.

Padrão recomendado:

- uma ação primária visível;
- até duas ações secundárias visíveis;
- ações adicionais em `DropdownMenu`;
- ações destrutivas separadas visualmente e confirmadas com `AlertDialog`.

Exemplo:

```text
Cabeçalho
├── Abrir processo      ← ação primária
├── Editar ficha        ← ação secundária
└── Mais ações
    ├── Imprimir
    └── Desativar ficha
```

Nesse caso, não deve existir outro card lateral repetindo `Editar ficha` e `Imprimir`.

### Alertas e banners

Alertas devem ser informativos por padrão.

Um alerta pode conter uma ação somente quando:

- a ação resolve diretamente o estado descrito;
- ela não existe em outro local visível;
- o alerta é o ponto natural do fluxo;
- remover a ação prejudicaria a compreensão do próximo passo.

Não transforme alertas em uma segunda barra de ações.

### Responsividade

Quando a mesma ação precisar mudar de posição entre desktop e mobile:

- reutilize a mesma definição ou componente de ação;
- garanta que apenas uma versão esteja visível em cada breakpoint;
- não crie handlers ou regras de permissão diferentes entre as versões;
- não deixe duas versões acessíveis simultaneamente.

### Fonte única das ações

Quando uma tela possuir várias ações relacionadas, prefira definir a configuração uma única vez e reutilizá-la na apresentação escolhida.

Não mantenha listas independentes de ações no cabeçalho, sidebar e cards.

### Checklist visual obrigatório

Antes de concluir uma tela, confirme:

- [ ] Existe no máximo uma ação primária visível para a página.
- [ ] Nenhum botão possui o mesmo destino ou efeito de outro botão visível.
- [ ] Ações de página não foram repetidas dentro de cards.
- [ ] Ações de item estão próximas do item correspondente.
- [ ] Alertas não repetem ações do cabeçalho.
- [ ] Ações destrutivas usam confirmação.
- [ ] Desktop e mobile não exibem versões duplicadas simultaneamente.
- [ ] A hierarquia visual deixa claro qual é o próximo passo principal.


## 8b. Revisão crítica de UI/UX e auditoria de controles

Não basta verificar se dois botões possuem o mesmo texto. Antes de implementar uma tela, o Claude Code deve analisar a intenção, o escopo, o modo atual, o destino e o efeito de cada controle visível.

A implementação deve ser crítica em relação ao prompt, aos documentos e ao código existente. Não reproduza automaticamente todas as ações mencionadas ou encontradas em componentes anteriores. Quando duas ações competirem, se repetirem ou criarem ambiguidade, escolha a hierarquia mais clara e registre a decisão.

### Objetivo principal da tela

Antes de criar a interface, identifique:

- qual é o recurso atual;
- qual é a tarefa principal do usuário;
- qual é o modo atual da interface;
- qual é a ação primária;
- quais ações são realmente necessárias naquele modo;
- quais controles pertencem ao recurso inteiro e quais pertencem somente a uma seção.

Uma tela não deve acumular ações apenas porque elas são possíveis. Exiba somente as ações úteis para a tarefa e para o estado atual.

### Registro obrigatório de ações

Antes da implementação, crie mentalmente ou documente um registro equivalente a:

```text
id da ação | intenção | escopo | modos visíveis | local canônico | prioridade | destino ou efeito
```

Exemplo:

```text
template.publish        | publicar template  | recurso | editar, prévia | cabeçalho da página | primária   | mutation publishTemplate
template.settings       | configurar template| recurso | editar, prévia | cabeçalho da página | secundária | dialog template-settings
editor.insert-variable  | inserir variável   | editor  | editar         | toolbar do editor   | contextual | command insertVariable
preview.print           | imprimir documento | prévia  | prévia         | toolbar da prévia   | contextual | window.print
preview.zoom            | alterar zoom       | prévia  | prévia         | toolbar da prévia   | utilitária | estado local de zoom
```

Regras:

- Cada ação deve possuir um identificador conceitual único.
- O mesmo identificador não pode ser renderizado em dois locais visíveis no mesmo breakpoint.
- Ações com textos diferentes, mas com o mesmo destino ou efeito, devem usar o mesmo identificador e ser tratadas como duplicadas.
- Não crie uma ação sem conseguir definir seu escopo e local canônico.
- Não crie controles apenas para preencher espaço visual.

### Escopos de interface

Classifique cada controle em um único escopo principal:

1. **Global da aplicação**: tema, conta, navegação global.
2. **Recurso ou página**: publicar, editar, configurar ou desativar o recurso atual.
3. **Modo de trabalho**: ações exclusivas de editar, visualizar, revisar ou imprimir.
4. **Seção ou canvas**: zoom, filtros locais, ordenação, comandos de uma área específica.
5. **Item**: ações de uma linha, card, documento ou registro individual.

Não misture escopos diferentes na mesma toolbar sem uma justificativa clara.

Exemplos:

- `Publicar template` e `Configurações do template` pertencem ao cabeçalho do recurso.
- `Inserir variável` pertence ao modo de edição.
- `Zoom` e `Imprimir` pertencem à prévia.
- Ações de uma linha pertencem ao menu da própria linha.

### Toolbars com responsabilidade única

Cada barra de controles deve possuir uma responsabilidade clara.

- O cabeçalho da página controla o recurso atual.
- O seletor de modo alterna entre editar e pré-visualizar.
- A toolbar do editor contém somente comandos de edição.
- A toolbar da prévia contém somente comandos de visualização, impressão ou zoom.
- A sidebar contém informações ou navegação contextual, não uma cópia das ações da página.

Não transforme uma toolbar em um depósito de ações não relacionadas.

### Visibilidade orientada por modo e estado

Ações devem aparecer somente quando forem válidas e úteis no modo atual.

Exemplos:

- Em `Editar`, pode existir `Inserir variável`.
- Em `Prévia`, não exiba comandos de edição como `Inserir variável`.
- Em `Prévia`, podem existir `Zoom` e `Imprimir`.
- Uma ação indisponível pelo estado atual deve ser removida, desabilitada com explicação ou movida para o fluxo apropriado.
- Não mantenha ações de edição visíveis apenas para permitir que o usuário volte ao modo de edição; o seletor de modo já cumpre essa função.

Ao alternar de modo, revise todas as ações visíveis. Não altere apenas o conteúdo central.

### Duplicidade semântica

Considere duplicidade mesmo quando os textos forem diferentes.

Exemplos de duplicidade semântica:

- `Configurações` e `Ajustar template` abrindo o mesmo diálogo;
- `Abrir fichas` e `Ver fichas finalizadas` levando à mesma rota;
- `Editar` e `Alterar dados` iniciando o mesmo fluxo;
- ícone de engrenagem e botão `Configurações` executando a mesma ação;
- ação no menu de reticências repetindo um botão já visível sem necessidade responsiva.

A detecção deve comparar:

- `href`;
- handler;
- action id;
- dialog aberto;
- mutation;
- alteração de estado;
- resultado esperado pelo usuário.

### Labels específicos e configurações

Não use múltiplos controles genéricos chamados `Configurações` na mesma tela.

Quando existirem configurações realmente diferentes, use nomes específicos:

- `Configurações do template`;
- `Configurações da impressão`;
- `Preferências do editor`;
- `Configurações da conta`.

Se dois botões chamados `Configurações` abrirem o mesmo fluxo, mantenha apenas o local canônico.

Se abrirem fluxos diferentes, diferencie claramente o nome, o escopo e o local. Não obrigue o usuário a descobrir a diferença clicando.

### Estado não é ação

Informações como:

- `0 variáveis usadas`;
- `Sem alterações`;
- `Rascunho`;
- `Publicado`;
- `Salvo há 2 minutos`;

são estados, não ações.

Regras:

- Não estilize estados como botões.
- Posicione o estado próximo do recurso ao qual ele se refere.
- Não repita o mesmo estado em várias regiões.
- Oculte estados sem utilidade no modo atual.
- Use texto compreensível; evite indicadores técnicos que não ajudam a decisão do usuário.

### Orçamento de ações visíveis

Como padrão para páginas de detalhes ou edição:

- mantenha no máximo uma ação primária visível;
- mantenha até duas ações secundárias visíveis quando forem frequentes;
- mova ações menos frequentes para `DropdownMenu`;
- não coloque no menu uma ação que já está visível, salvo quando for uma adaptação responsiva em que apenas uma versão aparece por breakpoint;
- não crie uma ação secundária sem necessidade documentada no fluxo.

Esses limites são orientação de hierarquia, não autorização para adicionar ações até atingir a quantidade máxima.

### Revisão crítica obrigatória antes de codificar

Antes de implementar a tela, responda:

1. Qual é o objetivo principal desta tela?
2. Qual é a única ação primária?
3. Existe mais de uma ação levando ao mesmo resultado?
4. Existe algum controle no modo errado?
5. Existe uma toolbar misturando escopos?
6. Existe um label genérico ou ambíguo?
7. Existe uma ação criada apenas por convenção, sem requisito funcional?
8. Alguma ação pode ser removida sem prejudicar o fluxo?
9. O menu de reticências repete ações visíveis?
10. O estado atual da tela está claro sem textos redundantes?

Quando houver conflito entre prompt, protótipo, Design System e fluxo funcional, não replique todos os elementos. Preserve a regra de negócio e escolha a solução com menor redundância e maior clareza. Informe o conflito na conclusão.

### Auditoria visual obrigatória após implementar

Depois de implementar uma tela:

1. Renderize a rota real.
2. Revise ao menos um viewport desktop e um mobile.
3. Liste todos os botões, links, menus, tabs e controles interativos visíveis.
4. Compare os destinos, handlers, dialogs e mutations.
5. Remova duplicidades semânticas.
6. Confirme que cada ação aparece apenas no modo e escopo corretos.
7. Confirme que toolbars possuem responsabilidade única.
8. Verifique se labels genéricos foram diferenciados.
9. Verifique se ações destrutivas estão separadas e confirmadas.
10. Capture screenshot ou use teste visual quando a ferramenta estiver disponível.

Não considere a revisão concluída apenas pela leitura do JSX.

Se não for possível executar ou visualizar a interface, declare explicitamente que a auditoria visual não foi realizada. Não afirme que a UI foi validada sem renderizá-la.

### Exemplo de organização para editor de templates

Padrão recomendado:

```text
Cabeçalho do recurso
├── status de salvamento
├── Configurações do template
├── Publicar
└── Mais ações

Seletor de modo
├── Editar
└── Prévia

Modo Editar
├── quantidade de variáveis utilizadas, quando útil
└── Inserir variável

Modo Prévia
├── Imprimir
└── Zoom
```

Não repetir `Configurações` no cabeçalho e na toolbar.

Não exibir `Inserir variável` enquanto `Prévia` estiver ativa.

Não misturar controles de edição com controles de impressão ou zoom.

### Checklist crítico de UI/UX

- [ ] O objetivo principal da tela foi identificado.
- [ ] Toda ação possui intenção, escopo, modo e local canônico.
- [ ] Existe no máximo uma ação primária visível.
- [ ] Não existem duplicidades por texto, destino, handler, diálogo, mutation ou resultado.
- [ ] Não existem labels diferentes para a mesma ação.
- [ ] Não existem dois controles genéricos chamados `Configurações`.
- [ ] Ações de edição aparecem somente no modo de edição.
- [ ] Ações de prévia aparecem somente no modo de prévia.
- [ ] Cada toolbar possui uma responsabilidade única.
- [ ] Estados não estão estilizados ou posicionados como ações.
- [ ] O menu de reticências não repete ações visíveis.
- [ ] Nenhuma ação foi adicionada sem requisito funcional.
- [ ] A tela foi renderizada e auditada visualmente.
- [ ] Desktop e mobile foram revisados.
- [ ] Limitações da auditoria foram declaradas.

---

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
app/
└── cases/
    └── queries/
        ├── list-cases.ts
        ├── get-case.ts
        ├── count-cases.ts
        └── list-case-documents.ts
```

Use nomes que expressem o caso de uso:

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

- Uma responsabilidade principal por query.
- Uma query pode carregar relações coerentes com o mesmo caso de uso.
- Não fragmente uma página em várias consultas pequenas apenas para cumprir “uma query por arquivo”.
- Não crie uma query genérica que misture dados sem relação.
- Não coloque mutations em `queries`.
- Não coloque consultas Prisma diretamente em pages, layouts ou componentes React.
- Pages, layouts e Server Components devem chamar funções exportadas por `queries`.
- Server Actions podem chamar queries quando precisarem ler dados, mas mutations continuam em `actions`.
- Não duplique a mesma consulta em vários arquivos.
- Aplique autenticação e autorização dentro da query quando os dados forem protegidos.
- Se uma query depender do usuário autenticado, derive o usuário da sessão no servidor.
- Nunca receba `userId` do cliente como substituto da sessão.
- Use `select` para buscar somente os campos necessários.
- Limite relações que possam crescer.
- Retorne DTOs serializáveis quando o resultado for enviado ao cliente.

### Prioridade entre `findUnique()` e `findFirst()`

Ao buscar um único registro, priorize sempre `findUnique()` quando existir uma chave única aplicável.

Use `findUnique()` para:

- campo `@id`;
- campo `@unique`;
- restrição composta `@@id`;
- restrição composta `@@unique`.

Exemplo por ID:

```ts
const user = await prisma.user.findUnique({
  where: {
    id: userId,
  },
})
```

Exemplo com autorização e exclusão lógica:

```ts
const process = await prisma.process.findUnique({
  where: {
    id: processId,
    createdById: user.id,
    isActive: true,
  },
  select: {
    id: true,
    title: true,
  },
})
```

Use `findFirst()` somente quando:

- nenhum campo ou conjunto de campos da consulta for único;
- a busca utilizar `OR` entre critérios diferentes;
- a busca depender de filtros relacionais que não garantem unicidade;
- for necessário retornar o primeiro registro segundo uma ordenação;
- o critério de negócio ainda não puder ser representado por uma restrição única.

Exemplo válido:

```ts
const latestMovement = await prisma.processMovement.findFirst({
  where: {
    processId,
    isActive: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

Regras obrigatórias:

- Não use `findFirst()` para buscar somente por `id`.
- Não use `findFirst()` para campos declarados como `@unique`.
- Ao verificar existência por chave única, use `findUnique()` com `select: { id: true }`.
- Quando uma combinação for única pela regra de negócio, represente essa unicidade no schema.
- Quando `findFirst()` significar “primeiro”, “último”, “mais recente” ou “mais antigo”, use `orderBy` explícito.
- Continue aplicando autorização e `isActive: true` mesmo ao usar `findUnique()`.

### Listagens e relações

Toda listagem que possa crescer deve utilizar:

- paginação;
- `take` com limite máximo;
- filtros normalizados;
- ordenação determinística;
- `select` explícito.

Toda relação potencialmente grande deve possuir limite ou paginação própria.

Não execute queries dentro de loops quando uma consulta em lote puder resolver o caso.

Evite N+1:

```ts
const clients = await prisma.client.findMany({
  where: {
    id: {
      in: clientIds,
    },
    isActive: true,
  },
  select: {
    id: true,
    name: true,
  },
})
```

### Consultas independentes

Consultas independentes podem ser executadas em paralelo quando uma não depende do resultado da outra.

```ts
const [cases, total] = await Promise.all([
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
  prisma.case.count({ where }),
])
```

Regras:

- Não use `Promise.all()` automaticamente.
- Não paralelize operações dependentes.
- Dentro de interactive transactions, execute as operações sequencialmente.
- Use `$transaction()` quando atomicidade ou consistência transacional forem necessárias, não apenas para agrupar qualquer conjunto de leituras.

### Uso de `cache()`

Use `cache()` do React para deduplicar queries server-side reutilizadas durante a mesma renderização.

```ts
import { cache } from 'react'

export const getCase = cache(async (caseId: string) => {
  const user = await verifyAuth()

  return prisma.case.findUnique({
    where: {
      id: caseId,
      createdById: user.id,
      isActive: true,
    },
  })
})
```

Use `cache()` quando page, layout, metadata ou múltiplos Server Components puderem chamar a mesma função durante o mesmo render.

Regras importantes:

- Importe `cache` de `react`.
- Defina a função memoizada uma única vez no escopo do módulo.
- Todos os consumidores devem importar a mesma função memoizada.
- Não crie `cache()` dentro de componentes ou dentro de outra função.
- Prefira argumentos primitivos e estáveis.
- Objetos diferentes com o mesmo conteúdo não garantem deduplicação por identidade.
- `cache()` não é cache persistente entre requisições.
- Não use `cache()` para compartilhar dados privados entre usuários.
- Não envolva mutations com `cache()`.
- Cache não substitui paginação, índices, `select` ou queries eficientes.
- Após mutations, use a estratégia de revalidação adequada.

Quando a necessidade for cache persistente entre requisições, defina explicitamente chave, isolamento, duração e invalidação. Não introduza cache persistente silenciosamente.

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
- confie apenas no proxy ou no layout;
- retorne mensagens que revelem se um usuário existe.

Estrutura:

```text
utils/
└── auth/
    ├── get-session.ts
    ├── redirect-auth.ts
    ├── redirect-role.ts
    ├── verify-auth.ts
    ├── has-role.ts
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

## 14. `getSession`

`getSession()` deve ser a única fonte server-side para obter a sessão autenticada atual.

Responsabilidades:

- Ler o cookie HTTP-only.
- Validar assinatura e expiração do JWT.
- Extrair o ID do usuário.
- Buscar o usuário atualizado no banco.
- Filtrar usuário inativo.
- Retornar somente os campos necessários.
- Retornar o usuário ou `null`.
- Não retornar senha nem hash.
- Tratar token inválido como sessão inexistente.

Não confie apenas nos dados armazenados no token para obter informações atualizadas do usuário.

### Cache obrigatório por renderização

`getSession()` deve ser envolvido uma única vez com `cache()` do React no escopo do módulo:

```ts
import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/utils/auth/token'

export const getSession = cache(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)

  if (!payload?.sub || typeof payload.sub !== 'string') {
    return null
  }

  return prisma.user.findUnique({
    where: {
      id: payload.sub,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })
})
```

Regras:

- Todos os helpers de autenticação devem importar essa mesma função.
- Não crie uma versão própria de `getSession()` em cada feature.
- Não envolva `getSession()` novamente com outro `cache()`.
- Não crie `cache()` dentro da função.
- A deduplicação vale para a mesma renderização server-side, não entre usuários ou requisições diferentes.
- Não aplique cache persistente à sessão, role ou autorização por padrão.
- Um erro ocorrido na primeira execução pode ser reutilizado durante o mesmo render; cache não corrige indisponibilidade do banco.

## 15. `redirectAuth`

Use `redirectAuth()` em layouts de grupos de rotas protegidas.

Responsabilidades:

- Obter a sessão por meio de `getSession()`.
- Redirecionar usuários deslogados para `/login`.
- Retornar o usuário autenticado para composição do layout.
- Não substituir autorização por recurso.
- Não ser chamada em Client Components.

Exemplo:

```tsx
import { redirectAuth } from '@/utils/auth/redirect-auth'

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await redirectAuth()

  return <AppShell user={user}>{children}</AppShell>
}
```

Regras:

- Não chame `redirectAuth()` em toda page filha de um layout já protegido.
- Não repita a consulta de autenticação apenas por precaução visual.
- Use um layout aninhado para proteger grupos menores de rotas.
- Pages públicas de autenticação podem usar uma função específica para redirecionar usuários já autenticados, sem misturar esse comportamento com todas as pages protegidas.
- Queries, Server Actions e Route Handlers continuam obrigados a usar `verifyAuth()` porque não devem depender da execução prévia do layout.

## 16. `verifyAuth`

Use em:

- Server Actions;
- Route Handlers;
- queries protegidas;
- funções server-side protegidas.

Responsabilidades:

- Buscar a sessão com `getSession()`.
- Interromper a operação se o usuário não estiver autenticado.
- Retornar o usuário autenticado.
- Não substituir autorização por recurso.
- Não ser chamado em Client Components.

Exemplo:

```ts
const user = await verifyAuth()
```

Como `getSession()` é memoizado no escopo do módulo, múltiplas chamadas de `verifyAuth()` durante a mesma renderização devem reutilizar o mesmo resultado de sessão.

## 17. `redirectRole`

Use em layouts Server Components quando um grupo de rotas exigir uma ou mais roles específicas.

Responsabilidades:

- Chamar `redirectAuth()` para obter o usuário autenticado.
- Comparar a role usando `hasRole()`.
- Permitir acesso quando a role estiver na lista autorizada.
- Redirecionar quando o usuário não possuir permissão de acesso à rota.
- Retornar o usuário autorizado.
- Não ser usado em Server Actions.
- Não ser usado em Client Components.
- Não substituir autorização sobre um recurso específico.

Exemplo:

```ts
import type { Role } from '@prisma/client'
import { redirect } from 'next/navigation'

import { redirectAuth } from './redirect-auth'
import { hasRole } from './has-role'

export const redirectRole = async (allowedRoles: readonly Role[]) => {
  const user = await redirectAuth()

  if (!hasRole(user.role, allowedRoles)) {
    redirect('/unauthorized')
  }

  return user
}
```

Uso recomendado em layout:

```tsx
import { Role } from '@prisma/client'

import { redirectRole } from '@/utils/auth/redirect-role'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await redirectRole([Role.ADMIN])

  return <>{children}</>
}

export default AdminLayout
```

Regras:

- Prefira proteger um grupo de rotas no layout em vez de repetir `redirectRole()` em cada page.
- Use o enum de role gerado pelo Prisma ou uma fonte única equivalente.
- Não compare roles com strings espalhadas pelo projeto.
- Não use role recebida por props, formulário, query string ou localStorage como fonte de autorização.
- A Client Component pode ocultar elementos com base na role recebida do servidor, mas isso é apenas comportamento visual.
- A proteção real deve continuar no servidor.

## 18. `hasRole`

`hasRole()` deve ser uma função pura e síncrona responsável somente por comparar roles.

Ela não deve:

- acessar cookies;
- consultar o banco;
- chamar `getSession()`;
- chamar `verifyAuth()`;
- redirecionar;
- lançar erro de autenticação;
- receber role ou permissão diretamente do cliente como fonte confiável.

Implementação:

```ts
import type { Role } from '@prisma/client'

export const hasRole = (
  currentRole: Role,
  allowedRoles: readonly Role[],
) => allowedRoles.includes(currentRole)
```

Uso em uma Server Action:

```ts
'use server'

import { Role } from '@prisma/client'

import { verifyAuth } from '@/utils/auth/verify-auth'
import { hasRole } from '@/utils/auth/has-role'

export const deactivateUser = async (userId: string) => {
  const currentUser = await verifyAuth()

  if (!hasRole(currentUser.role, [Role.ADMIN])) {
    return {
      ok: false,
      message: 'Você não possui permissão para realizar esta operação',
    }
  }

  // Validar também propriedade, organização e regras do recurso.
}
```

Regras:

- `verifyAuth()` autentica e retorna o usuário.
- `hasRole()` apenas compara a role já confiável desse usuário.
- Mesmo após `hasRole()`, valide propriedade, organização, privacidade e demais regras do recurso.
- Não use `hasRole()` como substituto de autorização por recurso.
- Não crie um helper chamado `hasPermission()` enquanto o projeto possuir apenas comparação de roles.
- Use `hasPermission()` somente quando existir uma matriz real de permissões, como `users:create`, `cases:update` ou `documents:read`.
- Quando um sistema de permissões for criado, a permissão deve ser derivada da role ou de regras server-side, nunca enviada pelo cliente como fonte de verdade.

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

const process = await prisma.process.findUnique({
  where: {
    id: input.id,
    createdById: user.id,
    isActive: true,
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
proxy.ts
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
schemas/
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

Localizado em:

```text
utils/action-result.ts
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

import type { ActionResult } from '@/utils'
import { verifyAuth } from '@/utils/auth/verify-auth'
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
lib/prisma.ts
```

Evite criar uma nova instância do Prisma Client em cada arquivo.

Regras:

- Exporte uma única instância compartilhada de `PrismaClient` por processo.
- Em desenvolvimento, preserve a instância durante hot reload.
- Quando usar `@prisma/adapter-pg`, centralize também o `pg.Pool` em `lib/prisma.ts`.
- Não crie `Client`, `Pool`, adapter ou `PrismaClient` dentro de queries, actions ou componentes.
- Não use `client.query()` diretamente em paralelo sobre a mesma conexão.

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
lib/env.ts
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
- `getSession()` deve ser memoizado uma única vez no escopo do módulo e reutilizado por `redirectAuth()`, `verifyAuth()` e `redirectRole()`.
- Não aplique cache persistente a sessão, roles ou dados usados para autorizar operações.

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

Prefira usar `useMutation` do TanStack Query para gerenciar estado de operações assíncronas:

```tsx
"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { createUpload } from "@/app/uploads/actions/create-upload"

const UploadForm = () => {
  const mutation = useMutation({
    mutationFn: createUpload,
    onSuccess: (result) => {
      if (result.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    },
    onError: () => {
      toast.error("Não foi possível concluir a operação")
    },
  })

  const onSubmit = (values: CreateUploadInput) => {
    mutation.mutate(values)
  }

  return (
    <button
      disabled={mutation.isPending}
      onClick={() => onSubmit(values)}
    >
      {mutation.isPending ? "Enviando..." : "Enviar"}
    </button>
  )
}
```

Para casos simples com `useTransition`, também é válido:

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

## 35. Exclusões, desativação e restauração

Neste projeto, “excluir” significa ocultar ou desativar logicamente o registro.

A aplicação não deve oferecer exclusão física de dados de domínio.

Toda operação de desativação deve:

- validar autenticação;
- validar role quando aplicável;
- validar autorização sobre o recurso;
- confirmar a intenção na interface quando houver risco relevante;
- verificar dependências e efeitos relacionados;
- preservar relacionamentos e histórico;
- registrar quem realizou a operação quando aplicável;
- permitir restauração quando a regra de negócio permitir;
- retornar mensagem clara sem revelar detalhes internos.

Na interface, prefira verbos que representem o efeito real:

- `Desativar`;
- `Arquivar`;
- `Ocultar`;
- `Remover da visualização`.

Evite “Excluir definitivamente”, pois essa operação não deve existir no fluxo comum da aplicação.

Ações destrutivas devem usar `AlertDialog` e explicar que o registro será ocultado, não apagado fisicamente.

## 36. Exclusão lógica (Soft Delete)

Os dados nunca devem ser removidos fisicamente pelo código da aplicação.

### Campos padrão

Todo modelo de domínio que possa ser desativado deve possuir, no mínimo:

```prisma
isActive Boolean @default(true)
```

Para registros que exigem auditoria, use também:

```prisma
deletedAt   DateTime?
deletedById String?
```

Os nomes podem ser adaptados ao domínio, mas a estratégia deve permanecer consistente.

### Operação de desativação

Toda exclusão deve ser uma mutation de atualização:

```ts
const user = await verifyAuth()

const process = await prisma.process.update({
  where: {
    id: processId,
    createdById: user.id,
    isActive: true,
  },
  data: {
    isActive: false,
    deletedAt: new Date(),
    deletedById: user.id,
  },
  select: {
    id: true,
  },
})
```

Quando o modelo possuir apenas `isActive`, a mutation deve alterar esse campo para `false`.

### Operação de restauração

Quando a restauração for permitida:

```ts
await prisma.process.update({
  where: {
    id: processId,
    isActive: false,
  },
  data: {
    isActive: true,
    deletedAt: null,
    deletedById: null,
  },
})
```

### Proibições obrigatórias

Não use no código da aplicação:

- `prisma.<model>.delete()`;
- `prisma.<model>.deleteMany()`;
- `tx.<model>.delete()`;
- `tx.<model>.deleteMany()`;
- nested writes com `delete` ou `deleteMany`;
- SQL `DELETE` para dados de domínio;
- `onDelete: Cascade` como padrão;
- remoção física de arquivos imediatamente após desativar o registro.

Relacionamentos devem usar comportamento restritivo por padrão. Qualquer exceção exige solicitação explícita, análise de impacto e documentação.

Migrations não devem introduzir `DROP TABLE`, `DROP COLUMN`, truncamento ou remoção destrutiva de dados sem solicitação explícita, backup e plano de migração.

### Filtros obrigatórios

Todas as consultas comuns devem filtrar registros ativos:

```ts
const cases = await prisma.case.findMany({
  where: {
    isActive: true,
  },
})
```

O filtro também se aplica a:

- `findUnique()` e `findFirst()`;
- `count()`;
- verificações de existência;
- relações aninhadas;
- selects de documentos, movimentações, prazos e fichas;
- consultas usadas por autenticação e autorização;
- relatórios e exportações comuns.

Exemplo com relação:

```ts
const process = await prisma.process.findUnique({
  where: {
    id: processId,
    isActive: true,
  },
  select: {
    id: true,
    movements: {
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
      },
    },
  },
})
```

Consultas de registros inativos devem ser explícitas e possuir finalidade clara, como administração, auditoria ou restauração.

### Unicidade e registros inativos

Ao criar constraints únicas, defina conscientemente se um valor pertencente a um registro inativo pode ou não ser reutilizado.

Não remova uma constraint única nem altere o schema silenciosamente apenas para permitir duplicação após soft delete.

### Arquivos

Ao desativar um documento:

- preserve seus metadados;
- preserve o vínculo com o registro original;
- não apague o arquivo físico pelo fluxo comum;
- impeça seu acesso nas consultas normais;
- mantenha possibilidade de restauração quando aplicável.

### Garantia automatizada

O CI deve possuir uma verificação que falhe ao encontrar uso não autorizado de:

```text
.delete(
.deleteMany(
delete:
deleteMany:
DELETE FROM
```

A verificação automatizada não substitui revisão, mas impede que hard deletes óbvios sejam adicionados silenciosamente.

Qualquer falso positivo deve ser tratado explicitamente. Não desative a verificação global apenas para liberar o build.

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
- [ ] Existe no máximo uma ação primária visível por página.
- [ ] Não existem ações repetidas no cabeçalho, cards, sidebar, alertas ou estados vazios.
- [ ] Ações de página, seção e item estão nos locais corretos.

### Dados e componentes

- [ ] Não existem consultas Prisma em Client Components.
- [ ] Os dados enviados ao cliente são serializáveis.
- [ ] Somente os campos necessários são retornados.
- [ ] Listagens usam a apresentação mais simples adequada à interface.
- [ ] Não foi introduzido TanStack Table sem solicitação explícita.
- [ ] Paginação server-side foi utilizada quando a quantidade de dados pode crescer.
- [ ] Todas as queries Prisma de leitura estão em arquivos separados dentro de `queries`.
- [ ] `findUnique()` foi priorizado quando existe chave única.
- [ ] `findFirst()` possui justificativa e `orderBy` quando representa primeiro ou último registro.
- [ ] Não existem queries dentro de loops nem N+1 conhecido.
- [ ] Relações potencialmente grandes possuem limite.
- [ ] Queries reutilizáveis usam `cache()` do React quando há reutilização no mesmo render.
- [ ] `getSession()` usa uma única função memoizada no escopo do módulo.

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

- [ ] O grupo de rotas protegidas usa `redirectAuth()` no layout compartilhado.
- [ ] Pages filhas não repetem `redirectAuth()` sem necessidade explícita.
- [ ] Toda query, Server Action e Route Handler protegido usa `verifyAuth()`.
- [ ] Toda mutation protegida valida autenticação.
- [ ] Toda operação por recurso valida autorização.
- [ ] Grupos restritos por role usam `redirectRole()` no layout quando aplicável.
- [ ] Actions, Route Handlers e queries restritas por role usam `verifyAuth()` e `hasRole()`.
- [ ] `hasRole()` apenas compara roles e não acessa sessão ou banco.
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
- [ ] Desativações verificam dependências.
- [ ] Não existe uso de `delete()`, `deleteMany()`, nested delete ou SQL `DELETE` no código da aplicação.
- [ ] Models desativáveis possuem a estratégia de soft delete definida.
- [ ] Queries, counts e relações filtram `isActive: true` por padrão.
- [ ] A restauração foi considerada quando aplicável.
- [ ] Não existe cascade destrutivo não autorizado.
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
15. Antes de criar ações, faça um inventário de ação primária, secundárias, contextuais e de item.
16. Não repita a mesma ação no cabeçalho, sidebar, cards, alertas ou estados vazios.
17. Não crie card “Ações” quando ele apenas repetir botões já existentes.
18. Mantenha no máximo uma ação primária visível por página.
19. Analise duplicidades semânticas, não apenas botões com o mesmo texto.
20. Defina um identificador conceitual, escopo, modo e local canônico para cada ação.
21. Não misture ações de recurso, edição, prévia e item na mesma toolbar.
22. Exiba ações somente no modo em que são válidas e úteis.
23. Não use múltiplos controles genéricos chamados `Configurações`; diferencie o escopo ou mantenha apenas um.
24. Renderize e audite visualmente a tela em desktop e mobile antes de considerá-la concluída.
25. Não afirme que a UI foi validada quando a rota não foi renderizada ou inspecionada visualmente.
26. Não crie tipos redundantes.
27. Não crie componentes de UI duplicados.
28. Não crie abstrações antecipadas.
29. Não introduza TanStack Table sem solicitação explícita.
30. Não crie automaticamente arquivos `data`, `table` e `columns`.
31. Não coloque várias actions no mesmo arquivo.
32. Não coloque várias queries sem relação no mesmo arquivo.
33. Coloque toda consulta de leitura em um arquivo separado dentro de `queries`.
34. Não fragmente um caso de uso coeso em várias queries pequenas sem benefício.
35. Use nomes explícitos como `list-cases.ts`, `get-case.ts` e `count-cases.ts`.
36. Priorize `findUnique()` para `@id`, `@unique`, `@@id` e `@@unique`.
37. Use `findFirst()` somente quando não houver chave única aplicável ou quando a ordenação definir o primeiro registro.
38. Não faça queries dentro de loops e evite N+1.
39. Envolva queries server-side reutilizáveis com `cache()` do React quando houver reutilização no mesmo render.
40. Mantenha `getSession()` memoizado uma única vez no escopo do módulo.
41. Não faça consultas Prisma diretamente em pages, layouts ou componentes React.
42. Não faça consultas ao banco em Client Components.
43. Use `redirectAuth()` no layout compartilhado das rotas protegidas.
44. Não repita `redirectAuth()` em toda page filha.
45. Use `verifyAuth()` em queries, Server Actions e Route Handlers protegidos.
46. Use `redirectRole()` em layouts de grupos restritos por role.
47. Use `hasRole()` somente para comparar a role confiável retornada pelo servidor.
48. Não faça `hasRole()` acessar cookie, sessão ou banco.
49. Não chame comparação de role de `hasPermission()` sem existir uma matriz real de permissões.
50. Não confie no proxy ou no layout como única proteção.
51. Não implemente apenas autenticação quando também for necessária autorização.
52. Nunca aceite role, `userId` ou permissões do cliente como fonte de autorização.
53. Não use `delete()`, `deleteMany()`, nested delete ou SQL `DELETE` para dados de domínio.
54. Toda exclusão funcional deve ser soft delete.
55. Filtre `isActive: true` em queries, counts e relações por padrão.
56. Não introduza `onDelete: Cascade` sem autorização explícita e análise de impacto.
57. Não remova fisicamente arquivos no fluxo comum de desativação.
58. Não retorne modelos completos do Prisma ao cliente sem necessidade.
59. Não carregue todos os registros quando a listagem puder crescer.
60. Não exponha mensagens internas, tokens, senhas ou dados sensíveis.
61. Não finalize uma implementação que viole este documento.
62. Execute as verificações disponíveis antes de concluir.
63. Informe claramente qualquer limitação, conflito, warning ou regra não atendida.

## 44. Critério final

Uma implementação só pode ser considerada concluída quando:

- funciona;
- respeita as regras de negócio;
- está protegida por autenticação e autorização;
- mantém a organização por feature;
- não expõe dados sensíveis;
- possui validação server-side;
- mantém consistência no banco;
- não possui ações visuais repetidas ou semanticamente equivalentes;
- exibe cada ação somente no modo e escopo corretos;
- possui toolbars com responsabilidade clara;
- teve a interface renderizada e auditada visualmente, ou declara explicitamente essa limitação;
- não possui hard delete no código da aplicação;
- trata loading e erro;
- passa nas verificações do projeto;
- não viola este documento.
