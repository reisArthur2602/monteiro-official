import { z } from "zod";

import { ProcessStatus, ProcessType } from "@/app/generated/prisma/enums";

/**
 * Parâmetros de URL da listagem de processos. `.catch()` em cada campo faz
 * um valor inválido virar ausência de filtro em vez de erro de rota.
 */
export const listClientCasesParamsSchema = z.object({
  search: z.string().trim().min(1).max(120).optional().catch(undefined),
  status: z.enum(ProcessStatus).optional().catch(undefined),
  type: z.enum(ProcessType).optional().catch(undefined),
  legalArea: z.string().trim().min(1).max(80).optional().catch(undefined),
  responsibleId: z.uuid().optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(9999).catch(1),
});

export type ListClientCasesParams = z.infer<
  typeof listClientCasesParamsSchema
>;
