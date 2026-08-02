import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Só os 3 contadores exibidos nos badges das abas do cliente.
 *
 * O layout precisava antes de `summarizeClientAttendanceForms` (3 counts),
 * `summarizeClientDocuments` (5) e `summarizeClientCases` (9) só para ler
 * `.total` de cada uma — 17 queries por navegação para aproveitar 3
 * números. As três summarize completas continuam existindo para os cards
 * de resumo das próprias listagens, que usam a distribuição por status.
 */
export const countClientTabs = cache(async (clientId: string) => {
  await verifyAuth();

  const scoped = { clientId, deletedAt: null };

  const [intakesCount, documentsCount, casesCount] = await prisma.$transaction([
    prisma.clientAttendanceForm.count({ where: scoped }),
    prisma.clientDocument.count({ where: scoped }),
    prisma.process.count({ where: scoped }),
  ]);

  return { intakesCount, documentsCount, casesCount };
});
