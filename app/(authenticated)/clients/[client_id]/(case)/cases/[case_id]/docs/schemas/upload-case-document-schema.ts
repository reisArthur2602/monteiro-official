import { z } from 'zod';

import { ClientDocumentVisibility, ProcessDocumentRole } from '@/app/generated/prisma/enums';

/**
 * Metadados que acompanham o upload de um documento do processo. O arquivo
 * em si é validado em `lib/ftp`, porque tipo, extensão e tamanho não passam
 * pelo mesmo caminho de um campo de formulário.
 *
 * Não há campo de categoria: ela é derivada da pasta (`role`) escolhida,
 * conforme `clientCategoryByDocumentRole`.
 */
export const uploadCaseDocumentSchema = z.object({
    title: z.string().trim().max(200).optional(),
    description: z.string().trim().max(500).optional(),
    role: z.enum(ProcessDocumentRole, {
        message: 'Selecione a pasta de destino',
    }),
    visibility: z.enum(ClientDocumentVisibility).default('EQUIPE'),
    documentDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
        .optional(),
});

export type UploadCaseDocumentInput = z.infer<typeof uploadCaseDocumentSchema>;
