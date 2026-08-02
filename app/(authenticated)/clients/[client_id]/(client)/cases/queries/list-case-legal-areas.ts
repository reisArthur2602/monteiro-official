import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/** Teto defensivo: `legalArea` é texto livre, então não é limitado pelo domínio. */
const MAX_OPTIONS = 200;

/**
 * Áreas jurídicas presentes nos processos deste cliente, para o select de
 * filtro. Só aparecem valores que existem, evitando filtro que não retorna
 * nada.
 */
export const listCaseLegalAreas = cache(async (clientId: string) => {
  await verifyAuth();

  const areas = await prisma.process.findMany({
    where: { clientId, deletedAt: null },
    select: { legalArea: true },
    distinct: ["legalArea"],
    orderBy: { legalArea: "asc" },
    take: MAX_OPTIONS,
  });

  return areas.map((area) => area.legalArea);
});
