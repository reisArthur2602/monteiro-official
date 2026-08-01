import { Skeleton } from "@/components/ui/skeleton";

const SUMMARY_ROWS = [
  "status",
  "channel",
  "legal-area",
  "subject",
  "responsible",
  "updated",
];

const AttendanceFormDetailLoading = () => (
  <div className="grid gap-4">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>

      <div className="hidden gap-2 sm:flex">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-32" />
      </div>
    </header>

    <div className="grid items-start gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className="grid gap-4">
        <div className="rounded-xl border bg-card">
          <div className="min-h-14 border-b px-4 py-3">
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="grid gap-2.5 p-4">
            {SUMMARY_ROWS.map((row) => (
              <Skeleton key={row} className="h-3.5" />
            ))}
          </div>
        </div>

        <Skeleton className="h-40 rounded-xl" />
      </aside>

      <Skeleton className="h-[900px] rounded-xl" />
    </div>
  </div>
);

export default AttendanceFormDetailLoading;
