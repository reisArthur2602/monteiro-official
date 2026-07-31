import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_CARDS = ["a", "b", "c", "d", "e", "f"];

export const AttendanceFormsGridSkeleton = () => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {PLACEHOLDER_CARDS.map((card) => (
      <div
        key={card}
        className="grid min-h-[340px] grid-rows-[176px_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border bg-card"
      >
        <div className="grid place-items-center border-b bg-muted p-[18px]">
          <Skeleton className="h-[166px] w-[132px] -rotate-[1.2deg]" />
        </div>

        <div className="grid content-start gap-2.5 p-4">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8" />

          <div className="flex gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <div className="flex min-h-13 items-center justify-between border-t px-3.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
);
