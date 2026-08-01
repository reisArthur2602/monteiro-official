import { z } from "zod";

/**
 * Modo da tela: `formId` abre a criação a partir de uma ficha finalizada;
 * `caseId` abre a edição de um processo existente.
 */
export const caseQuerySchema = z.object({
  formId: z.uuid().optional(),
  caseId: z.uuid().optional(),
});

export type CaseQuery = z.infer<typeof caseQuerySchema>;
