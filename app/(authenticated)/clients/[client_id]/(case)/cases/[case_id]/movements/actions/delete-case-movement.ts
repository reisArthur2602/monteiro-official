'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import type { ActionResult } from '@/utils';
import { verifyAuth } from '@/utils/auth';

type DeleteCaseMovementInput = {
    clientId: string;
    caseId: string;
    movementId: string;
};

/**
 * Exclusão lógica: só marca `deletedAt`. Uma movimentação do tribunal
 * importada por engano continua auditável, mesmo removida da linha do
 * tempo.
 */
export const deleteCaseMovement = async (
    input: DeleteCaseMovementInput
): Promise<ActionResult<null>> => {
    try {
        await verifyAuth();

        // Cliente e processo entram no `where`: uma movimentação de outro
        // processo simplesmente não é encontrada, em vez de revelar que
        // existe.
        const existing = await prisma.processMovement.findFirst({
            where: {
                id: input.movementId,
                deletedAt: null,
                process: { id: input.caseId, clientId: input.clientId, deletedAt: null },
            },
            select: { id: true },
        });

        if (!existing) {
            return {
                ok: false,
                message: 'Movimentação não encontrada ou acesso negado',
            };
        }

        await prisma.processMovement.update({
            where: { id: existing.id },
            data: { deletedAt: new Date() },
        });

        revalidatePath(`/clients/${input.clientId}/cases/${input.caseId}/movements`);
        revalidatePath(`/clients/${input.clientId}/cases/${input.caseId}`);

        return {
            ok: true,
            message: 'Movimentação removida',
            data: null,
        };
    } catch (error) {
        console.error('[deleteCaseMovement]', error);

        return {
            ok: false,
            message: 'Não foi possível remover a movimentação',
        };
    }
};
