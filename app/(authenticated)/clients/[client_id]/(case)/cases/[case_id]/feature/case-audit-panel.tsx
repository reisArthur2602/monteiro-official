import { formatUpdatedAt } from '../../../../../utils/format-updated-at';
import type { CaseOverview } from '../queries/get-case-overview';

type AuditRowProps = {
    label: string;
    children: React.ReactNode;
};

const AuditRow = ({ label, children }: AuditRowProps) => (
    <div className="flex items-start justify-between gap-3 border-t pt-2.5 first:border-t-0 first:pt-0">
        <span className="shrink-0 text-[10px] text-muted-foreground">{label}</span>

        <span className="max-w-[62%] truncate text-right text-[10px] font-semibold">{children}</span>
    </div>
);

type CaseAuditPanelProps = {
    createdBy: CaseOverview['createdBy'];
    createdAt: string;
    updatedBy: CaseOverview['updatedBy'];
    updatedAt: string;
};

export const CaseAuditPanel = ({ createdBy, createdAt, updatedBy, updatedAt }: CaseAuditPanelProps) => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <header className="flex min-h-14 items-center border-b px-4 py-3">
            <div>
                <h2 className="text-sm font-semibold">Auditoria</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Controle do registro processual.</p>
            </div>
        </header>

        <div className="grid gap-2.5 p-4">
            <AuditRow label="Criado por">{createdBy.name}</AuditRow>
            <AuditRow label="Criado em">{formatUpdatedAt(createdAt)}</AuditRow>
            <AuditRow label="Atualizado por">{updatedBy.name}</AuditRow>
            <AuditRow label="Última atualização">{formatUpdatedAt(updatedAt)}</AuditRow>
        </div>
    </section>
);
