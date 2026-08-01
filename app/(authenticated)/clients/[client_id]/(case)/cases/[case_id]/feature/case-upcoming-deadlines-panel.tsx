import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import {
    processDeadlineStatusBadgeClasses,
    processDeadlineStatusLabels,
} from '../../../../(client)/cases/utils/case-labels';
import type { CaseOverview } from '../queries/get-case-overview';
import { formatDeadlineBadge } from '../utils/format-date-time';

type CaseUpcomingDeadlinesPanelProps = {
    deadlines: CaseOverview['upcomingDeadlines'];
};

export const CaseUpcomingDeadlinesPanel = ({ deadlines }: CaseUpcomingDeadlinesPanelProps) => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <header className="flex min-h-14 items-center border-b px-4 py-3">
            <div>
                <h2 className="text-sm font-semibold">Próximos prazos</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Providências prioritárias.</p>
            </div>
        </header>

        <div className="grid gap-2 p-4">
            {deadlines.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum prazo em aberto.</p>
            ) : (
                deadlines.map((deadline) => {
                    const { day, month } = formatDeadlineBadge(deadline.dueAt);

                    return (
                        <article
                            key={deadline.id}
                            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border bg-muted p-2.5"
                        >
                            <span className="grid h-11 w-10 place-items-center rounded-md border bg-card font-mono text-[10px] text-primary">
                                {day}
                                <br />
                                {month}
                            </span>

                            <div className="min-w-0">
                                <strong className="block truncate text-xs">{deadline.title}</strong>
                                <small className="mt-0.5 block text-[10px] text-muted-foreground">
                                    Responsável: {deadline.responsible.name}
                                </small>
                            </div>

                            <Badge
                                variant="outline"
                                className={cn(
                                    'shrink-0 font-bold',
                                    processDeadlineStatusBadgeClasses[deadline.status]
                                )}
                            >
                                {processDeadlineStatusLabels[deadline.status]}
                            </Badge>
                        </article>
                    );
                })
            )}
        </div>
    </section>
);
