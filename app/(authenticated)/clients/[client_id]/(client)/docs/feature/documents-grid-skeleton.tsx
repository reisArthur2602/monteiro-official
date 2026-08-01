import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_CARDS = ["a", "b", "c", "d", "e", "f"];

export const DocumentsGridSkeleton = () => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {PLACEHOLDER_CARDS.map((card) => (
      <div
        key={card}
        className="grid min-h-95 grid-rows-[184px_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border bg-card"
      >
        <div className="grid place-items-center border-b bg-muted p-5">
          <Skeleton className="h-32 w-44.5 rounded-xl" />
        </div>

        <div className="grid content-start gap-2.5 p-4">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8" />

          <div className="flex gap-1.5">
            <Skeleton className="h-5.5 w-14 rounded-full" />
            <Skeleton className="h-5.5 w-16 rounded-full" />
          </div>
        </div>

        <div className="flex min-h-13 items-center justify-between border-t px-3.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);
