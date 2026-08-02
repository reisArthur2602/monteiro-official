'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { deleteCaseMovement } from '../actions/delete-case-movement';

type MovementDeleteDialogProps = {
    clientId: string;
    caseId: string;
    movementId: string;
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

/**
 * Aberto pelo menu de ações do card, não por um trigger próprio — por isso
 * não tem `AlertDialogTrigger`: `open`/`onOpenChange` são controlados de
 * fora.
 */
export const MovementDeleteDialog = ({
    clientId,
    caseId,
    movementId,
    title,
    open,
    onOpenChange,
}: MovementDeleteDialogProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const confirmDelete = () => {
        startTransition(async () => {
            const result = await deleteCaseMovement({ clientId, caseId, movementId });

            if (!result.ok) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            onOpenChange(false);
            router.refresh();
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remover movimentação</AlertDialogTitle>

                    <AlertDialogDescription>
                        <strong>{title}</strong> deixará de aparecer na linha do tempo do processo.
                        O registro é preservado e pode ser recuperado.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            // O dialog fecha sozinho ao confirmar; o fechamento fica por
                            // conta da action para que o erro mantenha o dialog aberto.
                            event.preventDefault();
                            confirmDelete();
                        }}
                        disabled={isPending}
                    >
                        {isPending ? 'Removendo...' : 'Remover'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
