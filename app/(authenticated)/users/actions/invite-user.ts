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

import {
  type InviteUserInput,
  inviteUserSchema,
} from "../schemas/invite-user-schema";
import { buildInvitationEmailHtml } from "../utils/build-invitation-email-html";
import { getRequestOrigin } from "../utils/get-request-origin";

const INVITATION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

export const inviteUser = async (
  input: InviteUserInput,
): Promise<ActionResult<null>> => {
  try {
    const currentUser = await verifyRole([UserRole.ADMINISTRADOR]);

    if (!isMailerConfigured()) {
      return {
        ok: false,
        message: "O envio de e-mail ainda não foi configurado",
      };
    }

    const parsed = inviteUserSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const email = parsed.data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        ok: false,
        message: "Já existe um usuário com este e-mail",
      };
    }

    const existingInvitation = await prisma.userInvitation.findFirst({
      where: { email, acceptedAt: null, revokedAt: null },
      select: { id: true },
    });

    if (existingInvitation) {
      return {
        ok: false,
        message: "Já existe um convite pendente para este e-mail",
      };
    }

    const token = generateInvitationToken();

    await prisma.userInvitation.create({
      data: {
        name: parsed.data.name,
        email,
        role: parsed.data.role,
        tokenHash: hashInvitationToken(token),
        invitedById: currentUser.id,
        expiresAt: new Date(Date.now() + INVITATION_MAX_AGE_MS),
      },
      select: { id: true },
    });

    const origin = await getRequestOrigin();

    await sendEmail({
      to: email,
      subject: "Convite — Monteiro Advocacia",
      html: buildInvitationEmailHtml(
        currentUser.name,
        `${origin}/invite/${token}`,
      ),
    });

    revalidatePath("/users");

    return {
      ok: true,
      message: "Convite enviado com sucesso",
      data: null,
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível enviar o convite",
    };
  }
};
