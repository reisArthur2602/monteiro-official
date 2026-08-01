'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/get-initials';

import { ClientStatusBadge } from '../../../../feature/client-status-badge';
import { clientTypeLabels } from '../../../../utils/client-labels';
import { formatDocument } from '../../../../utils/format-document';
import type { AssignableUser } from '../queries/list-assignable-users';
import type { ClientFormInput } from '../schemas/client-form-schema';
import { maskPhone } from '../utils/input-masks';

type SummaryRowProps = {
    label: string;
    children: React.ReactNode;
};

const SummaryRow = ({ label, children }: SummaryRowProps) => (
    <div className="flex items-center justify-between gap-3 border-t pt-2.5">
        <span className="shrink-0 text-xs text-muted-foreground">{label}</span>

        <span className="truncate text-xs font-semibold">{children}</span>
    </div>
);

type ClientSummaryCardProps = {
    users: AssignableUser[];
};

/**
 * Espelho do formulário enquanto ele é preenchido.
 *
 * Observa apenas os campos que exibe, com `useWatch` nomeado, para não
 * re-renderizar a cada tecla digitada nos outros painéis.
 */
export const ClientSummaryCard = ({ users }: ClientSummaryCardProps) => {
    const { control } = useFormContext<ClientFormInput>();

    const [type, status, name, displayName, document, email, phone, responsibleId] = useWatch({
        control,
        name: [
            'type',
            'status',
            'name',
            'displayName',
            'document',
            'email',
            'phone',
            'responsibleId',
        ],
    });

    const heading = displayName?.trim() || name?.trim() || 'Novo cliente';
    const responsible = users.find((user) => user.id === responsibleId);
    const contact = email?.trim() || (phone ? maskPhone(phone) : '');

    return (
        <section className="grid gap-4 rounded-xl border bg-card p-4">
            <header className="flex items-center gap-3">
                <Avatar className="size-12 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-accent font-heading text-lg font-semibold text-accent-foreground">
                        {getInitials(heading)}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <p className="truncate font-bold">{heading}</p>

                    <p className="truncate text-xs text-muted-foreground">
                        {type ? clientTypeLabels[type] : '—'}
                    </p>
                </div>
            </header>

            <div className="grid gap-2.5">
                <SummaryRow label="Status">
                    {status ? <ClientStatusBadge status={status} /> : '—'}
                </SummaryRow>

                <SummaryRow label="Documento">
                    {document ? (
                        <span className="font-mono">{formatDocument(document)}</span>
                    ) : (
                        <span className="font-normal text-muted-foreground">Não informado</span>
                    )}
                </SummaryRow>

                <SummaryRow label="Responsável">
                    {responsible?.name ?? (
                        <span className="font-normal text-muted-foreground">Não selecionado</span>
                    )}
                </SummaryRow>

                <SummaryRow label="Contato">
                    {contact || (
                        <span className="font-normal text-muted-foreground">Não informado</span>
                    )}
                </SummaryRow>
            </div>
        </section>
    );
};
