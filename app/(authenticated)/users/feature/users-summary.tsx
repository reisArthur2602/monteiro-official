import { MailQuestion, UserCheck, Users, UserX } from "lucide-react";
import type { ComponentType } from "react";

import { countUsersSummary } from "../queries/count-users-summary";

type MetricProps = {
  label: string;
  value: number;
  meta: string;
  icon: ComponentType<{ className?: string }>;
  tone?: "success" | "warning" | "danger";
};

const TONE_CLASSES: Record<NonNullable<MetricProps["tone"]>, string> = {
  success: "bg-chart-2/12 text-chart-2",
  warning: "bg-chart-3/12 text-chart-3",
  danger: "bg-destructive/10 text-destructive",
};

const Metric = ({ label, value, meta, icon: Icon, tone }: MetricProps) => (
  <article className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border bg-card p-4">
    <span
      className={
        "grid size-9 shrink-0 place-items-center rounded-lg " +
        (tone ? TONE_CLASSES[tone] : "bg-accent text-accent-foreground")
      }
    >
      <Icon className="size-4" />
    </span>

    <div className="min-w-0">
      <p className="font-mono text-2xl font-semibold">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="truncate text-[10px] text-muted-foreground">{meta}</p>
    </div>
  </article>
);

export const UsersSummary = async () => {
  const { total, active, pending, inactive } = await countUsersSummary();

  return (
    <section
      aria-label="Resumo de usuários"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Metric
        label="Total de usuários"
        value={total}
        meta="Todos os acessos do escritório"
        icon={Users}
      />

      <Metric
        label="Ativos"
        value={active}
        meta="Com acesso regular ao sistema"
        icon={UserCheck}
        tone="success"
      />

      <Metric
        label="Convites pendentes"
        value={pending}
        meta="Aguardando aceite"
        icon={MailQuestion}
        tone="warning"
      />

      <Metric
        label="Inativos"
        value={inactive}
        meta="Sem acesso ao sistema"
        icon={UserX}
        tone="danger"
      />
    </section>
  );
};
