import { cache } from "react";

import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import type { ListAttendanceFormsParams } from "../schemas/list-attendance-forms-params-schema";

const PAGE_SIZE = 12;

export const listClientAttendanceForms = cache(
  async (clientId: string, params: ListAttendanceFormsParams) => {
    await verifyAuth();

    const searchClauses: Prisma.ClientAttendanceFormWhereInput[] = params.search
      ? [
          { subject: { contains: params.search, mode: "insensitive" } },
          {
            contactPerson: {
              contains: params.search,
              mode: "insensitive",
            },
          },
          { clientReport: { contains: params.search, mode: "insensitive" } },
        ]
      : [];

    const where: Prisma.ClientAttendanceFormWhereInput = {
      clientId,
      deletedAt: null,
      ...(params.status ? { status: params.status } : {}),
      ...(params.legalArea ? { legalArea: params.legalArea } : {}),
      ...(searchClauses.length > 0 ? { OR: searchClauses } : {}),
    };

    const [forms, total] = await prisma.$transaction([
      prisma.clientAttendanceForm.findMany({
        where,
        select: {
          id: true,
          subject: true,
          legalArea: true,
          status: true,
          channel: true,
          contactPerson: true,
          revision: true,
          attendanceAt: true,
          updatedAt: true,
          clientReport: true,
          responsible: {
            select: { id: true, name: true },
          },
          actions: {
            select: { type: true },
          },
        },
        orderBy: {
          attendanceAt: "desc",
        },
        skip: (params.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.clientAttendanceForm.count({ where }),
    ]);

    return {
      data: forms.map((form) => ({
        ...form,
        attendanceAt: form.attendanceAt.toISOString(),
        updatedAt: form.updatedAt.toISOString(),
        actionsCount: form.actions.length,
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

export type AttendanceFormListItem = Awaited<
  ReturnType<typeof listClientAttendanceForms>
>["data"][number];
