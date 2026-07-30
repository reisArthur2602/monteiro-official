import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Usuários que respondem por ao menos um cliente ativo na carteira.
 *
 * A lista alimenta o filtro de responsável; incluir quem não tem cliente
 * algum só criaria opções que nunca retornam resultado.
 */
export const listClientResponsibles = cache(async () => {
  await verifyAuth();

  return prisma.user.findMany({
    where: {
      deletedAt: null,
      clientsResponsible: {
        some: { deletedAt: null },
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
});
