import { ClockAlert, Files, GitCommitHorizontal, UsersRound } from 'lucide-react';
import type { ComponentType } from 'react';

import { cn } from '@/lib/utils';

import type { CaseOverview } from '../queries/get-case-overview';

type MetricProps = {
    label: string;
    value: number;
    meta: string;
    icon: ComponentType<{ className?: string }>;
    tone?: 'default' | 'warning' | 'success';
};

const TONE_CLASSES: Record<NonNullable<MetricProps['tone']>, string> = {
    default: 'bg-accent text-accent-foreground',
    warning: 'bg-chart-3/12 text-chart-3',
    success: 'bg-chart-2/12 text-chart-2',
};

const Metric = ({ label, value, meta, icon: Icon, tone = 'default' }: MetricProps) => (
    <article className="grid gap-2 rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{label}</span>

            <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', TONE_CLASSES[tone])}>
                <Icon className="size-4" />
            </span>
        </div>

        <p className="font-mono text-2xl font-semibold">{value}</p>
        <p className="text-[10px] text-muted-foreground">{meta}</p>
    </article>
);

type CaseOverviewMetricsProps = {
    metrics: CaseOverview['metrics'];
};

export const CaseOverviewMetrics = ({ metrics }: CaseOverviewMetricsProps) => (
    <section aria-label="Resumo do processo" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
            label="Movimentações"
            value={metrics.movements}
            meta={
                metrics.movementsToday > 0
                    ? `${metrics.movementsToday} registradas hoje`
                    : 'Nenhuma registrada hoje'
            }
            icon={GitCommitHorizontal}
        />

        <Metric
            label="Documentos"
            value={metrics.documents}
            meta="Também no arquivo do cliente"
            icon={Files}
        />

        <Metric
            label="Prazos em aberto"
            value={metrics.openDeadlines}
            meta={
                metrics.deadlinesDueSoon > 0
                    ? `${metrics.deadlinesDueSoon} vencem nos próximos 10 dias`
                    : 'Nenhum vence nos próximos 10 dias'
            }
            icon={ClockAlert}
            tone="warning"
        />

        <Metric
            label="Partes"
            value={metrics.parties}
            meta="Polos e representantes"
            icon={UsersRound}
            tone="success"
        />
    </section>
);
