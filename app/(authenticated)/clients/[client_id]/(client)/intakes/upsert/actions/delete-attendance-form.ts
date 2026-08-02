"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

type DeleteAttendanceFormInput = {
  clientId: string;
  formId: string;
};

export const deleteAttendanceForm = async (
  input: DeleteAttendanceFormInput,
): Promise<ActionResult<null>> => {
  try {
    await verifyAuth();

    const existing = await prisma.clientAttendanceForm.findUnique({
      where: {
        id: input.formId,
        clientId: input.clientId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existing) {
      return {
        ok: false,
        message: "Ficha não encontrada ou acesso negado",
      };
    }

    await prisma.clientAttendanceForm.update({
      where: { id: existing.id },
      data: { deletedAt: new Date() },
    });

    revalidatePath(`/clients/${input.clientId}/intakes`);
    revalidatePath(`/clients/${input.clientId}`);

    return {
      ok: true,
      message: "Ficha excluída com sucesso",
      data: null,
    };
  } catch (error) {
    console.error("[deleteAttendanceForm]", error);

    return {
      ok: false,
      message: "Não foi possível excluir a ficha",
    };
  }
};
