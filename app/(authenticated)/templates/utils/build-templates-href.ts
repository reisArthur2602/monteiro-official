import type { ListTemplatesParams } from "../schemas/list-templates-params-schema";

export const TEMPLATES_PATH = "/templates";

/**
 * Monta a URL da listagem preservando apenas os filtros ativos.
 * A página só entra na query string a partir da segunda.
 */
export const buildTemplatesHref = (params: Partial<ListTemplatesParams>) => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.area) {
    searchParams.set("area", params.area);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const query = searchParams.toString();

  return query ? `${TEMPLATES_PATH}?${query}` : TEMPLATES_PATH;
};

export const hasActiveTemplateFilters = (params: ListTemplatesParams) =>
  Boolean(params.search || params.category || params.area || params.status);
