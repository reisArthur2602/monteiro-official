import { ExternalLink, NotebookPen } from 'lucide-react';
import Link from 'next/link';

import { buildIntakeDetailHref } from '../../../../(client)/intakes/utils/build-intakes-href';
import { formatUpdatedAt } from '../../../../../utils/format-updated-at';
import type { CaseOverview } from '../queries/get-case-overview';

const UNTITLED_INTAKE = 'Ficha sem assunto';

type CaseOriginPanelProps = {
    clientId: string;
    attendanceForm: CaseOverview['attendanceForm'];
};

export const CaseOriginPanel = ({ clientId, attendanceForm }: CaseOriginPanelProps) => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <header className="flex min-h-14 items-center border-b px-4 py-3">
            <div>
                <h2 className="text-sm font-semibold">Ficha de origem</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Atendimento finalizado que originou o processo.
                </p>
            </div>
        </header>

        <div className="p-4">
            <Link
                href={buildIntakeDetailHref(clientId, attendanceForm.id)}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-primary/20 bg-accent p-3.5 outline-none transition-colors hover:border-primary/40 focus-visible:border-primary"
            >
                <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary/20 bg-card text-primary"
                >
                    <NotebookPen className="size-5" />
                </span>

                <div className="min-w-0">
                    <strong className="block truncate text-sm">
                        {attendanceForm.subject ?? UNTITLED_INTAKE}
                    </strong>

                    <small className="mt-0.5 block text-xs text-muted-foreground">
                        {attendanceForm.finalizedAt
                            ? `Finalizada ${formatUpdatedAt(attendanceForm.finalizedAt)}${
                                  attendanceForm.finalizedBy ? ` por ${attendanceForm.finalizedBy.name}` : ''
                              }`
                            : 'Ficha finalizada'}
                    </small>

                    {attendanceForm.legalArea ? (
                        <small className="mt-0.5 block text-xs text-muted-foreground">
                            Área: {attendanceForm.legalArea}
                        </small>
                    ) : null}
                </div>

                <ExternalLink aria-hidden="true" className="size-4 shrink-0 text-primary" />
            </Link>
        </div>
    </section>
);
