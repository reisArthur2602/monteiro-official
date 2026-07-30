import type { Prisma } from "@/app/generated/prisma/client";

import type { TemplateFormValues } from "../types/template-types";
import { renderDocumentHtml } from "./render-document-html";

const FALLBACK_NAME = "Template sem título";

export type DocumentPayload = {
  contentJson: Prisma.InputJsonValue;
  contentHtml: string;
  variables: Prisma.InputJsonValue;
  signatures: Prisma.InputJsonValue;
  pageSettings: Prisma.InputJsonValue;
};

/**
 * Prepara as colunas Json do rascunho/versão a partir dos valores do
 * formulário.
 *
 * O `contentHtml` recebido do cliente é ignorado de propósito: o HTML é
 * sempre regerado aqui, no servidor, a partir do JSON.
 */
export const buildDocumentPayload = (
  values: TemplateFormValues,
): DocumentPayload => ({
  contentJson: values.document.contentJson as Prisma.InputJsonValue,
  contentHtml: renderDocumentHtml(values.document.contentJson),
  variables: values.document.usedVariables as unknown as Prisma.InputJsonValue,
  signatures: values.document.signatures as unknown as Prisma.InputJsonValue,
  pageSettings: values.document.page as unknown as Prisma.InputJsonValue,
});

/** O nome é obrigatório no banco, mas opcional enquanto se rascunha. */
export const resolveTemplateName = (name: string) =>
  name.trim() || FALLBACK_NAME;
