import type { ListClientsParams } from "../schemas/list-clients-params-schema";

export const CLIENTS_PATH = "/clients";

/**
 * Monta a URL da listagem preservando apenas os filtros ativos.
 * A página só entra na query string a partir da segunda.
 */
export const buildClientsHref = (params: Partial<ListClientsParams>) => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.responsibleId) {
    searchParams.set("responsibleId", params.responsibleId);
  }

  if (params.state) {
    searchParams.set("state", params.state);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const query = searchParams.toString();

  return query ? `${CLIENTS_PATH}?${query}` : CLIENTS_PATH;
};

export const hasActiveClientFilters = (params: ListClientsParams) =>
  Boolean(
    params.search ||
      params.type ||
      params.status ||
      params.responsibleId ||
      params.state,
  );
