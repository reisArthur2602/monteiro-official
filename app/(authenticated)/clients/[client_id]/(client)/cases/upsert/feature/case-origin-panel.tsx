import { Check, FileText } from 'lucide-react';

import { FormPanel } from '@/components/shared/form-panel';

import { formatDate } from '../../../utils/format-date';

export type CaseOrigin = {
    id: string;
    subject: string | null;
    legalArea: string | null;
    attendanceAt: string;
    finalizedAt: string | null;
    finalizedByName: string | null;
};

type CaseOriginPanelProps = {
    origin: CaseOrigin;
    clientName: string;
    clientDocument: string;
};

const UNTITLED_INTAKE = 'Ficha sem assunto';

/**
 * Origem do processo. É só leitura de propósito: cliente, ficha e
 * responsável são resolvidos no servidor e nunca trafegam como campo
 * editável do formulário.
 */
export const CaseOriginPanel = ({ origin, clientName, clientDocument }: CaseOriginPanelProps) => (
    <FormPanel
        title="Origem do processo"
        description="Cliente, ficha e responsável são definidos pelo servidor."
    >
        <div className="grid gap-3">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-primary/20 bg-accent p-3.5">
                <span
                    aria-hidden="true"
                    className="grid h-16 w-14 place-items-center rounded-lg border border-primary/20 bg-card text-primary"
                >
                    <FileText className="size-5" />
                </span>

                <div className="min-w-0">
                    <strong className="block truncate text-sm">
                        {origin.subject ?? UNTITLED_INTAKE}
                    </strong>

                    <small className="mt-1 block text-xs text-muted-foreground">
                        {origin.finalizedAt
                            ? `Finalizada em ${formatDate(origin.finalizedAt)}`
                            : `Atendimento de ${formatDate(origin.attendanceAt)}`}
                        {origin.finalizedByName ? ` por ${origin.finalizedByName}` : ''}
                        {origin.legalArea ? ` · Área ${origin.legalArea}` : ''}
                    </small>

                    <small className="mt-0.5 block truncate text-xs text-muted-foreground">
                        Cliente: {clientName} · {clientDocument}
                    </small>
                </div>
            </div>

            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5 rounded-lg border border-chart-2/40 bg-chart-2/12 p-3 text-chart-2">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />

                <div>
                    <strong className="block text-xs">Vínculo validado</strong>

                    <small className="mt-0.5 block text-[11px]">
                        A ficha está finalizada, pertence ao cliente atual e ainda não possui
                        processo.
                    </small>
                </div>
            </div>
        </div>
    </FormPanel>
);
