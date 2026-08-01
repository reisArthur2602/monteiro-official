import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { CASE_DOCS_ROW_GRID } from './case-document-row';

const PLACEHOLDER_ROWS = ['a', 'b', 'c', 'd', 'e'];

export const CaseDocsTableSkeleton = () => (
    <>
        <div className="flex flex-wrap gap-x-6 gap-y-3 border-b bg-muted px-4 py-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-32" />
        </div>

        <div className="overflow-x-auto">
            <div className="min-w-[46rem]">
                {PLACEHOLDER_ROWS.map((row) => (
                    <div
                        key={row}
                        className={cn(CASE_DOCS_ROW_GRID, 'min-h-18 border-b px-4 py-2.5')}
                    >
                        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5">
                            <Skeleton className="h-11.5 w-10 rounded-lg" />

                            <div className="grid gap-1.5">
                                <Skeleton className="h-3 w-40" />
                                <Skeleton className="h-2.5 w-52" />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Skeleton className="h-2.5 w-20" />
                            <Skeleton className="h-4 w-16 rounded-full" />
                        </div>

                        <Skeleton className="h-2.5 w-12" />
                        <Skeleton className="h-2.5 w-20" />
                        <Skeleton className="h-8 w-16 justify-self-end" />
                    </div>
                ))}
            </div>
        </div>
    </>
);
