import type {
  ProcessClientRole,
  ProcessDeadlineStatus,
  ProcessPartyRole,
  ProcessStatus,
  ProcessType,
} from "@/app/generated/prisma/enums";

export const processStatusLabels: Record<ProcessStatus, string> = {
  EM_ANALISE: "Em análise",
  AGUARDANDO_DOCUMENTOS: "Aguardando documentos",
  AGUARDANDO_DISTRIBUICAO: "Aguardando distribuição",
  EM_ANDAMENTO: "Em andamento",
  AGUARDANDO_DECISAO: "Aguardando decisão",
  SUSPENSO: "Suspenso",
  ENCERRADO: "Encerrado",
  ARQUIVADO: "Arquivado",
  CANCELADO: "Cancelado",
};

export const processTypeLabels: Record<ProcessType, string> = {
  JUDICIAL: "Judicial",
  ADMINISTRATIVO: "Administrativo",
  EXTRAJUDICIAL: "Extrajudicial",
  CONSULTIVO: "Consultivo",
};

export const processClientRoleLabels: Record<ProcessClientRole, string> = {
  AUTOR: "Autor",
  REU: "Réu",
  INTERESSADO: "Interessado",
  TERCEIRO: "Terceiro",
  REQUERENTE: "Requerente",
  REQUERIDO: "Requerido",
  EXEQUENTE: "Exequente",
  EXECUTADO: "Executado",
  RECORRENTE: "Recorrente",
  RECORRIDO: "Recorrido",
  OUTRO: "Outro",
};

/**
 * Mesmo padrão de badge com tinta leve das outras listas do projeto:
 * `chart-2` para o que corre bem, `chart-3` para o que aguarda ação,
 * `destructive` para o encerrado sem sucesso e neutro para o inerte.
 */
export const processStatusBadgeClasses: Record<ProcessStatus, string> = {
  EM_ANDAMENTO: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  ENCERRADO: "border-chart-2/40 bg-chart-2/12 text-chart-2",

  EM_ANALISE: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  AGUARDANDO_DOCUMENTOS: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  AGUARDANDO_DISTRIBUICAO: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  AGUARDANDO_DECISAO: "border-chart-3/40 bg-chart-3/12 text-chart-3",

  CANCELADO: "border-destructive/30 bg-destructive/8 text-destructive",

  SUSPENSO: "border-border bg-muted text-muted-foreground",
  ARQUIVADO: "border-border bg-muted text-muted-foreground",
};

/**
 * Status que contam como processo ativo no resumo: tudo que ainda exige
 * acompanhamento do escritório.
 */
export const ACTIVE_PROCESS_STATUSES: ProcessStatus[] = [
  "EM_ANALISE",
  "AGUARDANDO_DOCUMENTOS",
  "AGUARDANDO_DISTRIBUICAO",
  "EM_ANDAMENTO",
  "AGUARDANDO_DECISAO",
];

/**
 * Status oferecidos no cadastro. Um processo recém-criado não nasce
 * encerrado, suspenso ou arquivado — esses só aparecem na edição.
 */
export const INITIAL_PROCESS_STATUSES: ProcessStatus[] = [
  "EM_ANALISE",
  "AGUARDANDO_DOCUMENTOS",
  "AGUARDANDO_DISTRIBUICAO",
  "EM_ANDAMENTO",
];

export const processDeadlineStatusLabels: Record<ProcessDeadlineStatus, string> = {
  ABERTO: "Aberto",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  VENCIDO: "Vencido",
};

export const processDeadlineStatusBadgeClasses: Record<ProcessDeadlineStatus, string> = {
  ABERTO: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  EM_ANDAMENTO: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  VENCIDO: "border-destructive/30 bg-destructive/8 text-destructive",
  CONCLUIDO: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  CANCELADO: "border-border bg-muted text-muted-foreground",
};

/** Status que ainda pedem alguma providência — usados para "prazos abertos". */
export const OPEN_DEADLINE_STATUSES: ProcessDeadlineStatus[] = [
  "ABERTO",
  "EM_ANDAMENTO",
  "VENCIDO",
];

export const processPartyRoleLabels: Record<ProcessPartyRole, string> = {
  AUTOR: "Autor",
  REU: "Réu",
  INTERESSADO: "Interessado",
  TERCEIRO: "Terceiro",
  REQUERENTE: "Requerente",
  REQUERIDO: "Requerido",
  EXEQUENTE: "Exequente",
  EXECUTADO: "Executado",
  RECORRENTE: "Recorrente",
  RECORRIDO: "Recorrido",
  ADVOGADO: "Advogado",
  REPRESENTANTE: "Representante",
  TESTEMUNHA: "Testemunha",
  OUTRO: "Outro",
};
