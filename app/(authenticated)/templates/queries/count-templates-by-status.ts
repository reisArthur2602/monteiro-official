import { cache } from "react";

import { TemplateStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

export const countTemplatesByStatus = cache(async () => {
  await verifyAuth();

  const groups = await prisma.template.groupBy({
    by: ["status"],
    where: {
      deletedAt: null,
    },
    _count: {
      _all: true,
    },
  });

  const counts: Record<TemplateStatus, number> = {
    [TemplateStatus.RASCUNHO]: 0,
    [TemplateStatus.ATIVO]: 0,
    [TemplateStatus.INATIVO]: 0,
  };

  let total = 0;

  for (const group of groups) {
    counts[group.status] = group._count._all;
    total += group._count._all;
  }

  return {
    counts,
    total,
  };
});
