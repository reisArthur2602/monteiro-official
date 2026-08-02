import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_EVENTS = ['a', 'b', 'c'];

export const CaseMovementsTimelineSkeleton = () => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <div className="grid gap-3 border-b p-3.5 sm:grid-cols-[minmax(0,1fr)_11rem_auto] sm:items-center">
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-4 w-32 justify-self-end" />
        </div>

        <div className="grid gap-6 p-4">
            <div className="grid grid-cols-[8rem_minmax(0,1fr)] items-start gap-4">
                <div className="grid gap-1.5 pt-4.5">
                    <Skeleton className="h-3.5 w-20 justify-self-end" />
                    <Skeleton className="h-3 w-16 justify-self-end" />
                </div>

                <div className="grid gap-3.5">
                    {PLACEHOLDER_EVENTS.map((event) => (
                        <Skeleton key={event} className="h-28 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    </section>
);
