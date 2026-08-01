import { cn } from '@/lib/utils';

import { formatUpdatedAt } from '../../../../../../utils/format-updated-at';
import { listCaseDocuments } from '../queries/list-case-documents';
import { summarizeCaseDocuments } from '../queries/summarize-case-documents';
import type { ListCaseDocumentsParams } from '../schemas/list-case-documents-params-schema';
import { hasActiveCaseDocsFilters } from '../utils/build-case-docs-href';
import { processDocumentRoleFolderLabels } from '../utils/case-document-labels';
import { CASE_DOCS_ROW_GRID, CaseDocumentRow } from './case-document-row';
import { CaseDocsEmpty } from './case-docs-empty';
import { CaseDocsPagination } from './case-docs-pagination';

type SummaryItemProps = {
    label: string;
    value: string;
};

const SummaryItem = ({ label, value }: SummaryItemProps) => (
    <div>
        <span className="block text-[10px] text-muted-foreground">{label}</span>
        <strong className="mt-0.5 block text-xs">{value}</strong>
    </div>
);

type CaseDocsTableProps = {
    clientId: string;
    caseId: string;
    params: ListCaseDocumentsParams;
};

export const CaseDocsTable = async ({ clientId, caseId, params }: CaseDocsTableProps) => {
    // `summarizeCaseDocuments` também é chamada pela árvore de pastas; o
    // `cache()` da query resolve as duas com uma consulta só nesta
    // renderização.
    const [{ data, pagination }, { lastUpdatedAt }] = await Promise.all([
        listCaseDocuments(clientId, caseId, params),
        summarizeCaseDocuments(clientId, caseId),
    ]);

    const folderLabel = params.role
        ? processDocumentRoleFolderLabels[params.role]
        : 'Todos os documentos';

    return (
        <>
            <div className="flex flex-wrap gap-x-6 gap-y-3 border-b bg-muted px-4 py-3">
                <SummaryItem label="Pasta atual" value={folderLabel} />

                <SummaryItem
                    label="Itens nesta visualização"
                    value={String(pagination.total)}
                />

                <SummaryItem
                    label="Última atualização"
                    value={lastUpdatedAt ? formatUpdatedAt(lastUpdatedAt) : '—'}
                />
            </div>

            {data.length === 0 ? (
                <CaseDocsEmpty
                    clientId={clientId}
                    caseId={caseId}
                    hasFilters={hasActiveCaseDocsFilters(params)}
                />
            ) : (
                <>
                    {/*
            A tabela rola na horizontal em telas estreitas em vez de
            reempilhar as colunas: com nome, tipo, tamanho e data, empilhar
            deixaria cada linha alta demais para comparar arquivos.
          */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[46rem]">
                            <div
                                className={cn(
                                    CASE_DOCS_ROW_GRID,
                                    'min-h-10 border-b px-4 font-mono text-[9px] tracking-wider text-muted-foreground uppercase'
                                )}
                            >
                                <span>Nome</span>
                                <span>Tipo</span>
                                <span>Tamanho</span>
                                <span>Atualizado</span>
                                <span className="sr-only">Ações</span>
                            </div>

                            {data.map((item) => (
                                <CaseDocumentRow
                                    key={item.id}
                                    clientId={clientId}
                                    caseId={caseId}
                                    item={item}
                                />
                            ))}
                        </div>
                    </div>

                    {pagination.pageCount > 1 ? (
                        <CaseDocsPagination
                            clientId={clientId}
                            caseId={caseId}
                            params={params}
                            page={pagination.page}
                            pageCount={pagination.pageCount}
                            total={pagination.total}
                            from={pagination.from}
                            to={pagination.to}
                        />
                    ) : null}
                </>
            )}
        </>
    );
};
