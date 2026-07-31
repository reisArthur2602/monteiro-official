import { CalendarPlus, Files, Lock, Users } from "lucide-react";
import type { ComponentType } from "react";

import { summarizeClientDocuments } from "../queries/summarize-client-documents";

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

type DocumentsSummaryProps = {
  clientId: string;
};

export const DocumentsSummary = async ({
  clientId,
}: DocumentsSummaryProps) => {
  const { total, ativos, arquivados, addedThisMonth, visibleToClient, confidential } =
    await summarizeClientDocuments(clientId);

  return (
    <section
      aria-label="Resumo documental"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Metric
        label="Total de documentos"
        value={total}
        meta={`${ativos} ativos e ${arquivados} arquivados`}
        icon={Files}
      />

      <Metric
        label="Adicionados este mês"
        value={addedThisMonth}
        meta="Novos envios no mês corrente"
        icon={CalendarPlus}
      />

      <Metric
        label="Visíveis ao cliente"
        value={visibleToClient}
        meta="Disponíveis para compartilhamento"
        icon={Users}
      />

      <Metric
        label="Confidenciais"
        value={confidential}
        meta="Acesso restrito à equipe autorizada"
        icon={Lock}
      />
    </section>
  );
};
