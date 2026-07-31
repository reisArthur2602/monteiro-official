import { ClientAttendanceActionType } from "@/app/generated/prisma/enums";

type ActionOption = {
  value: ClientAttendanceActionType;
  label: string;
  description: string;
};

type ActionGroup = {
  title: string;
  description: string;
  options: ActionOption[];
};

/**
 * Os 16 valores do enum `ClientAttendanceActionType`, agrupados por etapa
 * do atendimento. Cada valor aparece em exatamente um grupo — se um valor
 * novo for adicionado ao enum, o TypeScript não avisa aqui, então ao
 * alterar o enum revise este catálogo também.
 */
export const attendanceActionGroups: ActionGroup[] = [
  {
    title: "Documentos e informações",
    description: "Providências relacionadas à coleta e análise documental.",
    options: [
      {
        value: ClientAttendanceActionType.SOLICITAR_DOCUMENTOS,
        label: "Solicitar documentos ao cliente",
        description: "Enviar lista de documentos necessários.",
      },
      {
        value: ClientAttendanceActionType.ANALISAR_DOCUMENTOS,
        label: "Analisar documentos recebidos",
        description: "Revisar contratos, comprovantes e comunicações.",
      },
      {
        value: ClientAttendanceActionType.SOLICITAR_INFORMACOES_COMPLEMENTARES,
        label: "Solicitar informações complementares",
        description: "Obter esclarecimentos adicionais do cliente.",
      },
      {
        value: ClientAttendanceActionType.CONSULTAR_PROCESSO_EXISTENTE,
        label: "Consultar processo existente",
        description: "Verificar autos, movimentações e documentos processuais.",
      },
    ],
  },
  {
    title: "Análise e produção jurídica",
    description: "Atividades técnicas que serão executadas pelo escritório.",
    options: [
      {
        value: ClientAttendanceActionType.REALIZAR_PESQUISA_JURIDICA,
        label: "Realizar pesquisa jurídica",
        description:
          "Pesquisar legislação, precedentes e entendimento aplicável.",
      },
      {
        value: ClientAttendanceActionType.ELABORAR_PARECER,
        label: "Elaborar parecer ou orientação",
        description: "Consolidar análise e recomendações ao cliente.",
      },
      {
        value: ClientAttendanceActionType.ELABORAR_CONTRATO_OU_ADITIVO,
        label: "Elaborar contrato ou aditivo",
        description: "Produzir ou revisar instrumento contratual.",
      },
      {
        value: ClientAttendanceActionType.ELABORAR_NOTIFICACAO_EXTRAJUDICIAL,
        label: "Elaborar notificação extrajudicial",
        description: "Preparar comunicação formal à parte contrária.",
      },
    ],
  },
  {
    title: "Medidas processuais",
    description: "Providências judiciais ou administrativas possíveis.",
    options: [
      {
        value: ClientAttendanceActionType.ELABORAR_PETICAO,
        label: "Elaborar petição",
        description: "Preparar manifestação em processo existente.",
      },
      {
        value: ClientAttendanceActionType.PROPOR_ACAO_JUDICIAL,
        label: "Propor ação judicial",
        description: "Preparar cadastro e ajuizamento de nova demanda.",
      },
      {
        value: ClientAttendanceActionType.APRESENTAR_DEFESA,
        label: "Apresentar defesa",
        description: "Elaborar contestação, recurso ou manifestação defensiva.",
      },
      {
        value: ClientAttendanceActionType.ABRIR_PROCESSO_INTERNO,
        label: "Abrir processo no sistema",
        description: "Criar processo interno vinculado ao cliente.",
      },
    ],
  },
  {
    title: "Relacionamento e acompanhamento",
    description: "Ações de retorno, proposta e continuidade do atendimento.",
    options: [
      {
        value: ClientAttendanceActionType.AGENDAR_RETORNO,
        label: "Agendar retorno com o cliente",
        description: "Marcar nova conversa para continuidade do atendimento.",
      },
      {
        value: ClientAttendanceActionType.ENVIAR_PROPOSTA_HONORARIOS,
        label: "Enviar proposta de honorários",
        description: "Preparar e encaminhar proposta comercial.",
      },
      {
        value: ClientAttendanceActionType.ENCAMINHAR_OUTRA_AREA,
        label: "Encaminhar para outra área",
        description: "Direcionar o caso para equipe especializada.",
      },
      {
        value: ClientAttendanceActionType.ENCERRAR_SEM_PROVIDENCIAS,
        label: "Encerrar sem novas providências",
        description: "Registrar que não haverá continuidade do caso.",
      },
    ],
  },
];

export const attendanceActionLabels: Record<
  ClientAttendanceActionType,
  string
> = Object.fromEntries(
  attendanceActionGroups.flatMap((group) =>
    group.options.map((option) => [option.value, option.label]),
  ),
) as Record<ClientAttendanceActionType, string>;
