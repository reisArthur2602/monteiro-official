import { cache } from 'react';

import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';

import { mapTemplateToFormValues } from '../mappers/template-form-mapper';
import type { TemplateForEdit } from '../types/template-types';

/**
 * Carrega o template e o rascunho para a tela de edição.
 *
 * Retorna `null` quando o template não existe ou está excluído logicamente
 * — quem chama decide entre `notFound()` e outro tratamento. O DTO
 * devolvido é serializável e não contém entidade do Prisma.
 */
export const getTemplateForEdit = cache(
    async (templateId: string): Promise<TemplateForEdit | null> => {
        await verifyAuth();

        const template = await prisma.template.findUnique({
            where: {
                id: templateId,
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                description: true,
                category: true,
                legalArea: true,
                status: true,
                currentVersion: true,
                draft: {
                    select: {
                        revision: true,
                        contentJson: true,
                        contentHtml: true,
                        variables: true,
                        signatures: true,
                        pageSettings: true,
                    },
                },
            },
        });

        if (!template) {
            return null;
        }

        return {
            values: mapTemplateToFormValues(template),
            meta: {
                templateId: template.id,
                // Um template sem rascunho ainda não foi editado nesta tela;
                // a primeira gravação parte da revisão 1.
                revision: template.draft?.revision ?? 1,
                currentVersion: template.currentVersion,
                status: template.status,
            },
        };
    }
);
