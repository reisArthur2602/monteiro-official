"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { deleteClientDocument } from "../actions/delete-client-document";

type DocumentDeleteDialogProps = {
  clientId: string;
  documentId: string;
  title: string;
};

export const DocumentDeleteDialog = ({
  clientId,
  documentId,
  title,
}: DocumentDeleteDialogProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteClientDocument({ clientId, documentId });

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
          aria-label={`Excluir ${title}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir documento</AlertDialogTitle>

          <AlertDialogDescription>
            O documento <strong>{title}</strong> deixará de aparecer no arquivo
            do cliente. O arquivo enviado é preservado, então a exclusão pode
            ser revertida.
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
            {isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
