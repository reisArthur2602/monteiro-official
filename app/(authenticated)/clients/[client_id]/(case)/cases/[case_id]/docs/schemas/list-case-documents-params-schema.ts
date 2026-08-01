import { z } from 'zod';

import { ProcessDocumentRole } from '@/app/generated/prisma/enums';

import { DOCUMENT_FORMATS } from '../utils/document-format';

/**
 * Parâmetros de URL do explorador de documentos do processo. `.catch()` em
 * cada campo faz um valor inválido virar ausência de filtro em vez de erro
 * de rota, como na listagem do arquivo do cliente.
 */
export const listCaseDocumentsParamsSchema = z.object({
    search: z.string().trim().min(1).max(120).optional().catch(undefined),
    role: z.enum(ProcessDocumentRole).optional().catch(undefined),
    format: z.enum(DOCUMENT_FORMATS).optional().catch(undefined),
    page: z.coerce.number().int().min(1).max(9999).catch(1),
});

export type ListCaseDocumentsParams = z.infer<typeof listCaseDocumentsParamsSchema>;
