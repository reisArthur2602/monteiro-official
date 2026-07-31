import { cache } from "react";

import { AttendanceFormStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Ficha de origem candidata a virar processo, restrita ao cliente da rota.
 *
 * Retorna `null` quando não existe, está excluída ou pertence a outro
 * cliente. Quando existe, devolve os motivos de inelegibilidade em vez de
 * esconder a ficha: a tela precisa explicar por que não dá para seguir.
 */
export const getAttendanceFormForCase = cache(
  async (clientId: string, formId: string) => {
    await verifyAuth();

    const form = await prisma.clientAttendanceForm.findFirst({
      where: {
        id: formId,
        clientId,
        deletedAt: null,
      },
      select: {
        id: true,
        subject: true,
        legalArea: true,
        status: true,
        attendanceAt: true,
        finalizedAt: true,
        finalizedBy: {
          select: { id: true, name: true },
        },
        responsible: {
          select: { id: true, name: true },
        },
        process: {
          select: { id: true },
        },
      },
    });

    if (!form) {
      return null;
    }

    return {
      id: form.id,
      subject: form.subject,
      legalArea: form.legalArea,
      status: form.status,
      attendanceAt: form.attendanceAt.toISOString(),
      finalizedAt: form.finalizedAt?.toISOString() ?? null,
      finalizedByName: form.finalizedBy?.name ?? null,
      responsibleName: form.responsible.name,
      existingCaseId: form.process?.id ?? null,
      isFinalized: form.status === AttendanceFormStatus.FINALIZADA,
    };
  },
);

export type AttendanceFormForCase = NonNullable<
  Awaited<ReturnType<typeof getAttendanceFormForCase>>
>;
