import { cache } from "react";

import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyRole } from "@/utils/auth";

export const countUsersSummary = cache(async () => {
  await verifyRole([UserRole.ADMINISTRADOR]);

  const [total, active, pending, inactive] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.userInvitation.count({
      where: { acceptedAt: null, revokedAt: null },
    }),
    prisma.user.count({ where: { deletedAt: { not: null } } }),
  ]);

  return { total: total + pending, active, pending, inactive };
});
