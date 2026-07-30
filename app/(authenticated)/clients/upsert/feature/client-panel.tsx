import type { PropsWithChildren } from "react";

type ClientPanelProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

/** Seção do formulário: cabeçalho descritivo e uma grade de campos. */
export const ClientPanel = ({
  title,
  description,
  children,
}: ClientPanelProps) => (
  <section className="overflow-hidden rounded-xl border bg-card">
    <header className="flex min-h-14 items-center border-b px-4 py-3">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>

        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </header>

    <div className="p-4 sm:p-5">{children}</div>
  </section>
);
