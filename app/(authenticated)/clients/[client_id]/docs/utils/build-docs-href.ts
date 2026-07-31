import { buildClientHref } from "../../../utils/build-clients-href";
import type { ListClientDocumentsParams } from "../schemas/list-client-documents-params-schema";

/** Rota do arquivo de documentos do cliente. */
export const buildClientDocsHref = (clientId: string) =>
  `${buildClientHref(clientId)}/docs`;

/**
 * Monta a URL da listagem preservando apenas os filtros ativos.
 * A página só entra na query string a partir da segunda.
 */
export const buildDocsHref = (
  clientId: string,
  params: Partial<ListClientDocumentsParams>,
) => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.visibility) {
    searchParams.set("visibility", params.visibility);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const base = buildClientDocsHref(clientId);
  const query = searchParams.toString();

  return query ? `${base}?${query}` : base;
};

export const hasActiveDocsFilters = (params: ListClientDocumentsParams) =>
  Boolean(
    params.search || params.category || params.visibility || params.status,
  );

/** Endpoint autenticado que faz o streaming do arquivo a partir do FTP. */
export const buildDocumentDownloadHref = (
  clientId: string,
  documentId: string,
) => `${buildClientDocsHref(clientId)}/${documentId}/download`;
