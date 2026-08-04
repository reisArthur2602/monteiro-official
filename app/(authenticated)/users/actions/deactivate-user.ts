"use server";

import { revalidatePath } from "next/cache";

import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyRole } from "@/utils/auth";

/**
 * Desativação lógica: `deletedAt` passa a filtrar o usuário de tudo que
 * respeita `isActive`/`deletedAt: null` no resto do sistema, sem apagar o
 * histórico de quem ele criou ou atualizou.
 */
export const deactivateUser = async (
  userId: string,
): Promise<ActionResult<null>> => {
  try {
    const currentUser = await verifyRole([UserRole.ADMINISTRADOR]);

    if (userId === currentUser.id) {
      return {
        ok: false,
        message: "Você não pode desativar sua própria conta",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { id: true, role: true },
    });

    if (!user) {
      return {
        ok: false,
        message: "Usuário não encontrado ou já inativo",
      };
    }

    if (user.role === UserRole.ADMINISTRADOR) {
      const activeAdmins = await prisma.user.count({
        where: { role: UserRole.ADMINISTRADOR, deletedAt: null },
      });

      if (activeAdmins <= 1) {
        return {
          ok: false,
          message: "O sistema precisa de ao menos um administrador ativo",
        };
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: new Date() },
      select: { id: true },
    });

    revalidatePath("/users");

    return {
      ok: true,
      message: "Usuário desativado",
      data: null,
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível desativar o usuário",
    };
  }
};
