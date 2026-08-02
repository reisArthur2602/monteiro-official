"use server";

import { revalidatePath } from "next/cache";

import { ProcessActivityType } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

import { processStatusLabels } from "../../utils/case-labels";
import {
  type CaseFormValues,
  caseFormSchema,
} from "../schemas/case-form-schema";
import { buildCaseScalarData } from "../utils/build-case-data";
import { mapCaseUniqueViolation } from "../utils/unique-violation";

type UpdateCaseInput = {
  clientId: string;
  caseId: string;
  values: CaseFormValues;
};

/** Discriminante explícito: a transação resolve regra de negócio ou grava. */
type UpdateOutcome =
  | { kind: "error"; message: string }
  | { kind: "updated" };

export const updateCase = async (
  input: UpdateCaseInput,
): Promise<ActionResult<null>> => {
  try {
    const user = await verifyAuth();

    const parsed = caseFormSchema.safeParse(input.values);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const values = parsed.data;

    const outcome = await prisma.$transaction(async (tx): Promise<UpdateOutcome> => {
      // Autorização por recurso: o processo precisa existir, estar vivo e
      // pertencer ao cliente da rota.
      const existing = await tx.process.findUnique({
        where: {
          id: input.caseId,
          clientId: input.clientId,
          deletedAt: null,
        },
        select: { id: true, status: true },
      });

      if (!existing) {
        return {
          kind: "error",
          message: "Processo não encontrado ou acesso negado",
        };
      }

      // `clientId` e `attendanceFormId` ficam de fora do update: a origem
      // do processo é imutável depois de criada.
      await tx.process.update({
        where: { id: existing.id },
        data: {
          ...buildCaseScalarData(values),
          updatedById: user.id,
        },
      });

      const statusChanged = existing.status !== values.status;

      await tx.processActivity.create({
        data: {
          processId: existing.id,
          type: statusChanged
            ? ProcessActivityType.STATUS_ALTERADO
            : ProcessActivityType.PROCESSO_ATUALIZADO,
          title: statusChanged
            ? `Status alterado para ${processStatusLabels[values.status]}`
            : "Processo atualizado",
          description: statusChanged
            ? `De ${processStatusLabels[existing.status]} para ${processStatusLabels[values.status]}.`
            : null,
          actorId: user.id,
        },
      });

      return { kind: "updated" };
    });

    if (outcome.kind === "error") {
      return { ok: false, message: outcome.message };
    }

    revalidatePath(`/clients/${input.clientId}/cases`);
    revalidatePath(`/clients/${input.clientId}`);

    return {
      ok: true,
      message: "Processo atualizado com sucesso",
      data: null,
    };
  } catch (error) {
    const conflict = mapCaseUniqueViolation(error);

    if (conflict) {
      return {
        ok: false,
        message: conflict.message,
        errors: conflict.errors,
      };
    }

    console.error("[updateCase]", error);

    return {
      ok: false,
      message: "Não foi possível atualizar o processo",
    };
  }
};
