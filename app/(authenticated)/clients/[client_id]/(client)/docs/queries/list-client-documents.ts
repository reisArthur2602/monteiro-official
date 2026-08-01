import { cache } from "react";

import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import type { ListClientDocumentsParams } from "../schemas/list-client-documents-params-schema";

const PAGE_SIZE = 12;

export const listClientDocuments = cache(
  async (clientId: string, params: ListClientDocumentsParams) => {
    await verifyAuth();

    const searchClauses: Prisma.ClientDocumentWhereInput[] = params.search
      ? [
          { title: { contains: params.search, mode: "insensitive" } },
          { description: { contains: params.search, mode: "insensitive" } },
          { originalName: { contains: params.search, mode: "insensitive" } },
          { tags: { has: params.search } },
        ]
      : [];

    const where: Prisma.ClientDocumentWhereInput = {
      clientId,
      deletedAt: null,
      ...(params.category ? { category: params.category } : {}),
      ...(params.visibility ? { visibility: params.visibility } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(searchClauses.length > 0 ? { OR: searchClauses } : {}),
    };

    const [documents, total] = await prisma.$transaction([
      prisma.clientDocument.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          status: true,
          visibility: true,
          tags: true,
          originalName: true,
          mimeType: true,
          sizeBytes: true,
          documentDate: true,
          createdAt: true,
          updatedAt: true,
          uploadedBy: {
            select: { id: true, name: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (params.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.clientDocument.count({ where }),
    ]);

    return {
      // `sizeBytes` é BigInt no Prisma e não sobrevive à serialização para
      // Client Components; os tamanhos aceitos cabem com folga em Number.
      data: documents.map((document) => ({
        ...document,
        sizeBytes: Number(document.sizeBytes),
        documentDate: document.documentDate?.toISOString() ?? null,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
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

export type ClientDocumentListItem = Awaited<
  ReturnType<typeof listClientDocuments>
>["data"][number];
