import { FileStack, Gavel, Scale, Timer } from "lucide-react";
import type { ComponentType } from "react";

import { summarizeClientCases } from "../queries/summarize-client-cases";

type MetricProps = {
  label: string;
  value: number;
  meta: string;
  icon: ComponentType<{ className?: string }>;
};

const Metric = ({ label, value, meta, icon: Icon }: MetricProps) => (
  <article className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border bg-card p-4">
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
      <Icon className="size-4" />
    </span>

    <div className="min-w-0">
      <p className="font-mono text-2xl font-semibold">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="truncate text-[10px] text-muted-foreground">{meta}</p>
    </div>
  </article>
);

type CasesSummaryProps = {
  clientId: string;
};

export const CasesSummary = async ({ clientId }: CasesSummaryProps) => {
  const {
    active,
    inProgress,
    underAnalysis,
    movements,
    recentMovements,
    openDeadlines,
    dueSoonDeadlines,
    documents,
  } = await summarizeClientCases(clientId);

  return (
    <section
      aria-label="Resumo dos processos"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Metric
        label="Processos ativos"
        value={active}
        meta={`${inProgress} em andamento e ${underAnalysis} em análise`}
        icon={Scale}
      />

      <Metric
        label="Movimentações"
        value={movements}
        meta={`${recentMovements} registradas nos últimos 7 dias`}
        icon={Gavel}
      />

      <Metric
        label="Prazos abertos"
        value={openDeadlines}
        meta={`${dueSoonDeadlines} vencem nos próximos 10 dias`}
        icon={Timer}
      />

      <Metric
        label="Documentos vinculados"
        value={documents}
        meta="Também disponíveis no arquivo do cliente"
        icon={FileStack}
      />
    </section>
  );
};
