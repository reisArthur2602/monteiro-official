import { cache } from "react";

import {
  ProcessDeadlineStatus,
  ProcessStatus,
} from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import { ACTIVE_PROCESS_STATUSES } from "../utils/case-labels";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

const OPEN_DEADLINE_STATUSES = [
  ProcessDeadlineStatus.ABERTO,
  ProcessDeadlineStatus.EM_ANDAMENTO,
  ProcessDeadlineStatus.VENCIDO,
];

/**
 * Números da faixa de resumo e contador da aba "Processos".
 *
 * Movimentos, prazos e documentos são contados pelo relacionamento com o
 * processo do cliente — por isso o filtro por `process` em cada `count`.
 */
export const summarizeClientCases = cache(async (clientId: string) => {
  await verifyAuth();

  const scopedProcess = { clientId, deletedAt: null };
  const now = new Date();

  const [
    total,
    active,
    inProgress,
    underAnalysis,
    movements,
    recentMovements,
    openDeadlines,
    dueSoonDeadlines,
    documents,
  ] = await prisma.$transaction([
    prisma.process.count({ where: scopedProcess }),
    prisma.process.count({
      where: { ...scopedProcess, status: { in: ACTIVE_PROCESS_STATUSES } },
    }),
    prisma.process.count({
      where: { ...scopedProcess, status: ProcessStatus.EM_ANDAMENTO },
    }),
    prisma.process.count({
      where: { ...scopedProcess, status: ProcessStatus.EM_ANALISE },
    }),

    prisma.processMovement.count({
      where: { deletedAt: null, process: scopedProcess },
    }),
    prisma.processMovement.count({
      where: {
        deletedAt: null,
        process: scopedProcess,
        movementAt: { gte: new Date(now.getTime() - SEVEN_DAYS_MS) },
      },
    }),

    prisma.processDeadline.count({
      where: {
        deletedAt: null,
        status: { in: OPEN_DEADLINE_STATUSES },
        process: scopedProcess,
      },
    }),
    prisma.processDeadline.count({
      where: {
        deletedAt: null,
        status: { in: OPEN_DEADLINE_STATUSES },
        process: scopedProcess,
        dueAt: { lte: new Date(now.getTime() + TEN_DAYS_MS) },
      },
    }),

    prisma.processDocument.count({
      where: { process: scopedProcess },
    }),
  ]);

  return {
    total,
    active,
    inProgress,
    underAnalysis,
    movements,
    recentMovements,
    openDeadlines,
    dueSoonDeadlines,
    documents,
  };
});
