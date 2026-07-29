import type { UserRole } from "@/app/generated/prisma/enums";

import { verifyAuth } from "./verify-auth";

export const verifyRole = async (allowedRoles: UserRole[]) => {
  const user = await verifyAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
};
