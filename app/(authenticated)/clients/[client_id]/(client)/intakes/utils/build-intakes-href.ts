import { buildClientIntakesHref } from '../../../../utils/build-clients-href';
import type { ListAttendanceFormsParams } from '../schemas/list-attendance-forms-params-schema';

/**
 * Monta a URL da listagem de fichas preservando apenas os filtros ativos.
 * A página só entra na query string a partir da segunda.
 */
export const buildIntakesHref = (clientId: string, params: Partial<ListAttendanceFormsParams>) => {
    const searchParams = new URLSearchParams();

    if (params.search) {
        searchParams.set('search', params.search);
    }

    if (params.status) {
        searchParams.set('status', params.status);
    }

    if (params.legalArea) {
        searchParams.set('legalArea', params.legalArea);
    }

    if (params.page && params.page > 1) {
        searchParams.set('page', String(params.page));
    }

    const base = buildClientIntakesHref(clientId);
    const query = searchParams.toString();

    return query ? `${base}?${query}` : base;
};

export const hasActiveIntakesFilters = (params: ListAttendanceFormsParams) =>
    Boolean(params.search || params.status || params.legalArea);

/** Rota de criação, ou de edição quando recebe um `formId`. */
export const buildIntakeUpsertHref = (clientId: string, formId?: string) => {
    const base = `${buildClientIntakesHref(clientId)}/upsert`;

    return formId ? `${base}?formId=${formId}` : base;
};

/** Rota de detalhe/impressão de uma ficha específica. */
export const buildIntakeDetailHref = (clientId: string, formId: string) =>
    `${buildClientIntakesHref(clientId)}/${formId}`;
