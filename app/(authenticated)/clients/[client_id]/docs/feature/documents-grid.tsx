import { listClientDocuments } from "../queries/list-client-documents";
import type { ListClientDocumentsParams } from "../schemas/list-client-documents-params-schema";
import { hasActiveDocsFilters } from "../utils/build-docs-href";
import { DocumentCard } from "./document-card";
import { DocumentsEmpty } from "./documents-empty";
import { DocumentsPagination } from "./documents-pagination";

type DocumentsGridProps = {
  clientId: string;
  params: ListClientDocumentsParams;
};

export const DocumentsGrid = async ({
  clientId,
  params,
}: DocumentsGridProps) => {
  const { data, pagination } = await listClientDocuments(clientId, params);

  if (data.length === 0) {
    return (
      <DocumentsEmpty
        clientId={clientId}
        hasFilters={hasActiveDocsFilters(params)}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((document, index) => (
          <DocumentCard
            key={document.id}
            clientId={clientId}
            document={document}
            index={index}
          />
        ))}
      </div>

      {pagination.pageCount > 1 ? (
        <DocumentsPagination
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
