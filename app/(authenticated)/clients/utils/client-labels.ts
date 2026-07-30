import type { ClientStatus, ClientType } from "@/app/generated/prisma/enums";

export const clientTypeLabels: Record<ClientType, string> = {
  PESSOA_FISICA: "Pessoa física",
  PESSOA_JURIDICA: "Pessoa jurídica",
};

export const clientStatusLabels: Record<ClientStatus, string> = {
  ATIVO: "Ativo",
  PROSPECTO: "Prospecto",
  INATIVO: "Inativo",
};

/**
 * Cores derivadas dos tokens do Design System: `chart-2` para o estado
 * saudável, `chart-3` para o que exige atenção e `muted` para o inerte.
 */
export const clientStatusBadgeClasses: Record<ClientStatus, string> = {
  ATIVO: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  PROSPECTO: "border-chart-3/40 bg-chart-3/12 text-chart-3",
  INATIVO: "border-border bg-muted text-muted-foreground",
};
