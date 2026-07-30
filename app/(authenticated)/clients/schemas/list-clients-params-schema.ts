import { z } from "zod";

import { ClientStatus, ClientType } from "@/app/generated/prisma/enums";

/**
 * Parâmetros de URL da listagem. Cada campo usa `.catch()` para que um
 * valor inválido vire ausência de filtro em vez de erro de rota — a URL é
 * editável pelo usuário e não deve derrubar a página.
 */
export const listClientsParamsSchema = z.object({
  search: z.string().trim().min(1).max(120).optional().catch(undefined),
  type: z.enum(ClientType).optional().catch(undefined),
  status: z.enum(ClientStatus).optional().catch(undefined),
  responsibleId: z.uuid().optional().catch(undefined),
  // UF em duas letras, como gravada em `client_addresses.state`.
  state: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/)
    .optional()
    .catch(undefined),
  page: z.coerce.number().int().min(1).max(9999).catch(1),
});

export type ListClientsParams = z.infer<typeof listClientsParamsSchema>;
