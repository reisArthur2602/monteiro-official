"use server";

import { revalidatePath } from "next/cache";

import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyRole } from "@/utils/auth";

export const revokeInvitation = async (
  invitationId: string,
): Promise<ActionResult<null>> => {
  try {
    await verifyRole([UserRole.ADMINISTRADOR]);

    const invitation = await prisma.userInvitation.findUnique({
      where: { id: invitationId, acceptedAt: null, revokedAt: null },
      select: { id: true },
    });

    if (!invitation) {
      return {
        ok: false,
        message: "Convite não encontrado ou já resolvido",
      };
    }

    await prisma.userInvitation.update({
      where: { id: invitation.id },
      data: { revokedAt: new Date() },
      select: { id: true },
    });

    revalidatePath("/users");

    return {
      ok: true,
      message: "Convite cancelado",
      data: null,
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível cancelar o convite",
    };
  }
};
