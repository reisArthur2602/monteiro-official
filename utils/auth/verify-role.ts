import type { UserRole } from "@/app/generated/prisma/enums";

import { hasRole } from "./has-role";
import { verifyAuth } from "./verify-auth";

export const verifyRole = async (allowedRoles: UserRole[]) => {
  const user = await verifyAuth();

  if (!hasRole(user.role, allowedRoles)) {
    throw new Error("FORBIDDEN");
  }

  return user;
};
