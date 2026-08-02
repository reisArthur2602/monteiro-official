"use server";

import { revalidatePath } from "next/cache";

import {
  AttendanceFormStatus,
  ProcessActivityType,
} from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

import {
  type CaseFormValues,
  caseFormSchema,
} from "../schemas/case-form-schema";
import { buildCaseScalarData } from "../utils/build-case-data";
import { mapCaseUniqueViolation } from "../utils/unique-violation";

type CreateCaseInput = {
  clientId: string;
  formId: string;
  values: CaseFormValues;
};

export type CreateCaseResult = {
  caseId: string;
};

/** Discriminante explícito: a transação resolve regra de negócio ou grava. */
type CreateOutcome =
  | { kind: "error"; message: string }
  | { kind: "created"; caseId: string };

export const createCase = async (
  input: CreateCaseInput,
): Promise<ActionResult<CreateCaseResult | null>> => {
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

    const outcome = await prisma.$transaction(async (tx): Promise<CreateOutcome> => {
      // As quatro regras do vínculo, revalidadas aqui mesmo: a ficha
      // pertence a este cliente, está viva, está finalizada e ainda não
      // originou processo. Nada disso vem do navegador.
      const form = await tx.clientAttendanceForm.findUnique({
        where: {
          id: input.formId,
          clientId: input.clientId,
          deletedAt: null,
          status: AttendanceFormStatus.FINALIZADA,
        },
        select: {
          id: true,
          process: { select: { id: true } },
        },
      });

      if (!form) {
        return {
          kind: "error",
          message: "Ficha não encontrada, não finalizada ou fora deste cliente",
        };
      }

      if (form.process) {
        return {
          kind: "error",
          message: "Esta ficha já possui um processo",
        };
      }

      const item = await tx.process.create({
        data: {
          ...buildCaseScalarData(values),
          clientId: input.clientId,
          attendanceFormId: form.id,
          responsibleId: user.id,
          createdById: user.id,
          updatedById: user.id,
        },
        select: { id: true },
      });

      await tx.processActivity.create({
        data: {
          processId: item.id,
          type: ProcessActivityType.PROCESSO_CRIADO,
          title: "Processo criado",
          description: `Cadastrado a partir da ficha de atendimento e vinculado permanentemente a ela.`,
          actorId: user.id,
        },
      });

      return { kind: "created", caseId: item.id };
    });

    if (outcome.kind === "error") {
      return { ok: false, message: outcome.message };
    }

    revalidatePath(`/clients/${input.clientId}/cases`);
    revalidatePath(`/clients/${input.clientId}/intakes`);
    revalidatePath(`/clients/${input.clientId}`);

    return {
      ok: true,
      message: "Processo criado e vinculado à ficha",
      data: { caseId: outcome.caseId },
    };
  } catch (error) {
    // O índice único é a última linha de defesa: dois cadastros
    // simultâneos passam pela checagem prévia, mas só um grava.
    const conflict = mapCaseUniqueViolation(error);

    if (conflict) {
      return {
        ok: false,
        message: conflict.message,
        errors: conflict.errors,
      };
    }

    console.error("[createCase]", error);

    return {
      ok: false,
      message: "Não foi possível criar o processo",
    };
  }
};
