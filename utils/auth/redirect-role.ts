import { redirect } from "next/navigation";

import type { UserRole } from "@/app/generated/prisma/enums";

import { getSession } from "./get-session";

export const redirectRole = async (allowedRoles: UserRole[]) => {
  const user = await getSession();

  if (!user) {
    redirect("/auth");
  }

  if (!allowedRoles.includes(user.role)) {
    redirect("/");
  }

  return user;
};
