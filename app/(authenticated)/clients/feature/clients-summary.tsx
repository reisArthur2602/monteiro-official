import { Building2, UserCheck, UserPlus, Users } from "lucide-react";
import type { ComponentType } from "react";

import { ClientStatus, ClientType } from "@/app/generated/prisma/enums";

import { summarizeClients } from "../queries/summarize-clients";

type MetricProps = {
  label: string;
  value: number;
  meta: string | null;
  icon: ComponentType<{ className?: string }>;
};

const Metric = ({ label, value, meta, icon: Icon }: MetricProps) => (
  <article className="grid gap-3 rounded-xl border bg-card p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>

        <p className="mt-1 font-mono text-2xl font-semibold">{value}</p>
      </div>

      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-4" />
      </span>
    </div>

    {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
  </article>
);

/** Percentual da carteira, com uma casa decimal e vírgula decimal. */
const shareOfPortfolio = (value: number, total: number) => {
  if (total === 0) {
    return null;
  }

  const percentage = ((value / total) * 100).toFixed(1).replace(".", ",");

  return `${percentage}% da carteira`;
};

export const ClientsSummary = async () => {
  const { total, byStatus, byType, newThisMonth } = await summarizeClients();

  const naturalPersons = byType[ClientType.PESSOA_FISICA];
  const legalPersons = byType[ClientType.PESSOA_JURIDICA];

  return (
    <section
      aria-label="Resumo da carteira"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Metric
        label="Clientes ativos"
        value={byStatus[ClientStatus.ATIVO]}
        meta={
          newThisMonth > 0
            ? `${newThisMonth} ${newThisMonth === 1 ? "novo" : "novos"} neste mês`
            : "Nenhum novo neste mês"
        }
        icon={UserCheck}
      />

      <Metric
        label="Pessoas físicas"
        value={naturalPersons}
        meta={shareOfPortfolio(naturalPersons, total)}
        icon={Users}
      />

      <Metric
        label="Pessoas jurídicas"
        value={legalPersons}
        meta={shareOfPortfolio(legalPersons, total)}
        icon={Building2}
      />

      <Metric
        label="Prospectos"
        value={byStatus[ClientStatus.PROSPECTO]}
        meta={`${byStatus[ClientStatus.INATIVO]} inativos na carteira`}
        icon={UserPlus}
      />
    </section>
  );
};
