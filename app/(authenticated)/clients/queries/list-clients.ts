import { cache } from "react";

import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import type { ListClientsParams } from "../schemas/list-clients-params-schema";
import { onlyDigits } from "../utils/format-document";

const PAGE_SIZE = 20;

export const listClients = cache(async (params: ListClientsParams) => {
  await verifyAuth();

  // Documento, telefone e CEP são gravados sem máscara, então a busca
  // precisa comparar dígitos: digitar "12.345" tem de encontrar
  // "12345678000190".
  const searchDigits = params.search ? onlyDigits(params.search) : "";

  const searchClauses: Prisma.ClientWhereInput[] = params.search
    ? [
        { name: { contains: params.search, mode: "insensitive" } },
        // Nome fantasia e nome social são como a equipe se refere ao
        // cliente no dia a dia — precisam entrar na busca.
        { displayName: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
        { address: { city: { contains: params.search, mode: "insensitive" } } },
        ...(searchDigits
          ? [
              { document: { contains: searchDigits } },
              { phone: { contains: searchDigits } },
              { address: { postalCode: { contains: searchDigits } } },
            ]
          : []),
      ]
    : [];

  const where: Prisma.ClientWhereInput = {
    deletedAt: null,
    ...(params.type ? { type: params.type } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.responsibleId ? { responsibleId: params.responsibleId } : {}),
    ...(params.state ? { address: { state: params.state } } : {}),
    ...(searchClauses.length > 0 ? { OR: searchClauses } : {}),
  };

  const [clients, total] = await prisma.$transaction([
    prisma.client.findMany({
      where,
      select: {
        id: true,
        name: true,
        displayName: true,
        document: true,
        type: true,
        status: true,
        email: true,
        phone: true,
        updatedAt: true,
        responsible: {
          select: {
            id: true,
            name: true,
          },
        },
        // Só o que a listagem exibe. O endereço completo fica para a tela
        // de detalhe.
        address: {
          select: {
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.client.count({ where }),
  ]);

  return {
    data: clients.map((client) => ({
      ...client,
      updatedAt: client.updatedAt.toISOString(),
    })),
    pagination: {
      page: params.page,
      pageSize: PAGE_SIZE,
      total,
      pageCount: Math.max(Math.ceil(total / PAGE_SIZE), 1),
      from: total === 0 ? 0 : (params.page - 1) * PAGE_SIZE + 1,
      to: Math.min(params.page * PAGE_SIZE, total),
    },
  };
});

export type ClientListItem = Awaited<
  ReturnType<typeof listClients>
>["data"][number];
