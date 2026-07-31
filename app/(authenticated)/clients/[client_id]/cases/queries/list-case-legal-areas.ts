import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

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
  });

  return areas.map((area) => area.legalArea);
});
