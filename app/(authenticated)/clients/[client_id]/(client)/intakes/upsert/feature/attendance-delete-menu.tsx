'use client';

import { MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AttendanceDeleteMenuProps = {
    isPending: boolean;
    onDelete: () => void;
};

/**
 * Única fonte da ação destrutiva da ficha, usada tanto no cabeçalho quanto
 * na barra mobile — a mesma definição, só reposicionada por breakpoint,
 * nunca duplicada.
 *
 * Fica em um menu, separada visualmente de Cancelar/Salvar/Finalizar, que
 * já ocupam o teto de uma primária e duas secundárias.
 */
export const AttendanceDeleteMenu = ({ isPending, onDelete }: AttendanceDeleteMenuProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Mais ações da ficha"
                    >
                        <MoreVertical aria-hidden="true" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        variant="destructive"
                        disabled={isPending}
                        onSelect={() => setIsConfirmOpen(true)}
                    >
                        <Trash2 aria-hidden="true" />
                        Excluir ficha
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir esta ficha?</AlertDialogTitle>

                        <AlertDialogDescription>
                            A ficha deixará de aparecer na listagem do cliente. Esta ação não pode
                            ser desfeita pela interface.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                // O dialog fecha sozinho ao confirmar; o fechamento fica por
                                // conta da action para que o erro mantenha o dialog aberto.
                                event.preventDefault();
                                onDelete();
                            }}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
