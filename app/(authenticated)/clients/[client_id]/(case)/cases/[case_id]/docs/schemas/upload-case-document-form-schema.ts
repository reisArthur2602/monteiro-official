import { z } from 'zod';

import { ClientDocumentVisibility, ProcessDocumentRole } from '@/app/generated/prisma/enums';
import { MAX_UPLOAD_BYTES } from '@/lib/ftp-limits';

/**
 * Schema do formulário de upload. Difere do schema da rota porque aqui os
 * campos opcionais chegam como string vazia e o arquivo ainda é um `File`.
 * A validação da rota continua sendo a que vale para segurança.
 */
export const uploadCaseDocumentFormSchema = z.object({
    title: z.string().trim().max(200),
    description: z.string().trim().max(500),
    role: z.enum(ProcessDocumentRole, {
        message: 'Selecione a pasta de destino',
    }),
    visibility: z.enum(ClientDocumentVisibility),
    documentDate: z.string(),
    file: z
        .instanceof(File, { message: 'Selecione um arquivo' })
        .refine((file) => file.size > 0, 'Selecione um arquivo')
        .refine((file) => file.size <= MAX_UPLOAD_BYTES, 'O arquivo excede o limite de 25 MB'),
});

export type UploadCaseDocumentFormInput = z.infer<typeof uploadCaseDocumentFormSchema>;
