import { UserRole } from "@/app/generated/prisma/enums";

import { UserListStatus } from "../schemas/list-users-params-schema";

export const userRoleLabels: Record<UserRole, string> = {
  [UserRole.ADMINISTRADOR]: "Administrador",
  [UserRole.ADVOGADO]: "Advogado",
  [UserRole.COLABORADOR]: "Colaborador",
};

export const userRoleBadgeClasses: Record<UserRole, string> = {
  [UserRole.ADMINISTRADOR]: "border-primary/30 bg-primary/10 text-primary",
  [UserRole.ADVOGADO]: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  [UserRole.COLABORADOR]: "border-border bg-muted text-muted-foreground",
};

export const userListStatusLabels: Record<UserListStatus, string> = {
  [UserListStatus.ATIVO]: "Ativo",
  [UserListStatus.PENDENTE]: "Convite pendente",
  [UserListStatus.INATIVO]: "Inativo",
};

export const userListStatusBadgeClasses: Record<UserListStatus, string> = {
  [UserListStatus.ATIVO]: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  [UserListStatus.PENDENTE]: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  [UserListStatus.INATIVO]: "border-border bg-muted text-muted-foreground",
};
