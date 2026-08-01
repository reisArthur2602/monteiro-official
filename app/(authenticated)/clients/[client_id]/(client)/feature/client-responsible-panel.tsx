import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/get-initials';
import { userRoleLabels } from '@/utils/user-role-labels';

import type { ClientContext } from '../queries/get-client-context';

type ClientResponsiblePanelProps = {
    responsible: ClientContext['responsible'];
};

export const ClientResponsiblePanel = ({ responsible }: ClientResponsiblePanelProps) => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <header className="flex min-h-14 items-center border-b px-4 py-3">
            <div>
                <h2 className="text-sm font-semibold">Responsável</h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                    Profissional principal pelo relacionamento.
                </p>
            </div>
        </header>

        <div className="flex items-center gap-3 p-4 sm:p-5">
            <Avatar className="size-11 rounded-lg">
                <AvatarFallback className="rounded-lg bg-accent font-heading font-semibold text-accent-foreground">
                    {getInitials(responsible.name)}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
                <p className="truncate font-semibold">{responsible.name}</p>

                <p className="truncate text-xs text-muted-foreground">
                    {userRoleLabels[responsible.role]}
                </p>
            </div>
        </div>
    </section>
);
