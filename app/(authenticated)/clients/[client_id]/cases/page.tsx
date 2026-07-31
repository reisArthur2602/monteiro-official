import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

import { buildClientIntakesHref } from "../../utils/build-clients-href";
import { clientIdSchema } from "../schemas/client-id-schema";
import { CasesFilters } from "./feature/cases-filters";
import { CasesGrid } from "./feature/cases-grid";
import { CasesGridSkeleton } from "./feature/cases-grid-skeleton";
import { CasesRuleBanner } from "./feature/cases-rule-banner";
import { CasesSummary } from "./feature/cases-summary";
import { listCaseLegalAreas } from "./queries/list-case-legal-areas";
import { listCaseResponsibles } from "./queries/list-case-responsibles";
import { listClientCasesParamsSchema } from "./schemas/list-client-cases-params-schema";

export const metadata: Metadata = {
  title: "Processos",
};

type CasesPageProps = {
  params: Promise<{ client_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CasesPage = async ({ params, searchParams }: CasesPageProps) => {
  const { client_id: rawClientId } = await params;
  const parsedId = clientIdSchema.safeParse(rawClientId);

  // O layout já validou o cliente; isto só protege esta rota caso seja
  // acessada de outro ponto sem passar pelo layout.
  if (!parsedId.success) {
    notFound();
  }

  const clientId = parsedId.data;
  const filterParams = listClientCasesParamsSchema.parse(await searchParams);

  const [legalAreas, responsibles] = await Promise.all([
    listCaseLegalAreas(clientId),
    listCaseResponsibles(clientId),
  ]);

  return (
    <div className="grid gap-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Acompanhamento jurídico
          </span>

          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Processos do cliente
          </h2>

          <p className="text-sm text-muted-foreground">
            Processos vinculados a este cliente, com origem, andamento e
            próximos marcos.
          </p>
        </div>

        <Button asChild>
          <Link href={buildClientIntakesHref(clientId)}>
            Ver fichas finalizadas
          </Link>
        </Button>
      </header>

      <CasesRuleBanner clientId={clientId} />

      <CasesSummary clientId={clientId} />

      <CasesFilters
        clientId={clientId}
        params={filterParams}
        legalAreas={legalAreas}
        responsibles={responsibles}
      />

      {/*
        A `key` refaz o boundary a cada combinação de filtros, então a
        troca de filtro mostra o skeleton em vez de congelar a lista
        anterior até a nova consulta responder.
      */}
      <Suspense
        key={JSON.stringify(filterParams)}
        fallback={<CasesGridSkeleton />}
      >
        <CasesGrid clientId={clientId} params={filterParams} />
      </Suspense>
    </div>
  );
};

export default CasesPage;
