import { cache } from "react";
import {
  parsePageSettings,
  parseSignatures,
  parseUsedVariables,
} from "@/app/(authenticated)/templates/upsert/mappers/template-form-mapper";
import { TemplateStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Um modelo publicado, pronto para ser preenchido com os dados de um
 * cliente. Só a versão publicada (`currentVersion`) é exposta aqui — nunca
 * o rascunho, que pode estar em edição e sem revisão.
 *
 * Retorna `null` quando o template não existe, está excluído logicamente,
 * não está `ATIVO` ou ainda não teve nenhuma versão publicada — um link
 * salvo para um template despublicado depois não deve abrir um documento.
 */
export const getClientUsableTemplate = cache(async (templateId: string) => {
  await verifyAuth();

  const template = await prisma.template.findUnique({
    where: {
      id: templateId,
      deletedAt: null,
      status: TemplateStatus.ATIVO,
    },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      legalArea: true,
      currentVersion: true,
    },
  });

  if (!template || template.currentVersion <= 0) {
    return null;
  }

  const version = await prisma.templateVersion.findUnique({
    where: {
      templateId_version: {
        templateId: template.id,
        version: template.currentVersion,
      },
    },
    select: {
      contentHtml: true,
      variables: true,
      signatures: true,
      pageSettings: true,
    },
  });

  if (!version) {
    return null;
  }

  return {
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    legalArea: template.legalArea,
    contentHtml: version.contentHtml,
    usedVariables: parseUsedVariables(version.variables),
    signatures: parseSignatures(version.signatures),
    page: parsePageSettings(version.pageSettings),
  };
});

export type ClientUsableTemplateDetail = NonNullable<
  Awaited<ReturnType<typeof getClientUsableTemplate>>
>;
