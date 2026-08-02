import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/** Teto defensivo: `legalArea` é texto livre, então não é limitado pelo domínio. */
const MAX_OPTIONS = 200;

/**
 * Áreas jurídicas presentes nas fichas deste cliente, para alimentar o
 * filtro. Listar só as que existem evita opções que nunca retornam
 * resultado — o mesmo critério de `listClientStates`.
 */
export const listAttendanceFormLegalAreas = cache(async (clientId: string) => {
  await verifyAuth();

  const rows = await prisma.clientAttendanceForm.findMany({
    where: {
      clientId,
      deletedAt: null,
      legalArea: { not: null },
    },
    select: { legalArea: true },
    distinct: ["legalArea"],
    orderBy: { legalArea: "asc" },
    take: MAX_OPTIONS,
  });

  return rows.flatMap((row) => (row.legalArea ? [row.legalArea] : []));
});
