import { Skeleton } from '@/components/ui/skeleton';

import { CaseMovementsTimelineSkeleton } from './feature/case-movements-timeline-skeleton';

const CaseMovementsLoading = () => (
    <div className="grid gap-4">
        <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-4 w-96 max-w-full" />
            </div>

            <Skeleton className="h-9 w-44" />
        </header>

        <CaseMovementsTimelineSkeleton />
    </div>
);

export default CaseMovementsLoading;
