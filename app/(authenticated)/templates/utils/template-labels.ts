import type {
  TemplateCategory,
  TemplateStatus,
} from "@/app/generated/prisma/enums";

export const templateCategoryLabels: Record<TemplateCategory, string> = {
  CONTRATO: "Contrato",
  PETICAO: "Petição",
  PROCURACAO: "Procuração",
  NOTIFICACAO: "Notificação",
  FICHA: "Ficha",
  OUTRO: "Outro",
};

export const templateStatusLabels: Record<TemplateStatus, string> = {
  RASCUNHO: "Rascunho",
  ATIVO: "Ativo",
  INATIVO: "Inativo",
};

export const templateStatusBadgeClasses: Record<TemplateStatus, string> = {
  ATIVO: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  RASCUNHO: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  INATIVO: "border-border bg-muted text-muted-foreground",
};
