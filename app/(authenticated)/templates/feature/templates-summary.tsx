import { TemplateStatus } from "@/app/generated/prisma/enums";

import { countTemplatesByStatus } from "../queries/count-templates-by-status";

type SummaryStatProps = {
  label: string;
  value: number;
};

const SummaryStat = ({ label, value }: SummaryStatProps) => (
  <div className="grid content-center gap-1 border-t p-5 sm:border-t-0 sm:border-l">
    <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
      {label}
    </span>

    <strong className="font-mono text-2xl font-semibold">
      {String(value).padStart(2, "0")}
    </strong>
  </div>
);

export const TemplatesSummary = async () => {
  const { counts, total } = await countTemplatesByStatus();

  return (
    <section
      aria-label="Resumo dos templates"
      className="grid overflow-hidden rounded-xl border bg-card sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,0.45fr))]"
    >
      <div className="grid content-center gap-1 bg-muted p-5 lg:col-span-1">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          Biblioteca Monteiro
        </span>

        <strong className="font-heading text-base font-semibold">
          Padronização documental com histórico preservado.
        </strong>
      </div>

      <SummaryStat label="Ativos" value={counts[TemplateStatus.ATIVO]} />

      <SummaryStat label="Rascunhos" value={counts[TemplateStatus.RASCUNHO]} />

      <SummaryStat label="Total" value={total} />
    </section>
  );
};
