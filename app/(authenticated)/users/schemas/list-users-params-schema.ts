import { z } from "zod";

import { UserRole } from "@/app/generated/prisma/enums";

export const UserListStatus = {
  ATIVO: "ATIVO",
  PENDENTE: "PENDENTE",
  INATIVO: "INATIVO",
} as const;

export type UserListStatus =
  (typeof UserListStatus)[keyof typeof UserListStatus];

export const listUsersParamsSchema = z.object({
  search: z.string().trim().min(1).max(120).optional().catch(undefined),
  role: z.enum(UserRole).optional().catch(undefined),
  status: z.enum(UserListStatus).optional().catch(undefined),
});

export type ListUsersParams = z.infer<typeof listUsersParamsSchema>;
