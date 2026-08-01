import { Skeleton } from "@/components/ui/skeleton";

import { AttendanceFormsGridSkeleton } from "./feature/attendance-forms-grid-skeleton";

const PLACEHOLDER_METRICS = ["a", "b", "c", "d"];

const IntakesLoading = () => (
  <div className="grid gap-4">
    <header className="grid gap-1.5">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </header>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {PLACEHOLDER_METRICS.map((metric) => (
        <Skeleton key={metric} className="h-16 rounded-xl" />
      ))}
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,11rem))]">
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
    </div>

    <AttendanceFormsGridSkeleton />
  </div>
);

export default IntakesLoading;
