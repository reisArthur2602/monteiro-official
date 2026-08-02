import { cache } from 'react';

import type { Prisma } from '@/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';

import type { ListCaseMovementsParams } from '../schemas/list-case-movements-params-schema';

const PAGE_SIZE = 30;

/**
 * Movimentações do processo, mais recentes primeiro.
 *
 * O escopo usa `process: { id, clientId, deletedAt: null }` em vez de só
 * `processId`: um processo de outro cliente simplesmente não devolve nada,
 * e quem decide o 404 continua sendo a consulta principal do layout.
 *
 * A paginação corta a lista antes do agrupamento por dia — um dia no meio
 * de duas páginas aparece partido, com a contagem certa em cada uma, o
 * mesmo comportamento de qualquer lista paginada do projeto.
 */
export const listCaseMovements = cache(
    async (clientId: string, caseId: string, params: ListCaseMovementsParams) => {
        await verifyAuth();

        const searchClauses: Prisma.ProcessMovementWhereInput[] = params.search
            ? [
                  { title: { contains: params.search, mode: 'insensitive' } },
                  { description: { contains: params.search, mode: 'insensitive' } },
              ]
            : [];

        const where: Prisma.ProcessMovementWhereInput = {
            deletedAt: null,
            process: { id: caseId, clientId, deletedAt: null },
            ...(params.source ? { source: params.source } : {}),
            ...(searchClauses.length > 0 ? { OR: searchClauses } : {}),
        };

        const [movements, total] = await prisma.$transaction([
            prisma.processMovement.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    movementAt: true,
                    source: true,
                    externalCode: true,
                    createdAt: true,
                    createdBy: { select: { id: true, name: true } },
                },
                orderBy: { movementAt: 'desc' },
                skip: (params.page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.processMovement.count({ where }),
        ]);

        return {
            data: movements.map((movement) => ({
                ...movement,
                movementAt: movement.movementAt.toISOString(),
                createdAt: movement.createdAt.toISOString(),
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

export type CaseMovementListItem = Awaited<ReturnType<typeof listCaseMovements>>['data'][number];
