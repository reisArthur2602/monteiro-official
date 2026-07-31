import { cache } from "react";

import { AttendanceFormStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Contagem de fichas do cliente por status, para a faixa de resumo da
 * listagem e para o contador na aba "Fichas" do layout de contexto.
 *
 * Contagens separadas em vez de `groupBy`: cada uma cai direto num índice
 * de `[clientId, status, deletedAt]`, e rodam na mesma transação para que
 * os números sejam lidos de um único ponto no tempo.
 */
export const summarizeClientAttendanceForms = cache(
  async (clientId: string) => {
    await verifyAuth();

    const scoped = { clientId, deletedAt: null };

    const [rascunho, finalizada, cancelada] = await prisma.$transaction([
      prisma.clientAttendanceForm.count({
        where: { ...scoped, status: AttendanceFormStatus.RASCUNHO },
      }),
      prisma.clientAttendanceForm.count({
        where: { ...scoped, status: AttendanceFormStatus.FINALIZADA },
      }),
      prisma.clientAttendanceForm.count({
        where: { ...scoped, status: AttendanceFormStatus.CANCELADA },
      }),
    ]);

    return {
      total: rascunho + finalizada + cancelada,
      byStatus: {
        [AttendanceFormStatus.RASCUNHO]: rascunho,
        [AttendanceFormStatus.FINALIZADA]: finalizada,
        [AttendanceFormStatus.CANCELADA]: cancelada,
      },
    };
  },
);
