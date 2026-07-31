import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Responsáveis que aparecem nos processos deste cliente, para o select de
 * filtro. Deriva dos próprios processos em vez de listar todos os usuários,
 * para não oferecer filtro que não retorna nada.
 */
export const listCaseResponsibles = cache(async (clientId: string) => {
  await verifyAuth();

  const responsibles = await prisma.user.findMany({
    where: {
      deletedAt: null,
      processesResponsible: {
        some: { clientId, deletedAt: null },
      },
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return responsibles;
});
