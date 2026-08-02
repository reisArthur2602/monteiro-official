import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { clientIdSchema } from '../../../(client)/schemas/client-id-schema';
import { CaseAuditPanel } from './feature/case-audit-panel';
import { CaseInfoPanel } from './feature/case-info-panel';
import { CaseMainPartiesPanel } from './feature/case-main-parties-panel';
import { CaseOriginPanel } from './feature/case-origin-panel';
import { CaseOverviewMetrics } from './feature/case-overview-metrics';
import { CaseRecentDocumentsPanel } from './feature/case-recent-documents-panel';
import { CaseRecentMovementsPanel } from './feature/case-recent-movements-panel';
import { CaseUpcomingDeadlinesPanel } from './feature/case-upcoming-deadlines-panel';
import { getCaseOverview } from './queries/get-case-overview';
import { caseIdSchema } from './schemas/case-id-schema';

type CasePageProps = {
    params: Promise<{ client_id: string; case_id: string }>;
};

export const generateMetadata = async ({ params }: CasePageProps): Promise<Metadata> => {
    const { client_id: rawClientId, case_id: rawCaseId } = await params;

    const parsedClientId = clientIdSchema.safeParse(rawClientId);
    const parsedCaseId = caseIdSchema.safeParse(rawCaseId);

    if (!parsedClientId.success || !parsedCaseId.success) {
        return { title: 'Processo' };
    }

    const item = await getCaseOverview(parsedClientId.data, parsedCaseId.data);

    return { title: item ? item.title : 'Processo' };
};

const CasePage = async ({ params }: CasePageProps) => {
    const { client_id: rawClientId, case_id: rawCaseId } = await params;

    const parsedClientId = clientIdSchema.safeParse(rawClientId);
    const parsedCaseId = caseIdSchema.safeParse(rawCaseId);

    if (!parsedClientId.success || !parsedCaseId.success) {
        notFound();
    }

    // Deduplicado pelo `cache()` da query: o layout já buscou o processo
    // nesta renderização, mas com uma seleção mais enxuta — esta consulta
    // traz as relações extras que só a Visão geral usa.
    const item = await getCaseOverview(parsedClientId.data, parsedCaseId.data);

    if (!item) {
        notFound();
    }

    return (
        <div className="grid gap-5">
            <header className="grid gap-1">
                <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
                    Módulo do processo
                </span>

                <h2 className="font-heading text-2xl font-semibold tracking-tight">Visão geral</h2>

                <p className="text-sm text-muted-foreground">
                    Resumo processual, movimentações recentes e itens que exigem acompanhamento.
                </p>
            </header>

            <CaseOverviewMetrics metrics={item.metrics} />

            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="grid gap-4">
                    <CaseInfoPanel item={item} />
                    <CaseOriginPanel clientId={parsedClientId.data} attendanceForm={item.attendanceForm} />
                    <CaseRecentMovementsPanel
                        clientId={parsedClientId.data}
                        caseId={parsedCaseId.data}
                        movements={item.recentMovements}
                    />
                </div>

                <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <CaseUpcomingDeadlinesPanel deadlines={item.upcomingDeadlines} />
                    <CaseMainPartiesPanel parties={item.mainParties} />
                    <CaseRecentDocumentsPanel clientId={parsedClientId.data} documents={item.recentDocuments} />

                    <CaseAuditPanel
                        createdBy={item.createdBy}
                        createdAt={item.createdAt}
                        updatedBy={item.updatedBy}
                        updatedAt={item.updatedAt}
                    />
                </aside>
            </div>
        </div>
    );
};

export default CasePage;
