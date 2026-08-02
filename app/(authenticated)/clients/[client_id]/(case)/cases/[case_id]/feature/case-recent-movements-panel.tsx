import { GitCommitHorizontal } from 'lucide-react';
import Link from 'next/link';

import { buildCaseMovementsHref } from '../movements/utils/build-case-movements-href';
import type { CaseOverview } from '../queries/get-case-overview';
import { formatDateTime } from '../utils/format-date-time';

type CaseRecentMovementsPanelProps = {
    clientId: string;
    caseId: string;
    movements: CaseOverview['recentMovements'];
};

export const CaseRecentMovementsPanel = ({
    clientId,
    caseId,
    movements,
}: CaseRecentMovementsPanelProps) => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <header className="flex min-h-14 items-center justify-between gap-3 border-b px-4 py-3">
            <div>
                <h2 className="text-sm font-semibold">Movimentações recentes</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Últimos registros do andamento processual.</p>
            </div>

            <Link
                href={buildCaseMovementsHref(clientId, caseId)}
                className="shrink-0 text-xs font-semibold text-primary hover:underline"
            >
                Ver todas
            </Link>
        </header>

        <div className="p-4">
            {movements.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma movimentação registrada.</p>
            ) : (
                <div className="grid">
                    {movements.map((movement, index) => {
                        const { date, time } = formatDateTime(movement.movementAt);
                        const isLast = index === movements.length - 1;

                        return (
                            <article
                                key={movement.id}
                                className="grid grid-cols-[5.5rem_1.75rem_minmax(0,1fr)] gap-2.5"
                            >
                                <span className="text-right font-mono text-[10px] text-muted-foreground">
                                    {date}
                                    <br />
                                    {time}
                                </span>

                                <span className="relative flex justify-center">
                                    {!isLast ? (
                                        <span className="absolute top-3.5 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border" />
                                    ) : null}

                                    <span className="relative z-10 grid size-6 place-items-center rounded-md border-4 border-card bg-accent text-accent-foreground ring-1 ring-primary/20">
                                        <GitCommitHorizontal className="size-3" />
                                    </span>
                                </span>

                                <div className={isLast ? 'pb-0' : 'pb-4.5'}>
                                    <strong className="block text-xs">{movement.title}</strong>

                                    {movement.description ? (
                                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                                            {movement.description}
                                        </p>
                                    ) : null}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    </section>
);
