import { z } from "zod";

import {
  ClientDocumentCategory,
  ClientDocumentStatus,
  ClientDocumentVisibility,
} from "@/app/generated/prisma/enums";

/**
 * Parâmetros de URL da listagem de documentos. `.catch()` em cada campo faz
 * um valor inválido virar ausência de filtro em vez de erro de rota.
 */
export const listClientDocumentsParamsSchema = z.object({
  search: z.string().trim().min(1).max(120).optional().catch(undefined),
  category: z.enum(ClientDocumentCategory).optional().catch(undefined),
  visibility: z.enum(ClientDocumentVisibility).optional().catch(undefined),
  status: z.enum(ClientDocumentStatus).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(9999).catch(1),
});

export type ListClientDocumentsParams = z.infer<
  typeof listClientDocumentsParamsSchema
>;
