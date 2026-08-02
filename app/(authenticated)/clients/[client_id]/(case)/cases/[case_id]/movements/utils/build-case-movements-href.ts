import { buildClientCaseHref } from '../../../../../(client)/cases/utils/build-cases-href';
import type { ListCaseMovementsParams } from '../schemas/list-case-movements-params-schema';

/** Rota da linha do tempo de movimentações do processo. */
export const buildCaseMovementsHref = (clientId: string, caseId: string) =>
    `${buildClientCaseHref(clientId, caseId)}/movements`;

/**
 * Monta a URL da linha do tempo preservando apenas os filtros ativos.
 * A página só entra na query string a partir da segunda.
 */
export const buildCaseMovementsFilterHref = (
    clientId: string,
    caseId: string,
    params: Partial<ListCaseMovementsParams>
) => {
    const searchParams = new URLSearchParams();

    if (params.search) {
        searchParams.set('search', params.search);
    }

    if (params.source) {
        searchParams.set('source', params.source);
    }

    if (params.page && params.page > 1) {
        searchParams.set('page', String(params.page));
    }

    const base = buildCaseMovementsHref(clientId, caseId);
    const query = searchParams.toString();

    return query ? `${base}?${query}` : base;
};

export const hasActiveCaseMovementsFilters = (params: ListCaseMovementsParams) =>
    Boolean(params.search || params.source);
