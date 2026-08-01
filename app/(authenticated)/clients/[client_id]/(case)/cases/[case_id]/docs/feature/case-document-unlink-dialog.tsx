'use client';

import { Unlink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { unlinkCaseDocument } from '../actions/unlink-case-document';

type CaseDocumentUnlinkDialogProps = {
    clientId: string;
    caseId: string;
    linkId: string;
    title: string;
};

export const CaseDocumentUnlinkDialog = ({
    clientId,
    caseId,
    linkId,
    title,
}: CaseDocumentUnlinkDialogProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const confirmUnlink = () => {
        startTransition(async () => {
            const result = await unlinkCaseDocument({ clientId, caseId, linkId });

            if (!result.ok) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            setIsOpen(false);
            router.refresh();
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover ${title} do processo`}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Unlink aria-hidden="true" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remover documento do processo</AlertDialogTitle>

                    <AlertDialogDescription>
                        <strong>{title}</strong> deixará de constar no repositório deste processo,
                        mas continua disponível no arquivo do cliente. Para excluir o documento em
                        si, use a aba Documentos do cliente.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            // O dialog fecha sozinho ao confirmar; o fechamento fica por
                            // conta da action para que o erro mantenha o dialog aberto.
                            event.preventDefault();
                            confirmUnlink();
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
