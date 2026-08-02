import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { clientIdSchema } from '../../../../(client)/schemas/client-id-schema';
import { caseIdSchema } from '../schemas/case-id-schema';
import { CaseMovementsTimeline } from './feature/case-movements-timeline';
import { CaseMovementsTimelineSkeleton } from './feature/case-movements-timeline-skeleton';
import { CreateCaseMovementDialog } from './feature/create-case-movement-dialog';
import { listCaseMovementsParamsSchema } from './schemas/list-case-movements-params-schema';

export const metadata: Metadata = {
    title: 'Movimentações do processo',
};

type CaseMovementsPageProps = {
    params: Promise<{ client_id: string; case_id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CaseMovementsPage = async ({ params, searchParams }: CaseMovementsPageProps) => {
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
    const filterParams = listCaseMovementsParamsSchema.parse(await searchParams);

    return (
        <div className="grid gap-4">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="grid gap-1">
                    <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
                        Módulo do processo
                    </span>

                    <h2 className="font-heading text-2xl font-semibold tracking-tight">
                        Movimentações
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Histórico cronológico dos andamentos registrados pela equipe, pelo sistema
                        e pelo tribunal.
                    </p>
                </div>

                <CreateCaseMovementDialog clientId={clientId} caseId={caseId} />
            </header>

            {/*
        A `key` refaz o boundary a cada combinação de filtros, então a
        troca de filtro mostra o skeleton em vez de congelar a lista
        anterior até a nova consulta responder.
      */}
            <Suspense
                key={JSON.stringify(filterParams)}
                fallback={<CaseMovementsTimelineSkeleton />}
            >
                <CaseMovementsTimeline clientId={clientId} caseId={caseId} params={filterParams} />
            </Suspense>
        </div>
    );
};

export default CaseMovementsPage;
