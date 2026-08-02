import { listCaseMovements } from '../queries/list-case-movements';
import type { ListCaseMovementsParams } from '../schemas/list-case-movements-params-schema';
import { hasActiveCaseMovementsFilters } from '../utils/build-case-movements-href';
import { groupMovementsByDay } from '../utils/group-movements-by-day';
import { CaseMovementsEmpty } from './case-movements-empty';
import { CaseMovementsPagination } from './case-movements-pagination';
import { CaseMovementsToolbar } from './case-movements-toolbar';
import { MovementEventCard } from './movement-event-card';

type CaseMovementsTimelineProps = {
    clientId: string;
    caseId: string;
    params: ListCaseMovementsParams;
};

export const CaseMovementsTimeline = async ({
    clientId,
    caseId,
    params,
}: CaseMovementsTimelineProps) => {
    const { data, pagination } = await listCaseMovements(clientId, caseId, params);
    const groups = groupMovementsByDay(data);

    // "Mais recente" só faz sentido sem filtro: com uma origem selecionada, o
    // primeiro item da lista filtrada não é necessariamente a última
    // movimentação real do processo.
    const showLatestBadge = params.page === 1 && !hasActiveCaseMovementsFilters(params);

    return (
        <section className="overflow-hidden rounded-xl border bg-card">
            <CaseMovementsToolbar
                clientId={clientId}
                caseId={caseId}
                params={params}
                total={pagination.total}
                visibleCount={data.length}
            />

            {data.length === 0 ? (
                <CaseMovementsEmpty
                    clientId={clientId}
                    caseId={caseId}
                    hasFilters={hasActiveCaseMovementsFilters(params)}
                />
            ) : (
                <>
                    <div className="grid gap-6 p-4">
                        {groups.map((group) => (
                            <section
                                key={group.key}
                                className="grid grid-cols-[8rem_minmax(0,1fr)] items-start gap-4"
                            >
                                <header className="sticky top-32 grid gap-0.5 pt-4.5 text-right">
                                    <strong className="font-mono text-[11px] font-semibold">
                                        {group.heading}
                                    </strong>

                                    <small className="text-[10px] text-muted-foreground">
                                        {group.items.length === 1
                                            ? '1 movimentação'
                                            : `${group.items.length} movimentações`}
                                    </small>
                                </header>

                                <div className="grid gap-3.5">
                                    {group.items.map((movement, index) => (
                                        <MovementEventCard
                                            key={movement.id}
                                            clientId={clientId}
                                            caseId={caseId}
                                            movement={movement}
                                            isLatest={
                                                showLatestBadge &&
                                                group === groups[0] &&
                                                index === 0
                                            }
                                            isLastInGroup={index === group.items.length - 1}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {pagination.pageCount > 1 ? (
                        <CaseMovementsPagination
                            clientId={clientId}
                            caseId={caseId}
                            params={params}
                            page={pagination.page}
                            pageCount={pagination.pageCount}
                        />
                    ) : null}
                </>
            )}
        </section>
    );
};
