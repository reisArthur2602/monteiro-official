import { Skeleton } from "@/components/ui/skeleton";

import { ClientsResultsSkeleton } from "./feature/clients-results-skeleton";

const PLACEHOLDER_METRICS = ["a", "b", "c", "d"];

const ClientsLoading = () => (
  <div className="grid gap-6">
    <header className="grid gap-2">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </header>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {PLACEHOLDER_METRICS.map((metric) => (
        <Skeleton key={metric} className="h-24 rounded-xl" />
      ))}
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,10rem))_minmax(0,6rem)]">
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
      <Skeleton className="h-9" />
    </div>

    <ClientsResultsSkeleton />
  </div>
);

export default ClientsLoading;
