import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Ficha completa para a tela de detalhe/impressão, restrita ao cliente da
 * rota — um `formId` de outro cliente não deve abrir aqui.
 *
 * Retorna `null` quando não existe, está excluída logicamente ou não
 * pertence a este cliente.
 */
export const getAttendanceFormDetail = cache(
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
        status: true,
        channel: true,
        contactPerson: true,
        legalArea: true,
        subject: true,
        clientReport: true,
        preliminaryAnalysis: true,
        revision: true,
        attendanceAt: true,
        createdAt: true,
        updatedAt: true,
        responsible: {
          select: { id: true, name: true },
        },
        createdBy: {
          select: { id: true, name: true },
        },
        actions: {
          select: { type: true },
          orderBy: { position: "asc" },
        },
        // Relação um-para-um: revela se a ficha já originou um processo,
        // o que decide entre "Gerar processo" e "Abrir processo".
        process: {
          select: { id: true },
        },
      },
    });

    if (!form) {
      return null;
    }

    return {
      ...form,
      attendanceAt: form.attendanceAt.toISOString(),
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
    };
  },
);

export type AttendanceFormDetail = NonNullable<
  Awaited<ReturnType<typeof getAttendanceFormDetail>>
>;
