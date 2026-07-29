"use server";

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { type LoginInput, loginSchema } from "@/schemas/auth/login-schema";
import type { ActionResult } from "@/utils";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
} from "@/utils/auth";

const INVALID_CREDENTIALS_MESSAGE = "Email ou senha inválidos";

export const login = async (input: LoginInput): Promise<ActionResult<null>> => {
  try {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { email, password, persistentSession } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        deletedAt: null,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return {
        ok: false,
        message: INVALID_CREDENTIALS_MESSAGE,
      };
    }

    const passwordMatches = await compare(password, user.passwordHash);

    if (!passwordMatches) {
      return {
        ok: false,
        message: INVALID_CREDENTIALS_MESSAGE,
      };
    }

    const token = await signSessionToken({ sub: user.id });

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: persistentSession ? SESSION_MAX_AGE_SECONDS : undefined,
    });

    return {
      ok: true,
      message: "Login realizado com sucesso",
      data: null,
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível concluir o login",
    };
  }
};
