import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import { mapCaseToValues } from "../mappers/case-form-mapper";

/**
 * Carrega o processo para edição, restrito ao cliente da rota — um
 * `caseId` de outro cliente não deve ser editável a partir daqui.
 *
 * Retorna `null` quando não existe, está excluído logicamente ou não
 * pertence a este cliente.
 */
export const getCaseForEdit = cache(
  async (clientId: string, caseId: string) => {
    await verifyAuth();

    const item = await prisma.process.findUnique({
      where: {
        id: caseId,
        clientId,
        deletedAt: null,
      },
      select: {
        id: true,
        internalCode: true,
        number: true,
        title: true,
        legalArea: true,
        type: true,
        status: true,
        clientRole: true,
        court: true,
        courtUnit: true,
        jurisdiction: true,
        state: true,
        filingDate: true,
        notes: true,
        createdAt: true,
        responsible: {
          select: { id: true, name: true },
        },
        attendanceForm: {
          select: {
            id: true,
            subject: true,
            legalArea: true,
            attendanceAt: true,
            finalizedAt: true,
            finalizedBy: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!item) {
      return null;
    }

    return {
      caseId: item.id,
      responsibleName: item.responsible.name,
      createdAt: item.createdAt.toISOString(),
      origin: {
        id: item.attendanceForm.id,
        subject: item.attendanceForm.subject,
        legalArea: item.attendanceForm.legalArea,
        attendanceAt: item.attendanceForm.attendanceAt.toISOString(),
        finalizedAt: item.attendanceForm.finalizedAt?.toISOString() ?? null,
        finalizedByName: item.attendanceForm.finalizedBy?.name ?? null,
      },
      values: mapCaseToValues({
        ...item,
        filingDate: item.filingDate?.toISOString() ?? null,
      }),
    };
  },
);
