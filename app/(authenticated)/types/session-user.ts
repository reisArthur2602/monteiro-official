import type { UserRole } from "@/app/generated/prisma/enums";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
