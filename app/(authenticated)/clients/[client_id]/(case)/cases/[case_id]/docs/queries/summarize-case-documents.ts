import { cache } from 'react';

import { ProcessDocumentRole } from '@/app/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';

/**
 * Números da árvore de pastas: quantos documentos há em cada papel, o
 * total, o espaço ocupado e a última atualização.
 *
 * Os contadores não dependem dos filtros da URL — a árvore mostra sempre o
 * repositório inteiro, senão a pasta selecionada zeraria as outras.
 */
export const summarizeCaseDocuments = cache(async (clientId: string, caseId: string) => {
    await verifyAuth();

    const scopedProcess = { id: caseId, clientId, deletedAt: null };

    const linkWhere = {
        deletedAt: null,
        process: scopedProcess,
        clientDocument: { deletedAt: null },
    };

    // Transação interativa em vez do formato de array: o `groupBy` só tem o
    // tipo do `_count` inferido corretamente fora daquele formato.
    const { groups, total, archive } = await prisma.$transaction(async (tx) => {
        const groups = await tx.processDocument.groupBy({
            by: ['role'],
            where: linkWhere,
            _count: true,
            orderBy: { role: 'asc' },
        });

        const total = await tx.processDocument.count({ where: linkWhere });

        // O tamanho vive em `ClientDocument`, fora do alcance do `groupBy`
        // acima, então o espaço ocupado sai de uma agregação própria.
        const archive = await tx.clientDocument.aggregate({
            where: {
                deletedAt: null,
                processLinks: { some: { deletedAt: null, process: scopedProcess } },
            },
            _sum: { sizeBytes: true },
            _max: { updatedAt: true },
        });

        return { groups, total, archive };
    });

    const countsByRole = Object.fromEntries(
        Object.values(ProcessDocumentRole).map((role) => [role, 0])
    ) as Record<ProcessDocumentRole, number>;

    for (const group of groups) {
        countsByRole[group.role] = group._count;
    }

    return {
        total,
        countsByRole,
        totalBytes: Number(archive._sum.sizeBytes ?? 0),
        lastUpdatedAt: archive._max.updatedAt?.toISOString() ?? null,
    };
});
