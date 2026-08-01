import { getInitials } from '@/utils/get-initials';

import { processPartyRoleLabels } from '../../../../(client)/cases/utils/case-labels';
import type { CaseOverview } from '../queries/get-case-overview';

type CaseMainPartiesPanelProps = {
    parties: CaseOverview['mainParties'];
};

export const CaseMainPartiesPanel = ({ parties }: CaseMainPartiesPanelProps) => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <header className="flex min-h-14 items-center border-b px-4 py-3">
            <div>
                <h2 className="text-sm font-semibold">Partes principais</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Polos e representantes do processo.</p>
            </div>
        </header>

        <div className="grid gap-2 p-4">
            {parties.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma parte cadastrada.</p>
            ) : (
                parties.map((party) => (
                    <article
                        key={party.id}
                        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border bg-muted p-2.5"
                    >
                        <span className="grid size-8 place-items-center rounded-md bg-card text-[10px] font-bold text-primary">
                            {getInitials(party.name)}
                        </span>

                        <div className="min-w-0">
                            <strong className="block truncate text-xs">{party.name}</strong>
                            <small className="mt-0.5 block text-[10px] text-muted-foreground">
                                {party.isClient ? 'Cliente' : 'Parte contrária'}
                            </small>
                        </div>

                        <span className="shrink-0 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                            {processPartyRoleLabels[party.role]}
                        </span>
                    </article>
                ))
            )}
        </div>
    </section>
);
