import { Skeleton } from '@/components/ui/skeleton';

const PLACEHOLDER_FOLDERS = ['a', 'b', 'c', 'd', 'e'];

export const CaseDocsFoldersSkeleton = () => (
    <aside className="overflow-hidden rounded-xl border bg-card">
        <header className="grid gap-1.5 border-b px-4 py-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-44" />
        </header>

        <div className="grid gap-1.5 p-2.5">
            {PLACEHOLDER_FOLDERS.map((folder) => (
                <Skeleton key={folder} className="h-9 rounded-lg" />
            ))}
        </div>

        <Skeleton className="m-2.5 h-14 rounded-lg" />
    </aside>
);
