import type { UserRole } from "@/app/generated/prisma/enums";

export const userRoleLabels: Record<UserRole, string> = {
  ADMINISTRADOR: "Administrador",
  ADVOGADO: "Advogado",
  COLABORADOR: "Colaborador",
};
