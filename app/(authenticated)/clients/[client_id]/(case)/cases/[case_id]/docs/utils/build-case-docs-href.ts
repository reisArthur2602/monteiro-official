import { buildClientCaseHref } from '../../../../../(client)/cases/utils/build-cases-href';
import type { ListCaseDocumentsParams } from '../schemas/list-case-documents-params-schema';

/** Rota do repositório de documentos do processo. */
export const buildCaseDocsHref = (clientId: string, caseId: string) =>
    `${buildClientCaseHref(clientId, caseId)}/docs`;

/**
 * Monta a URL do explorador preservando apenas os filtros ativos.
 * A página só entra na query string a partir da segunda.
 */
export const buildCaseDocsFilterHref = (
    clientId: string,
    caseId: string,
    params: Partial<ListCaseDocumentsParams>
) => {
    const searchParams = new URLSearchParams();

    if (params.search) {
        searchParams.set('search', params.search);
    }

    if (params.role) {
        searchParams.set('role', params.role);
    }

    if (params.format) {
        searchParams.set('format', params.format);
    }

    if (params.page && params.page > 1) {
        searchParams.set('page', String(params.page));
    }

    const base = buildCaseDocsHref(clientId, caseId);
    const query = searchParams.toString();

    return query ? `${base}?${query}` : base;
};

export const hasActiveCaseDocsFilters = (params: ListCaseDocumentsParams) =>
    Boolean(params.search || params.role || params.format);

/** Endpoint de upload da própria rota, consumido pelo diálogo. */
export const buildCaseDocsUploadHref = (clientId: string, caseId: string) =>
    `${buildCaseDocsHref(clientId, caseId)}/upload`;
