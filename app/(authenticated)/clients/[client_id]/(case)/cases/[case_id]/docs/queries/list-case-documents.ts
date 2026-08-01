import { cache } from 'react';

import type { Prisma } from '@/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';

import type { ListCaseDocumentsParams } from '../schemas/list-case-documents-params-schema';
import { buildMimeTypeFilter } from '../utils/document-format';

const PAGE_SIZE = 12;

/**
 * Documentos vinculados ao processo, com filtro por pasta (papel), formato
 * e busca textual.
 *
 * A consulta parte de `ProcessDocument` — o vínculo — e não de
 * `ClientDocument`, porque é o vínculo que carrega o papel dentro do
 * processo e é ele que a remoção desfaz. O escopo é montado com
 * `process: { id, clientId, deletedAt: null }` em vez de só `processId`:
 * um processo de outro cliente simplesmente não devolve nada.
 *
 * Os dois `deletedAt: null` são intencionais e cobrem coisas diferentes —
 * o do vínculo esconde o que foi removido do processo, o do documento
 * esconde o que foi excluído do arquivo do cliente.
 */
export const listCaseDocuments = cache(
    async (clientId: string, caseId: string, params: ListCaseDocumentsParams) => {
        await verifyAuth();

        const searchClauses: Prisma.ClientDocumentWhereInput[] = params.search
            ? [
                  { title: { contains: params.search, mode: 'insensitive' } },
                  { description: { contains: params.search, mode: 'insensitive' } },
                  { originalName: { contains: params.search, mode: 'insensitive' } },
                  { tags: { has: params.search } },
              ]
            : [];

        const where: Prisma.ProcessDocumentWhereInput = {
            deletedAt: null,
            process: { id: caseId, clientId, deletedAt: null },
            ...(params.role ? { role: params.role } : {}),
            clientDocument: {
                deletedAt: null,
                ...(params.format ? { mimeType: buildMimeTypeFilter(params.format) } : {}),
                ...(searchClauses.length > 0 ? { OR: searchClauses } : {}),
            },
        };

        const [links, total] = await prisma.$transaction([
            prisma.processDocument.findMany({
                where,
                select: {
                    id: true,
                    role: true,
                    notes: true,
                    createdAt: true,
                    addedBy: { select: { id: true, name: true } },
                    clientDocument: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            visibility: true,
                            originalName: true,
                            mimeType: true,
                            sizeBytes: true,
                            documentDate: true,
                            updatedAt: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (params.page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.processDocument.count({ where }),
        ]);

        return {
            // O vínculo e o documento são achatados em um item só: a linha da
            // tabela precisa de campos dos dois, e o cliente não tem por que
            // conhecer a existência da tabela de ligação.
            data: links.map((link) => ({
                id: link.id,
                role: link.role,
                notes: link.notes,
                addedBy: link.addedBy,
                linkedAt: link.createdAt.toISOString(),
                documentId: link.clientDocument.id,
                title: link.clientDocument.title,
                description: link.clientDocument.description,
                visibility: link.clientDocument.visibility,
                originalName: link.clientDocument.originalName,
                mimeType: link.clientDocument.mimeType,
                // `BigInt` não é serializável para Client Components.
                sizeBytes: Number(link.clientDocument.sizeBytes),
                documentDate: link.clientDocument.documentDate?.toISOString() ?? null,
                updatedAt: link.clientDocument.updatedAt.toISOString(),
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
    }
);

export type CaseDocumentListItem = Awaited<ReturnType<typeof listCaseDocuments>>['data'][number];
