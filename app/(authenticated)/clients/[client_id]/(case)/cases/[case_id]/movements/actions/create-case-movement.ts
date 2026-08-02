'use server';

import { revalidatePath } from 'next/cache';

import { ProcessActivityType } from '@/app/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from '@/utils';
import { verifyAuth } from '@/utils/auth';

import {
    type CreateCaseMovementFormValues,
    createCaseMovementSchema,
} from '../schemas/create-case-movement-schema';

type CreateCaseMovementInput = {
    clientId: string;
    caseId: string;
    values: CreateCaseMovementFormValues;
};

export const createCaseMovement = async (
    input: CreateCaseMovementInput
): Promise<ActionResult<{ id: string }>> => {
    try {
        const user = await verifyAuth();

        const parsed = createCaseMovementSchema.safeParse(input.values);

        if (!parsed.success) {
            return {
                ok: false,
                message: 'Revise os campos informados',
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const values = parsed.data;

        // Cliente e processo entram no `where`: um `caseId` de outro cliente
        // simplesmente não é encontrado, em vez de revelar que existe.
        const item = await prisma.process.findUnique({
            where: { id: input.caseId, clientId: input.clientId, deletedAt: null },
            select: { id: true },
        });

        if (!item) {
            return {
                ok: false,
                message: 'Processo não encontrado ou acesso negado',
            };
        }

        // O input local não carrega fuso: interpretado no horário do
        // servidor, como qualquer outro horário digitado em formulário deste
        // projeto.
        const movementAt = new Date(`${values.date}T${values.time}:00`);

        const movement = await prisma.$transaction(async (tx) => {
            const created = await tx.processMovement.create({
                data: {
                    processId: item.id,
                    title: values.title,
                    description: values.description,
                    movementAt,
                    source: values.source,
                    externalCode: values.externalCode || null,
                    createdById: user.id,
                },
                select: { id: true },
            });

            await tx.processActivity.create({
                data: {
                    processId: item.id,
                    type: ProcessActivityType.MOVIMENTACAO_CRIADA,
                    title: 'Movimentação registrada',
                    description: values.title,
                    actorId: user.id,
                },
            });

            return created;
        });

        revalidatePath(`/clients/${input.clientId}/cases/${input.caseId}/movements`);
        revalidatePath(`/clients/${input.clientId}/cases/${input.caseId}`);

        return {
            ok: true,
            message: 'Movimentação registrada',
            data: { id: movement.id },
        };
    } catch (error) {
        console.error('[createCaseMovement]', error);

        return {
            ok: false,
            message: 'Não foi possível registrar a movimentação',
        };
    }
};
