import { attendanceChannelLabels } from '../../../utils/attendance-form-labels';
import type { AttendanceFormDetail } from '../queries/get-attendance-form-detail';
import { formatDateTime } from '../utils/format-datetime';

type SummaryItemProps = {
    label: string;
    children: React.ReactNode;
};

const SummaryItem = ({ label, children }: SummaryItemProps) => (
    <div className="flex items-start justify-between gap-3 border-b pb-2.5 last:border-b-0 last:pb-0">
        <span className="text-[10px] text-muted-foreground">{label}</span>

        <strong className="max-w-[64%] text-right text-[10px] font-semibold">{children}</strong>
    </div>
);

type AttendanceInfoSummaryPanelProps = {
    form: AttendanceFormDetail;
    statusLabel: string;
};

export const AttendanceInfoSummaryPanel = ({
    form,
    statusLabel,
}: AttendanceInfoSummaryPanelProps) => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <header className="flex min-h-14 items-center border-b px-4 py-3">
            <div>
                <h2 className="text-sm font-semibold">Informações da ficha</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Contexto e estado atual.</p>
            </div>
        </header>

        <div className="grid gap-2.5 p-4">
            <SummaryItem label="Status">{statusLabel}</SummaryItem>

            <SummaryItem label="Canal">
                {form.channel ? attendanceChannelLabels[form.channel] : 'Não informado'}
            </SummaryItem>

            <SummaryItem label="Área jurídica">{form.legalArea || 'Não informada'}</SummaryItem>

            <SummaryItem label="Assunto">{form.subject || 'Não informado'}</SummaryItem>

            <SummaryItem label="Responsável">{form.responsible.name}</SummaryItem>

            <SummaryItem label="Atualização">{formatDateTime(form.updatedAt)}</SummaryItem>
        </div>
    </section>
);
