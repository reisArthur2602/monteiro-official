import { cache } from "react";

import { ClientStatus, ClientType } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/** Primeiro instante do mês corrente, no fuso do servidor. */
const startOfCurrentMonth = () => {
  const start = new Date();

  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  return start;
};

/**
 * Métricas da carteira para a faixa de resumo.
 *
 * São contagens separadas em vez de `groupBy` porque cada uma cai direto
 * num índice de `[campo, deletedAt]`, e porque rodam na mesma transação:
 * os números são lidos de um único ponto no tempo, então as porcentagens
 * sempre fecham com o total.
 */
export const summarizeClients = cache(async () => {
  await verifyAuth();

  const activeOnly = { deletedAt: null };

  const [active, prospect, inactive, naturalPerson, legalPerson, newThisMonth] =
    await prisma.$transaction([
      prisma.client.count({
        where: { ...activeOnly, status: ClientStatus.ATIVO },
      }),
      prisma.client.count({
        where: { ...activeOnly, status: ClientStatus.PROSPECTO },
      }),
      prisma.client.count({
        where: { ...activeOnly, status: ClientStatus.INATIVO },
      }),
      prisma.client.count({
        where: { ...activeOnly, type: ClientType.PESSOA_FISICA },
      }),
      prisma.client.count({
        where: { ...activeOnly, type: ClientType.PESSOA_JURIDICA },
      }),
      prisma.client.count({
        where: { ...activeOnly, createdAt: { gte: startOfCurrentMonth() } },
      }),
    ]);

  return {
    total: active + prospect + inactive,
    byStatus: {
      [ClientStatus.ATIVO]: active,
      [ClientStatus.PROSPECTO]: prospect,
      [ClientStatus.INATIVO]: inactive,
    },
    byType: {
      [ClientType.PESSOA_FISICA]: naturalPerson,
      [ClientType.PESSOA_JURIDICA]: legalPerson,
    },
    newThisMonth,
  };
});
