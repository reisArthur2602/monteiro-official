import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import { mapAttendanceFormToValues } from "../mappers/attendance-form-mapper";

/**
 * Carrega a ficha para edição, restrita ao cliente da rota — um `formId`
 * de outro cliente não deve ser editável a partir daqui.
 *
 * Retorna `null` quando não existe, está excluída logicamente ou não
 * pertence a este cliente.
 */
export const getAttendanceFormForEdit = cache(
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
        attendanceAt: true,
        responsible: {
          select: { id: true, name: true },
        },
        actions: {
          select: { type: true },
        },
      },
    });

    if (!form) {
      return null;
    }

    return {
      formId: form.id,
      status: form.status,
      attendanceAt: form.attendanceAt.toISOString(),
      responsibleName: form.responsible.name,
      values: mapAttendanceFormToValues(form),
    };
  },
);
