import { z } from "zod";

import { AttendanceFormStatus } from "@/app/generated/prisma/enums";

/**
 * Parâmetros de URL da listagem de fichas. `.catch()` em cada campo faz um
 * valor inválido virar ausência de filtro em vez de erro de rota.
 */
export const listAttendanceFormsParamsSchema = z.object({
  search: z.string().trim().min(1).max(120).optional().catch(undefined),
  status: z.enum(AttendanceFormStatus).optional().catch(undefined),
  legalArea: z.string().trim().min(1).max(80).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(9999).catch(1),
});

export type ListAttendanceFormsParams = z.infer<
  typeof listAttendanceFormsParamsSchema
>;
