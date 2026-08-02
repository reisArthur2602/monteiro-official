import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/** Teto defensivo: nunca deve ser atingido pelo quadro real de um escritório. */
const MAX_OPTIONS = 500;

/**
 * Usuários que podem responder por um cliente.
 *
 * Diferente de `listClientResponsibles`, que alimenta o filtro da listagem
 * e só traz quem já tem cliente: aqui a lista precisa incluir todo usuário
 * ativo, senão um recém-cadastrado nunca poderia receber o primeiro
 * cliente.
 */
export const listAssignableUsers = cache(async () => {
  await verifyAuth();

  return prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      role: true,
    },
    orderBy: { name: "asc" },
    take: MAX_OPTIONS,
  });
});

export type AssignableUser = Awaited<
  ReturnType<typeof listAssignableUsers>
>[number];
