import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_ROWS = ["a", "b", "c", "d", "e", "f"];

export const ClientsResultsSkeleton = () => (
  <div className="grid gap-4">
    <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
      <div className="flex min-h-14 items-center justify-between gap-4 border-b px-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>

      <div className="grid gap-4 p-4">
        {PLACEHOLDER_ROWS.map((row) => (
          <div
            key={row}
            className="grid grid-cols-[minmax(0,2fr)_repeat(5,minmax(0,1fr))] items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-lg" />

              <div className="grid flex-1 gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>

    <div className="grid gap-3 md:hidden">
      {PLACEHOLDER_ROWS.slice(0, 3).map((card) => (
        <div key={card} className="grid gap-3 rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
          </div>

          <Skeleton className="h-12" />
        </div>
      ))}
    </div>
  </div>
);
