import { buildClientTemplatesHref } from "@/app/(authenticated)/clients/utils/build-clients-href";

import type { ListClientTemplatesParams } from "../schemas/list-client-templates-params-schema";

/**
 * Monta a URL do catálogo preservando apenas os filtros ativos.
 */
export const buildClientTemplatesFilterHref = (
  clientId: string,
  params: Partial<ListClientTemplatesParams>,
) => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  const base = buildClientTemplatesHref(clientId);
  const query = searchParams.toString();

  return query ? `${base}?${query}` : base;
};

export const hasActiveClientTemplatesFilters = (
  params: ListClientTemplatesParams,
) => Boolean(params.search || params.category);

/** Rota de prévia/geração de um modelo específico para este cliente. */
export const buildClientTemplatePreviewHref = (
  clientId: string,
  templateId: string,
) => `${buildClientTemplatesHref(clientId)}/${templateId}`;
