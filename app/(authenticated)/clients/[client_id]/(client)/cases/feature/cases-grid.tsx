import { listClientCases } from "../queries/list-client-cases";
import type { ListClientCasesParams } from "../schemas/list-client-cases-params-schema";
import { hasActiveCasesFilters } from "../utils/build-cases-href";
import { CaseCard } from "./case-card";
import { CasesEmpty } from "./cases-empty";
import { CasesPagination } from "./cases-pagination";

type CasesGridProps = {
  clientId: string;
  params: ListClientCasesParams;
};

export const CasesGrid = async ({ clientId, params }: CasesGridProps) => {
  const { data, pagination } = await listClientCases(clientId, params);

  if (data.length === 0) {
    return (
      <CasesEmpty
        clientId={clientId}
        hasFilters={hasActiveCasesFilters(params)}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item, index) => (
          <CaseCard
            key={item.id}
            clientId={clientId}
            item={item}
            index={index}
          />
        ))}
      </div>

      {pagination.pageCount > 1 ? (
        <CasesPagination
          clientId={clientId}
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
