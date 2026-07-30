import { Skeleton } from "@/components/ui/skeleton";

const INFO_FIELDS = [
  "name",
  "display-name",
  "document",
  "email",
  "phone",
  "address",
];

const ClientLoading = () => (
  <div className="grid gap-5">
    <div className="grid gap-3">
      <Skeleton className="h-4 w-20" />

      <div className="grid gap-5 rounded-2xl border bg-card p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <Skeleton className="size-16 rounded-2xl" />

        <div className="grid gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <Skeleton className="h-10 w-36" />
      </div>
    </div>

    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="rounded-xl border bg-card">
        <div className="min-h-14 border-b px-4 py-3">
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          {INFO_FIELDS.map((field) => (
            <div key={field} className="grid gap-1.5">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="min-h-14 border-b px-4 py-3">
          <Skeleton className="h-4 w-28" />
        </div>

        <div className="flex items-center gap-3 p-4 sm:p-5">
          <Skeleton className="size-11 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  </div>
);

export default ClientLoading;
