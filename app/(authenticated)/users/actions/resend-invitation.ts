"use server";

import { revalidatePath } from "next/cache";

import { UserRole } from "@/app/generated/prisma/enums";
import { isMailerConfigured, sendEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import {
  generateInvitationToken,
  hashInvitationToken,
  verifyRole,
} from "@/utils/auth";

import { buildInvitationEmailHtml } from "../utils/build-invitation-email-html";
import { getRequestOrigin } from "../utils/get-request-origin";

const INVITATION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

/**
 * Gera um novo token e reenvia — o link anterior deixa de funcionar. Evita
 * que um e-mail antigo, talvez interceptado ou esquecido numa caixa de
 * entrada, continue valendo depois de um reenvio deliberado.
 */
export const resendInvitation = async (
  invitationId: string,
): Promise<ActionResult<null>> => {
  try {
    const currentUser = await verifyRole([UserRole.ADMINISTRADOR]);

    if (!isMailerConfigured()) {
      return {
        ok: false,
        message: "O envio de e-mail ainda não foi configurado",
      };
    }

    const invitation = await prisma.userInvitation.findUnique({
      where: { id: invitationId, acceptedAt: null, revokedAt: null },
      select: { id: true, email: true },
    });

    if (!invitation) {
      return {
        ok: false,
        message: "Convite não encontrado ou já resolvido",
      };
    }

    const token = generateInvitationToken();

    await prisma.userInvitation.update({
      where: { id: invitation.id },
      data: {
        tokenHash: hashInvitationToken(token),
        expiresAt: new Date(Date.now() + INVITATION_MAX_AGE_MS),
      },
      select: { id: true },
    });

    const origin = await getRequestOrigin();

    await sendEmail({
      to: invitation.email,
      subject: "Convite — Monteiro Advocacia",
      html: buildInvitationEmailHtml(
        currentUser.name,
        `${origin}/invite/${token}`,
      ),
    });

    revalidatePath("/users");

    return {
      ok: true,
      message: "Convite reenviado",
      data: null,
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível reenviar o convite",
    };
  }
};
