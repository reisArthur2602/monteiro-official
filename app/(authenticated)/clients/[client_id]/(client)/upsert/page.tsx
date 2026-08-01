import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { redirectAuth } from "@/utils/auth";

import { ClientUpsertScreen } from "./feature/client-upsert-screen";
import { createEmptyClientFormValues } from "./mappers/client-form-mapper";
import { getClientForEdit } from "./queries/get-client-for-edit";
import { listAssignableUsers } from "./queries/list-assignable-users";
import { clientQuerySchema } from "./schemas/client-query-schema";

export const metadata: Metadata = {
  title: "Cadastro de cliente",
};

type ClientUpsertPageProps = {
  searchParams: Promise<{
    clientId?: string;
  }>;
};

const ClientUpsertPage = async ({ searchParams }: ClientUpsertPageProps) => {
  await redirectAuth();

  const parsedQuery = clientQuerySchema.safeParse(await searchParams);

  // Um `clientId` malformado não chega ao banco: a rota simplesmente não
  // existe para aquele endereço.
  if (!parsedQuery.success) {
    notFound();
  }

  const { clientId } = parsedQuery.data;
  const users = await listAssignableUsers();

  if (!clientId) {
    return (
      <ClientUpsertScreen
        mode="create"
        initialValues={createEmptyClientFormValues()}
        users={users}
      />
    );
  }

  const client = await getClientForEdit(clientId);

  if (!client) {
    notFound();
  }

  return (
    <ClientUpsertScreen
      mode="edit"
      clientId={client.clientId}
      initialValues={client.values}
      users={users}
    />
  );
};

export default ClientUpsertPage;
