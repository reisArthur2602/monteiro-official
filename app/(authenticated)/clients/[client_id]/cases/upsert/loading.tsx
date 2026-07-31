import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_PANELS = ["a", "b", "c", "d"];

const UpsertCaseLoading = () => (
  <div className="grid gap-6">
    <header className="grid gap-2">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-9 w-72 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </header>

    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="grid gap-4">
        {PLACEHOLDER_PANELS.map((panel) => (
          <Skeleton key={panel} className="h-56 rounded-xl" />
        ))}
      </div>

      <aside className="grid gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </aside>
    </div>
  </div>
);

export default UpsertCaseLoading;
