import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import { OPEN_DEADLINE_STATUSES } from "../../../../(client)/cases/utils/case-labels";

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

const startOfToday = () => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Todos os dados da Visão geral do processo: informações principais,
 * origem, movimentações recentes, próximos prazos, partes principais,
 * documentos recentes e auditoria.
 *
 * Fica separada de `get-case-context` (usada pelo layout para o
 * cabeçalho) porque a Visão geral precisa de bem mais relações — não faz
 * sentido carregar tudo isso só para desenhar o cabeçalho e as abas.
 *
 * As sub-consultas usam `process: { id, clientId, deletedAt: null }` como
 * filtro em vez de confiar em `processId` sozinho: mesmo que o processo
 * não exista ou seja de outro cliente, elas só retornam vazio — quem
 * decide o 404 é o resultado da consulta principal.
 */
export const getCaseOverview = cache(
  async (clientId: string, caseId: string) => {
    await verifyAuth();

    const scopedProcess = { id: caseId, clientId, deletedAt: null };

    const [
      item,
      movementsToday,
      deadlinesDueSoon,
      recentMovements,
      upcomingDeadlines,
      mainParties,
      recentDocuments,
    ] = await prisma.$transaction([
      prisma.process.findFirst({
        where: scopedProcess,
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
          responsible: { select: { id: true, name: true } },
          createdBy: { select: { id: true, name: true } },
          updatedBy: { select: { id: true, name: true } },
          attendanceForm: {
            select: {
              id: true,
              subject: true,
              legalArea: true,
              finalizedAt: true,
              finalizedBy: { select: { id: true, name: true } },
            },
          },
          _count: {
            select: {
              movements: { where: { deletedAt: null } },
              documents: true,
              deadlines: {
                where: { deletedAt: null, status: { in: OPEN_DEADLINE_STATUSES } },
              },
              parties: { where: { deletedAt: null } },
            },
          },
        },
      }),

      prisma.processMovement.count({
        where: {
          deletedAt: null,
          process: scopedProcess,
          movementAt: { gte: startOfToday() },
        },
      }),
      prisma.processDeadline.count({
        where: {
          deletedAt: null,
          status: { in: OPEN_DEADLINE_STATUSES },
          process: scopedProcess,
          dueAt: { lte: new Date(Date.now() + TEN_DAYS_MS) },
        },
      }),

      prisma.processMovement.findMany({
        where: { deletedAt: null, process: scopedProcess },
        select: { id: true, title: true, description: true, movementAt: true },
        orderBy: { movementAt: "desc" },
        take: 3,
      }),
      prisma.processDeadline.findMany({
        where: {
          deletedAt: null,
          status: { in: OPEN_DEADLINE_STATUSES },
          process: scopedProcess,
        },
        select: {
          id: true,
          title: true,
          dueAt: true,
          status: true,
          responsible: { select: { name: true } },
        },
        orderBy: { dueAt: "asc" },
        take: 3,
      }),
      prisma.processParty.findMany({
        where: { deletedAt: null, process: scopedProcess },
        select: { id: true, name: true, type: true, role: true, isClient: true },
        orderBy: [{ isClient: "desc" }, { position: "asc" }],
        take: 3,
      }),
      prisma.processDocument.findMany({
        where: { process: scopedProcess },
        select: {
          id: true,
          createdAt: true,
          clientDocument: {
            select: {
              id: true,
              title: true,
              originalName: true,
              mimeType: true,
              sizeBytes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    if (!item) {
      return null;
    }

    return {
      ...item,
      filingDate: item.filingDate?.toISOString() ?? null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      attendanceForm: {
        ...item.attendanceForm,
        finalizedAt: item.attendanceForm.finalizedAt?.toISOString() ?? null,
      },
      metrics: {
        movements: item._count.movements,
        movementsToday,
        documents: item._count.documents,
        openDeadlines: item._count.deadlines,
        deadlinesDueSoon,
        parties: item._count.parties,
      },
      recentMovements: recentMovements.map((movement) => ({
        ...movement,
        movementAt: movement.movementAt.toISOString(),
      })),
      upcomingDeadlines: upcomingDeadlines.map((deadline) => ({
        ...deadline,
        dueAt: deadline.dueAt.toISOString(),
      })),
      mainParties,
      recentDocuments: recentDocuments.map((document) => ({
        id: document.id,
        createdAt: document.createdAt.toISOString(),
        title: document.clientDocument.title,
        originalName: document.clientDocument.originalName,
        mimeType: document.clientDocument.mimeType,
        // `BigInt` não é serializável para Client Components.
        sizeBytes: Number(document.clientDocument.sizeBytes),
        clientDocumentId: document.clientDocument.id,
      })),
    };
  },
);

export type CaseOverview = NonNullable<
  Awaited<ReturnType<typeof getCaseOverview>>
>;
