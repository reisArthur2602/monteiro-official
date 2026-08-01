import {
    processClientRoleLabels,
    processStatusLabels,
    processTypeLabels,
} from '../../../../(client)/cases/utils/case-labels';
import { formatCivilDate } from '../../../../(client)/utils/format-date';
import type { CaseOverview } from '../queries/get-case-overview';

type InfoItemProps = {
    label: string;
    value: string;
};

const InfoItem = ({ label, value }: InfoItemProps) => (
    <div className="grid gap-1 rounded-lg border bg-muted p-3">
        <span className="font-mono text-[8px] tracking-wider text-muted-foreground uppercase">{label}</span>
        <strong className="text-xs">{value}</strong>
    </div>
);

const NOT_INFORMED = 'Não informado';

type CaseInfoPanelProps = {
    item: CaseOverview;
};

export const CaseInfoPanel = ({ item }: CaseInfoPanelProps) => {
    const jurisdiction = [item.jurisdiction, item.state].filter(Boolean).join('/');

    return (
        <section className="overflow-hidden rounded-xl border bg-card">
            <header className="flex min-h-14 items-center border-b px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold">Informações do processo</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Identificação, classificação e distribuição.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3">
                <InfoItem label="Código interno" value={item.internalCode} />
                <InfoItem label="Status" value={processStatusLabels[item.status]} />
                <InfoItem label="Tipo" value={processTypeLabels[item.type]} />
                <InfoItem label="Área jurídica" value={item.legalArea} />
                <InfoItem label="Polo do cliente" value={processClientRoleLabels[item.clientRole]} />

                <InfoItem
                    label="Distribuição"
                    value={item.filingDate ? formatCivilDate(item.filingDate) : NOT_INFORMED}
                />

                <InfoItem label="Tribunal" value={item.court ?? NOT_INFORMED} />
                <InfoItem label="Unidade" value={item.courtUnit ?? NOT_INFORMED} />
                <InfoItem label="Comarca" value={jurisdiction || NOT_INFORMED} />
            </div>

            {item.notes ? (
                <div className="border-t px-4 py-3.5">
                    <p className="mb-1.5 font-mono text-[8px] tracking-wider text-muted-foreground uppercase">
                        Observações internas
                    </p>

                    <p className="text-xs leading-relaxed whitespace-pre-line text-foreground">{item.notes}</p>
                </div>
            ) : null}
        </section>
    );
};
