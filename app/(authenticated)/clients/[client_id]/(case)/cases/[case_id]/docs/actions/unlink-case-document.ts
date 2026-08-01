'use server';

import { revalidatePath } from 'next/cache';

import { ProcessActivityType } from '@/app/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from '@/utils';
import { verifyAuth } from '@/utils/auth';

type UnlinkCaseDocumentInput = {
    clientId: string;
    caseId: string;
    linkId: string;
};

/**
 * Desvincula um documento do processo por exclusão lógica do vínculo.
 *
 * O `ClientDocument` não é tocado: o arquivo continua no arquivo geral do
 * cliente e pode ser vinculado a outro processo. Excluir o documento em si
 * é operação da aba Documentos do cliente, não desta.
 */
export const unlinkCaseDocument = async (
    input: UnlinkCaseDocumentInput
): Promise<ActionResult<null>> => {
    try {
        const user = await verifyAuth();

        // Cliente e processo entram no `where` para que um vínculo de outro
        // processo simplesmente não seja encontrado, em vez de revelar que
        // ele existe.
        const existing = await prisma.processDocument.findFirst({
            where: {
                id: input.linkId,
                deletedAt: null,
                process: {
                    id: input.caseId,
                    clientId: input.clientId,
                    deletedAt: null,
                },
            },
            select: {
                id: true,
                clientDocument: { select: { title: true } },
            },
        });

        if (!existing) {
            return {
                ok: false,
                message: 'Documento não encontrado ou acesso negado',
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.processDocument.update({
                where: { id: existing.id },
                data: { deletedAt: new Date() },
            });

            await tx.processActivity.create({
                data: {
                    processId: input.caseId,
                    type: ProcessActivityType.DOCUMENTO_DESVINCULADO,
                    title: 'Documento removido do processo',
                    description: `${existing.clientDocument.title} deixou de constar no repositório do processo e permanece no arquivo do cliente.`,
                    actorId: user.id,
                },
            });
        });

        revalidatePath(`/clients/${input.clientId}/cases/${input.caseId}/docs`);
        revalidatePath(`/clients/${input.clientId}/cases/${input.caseId}`);

        return {
            ok: true,
            message: 'Documento removido do processo',
            data: null,
        };
    } catch (error) {
        console.error('[unlinkCaseDocument]', error);

        return {
            ok: false,
            message: 'Não foi possível remover o documento do processo',
        };
    }
};
