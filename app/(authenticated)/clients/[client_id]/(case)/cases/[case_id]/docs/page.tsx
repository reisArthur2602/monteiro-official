import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { clientIdSchema } from '../../../../(client)/schemas/client-id-schema';
import { caseIdSchema } from '../schemas/case-id-schema';
import { CaseDocsFolders } from './feature/case-docs-folders';
import { CaseDocsFoldersSkeleton } from './feature/case-docs-folders-skeleton';
import { CaseDocsTable } from './feature/case-docs-table';
import { CaseDocsTableSkeleton } from './feature/case-docs-table-skeleton';
import { CaseDocsToolbar } from './feature/case-docs-toolbar';
import { UploadCaseDocumentDialog } from './feature/upload-case-document-dialog';
import { listCaseDocumentsParamsSchema } from './schemas/list-case-documents-params-schema';
import { processDocumentRoleFolderLabels } from './utils/case-document-labels';

export const metadata: Metadata = {
    title: 'Documentos do processo',
};

type CaseDocsPageProps = {
    params: Promise<{ client_id: string; case_id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CaseDocsPage = async ({ params, searchParams }: CaseDocsPageProps) => {
    const { client_id: rawClientId, case_id: rawCaseId } = await params;

    const parsedClientId = clientIdSchema.safeParse(rawClientId);
    const parsedCaseId = caseIdSchema.safeParse(rawCaseId);

    // O layout já validou o processo; isto só protege esta rota caso ela seja
    // acessada de outro ponto sem passar pelo layout.
    if (!parsedClientId.success || !parsedCaseId.success) {
        notFound();
    }

    const clientId = parsedClientId.data;
    const caseId = parsedCaseId.data;
    const filterParams = listCaseDocumentsParamsSchema.parse(await searchParams);

    const folderLabel = filterParams.role
        ? processDocumentRoleFolderLabels[filterParams.role]
        : 'Todos os documentos';

    return (
        <div className="grid gap-4">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="grid gap-1">
                    <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
                        Módulo do processo
                    </span>

                    <h2 className="font-heading text-2xl font-semibold tracking-tight">
                        Documentos do processo
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Arquivos vinculados a este processo. Todos permanecem também no arquivo
                        geral do cliente.
                    </p>
                </div>

                <UploadCaseDocumentDialog
                    clientId={clientId}
                    caseId={caseId}
                    defaultRole={filterParams.role}
                />
            </header>

            <div className="grid items-start gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
                {/*
          A árvore só depende da pasta selecionada, mas ainda assim ganha um
          boundary próprio: sem ele, a busca e o filtro de formato ficariam
          esperando a consulta dos contadores para trocar a tabela.
        */}
                <Suspense key={filterParams.role ?? 'all'} fallback={<CaseDocsFoldersSkeleton />}>
                    <CaseDocsFolders clientId={clientId} caseId={caseId} params={filterParams} />
                </Suspense>

                <section className="overflow-hidden rounded-xl border bg-card">
                    <header className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                        <div className="min-w-52">
                            <h3 className="text-sm font-semibold">{folderLabel}</h3>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Repositório de documentos do processo.
                            </p>
                        </div>

                        <CaseDocsToolbar clientId={clientId} caseId={caseId} params={filterParams} />
                    </header>

                    {/*
            A `key` refaz o boundary a cada combinação de filtros, então a
            troca de filtro mostra o skeleton em vez de congelar a lista
            anterior até a nova consulta responder.
          */}
                    <Suspense
                        key={JSON.stringify(filterParams)}
                        fallback={<CaseDocsTableSkeleton />}
                    >
                        <CaseDocsTable clientId={clientId} caseId={caseId} params={filterParams} />
                    </Suspense>
                </section>
            </div>
        </div>
    );
};

export default CaseDocsPage;
