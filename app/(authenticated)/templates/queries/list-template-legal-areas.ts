import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/** Teto defensivo: `legalArea` é texto livre, então não é limitado pelo domínio. */
const MAX_OPTIONS = 200;

export const listTemplateLegalAreas = cache(async () => {
  await verifyAuth();

  const rows = await prisma.template.findMany({
    where: {
      deletedAt: null,
      legalArea: {
        not: null,
      },
    },
    select: {
      legalArea: true,
    },
    distinct: ["legalArea"],
    orderBy: {
      legalArea: "asc",
    },
    take: MAX_OPTIONS,
  });

  return rows
    .map((row) => row.legalArea)
    .filter((legalArea): legalArea is string => Boolean(legalArea));
});
