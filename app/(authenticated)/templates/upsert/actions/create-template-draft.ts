"use server";

import { revalidatePath } from "next/cache";

import { TemplateStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

import {
  type CreateTemplateDraftInput,
  createTemplateDraftSchema,
} from "../schemas/template-payload-schema";
import {
  buildDocumentPayload,
  resolveTemplateName,
} from "../utils/build-document-payload";

export type CreateTemplateDraftResult = {
  templateId: string;
  revision: number;
};

/**
 * Primeiro autosave do modo de criação: materializa o Template em
 * RASCUNHO junto com o rascunho editável.
 *
 * `currentVersion` fica em zero — nenhuma versão foi publicada ainda.
 */
export const createTemplateDraft = async (
  input: CreateTemplateDraftInput,
): Promise<ActionResult<CreateTemplateDraftResult | null>> => {
  try {
    const user = await verifyAuth();

    const parsed = createTemplateDraftSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { values } = parsed.data;
    const payload = buildDocumentPayload(values);

    const template = await prisma.template.create({
      data: {
        name: resolveTemplateName(values.name),
        description: values.description || null,
        category: values.category,
        legalArea: values.legalArea || null,
        status: TemplateStatus.RASCUNHO,
        currentVersion: 0,
        // A autoria vem sempre da sessão, nunca do payload.
        createdById: user.id,
        updatedById: user.id,
        draft: {
          create: {
            revision: 1,
            updatedById: user.id,
            ...payload,
          },
        },
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/templates");

    return {
      ok: true,
      message: "Rascunho criado",
      data: {
        templateId: template.id,
        revision: 1,
      },
    };
  } catch (error) {
    console.error("[createTemplateDraft]", error);

    return {
      ok: false,
      message: "Não foi possível criar o rascunho",
    };
  }
};
