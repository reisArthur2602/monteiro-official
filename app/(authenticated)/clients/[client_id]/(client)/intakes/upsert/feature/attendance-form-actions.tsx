"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";

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

import { buildIntakesHref } from "../../utils/build-intakes-href";

type AttendanceFormActionsProps = {
  clientId: string;
  mode: "create" | "edit";
  isPending: boolean;
  onSaveDraft: () => void;
  onFinalize: () => void;
  onDelete?: () => void;
};

export const AttendanceFormActions = ({
  clientId,
  mode,
  isPending,
  onSaveDraft,
  onFinalize,
  onDelete,
}: AttendanceFormActionsProps) => (
  <section className="grid gap-2 rounded-xl border bg-card p-3.5">
    <Button type="button" disabled={isPending} onClick={onFinalize}>
      {isPending ? "Salvando…" : "Finalizar ficha"}
    </Button>

    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={onSaveDraft}
    >
      Salvar rascunho
    </Button>

    <Button asChild variant="outline">
      <Link href={buildIntakesHref(clientId, {})}>Cancelar</Link>
    </Button>

    {mode === "edit" && onDelete ? (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="border-destructive/35 bg-destructive/8 text-destructive hover:bg-destructive/15 hover:text-destructive"
          >
            <Trash2 aria-hidden="true" />
            Excluir ficha
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta ficha?</AlertDialogTitle>

            <AlertDialogDescription>
              A ficha deixará de aparecer na listagem do cliente. Esta ação não
              pode ser desfeita pela interface.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : null}
  </section>
);
