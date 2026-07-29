import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

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
  });

  return rows
    .map((row) => row.legalArea)
    .filter((legalArea): legalArea is string => Boolean(legalArea));
});
