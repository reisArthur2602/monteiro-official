import { cache } from "react";

import {
  ClientDocumentStatus,
  ClientDocumentVisibility,
} from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Início do mês corrente em UTC. `createdAt` é `Timestamptz`, então a
 * comparação por instante (não por data civil) é a correta aqui.
 */
const startOfCurrentMonth = () => {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};

/**
 * Números da faixa de resumo da listagem e contador da aba "Documentos".
 * As leituras rodam na mesma transação para que os valores venham de um
 * único ponto no tempo.
 */
export const summarizeClientDocuments = cache(async (clientId: string) => {
  await verifyAuth();

  const scoped = { clientId, deletedAt: null };

  const [ativos, arquivados, addedThisMonth, visibleToClient, confidential] =
    await prisma.$transaction([
      prisma.clientDocument.count({
        where: { ...scoped, status: ClientDocumentStatus.ATIVO },
      }),
      prisma.clientDocument.count({
        where: { ...scoped, status: ClientDocumentStatus.ARQUIVADO },
      }),
      prisma.clientDocument.count({
        where: { ...scoped, createdAt: { gte: startOfCurrentMonth() } },
      }),
      prisma.clientDocument.count({
        where: { ...scoped, visibility: ClientDocumentVisibility.CLIENTE },
      }),
      prisma.clientDocument.count({
        where: {
          ...scoped,
          visibility: ClientDocumentVisibility.CONFIDENCIAL,
        },
      }),
    ]);

  return {
    total: ativos + arquivados,
    ativos,
    arquivados,
    addedThisMonth,
    visibleToClient,
    confidential,
  };
});
