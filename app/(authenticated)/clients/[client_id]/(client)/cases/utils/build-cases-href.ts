import { buildClientHref } from '../../../../utils/build-clients-href';
import type { ListClientCasesParams } from '../schemas/list-client-cases-params-schema';

/** Rota dos processos do cliente. */
export const buildClientCasesHref = (clientId: string) => `${buildClientHref(clientId)}/cases`;

/**
 * Monta a URL da listagem preservando apenas os filtros ativos.
 * A página só entra na query string a partir da segunda.
 */
export const buildCasesHref = (clientId: string, params: Partial<ListClientCasesParams>) => {
    const searchParams = new URLSearchParams();

    if (params.search) {
        searchParams.set('search', params.search);
    }

    if (params.status) {
        searchParams.set('status', params.status);
    }

    if (params.type) {
        searchParams.set('type', params.type);
    }

    if (params.legalArea) {
        searchParams.set('legalArea', params.legalArea);
    }

    if (params.responsibleId) {
        searchParams.set('responsibleId', params.responsibleId);
    }

    if (params.page && params.page > 1) {
        searchParams.set('page', String(params.page));
    }

    const base = buildClientCasesHref(clientId);
    const query = searchParams.toString();

    return query ? `${base}?${query}` : base;
};

/** Rota de detalhe/contexto de um processo específico. */
export const buildClientCaseHref = (clientId: string, caseId: string) =>
    `${buildClientCasesHref(clientId)}/${caseId}`;

/** Cadastro a partir de uma ficha finalizada. */
export const buildCaseCreateHref = (clientId: string, formId: string) =>
    `${buildClientCasesHref(clientId)}/upsert?formId=${formId}`;

/** Edição de um processo existente. */
export const buildCaseEditHref = (clientId: string, caseId: string) =>
    `${buildClientCasesHref(clientId)}/upsert?caseId=${caseId}`;

export const hasActiveCasesFilters = (params: ListClientCasesParams) =>
    Boolean(
        params.search || params.status || params.type || params.legalArea || params.responsibleId
    );
