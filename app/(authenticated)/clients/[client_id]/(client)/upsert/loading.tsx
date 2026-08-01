import { Skeleton } from "@/components/ui/skeleton";

/** Cada string identifica um campo do painel e serve de `key` estável. */
const PANELS = [
  {
    key: "identification",
    fields: ["type", "name", "display-name", "document", "extra", "status"],
  },
  { key: "contact", fields: ["email", "phone", "responsible"] },
  {
    key: "address",
    fields: [
      "postal-code",
      "street",
      "number",
      "complement",
      "district",
      "city",
      "state",
      "country",
    ],
  },
  { key: "notes", fields: ["notes"] },
];

const ClientUpsertLoading = () => (
  <div className="grid gap-6">
    <header className="grid gap-2">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </header>

    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="grid gap-4">
        {PANELS.map((panel) => (
          <div key={panel.key} className="rounded-xl border bg-card">
            <div className="grid min-h-14 gap-1.5 border-b px-4 py-3">
              <Skeleton className="h-4 w-40" />
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
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </aside>
    </div>
  </div>
);

export default ClientUpsertLoading;
