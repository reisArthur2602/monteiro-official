import { cache } from "react";

import type { Prisma } from "@/app/generated/prisma/client";
import { ProcessDeadlineStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import type { ListClientCasesParams } from "../schemas/list-client-cases-params-schema";

const PAGE_SIZE = 12;

/** Prazos que ainda contam como "próximo marco" do processo. */
const OPEN_DEADLINE_STATUSES = [
  ProcessDeadlineStatus.ABERTO,
  ProcessDeadlineStatus.EM_ANDAMENTO,
  ProcessDeadlineStatus.VENCIDO,
];

export const listClientCases = cache(
  async (clientId: string, params: ListClientCasesParams) => {
    await verifyAuth();

    const searchClauses: Prisma.ProcessWhereInput[] = params.search
      ? [
          { title: { contains: params.search, mode: "insensitive" } },
          { number: { contains: params.search, mode: "insensitive" } },
          { internalCode: { contains: params.search, mode: "insensitive" } },
          { court: { contains: params.search, mode: "insensitive" } },
          { courtUnit: { contains: params.search, mode: "insensitive" } },
          {
            responsible: {
              name: { contains: params.search, mode: "insensitive" },
            },
          },
        ]
      : [];

    const where: Prisma.ProcessWhereInput = {
      clientId,
      deletedAt: null,
      ...(params.status ? { status: params.status } : {}),
      ...(params.type ? { type: params.type } : {}),
      ...(params.legalArea ? { legalArea: params.legalArea } : {}),
      ...(params.responsibleId
        ? { responsibleId: params.responsibleId }
        : {}),
      ...(searchClauses.length > 0 ? { OR: searchClauses } : {}),
    };

    const [cases, total] = await prisma.$transaction([
      prisma.process.findMany({
        where,
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
          updatedAt: true,
          responsible: {
            select: { id: true, name: true },
          },
          attendanceForm: {
            select: {
              id: true,
              subject: true,
              attendanceAt: true,
            },
          },
          // Contagens vêm do próprio Prisma em vez de carregar as coleções:
          // o card só exibe os números.
          _count: {
            select: {
              movements: { where: { deletedAt: null } },
              documents: true,
              deadlines: { where: { deletedAt: null } },
            },
          },
          // Só o próximo marco entra no card. `take: 1` sobre o índice de
          // `dueAt` evita trazer a agenda inteira de cada processo.
          deadlines: {
            where: {
              deletedAt: null,
              status: { in: OPEN_DEADLINE_STATUSES },
            },
            select: {
              id: true,
              title: true,
              dueAt: true,
              status: true,
            },
            orderBy: { dueAt: "asc" },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip: (params.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.process.count({ where }),
    ]);

    return {
      data: cases.map(({ deadlines, _count, ...item }) => ({
        ...item,
        updatedAt: item.updatedAt.toISOString(),
        attendanceForm: {
          ...item.attendanceForm,
          attendanceAt: item.attendanceForm.attendanceAt.toISOString(),
        },
        movementsCount: _count.movements,
        documentsCount: _count.documents,
        deadlinesCount: _count.deadlines,
        nextDeadline: deadlines[0]
          ? {
              ...deadlines[0],
              dueAt: deadlines[0].dueAt.toISOString(),
            }
          : null,
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
  },
);

export type ClientCaseListItem = Awaited<
  ReturnType<typeof listClientCases>
>["data"][number];
