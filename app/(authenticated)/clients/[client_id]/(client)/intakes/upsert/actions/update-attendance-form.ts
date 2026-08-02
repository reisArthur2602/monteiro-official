"use server";

import { revalidatePath } from "next/cache";

import { AttendanceFormStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

import {
  type AttendanceFormValues,
  attendanceFormDraftSchema,
  attendanceFormFinalizeSchema,
} from "../schemas/attendance-form-schema";
import {
  buildAttendanceFormScalarData,
  persistAttendanceActions,
} from "../utils/build-attendance-form-data";

type UpdateAttendanceFormInput = {
  clientId: string;
  formId: string;
  values: AttendanceFormValues;
  finalize: boolean;
};

export const updateAttendanceForm = async (
  input: UpdateAttendanceFormInput,
): Promise<ActionResult<null>> => {
  try {
    const user = await verifyAuth();

    const parsed = attendanceFormDraftSchema.safeParse(input.values);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    if (input.finalize) {
      const finalizeCheck = attendanceFormFinalizeSchema.safeParse(
        input.values,
      );

      if (!finalizeCheck.success) {
        return {
          ok: false,
          message: "Revise os campos obrigatórios para finalizar",
          errors: finalizeCheck.error.flatten().fieldErrors,
        };
      }
    }

    // Autorização por recurso: a ficha precisa existir, estar viva e
    // pertencer ao cliente da rota.
    const existing = await prisma.clientAttendanceForm.findUnique({
      where: {
        id: input.formId,
        clientId: input.clientId,
        deletedAt: null,
      },
      select: { id: true, status: true },
    });

    if (!existing) {
      return {
        ok: false,
        message: "Ficha não encontrada ou acesso negado",
      };
    }

    const values = parsed.data;
    const now = new Date();

    // Salvar como rascunho nunca rebaixa uma ficha já finalizada — só
    // "Finalizar" altera o status, e sempre para a frente.
    const status = input.finalize
      ? AttendanceFormStatus.FINALIZADA
      : existing.status;

    await prisma.$transaction(async (tx) => {
      await tx.clientAttendanceForm.update({
        where: { id: existing.id },
        data: {
          ...buildAttendanceFormScalarData(values),
          status,
          updatedById: user.id,
          revision: { increment: 1 },
          ...(input.finalize
            ? { finalizedById: user.id, finalizedAt: now }
            : {}),
        },
      });

      await persistAttendanceActions(tx, existing.id, values.actions);
    });

    revalidatePath(`/clients/${input.clientId}/intakes`);
    revalidatePath(`/clients/${input.clientId}`);

    return {
      ok: true,
      message: input.finalize
        ? "Ficha atualizada e finalizada"
        : "Rascunho atualizado",
      data: null,
    };
  } catch (error) {
    console.error("[updateAttendanceForm]", error);

    return {
      ok: false,
      message: "Não foi possível atualizar a ficha",
    };
  }
};
