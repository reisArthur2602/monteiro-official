import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { hashInvitationToken } from "@/utils/auth";

/**
 * Rota pública — quem chama ainda não tem conta, então não há sessão para
 * verificar aqui. O token (com hash comparado, nunca o valor em si) é a
 * única credencial.
 *
 * Retorna `null` para convite inexistente, já aceito, revogado ou expirado
 * — o chamador trata todos esses casos com a mesma mensagem genérica, sem
 * distinguir o motivo.
 */
export const getInvitationByToken = cache(async (token: string) => {
  const invitation = await prisma.userInvitation.findUnique({
    where: { tokenHash: hashInvitationToken(token) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      acceptedAt: true,
      revokedAt: true,
      expiresAt: true,
      invitedBy: { select: { name: true } },
    },
  });

  if (
    !invitation ||
    invitation.acceptedAt ||
    invitation.revokedAt ||
    invitation.expiresAt < new Date()
  ) {
    return null;
  }

  return {
    id: invitation.id,
    name: invitation.name,
    email: invitation.email,
    role: invitation.role,
    invitedByName: invitation.invitedBy.name,
  };
});

export type InvitationByToken = NonNullable<
  Awaited<ReturnType<typeof getInvitationByToken>>
>;
