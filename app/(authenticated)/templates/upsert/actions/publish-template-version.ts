"use server";

import { revalidatePath } from "next/cache";

import { TemplateStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

import {
  type PublishTemplateVersionInput,
  publishTemplateVersionSchema,
} from "../schemas/template-payload-schema";
import { buildDocumentPayload } from "../utils/build-document-payload";

export type PublishTemplateVersionResult = {
  version: number;
  revision: number;
};

const REVISION_CONFLICT = "REVISION_CONFLICT";
const TEMPLATE_NOT_FOUND = "TEMPLATE_NOT_FOUND";

/**
 * Publica uma versão imutável do template.
 *
 * Tudo acontece em uma única transação: criar a versão, promover o
 * template a ATIVO, incrementar `currentVersion` e sincronizar o rascunho.
 * Uma falha parcial deixaria um template ATIVO apontando para uma versão
 * inexistente, então nada aqui pode acontecer isoladamente.
 */
export const publishTemplateVersion = async (
  input: PublishTemplateVersionInput,
): Promise<ActionResult<PublishTemplateVersionResult | null>> => {
  try {
    const user = await verifyAuth();

    const parsed = publishTemplateVersionSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos antes de publicar",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { templateId, revision, values } = parsed.data;
    const payload = buildDocumentPayload(values);
    const nextRevision = revision + 1;

    const published = await prisma.$transaction(async (tx) => {
      const template = await tx.template.findFirst({
        where: {
          id: templateId,
          deletedAt: null,
        },
        select: {
          id: true,
          currentVersion: true,
          draft: {
            select: { revision: true },
          },
        },
      });

      if (!template) {
        throw new Error(TEMPLATE_NOT_FOUND);
      }

      if (template.draft && template.draft.revision !== revision) {
        throw new Error(REVISION_CONFLICT);
      }

      const nextVersion = template.currentVersion + 1;

      await tx.templateVersion.create({
        data: {
          templateId,
          version: nextVersion,
          createdById: user.id,
          ...payload,
        },
      });

      await tx.template.update({
        where: { id: templateId },
        data: {
          name: values.name,
          description: values.description || null,
          category: values.category,
          legalArea: values.legalArea || null,
          status: TemplateStatus.ATIVO,
          currentVersion: nextVersion,
          updatedById: user.id,
        },
      });

      // O rascunho passa a refletir exatamente o que foi publicado.
      await tx.templateDraft.upsert({
        where: { templateId },
        create: {
          templateId,
          revision: nextRevision,
          updatedById: user.id,
          ...payload,
        },
        update: {
          revision: nextRevision,
          updatedById: user.id,
          ...payload,
        },
      });

      return { version: nextVersion, revision: nextRevision };
    });

    revalidatePath("/templates");
    revalidatePath("/templates/upsert");

    return {
      ok: true,
      message: `Versão ${published.version} publicada com sucesso`,
      data: published,
    };
  } catch (error) {
    if (error instanceof Error && error.message === REVISION_CONFLICT) {
      return {
        ok: false,
        message:
          "Este template foi alterado em outro lugar. Recarregue a página antes de publicar.",
      };
    }

    if (error instanceof Error && error.message === TEMPLATE_NOT_FOUND) {
      return {
        ok: false,
        message: "Template não encontrado ou acesso negado",
      };
    }

    console.error("[publishTemplateVersion]", error);

    return {
      ok: false,
      message: "Não foi possível publicar a versão",
    };
  }
};
