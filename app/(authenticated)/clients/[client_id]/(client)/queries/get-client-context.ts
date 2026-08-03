import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Dados do cliente para o cabeçalho de contexto e para a Visão geral.
 *
 * Retorna `null` quando o cliente não existe ou está excluído logicamente
 * — quem chama decide entre `notFound()` e outro tratamento.
 */
export const getClientContext = cache(async (clientId: string) => {
  await verifyAuth();

  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      displayName: true,
      document: true,
      type: true,
      status: true,
      birthDate: true,
      stateRegistration: true,
      municipalRegistration: true,
      profession: true,
      nationality: true,
      rgNumber: true,
      email: true,
      phone: true,
      notes: true,
      createdAt: true,
      responsible: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      address: {
        select: {
          postalCode: true,
          street: true,
          number: true,
          complement: true,
          district: true,
          city: true,
          state: true,
        },
      },
    },
  });

  if (!client) {
    return null;
  }

  return {
    ...client,
    birthDate: client.birthDate ? client.birthDate.toISOString() : null,
    createdAt: client.createdAt.toISOString(),
  };
});

export type ClientContext = NonNullable<
  Awaited<ReturnType<typeof getClientContext>>
>;
