import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClientContext } from "../queries/get-client-context";
import { clientIdSchema } from "../schemas/client-id-schema";
import { ClientDataReadinessPanel } from "./feature/client-data-readiness-panel";
import { ClientTemplatesFilters } from "./feature/client-templates-filters";
import { ClientTemplatesList } from "./feature/client-templates-list";
import { listClientUsableTemplates } from "./queries/list-client-usable-templates";
import { listClientTemplatesParamsSchema } from "./schemas/list-client-templates-params-schema";
import { hasActiveClientTemplatesFilters } from "./utils/build-client-templates-href";

export const metadata: Metadata = {
  title: "Modelos do cliente",
};

type ClientTemplatesPageProps = {
  params: Promise<{ client_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ClientTemplatesPage = async ({
  params,
  searchParams,
}: ClientTemplatesPageProps) => {
  const { client_id: rawClientId } = await params;
  const parsedId = clientIdSchema.safeParse(rawClientId);

  if (!parsedId.success) {
    notFound();
  }

  // Deduplicado pelo `cache()` da query: o layout já buscou o mesmo cliente
  // nesta renderização.
  const client = await getClientContext(parsedId.data);

  if (!client) {
    notFound();
  }

  const filterParams = listClientTemplatesParamsSchema.parse(
    await searchParams,
  );
  const templates = await listClientUsableTemplates(filterParams);

  return (
    <div className="grid gap-4">
      <header className="grid gap-1.5">
        <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
          Documentos a partir de templates
        </span>

        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Modelos do cliente
        </h2>

        <p className="text-sm text-muted-foreground">
          Escolha um modelo e confira os dados do cliente já preenchidos no
          documento.
        </p>
      </header>

      <ClientTemplatesFilters clientId={client.id} params={filterParams} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ClientTemplatesList
          clientId={client.id}
          client={client}
          templates={templates}
          hasFilters={hasActiveClientTemplatesFilters(filterParams)}
        />

        <ClientDataReadinessPanel client={client} />
      </div>
    </div>
  );
};

export default ClientTemplatesPage;
