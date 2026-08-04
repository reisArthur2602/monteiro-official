"use server";

import { revalidatePath } from "next/cache";

import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyRole } from "@/utils/auth";

export const reactivateUser = async (
  userId: string,
): Promise<ActionResult<null>> => {
  try {
    await verifyRole([UserRole.ADMINISTRADOR]);

    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: { not: null } },
      select: { id: true },
    });

    if (!user) {
      return {
        ok: false,
        message: "Usuário não encontrado ou já ativo",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: null },
      select: { id: true },
    });

    revalidatePath("/users");

    return {
      ok: true,
      message: "Usuário reativado",
      data: null,
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível reativar o usuário",
    };
  }
};
