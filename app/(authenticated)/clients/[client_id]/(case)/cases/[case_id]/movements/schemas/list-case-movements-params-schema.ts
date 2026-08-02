import { z } from 'zod';

import { ProcessMovementSource } from '@/app/generated/prisma/enums';

/**
 * Parâmetros de URL da linha do tempo. `.catch()` em cada campo faz um
 * valor inválido virar ausência de filtro em vez de erro de rota, como nas
 * outras listagens do processo.
 */
export const listCaseMovementsParamsSchema = z.object({
    search: z.string().trim().min(1).max(120).optional().catch(undefined),
    source: z.enum(ProcessMovementSource).optional().catch(undefined),
    page: z.coerce.number().int().min(1).max(9999).catch(1),
});

export type ListCaseMovementsParams = z.infer<typeof listCaseMovementsParamsSchema>;
