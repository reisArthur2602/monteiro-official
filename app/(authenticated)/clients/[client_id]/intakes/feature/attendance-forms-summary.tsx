import { ClipboardList, ClipboardX, FileCheck2, FilePen } from "lucide-react";
import type { ComponentType } from "react";

import { AttendanceFormStatus } from "@/app/generated/prisma/enums";

import { summarizeClientAttendanceForms } from "../queries/summarize-client-attendance-forms";

type MetricProps = {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
};

const Metric = ({ label, value, icon: Icon }: MetricProps) => (
  <article className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border bg-card p-4">
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
      <Icon className="size-4" />
    </span>

    <div>
      <p className="font-mono text-2xl font-semibold">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
  </article>
);

type AttendanceFormsSummaryProps = {
  clientId: string;
};

export const AttendanceFormsSummary = async ({
  clientId,
}: AttendanceFormsSummaryProps) => {
  const { total, byStatus } = await summarizeClientAttendanceForms(clientId);

  return (
    <section
      aria-label="Resumo das fichas"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Metric label="Fichas registradas" value={total} icon={ClipboardList} />

      <Metric
        label="Finalizadas"
        value={byStatus[AttendanceFormStatus.FINALIZADA]}
        icon={FileCheck2}
      />

      <Metric
        label="Em rascunho"
        value={byStatus[AttendanceFormStatus.RASCUNHO]}
        icon={FilePen}
      />

      <Metric
        label="Canceladas"
        value={byStatus[AttendanceFormStatus.CANCELADA]}
        icon={ClipboardX}
      />
    </section>
  );
};
