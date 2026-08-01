'use client';

import { UserX } from 'lucide-react';
import Link from 'next/link';
import { useFormContext, useWatch } from 'react-hook-form';

import { ClientStatus } from '@/app/generated/prisma/enums';
import { Button } from '@/components/ui/button';

import { CLIENTS_PATH } from '../../../../utils/build-clients-href';
import type { ClientFormInput } from '../schemas/client-form-schema';

type ClientFormActionsProps = {
    formId: string;
    mode: 'create' | 'edit';
    isPending: boolean;
    onDeactivate: () => void;
};

export const ClientFormActions = ({
    formId,
    mode,
    isPending,
    onDeactivate,
}: ClientFormActionsProps) => {
    const { control } = useFormContext<ClientFormInput>();
    const status = useWatch({ control, name: 'status' });

    const isInactive = status === ClientStatus.INATIVO;

    return (
        <section className="grid gap-2 rounded-xl border bg-card p-3.5">
            <Button type="submit" form={formId} disabled={isPending}>
                {isPending ? 'Salvando…' : mode === 'edit' ? 'Salvar alterações' : 'Salvar cliente'}
            </Button>

            <Button asChild variant="outline">
                <Link href={CLIENTS_PATH}>Cancelar</Link>
            </Button>

            {mode === 'edit' ? (
                <Button
                    type="button"
                    variant="outline"
                    className="border-destructive/35 bg-destructive/8 text-destructive hover:bg-destructive/15 hover:text-destructive"
                    disabled={isPending || isInactive}
                    onClick={onDeactivate}
                >
                    <UserX aria-hidden="true" />
                    {isInactive ? 'Cliente inativo' : 'Desativar cliente'}
                </Button>
            ) : null}
        </section>
    );
};
