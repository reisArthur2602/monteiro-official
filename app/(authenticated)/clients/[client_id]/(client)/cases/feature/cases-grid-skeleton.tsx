import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_CARDS = ["a", "b", "c", "d", "e", "f"];

export const CasesGridSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {PLACEHOLDER_CARDS.map((card) => (
      <div
        key={card}
        className="grid min-h-127.5 grid-rows-[176px_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border bg-card"
      >
        <div className="grid place-items-center border-b bg-muted p-4.5">
          <Skeleton className="h-41.5 w-33 -rotate-[1deg]" />
        </div>

        <div className="grid content-start gap-2.5 p-4">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-2.5 w-36" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="flex min-h-13 items-center border-t px-3.5">
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    ))}
  </div>
);
