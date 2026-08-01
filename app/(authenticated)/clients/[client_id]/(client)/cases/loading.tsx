import { Skeleton } from "@/components/ui/skeleton";

import { CasesGridSkeleton } from "./feature/cases-grid-skeleton";

const PLACEHOLDER_METRICS = ["a", "b", "c", "d"];

const CasesLoading = () => (
  <div className="grid gap-4">
    <header className="grid gap-1.5">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="h-7 w-60" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </header>

    <Skeleton className="h-16 rounded-xl" />

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {PLACEHOLDER_METRICS.map((metric) => (
        <Skeleton key={metric} className="h-16.5 rounded-xl" />
      ))}
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,10rem))]">
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
    </div>

    <CasesGridSkeleton />
  </div>
);

export default CasesLoading;
