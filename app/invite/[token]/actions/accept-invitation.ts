"use server";

import { hash } from "bcryptjs";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import {
  hashInvitationToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
} from "@/utils/auth";

import {
  type AcceptInvitationInput,
  acceptInvitationSchema,
} from "../schemas/accept-invitation-schema";

const PASSWORD_SALT_ROUNDS = 12;

const GENERIC_ERROR =
  "Este convite não é mais válido. Peça um novo convite ao administrador.";

/**
 * Aceita um convite: cria a conta de verdade e assina a sessão, sem passar
 * pela tela de login — a pessoa acabou de provar controle sobre o e-mail
 * convidado ao abrir este link.
 *
 * O token é revalidado aqui, mesmo já validado na leitura da página: o
 * intervalo entre abrir o formulário e enviá-lo é tempo suficiente para o
 * convite expirar ou ser revogado por um administrador.
 */
export const acceptInvitation = async (
  token: string,
  input: AcceptInvitationInput,
): Promise<ActionResult<null>> => {
  try {
    const parsed = acceptInvitationSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

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
      },
    });

    if (
      !invitation ||
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt < new Date()
    ) {
      return { ok: false, message: GENERIC_ERROR };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
      select: { id: true },
    });

    if (existingUser) {
      return { ok: false, message: GENERIC_ERROR };
    }

    const passwordHash = await hash(parsed.data.password, PASSWORD_SALT_ROUNDS);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: invitation.name,
          email: invitation.email,
          role: invitation.role,
          passwordHash,
        },
        select: { id: true },
      });

      await tx.userInvitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
        select: { id: true },
      });

      return createdUser;
    });

    const sessionToken = await signSessionToken({ sub: user.id });
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return {
      ok: true,
      message: "Conta criada com sucesso",
      data: null,
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível concluir o convite",
    };
  }
};
