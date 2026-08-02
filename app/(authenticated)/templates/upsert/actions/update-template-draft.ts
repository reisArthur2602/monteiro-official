"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyRole } from "@/utils/auth";

import {
  type UpdateTemplateDraftInput,
  updateTemplateDraftSchema,
} from "../schemas/template-payload-schema";
import {
  buildDocumentPayload,
  resolveTemplateName,
} from "../utils/build-document-payload";

export type UpdateTemplateDraftResult = {
  revision: number;
};

/**
 * Autosave do rascunho. Não cria versão e não altera o status.
 *
 * O controle de concorrência é otimista: a gravação só acontece se a
 * revisão no banco ainda for a que o cliente carregou. Se outra aba ou
 * outra pessoa gravou antes, a operação é recusada em vez de sobrescrever
 * silenciosamente o trabalho alheio.
 */
export const updateTemplateDraft = async (
  input: UpdateTemplateDraftInput,
): Promise<ActionResult<UpdateTemplateDraftResult | null>> => {
  try {
    // Templates são um recurso de escritório, não do usuário: só quem
    // administra o escritório pode criar, editar e publicar.
    const user = await verifyRole(["ADMINISTRADOR"]);

    const parsed = updateTemplateDraftSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { templateId, revision, values } = parsed.data;

    // Autorização por recurso: só rascunhos de templates vivos.
    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
        deletedAt: null,
      },
      select: {
        id: true,
        draft: {
          select: { revision: true },
        },
      },
    });

    if (!template) {
      return {
        ok: false,
        message: "Template não encontrado ou acesso negado",
      };
    }

    const payload = buildDocumentPayload(values);
    const nextRevision = revision + 1;

    const templateData = {
      name: resolveTemplateName(values.name),
      description: values.description || null,
      category: values.category,
      legalArea: values.legalArea || null,
      updatedById: user.id,
    };

    if (!template.draft) {
      // Template criado fora desta tela ainda não tem rascunho.
      await prisma.$transaction([
        prisma.templateDraft.create({
          data: {
            templateId,
            revision: nextRevision,
            updatedById: user.id,
            ...payload,
          },
        }),
        prisma.template.update({
          where: { id: templateId },
          data: templateData,
        }),
      ]);

      return {
        ok: true,
        message: "Rascunho salvo",
        data: { revision: nextRevision },
      };
    }

    // `updateMany` com a revisão no `where` torna a checagem atômica:
    // duas gravações concorrentes não passam as duas.
    const updated = await prisma.templateDraft.updateMany({
      where: {
        templateId,
        revision,
      },
      data: {
        revision: nextRevision,
        updatedById: user.id,
        ...payload,
      },
    });

    if (updated.count === 0) {
      return {
        ok: false,
        message:
          "Este template foi alterado em outro lugar. Recarregue a página para continuar.",
      };
    }

    await prisma.template.update({
      where: { id: templateId },
      data: templateData,
    });

    return {
      ok: true,
      message: "Rascunho salvo",
      data: { revision: nextRevision },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return {
        ok: false,
        message: "Você não possui permissão para editar templates",
      };
    }

    console.error("[updateTemplateDraft]", error);

    return {
      ok: false,
      message: "Não foi possível salvar o rascunho",
    };
  }
};
