import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import { mapClientToFormValues } from "../mappers/client-form-mapper";

/**
 * Carrega o cliente para edição.
 *
 * Retorna `null` quando não existe ou está excluído logicamente — quem
 * chama decide entre `notFound()` e outro tratamento. O DTO devolvido é
 * serializável e não carrega entidade do Prisma.
 */
export const getClientForEdit = cache(async (clientId: string) => {
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
      profession: true,
      nationality: true,
      rgNumber: true,
      stateRegistration: true,
      municipalRegistration: true,
      email: true,
      phone: true,
      notes: true,
      responsibleId: true,
      address: {
        select: {
          postalCode: true,
          street: true,
          number: true,
          complement: true,
          district: true,
          city: true,
          state: true,
          country: true,
        },
      },
    },
  });

  if (!client) {
    return null;
  }

  return {
    clientId: client.id,
    values: mapClientToFormValues(client),
  };
});
