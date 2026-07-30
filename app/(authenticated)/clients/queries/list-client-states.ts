import { cache } from 'react';

import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';

/**
 * UFs presentes na carteira, para alimentar o filtro de localidade.
 *
 * Listar apenas as que existem evita opções que nunca retornam resultado —
 * o mesmo critério usado em `listClientResponsibles`.
 */
export const listClientStates = cache(async () => {
    await verifyAuth();

    const rows = await prisma.clientAddress.findMany({
        where: {
            state: { not: null },
            client: { deletedAt: null },
        },
        select: { state: true },
        distinct: ['state'],
        orderBy: { state: 'asc' },
    });

    return rows.flatMap((row) => (row.state ? [row.state] : []));
});
