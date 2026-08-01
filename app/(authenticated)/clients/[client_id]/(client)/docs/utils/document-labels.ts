import type {
  ClientDocumentCategory,
  ClientDocumentStatus,
  ClientDocumentVisibility,
} from "@/app/generated/prisma/enums";

export const clientDocumentCategoryLabels: Record<
  ClientDocumentCategory,
  string
> = {
  IDENTIFICACAO: "Identificação",
  CONTRATO: "Contrato",
  PROCURACAO: "Procuração",
  COMPROVANTE: "Comprovante",
  CORRESPONDENCIA: "Correspondência",
  DOCUMENTO_JURIDICO: "Documento jurídico",
  DOCUMENTO_FINANCEIRO: "Financeiro",
  OUTRO: "Outro",
};

export const clientDocumentVisibilityLabels: Record<
  ClientDocumentVisibility,
  string
> = {
  EQUIPE: "Equipe",
  CLIENTE: "Cliente",
  CONFIDENCIAL: "Confidencial",
};

export const clientDocumentStatusLabels: Record<ClientDocumentStatus, string> =
  {
    ATIVO: "Ativo",
    ARQUIVADO: "Arquivado",
  };

/**
 * Mesmo padrão de badge com tinta leve usado em outras listas do projeto
 * (ex.: status de ficha de atendimento): fundo suave na cor do token e
 * texto na cor cheia, nunca preenchimento sólido com texto branco.
 */
export const clientDocumentVisibilityBadgeClasses: Record<
  ClientDocumentVisibility,
  string
> = {
  EQUIPE: "border-accent-foreground/25 bg-accent text-accent-foreground",
  CLIENTE: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  CONFIDENCIAL: "border-destructive/30 bg-destructive/8 text-destructive",
};

/**
 * Identidade visual da "pasta" de cada categoria no card do arquivo. Usa só
 * os tokens já existentes no Design System (`primary` e `chart-1..5`) em
 * vez da paleta própria do protótipo, para não introduzir cores novas —
 * por isso duas categorias adjacentes (jurídico/contrato e
 * financeiro/identificação) dividem o mesmo tom.
 */
export const clientDocumentFolderTokens: Record<
  ClientDocumentCategory,
  {
    tab: string;
    back: string;
    front: string;
    accentText: string;
  }
> = {
  CONTRATO: {
    tab: "bg-primary text-primary-foreground",
    back: "border-primary/25 bg-primary/12",
    front: "border-primary/70 bg-primary text-primary-foreground",
    accentText: "text-primary",
  },
  DOCUMENTO_JURIDICO: {
    tab: "bg-primary text-primary-foreground",
    back: "border-primary/25 bg-primary/12",
    front: "border-primary/70 bg-primary text-primary-foreground",
    accentText: "text-primary",
  },
  IDENTIFICACAO: {
    tab: "bg-chart-2 text-white",
    back: "border-chart-2/25 bg-chart-2/12",
    front: "border-chart-2/70 bg-chart-2 text-white",
    accentText: "text-chart-2",
  },
  DOCUMENTO_FINANCEIRO: {
    tab: "bg-chart-2 text-white",
    back: "border-chart-2/25 bg-chart-2/12",
    front: "border-chart-2/70 bg-chart-2 text-white",
    accentText: "text-chart-2",
  },
  PROCURACAO: {
    tab: "bg-chart-3 text-white",
    back: "border-chart-3/25 bg-chart-3/12",
    front: "border-chart-3/70 bg-chart-3 text-white",
    accentText: "text-chart-3",
  },
  COMPROVANTE: {
    tab: "bg-chart-4 text-white",
    back: "border-chart-4/25 bg-chart-4/12",
    front: "border-chart-4/70 bg-chart-4 text-white",
    accentText: "text-chart-4",
  },
  CORRESPONDENCIA: {
    tab: "bg-chart-5 text-white",
    back: "border-chart-5/25 bg-chart-5/12",
    front: "border-chart-5/70 bg-chart-5 text-white",
    accentText: "text-chart-5",
  },
  OUTRO: {
    tab: "bg-muted-foreground text-background",
    back: "border-border bg-muted",
    front: "border-muted-foreground/70 bg-muted-foreground text-background",
    accentText: "text-muted-foreground",
  },
};
