import { redirect } from "next/navigation";

import type { UserRole } from "@/app/generated/prisma/enums";

import { hasRole } from "./has-role";
import { redirectAuth } from "./redirect-auth";

export const redirectRole = async (allowedRoles: UserRole[]) => {
  const user = await redirectAuth();

  if (!hasRole(user.role, allowedRoles)) {
    redirect("/unauthorized");
  }

  return user;
};
