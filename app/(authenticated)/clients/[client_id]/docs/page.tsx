import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { clientIdSchema } from "../schemas/client-id-schema";
import { DocumentsFilters } from "./feature/documents-filters";
import { DocumentsGrid } from "./feature/documents-grid";
import { DocumentsGridSkeleton } from "./feature/documents-grid-skeleton";
import { DocumentsSummary } from "./feature/documents-summary";
import { UploadDocumentDialog } from "./feature/upload-document-dialog";
import { listClientDocumentsParamsSchema } from "./schemas/list-client-documents-params-schema";

export const metadata: Metadata = {
  title: "Documentos",
};

type DocsPageProps = {
  params: Promise<{ client_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DocsPage = async ({ params, searchParams }: DocsPageProps) => {
  const { client_id: rawClientId } = await params;
  const parsedId = clientIdSchema.safeParse(rawClientId);

  // O layout já validou o cliente; isto só protege esta rota caso seja
  // acessada de outro ponto sem passar pelo layout.
  if (!parsedId.success) {
    notFound();
  }

  const clientId = parsedId.data;
  const filterParams = listClientDocumentsParamsSchema.parse(
    await searchParams,
  );

  return (
    <div className="grid gap-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Arquivo do cliente
          </span>

          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Documentos do cliente
          </h2>

          <p className="text-sm text-muted-foreground">
            Arquivos enviados e vinculados a este cliente.
          </p>
        </div>

        <UploadDocumentDialog clientId={clientId} />
      </header>

      <DocumentsSummary clientId={clientId} />

      <DocumentsFilters clientId={clientId} params={filterParams} />

      {/*
        A `key` refaz o boundary a cada combinação de filtros, então a
        troca de filtro mostra o skeleton em vez de congelar a lista
        anterior até a nova consulta responder.
      */}
      <Suspense
        key={JSON.stringify(filterParams)}
        fallback={<DocumentsGridSkeleton />}
      >
        <DocumentsGrid clientId={clientId} params={filterParams} />
      </Suspense>
    </div>
  );
};

export default DocsPage;
