import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes",
};

const ClientsPage = () => {
  return (
    <div className="grid gap-2">
      <p className="font-mono text-xs tracking-wider text-primary uppercase">
        Escritório
      </p>

      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Clientes
      </h1>

      <p className="text-muted-foreground">
        Gerencie os clientes do escritório.
      </p>
    </div>
  );
};

export default ClientsPage;
