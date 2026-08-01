import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Dados do processo para o cabeçalho de contexto e para a Visão geral.
 *
 * O processo é buscado sempre com o cliente da rota no `where` — um
 * `caseId` de outro cliente não deve abrir aqui. Como esta página não
 * fica aninhada no layout do cliente, os dados básicos do cliente também
 * são resolvidos aqui, para o cabeçalho e a navegação de volta.
 *
 * Retorna `null` quando o processo não existe, está excluído logicamente
 * ou não pertence a este cliente.
 */
export const getCaseContext = cache(async (clientId: string, caseId: string) => {
  await verifyAuth();

  const item = await prisma.process.findFirst({
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
      updatedAt: true,
      responsible: {
        select: { id: true, name: true },
      },
      attendanceForm: {
        select: { id: true, subject: true },
      },
      client: {
        select: {
          id: true,
          name: true,
          displayName: true,
          document: true,
          type: true,
          status: true,
        },
      },
    },
  });

  if (!item) {
    return null;
  }

  return {
    ...item,
    filingDate: item.filingDate?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
});

export type CaseContext = NonNullable<
  Awaited<ReturnType<typeof getCaseContext>>
>;
