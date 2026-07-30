import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientInfoPanel } from "./feature/client-info-panel";
import { ClientResponsiblePanel } from "./feature/client-responsible-panel";
import { getClientContext } from "./queries/get-client-context";
import { clientIdSchema } from "./schemas/client-id-schema";

type ClientPageProps = {
  params: Promise<{ client_id: string }>;
};

export const generateMetadata = async ({
  params,
}: ClientPageProps): Promise<Metadata> => {
  const { client_id: rawClientId } = await params;
  const parsedId = clientIdSchema.safeParse(rawClientId);

  if (!parsedId.success) {
    return { title: "Cliente" };
  }

  const client = await getClientContext(parsedId.data);

  return { title: client ? (client.displayName ?? client.name) : "Cliente" };
};

const ClientPage = async ({ params }: ClientPageProps) => {
  const { client_id: rawClientId } = await params;
  const parsedId = clientIdSchema.safeParse(rawClientId);

  if (!parsedId.success) {
    notFound();
  }

  // Deduplicado pelo `cache()` da query: o layout já buscou o mesmo
  // cliente nesta renderização, então esta chamada não gera nova consulta.
  const client = await getClientContext(parsedId.data);

  if (!client) {
    notFound();
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <ClientInfoPanel client={client} />
      <ClientResponsiblePanel responsible={client.responsible} />
    </div>
  );
};

export default ClientPage;
