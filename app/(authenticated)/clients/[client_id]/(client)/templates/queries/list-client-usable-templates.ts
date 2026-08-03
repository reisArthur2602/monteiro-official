import { cache } from "react";
import { parseUsedVariables } from "@/app/(authenticated)/templates/upsert/mappers/template-form-mapper";
import type { Prisma } from "@/app/generated/prisma/client";
import { TemplateStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

import type { ListClientTemplatesParams } from "../schemas/list-client-templates-params-schema";

const MAX_RESULTS = 60;

/**
 * Catálogo de modelos que um cliente pode usar: só templates publicados
 * (`ATIVO`, com ao menos uma versão) entram aqui — um rascunho não é um
 * documento pronto para gerar.
 *
 * Não pagina: é um catálogo curado pela própria equipe, não uma listagem que
 * cresce sem limite — o mesmo raciocínio da constante em `list-templates.ts`,
 * só que aqui sem paginação porque a tela não precisa dela.
 */
export const listClientUsableTemplates = cache(
  async (params: ListClientTemplatesParams) => {
    await verifyAuth();

    const where: Prisma.TemplateWhereInput = {
      deletedAt: null,
      status: TemplateStatus.ATIVO,
      currentVersion: { gt: 0 },
      ...(params.category ? { category: params.category } : {}),
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              {
                description: { contains: params.search, mode: "insensitive" },
              },
              { legalArea: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const templates = await prisma.template.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        legalArea: true,
        updatedAt: true,
        currentVersion: true,
        versions: {
          select: { variables: true },
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: MAX_RESULTS,
    });

    return templates.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      legalArea: template.legalArea,
      currentVersion: template.currentVersion,
      updatedAt: template.updatedAt.toISOString(),
      usedVariables: parseUsedVariables(template.versions[0]?.variables),
    }));
  },
);

export type ClientUsableTemplate = Awaited<
  ReturnType<typeof listClientUsableTemplates>
>[number];
