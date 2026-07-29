import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_CARDS = ["a", "b", "c", "d", "e", "f"];

export const TemplatesGridSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {PLACEHOLDER_CARDS.map((card) => (
      <div
        key={card}
        className="flex flex-col overflow-hidden rounded-xl border bg-card"
      >
        <Skeleton className="h-44 rounded-none" />

        <div className="grid gap-3 p-5">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="border-t bg-muted px-5 py-3">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    ))}
  </div>
);
