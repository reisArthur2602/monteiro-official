import { listClients } from "../queries/list-clients";
import type { ListClientsParams } from "../schemas/list-clients-params-schema";
import { hasActiveClientFilters } from "../utils/build-clients-href";
import { ClientCard } from "./client-card";
import { ClientsEmpty } from "./clients-empty";
import { ClientsPagination } from "./clients-pagination";
import { ClientsPanel } from "./clients-panel";

type ClientsResultsProps = {
  params: ListClientsParams;
};

export const ClientsResults = async ({ params }: ClientsResultsProps) => {
  const { data, pagination } = await listClients(params);

  if (data.length === 0) {
    return <ClientsEmpty hasFilters={hasActiveClientFilters(params)} />;
  }

  return (
    <div className="grid gap-4">
      <ClientsPanel clients={data} total={pagination.total} />

      {/* Mesma carteira, apresentação adequada a telas estreitas. */}
      <div className="grid gap-3 md:hidden">
        {data.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {pagination.pageCount > 1 ? (
        <ClientsPagination
          params={params}
          page={pagination.page}
          pageCount={pagination.pageCount}
          total={pagination.total}
          from={pagination.from}
          to={pagination.to}
        />
      ) : null}
    </div>
  );
};
