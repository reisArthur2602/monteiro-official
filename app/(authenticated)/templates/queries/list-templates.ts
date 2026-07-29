import { cache } from "react";

import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import type { ListTemplatesParams } from "../schemas/list-templates-params-schema";

const PAGE_SIZE = 12;

export const listTemplates = cache(async (params: ListTemplatesParams) => {
  await verifyAuth();

  const where: Prisma.TemplateWhereInput = {
    deletedAt: null,
    ...(params.category ? { category: params.category } : {}),
    ...(params.area ? { legalArea: params.area } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
            { legalArea: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [templates, total] = await prisma.$transaction([
    prisma.template.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        legalArea: true,
        status: true,
        currentVersion: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.template.count({ where }),
  ]);

  return {
    data: templates.map((template) => ({
      ...template,
      updatedAt: template.updatedAt.toISOString(),
    })),
    pagination: {
      page: params.page,
      pageSize: PAGE_SIZE,
      total,
      pageCount: Math.max(Math.ceil(total / PAGE_SIZE), 1),
    },
  };
});

export type TemplateListItem = Awaited<
  ReturnType<typeof listTemplates>
>["data"][number];
