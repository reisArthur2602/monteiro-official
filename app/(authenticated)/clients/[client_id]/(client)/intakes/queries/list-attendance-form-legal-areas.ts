import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

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
  });

  return rows.flatMap((row) => (row.legalArea ? [row.legalArea] : []));
});
