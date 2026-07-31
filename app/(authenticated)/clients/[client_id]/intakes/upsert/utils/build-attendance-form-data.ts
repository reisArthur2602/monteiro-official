import type { Prisma } from "@/app/generated/prisma/client";
import type { ClientAttendanceActionType } from "@/app/generated/prisma/enums";

import type { AttendanceFormDraftParsed } from "../schemas/attendance-form-schema";

export const buildAttendanceFormScalarData = (
  values: AttendanceFormDraftParsed,
) => ({
  channel: values.channel ?? null,
  contactPerson: values.contactPerson ?? null,
  legalArea: values.legalArea ?? null,
  subject: values.subject ?? null,
  clientReport: values.clientReport ?? null,
  preliminaryAnalysis: values.preliminaryAnalysis ?? null,
});

/**
 * Substitui por completo as ações selecionadas da ficha.
 *
 * Mais simples que diferenciar quais entraram/saíram: a lista vem inteira
 * do formulário a cada envio, então apagar e recriar é direto e não deixa
 * ação órfã para trás.
 */
export const persistAttendanceActions = async (
  tx: Prisma.TransactionClient,
  attendanceFormId: string,
  actions: ClientAttendanceActionType[],
) => {
  await tx.clientAttendanceAction.deleteMany({
    where: { attendanceFormId },
  });

  if (actions.length === 0) {
    return;
  }

  await tx.clientAttendanceAction.createMany({
    data: actions.map((type, position) => ({
      attendanceFormId,
      type,
      position,
    })),
  });
};
