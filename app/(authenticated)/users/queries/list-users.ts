import { cache } from "react";

import type { Prisma } from "@/app/generated/prisma/client";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyRole } from "@/utils/auth";

import {
  type ListUsersParams,
  UserListStatus,
} from "../schemas/list-users-params-schema";

const MAX_RESULTS = 300;

export type UserListItem = {
  kind: "user" | "invitation";
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserListStatus;
  createdAt: string;
  lastLoginAt: string | null;
  meta: string | null;
};

/**
 * Uma listagem só, misturando usuários reais e convites ainda não aceitos —
 * é exatamente o que a tela de administração precisa mostrar junto, com um
 * status que distingue os dois. Convite aceito vira usuário e para de
 * aparecer como convite; convite revogado nunca mais aparece.
 */
export const listUsers = cache(async (params: ListUsersParams) => {
  await verifyRole([UserRole.ADMINISTRADOR]);

  const includeUsers = params.status !== UserListStatus.PENDENTE;
  const includeInvitations =
    params.status !== UserListStatus.ATIVO &&
    params.status !== UserListStatus.INATIVO;

  const [users, invitations] = await Promise.all([
    includeUsers
      ? prisma.user.findMany({
          where: {
            ...(params.search
              ? {
                  OR: [
                    { name: { contains: params.search, mode: "insensitive" } },
                    { email: { contains: params.search, mode: "insensitive" } },
                  ],
                }
              : {}),
            ...(params.role ? { role: params.role } : {}),
            ...(params.status === UserListStatus.ATIVO
              ? { deletedAt: null }
              : {}),
            ...(params.status === UserListStatus.INATIVO
              ? { deletedAt: { not: null } }
              : {}),
          } satisfies Prisma.UserWhereInput,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            deletedAt: true,
            lastLoginAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: MAX_RESULTS,
        })
      : Promise.resolve([]),
    includeInvitations
      ? prisma.userInvitation.findMany({
          where: {
            acceptedAt: null,
            revokedAt: null,
            ...(params.search
              ? {
                  OR: [
                    { name: { contains: params.search, mode: "insensitive" } },
                    { email: { contains: params.search, mode: "insensitive" } },
                  ],
                }
              : {}),
            ...(params.role ? { role: params.role } : {}),
          } satisfies Prisma.UserInvitationWhereInput,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            invitedBy: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: MAX_RESULTS,
        })
      : Promise.resolve([]),
  ]);

  const userItems: UserListItem[] = users.map((user) => ({
    kind: "user",
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.deletedAt ? UserListStatus.INATIVO : UserListStatus.ATIVO,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    meta: null,
  }));

  const invitationItems: UserListItem[] = invitations.map((invitation) => ({
    kind: "invitation",
    id: invitation.id,
    name: invitation.name,
    email: invitation.email,
    role: invitation.role,
    status: UserListStatus.PENDENTE,
    createdAt: invitation.createdAt.toISOString(),
    lastLoginAt: null,
    meta: `Convidado por ${invitation.invitedBy.name}`,
  }));

  return [...userItems, ...invitationItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
});
