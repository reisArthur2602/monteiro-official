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

type CreateAttendanceFormInput = {
  clientId: string;
  values: AttendanceFormValues;
  finalize: boolean;
};

export type CreateAttendanceFormResult = {
  formId: string;
};

export const createAttendanceForm = async (
  input: CreateAttendanceFormInput,
): Promise<ActionResult<CreateAttendanceFormResult | null>> => {
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

    // Salvar como rascunho não exige os campos obrigatórios; finalizar
    // exige. A mesma distinção do protótipo, aplicada aqui no servidor.
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

    const client = await prisma.client.findUnique({
      where: { id: input.clientId, deletedAt: null },
      select: {
        name: true,
        displayName: true,
        document: true,
        type: true,
        email: true,
        phone: true,
        address: {
          select: {
            postalCode: true,
            street: true,
            number: true,
            complement: true,
            district: true,
            city: true,
            state: true,
          },
        },
      },
    });

    if (!client) {
      return {
        ok: false,
        message: "Cliente não encontrado ou acesso negado",
      };
    }

    const values = parsed.data;
    const now = new Date();

    const form = await prisma.$transaction(async (tx) => {
      const created = await tx.clientAttendanceForm.create({
        data: {
          ...buildAttendanceFormScalarData(values),
          clientId: input.clientId,
          clientSnapshot: client,
          status: input.finalize
            ? AttendanceFormStatus.FINALIZADA
            : AttendanceFormStatus.RASCUNHO,
          responsibleId: user.id,
          createdById: user.id,
          updatedById: user.id,
          ...(input.finalize
            ? { finalizedById: user.id, finalizedAt: now }
            : {}),
        },
        select: { id: true },
      });

      await persistAttendanceActions(tx, created.id, values.actions);

      return created;
    });

    revalidatePath(`/clients/${input.clientId}/intakes`);
    revalidatePath(`/clients/${input.clientId}`);

    return {
      ok: true,
      message: input.finalize
        ? "Ficha finalizada com sucesso"
        : "Rascunho criado",
      data: { formId: form.id },
    };
  } catch (error) {
    console.error("[createAttendanceForm]", error);

    return {
      ok: false,
      message: "Não foi possível criar a ficha",
    };
  }
};
