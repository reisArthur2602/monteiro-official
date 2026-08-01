import { Skeleton } from "@/components/ui/skeleton";

const PANELS = [
  {
    key: "snapshot",
    fields: ["name", "display-name", "document", "contact", "phone", "address"],
  },
  { key: "system", fields: ["date", "time", "responsible"] },
  {
    key: "info",
    fields: ["channel", "contact-person", "legal-area", "subject"],
  },
  { key: "report", fields: ["report"] },
  { key: "analysis", fields: ["analysis"] },
];

const UpsertIntakeLoading = () => (
  <div className="grid gap-6">
    <header className="grid gap-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-72 max-w-full" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </header>

    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="grid gap-4">
        {PANELS.map((panel) => (
          <div key={panel.key} className="rounded-xl border bg-card">
            <div className="grid min-h-14 gap-1.5 border-b px-4 py-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
              {panel.fields.map((field) => (
                <div key={field} className="grid gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-9" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </aside>
    </div>
  </div>
);

export default UpsertIntakeLoading;
