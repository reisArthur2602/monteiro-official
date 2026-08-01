import { Skeleton } from '@/components/ui/skeleton';

import { CaseDocsFoldersSkeleton } from './feature/case-docs-folders-skeleton';
import { CaseDocsTableSkeleton } from './feature/case-docs-table-skeleton';

const CaseDocsLoading = () => (
    <div className="grid gap-4">
        <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <Skeleton className="h-9 w-44" />
        </header>

        <div className="grid items-start gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
            <CaseDocsFoldersSkeleton />

            <section className="overflow-hidden rounded-xl border bg-card">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                    <div className="grid gap-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-52" />
                    </div>

                    <div className="flex flex-1 justify-end gap-2">
                        <Skeleton className="h-9 min-w-56 flex-1 sm:max-w-md" />
                        <Skeleton className="h-9 w-full sm:w-44" />
                    </div>
                </header>

                <CaseDocsTableSkeleton />
            </section>
        </div>
    </div>
);

export default CaseDocsLoading;
