import type {
  AttendanceChannel,
  AttendanceFormStatus,
} from "@/app/generated/prisma/enums";

export const attendanceFormStatusLabels: Record<AttendanceFormStatus, string> =
  {
    RASCUNHO: "Rascunho",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
  };

/**
 * Mesmos tokens do Design System usados nos badges de cliente:
 * `chart-2` para o estado concluído, `chart-3` para o que ainda exige
 * atenção e `destructive` para o encerrado sem sucesso.
 */
export const attendanceFormStatusBadgeClasses: Record<
  AttendanceFormStatus,
  string
> = {
  FINALIZADA: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  RASCUNHO: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  CANCELADA: "border-destructive/30 bg-destructive/8 text-destructive",
};

/** Verbo do rodapé do card, coerente com o que o status representa. */
export const attendanceFormFooterVerb: Record<AttendanceFormStatus, string> = {
  RASCUNHO: "Salva",
  FINALIZADA: "Atualizada",
  CANCELADA: "Encerrada",
};

export const attendanceChannelLabels: Record<AttendanceChannel, string> = {
  PRESENCIAL: "Presencial",
  TELEFONE: "Telefone",
  VIDEOCHAMADA: "Videochamada",
  EMAIL: "E-mail",
  WHATSAPP: "WhatsApp",
  OUTRO: "Outro",
};
