import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

import { ClientsFilters } from "./feature/clients-filters";
import { ClientsResults } from "./feature/clients-results";
import { ClientsResultsSkeleton } from "./feature/clients-results-skeleton";
import { ClientsSummary } from "./feature/clients-summary";
import { listClientResponsibles } from "./queries/list-client-responsibles";
import { listClientStates } from "./queries/list-client-states";
import { listClientsParamsSchema } from "./schemas/list-clients-params-schema";
import { buildClientUpsertHref } from "./utils/build-clients-href";

export const metadata: Metadata = {
  title: "Clientes",
};

type ClientsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ClientsPage = async ({ searchParams }: ClientsPageProps) => {
  const params = listClientsParamsSchema.parse(await searchParams);

  // Independentes entre si: as duas consultas dos filtros vão juntas.
  const [responsibles, states] = await Promise.all([
    listClientResponsibles(),
    listClientStates(),
  ]);

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="grid max-w-3xl gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Relacionamento
          </span>

          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            Clientes
          </h1>

          <p className="text-muted-foreground">
            Consulte pessoas físicas e jurídicas vinculadas ao escritório.
          </p>
        </div>

        <Button asChild>
          <Link href={buildClientUpsertHref()}>
            <Plus aria-hidden="true" />
            Novo cliente
          </Link>
        </Button>
      </header>

      <ClientsSummary />

      <section aria-labelledby="clients-heading" className="grid gap-4">
        <h2 id="clients-heading" className="sr-only">
          Carteira de clientes
        </h2>

        <ClientsFilters
          params={params}
          responsibles={responsibles}
          states={states}
        />

        {/*
          A `key` refaz o boundary a cada combinação de filtros, então a
          troca de filtro mostra o skeleton em vez de congelar a lista
          anterior até a nova consulta responder.
        */}
        <Suspense
          key={JSON.stringify(params)}
          fallback={<ClientsResultsSkeleton />}
        >
          <ClientsResults params={params} />
        </Suspense>
      </section>
    </div>
  );
};

export default ClientsPage;
