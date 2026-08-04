import type { UserRole } from "@/app/generated/prisma/enums";

/**
 * Função pura e síncrona: só compara a role já confiável de um usuário
 * autenticado. Não acessa cookie, sessão nem banco, e não redireciona —
 * quem autentica é `getSession()`/`verifyAuth()`/`redirectAuth()`.
 */
export const hasRole = (
  currentRole: UserRole,
  allowedRoles: readonly UserRole[],
) => allowedRoles.includes(currentRole);
