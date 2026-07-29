import { Skeleton } from "@/components/ui/skeleton";

import { TemplatesGridSkeleton } from "./feature/templates-grid-skeleton";

const TemplatesLoading = () => (
  <div className="grid gap-6">
    <header className="flex flex-wrap items-end justify-between gap-6">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
    </header>

    <Skeleton className="h-24 rounded-xl" />

    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,11rem))]">
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
    </div>

    <TemplatesGridSkeleton />
  </div>
);

export default TemplatesLoading;
