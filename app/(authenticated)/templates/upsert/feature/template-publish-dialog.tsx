"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { TEMPLATE_FORM_ID, useTemplateUpsert } from "./template-form-provider";

type TemplatePublishDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TemplatePublishDialog = ({
  open,
  onOpenChange,
}: TemplatePublishDialogProps) => {
  const { currentVersion, isPublishing } = useTemplateUpsert();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publicar nova versão?</AlertDialogTitle>

          <AlertDialogDescription>
            O documento será salvo como a versão {currentVersion + 1}, imutável.
            Alterações futuras criarão outra versão.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPublishing}>
            Cancelar
          </AlertDialogCancel>

          {/*
            O conteúdo do AlertDialog é renderizado em portal, fora da árvore
            do <form>. O atributo `form` religa o botão ao formulário, para
            que a publicação passe pelo handleSubmit e pela validação.
          */}
          <AlertDialogAction
            type="submit"
            form={TEMPLATE_FORM_ID}
            disabled={isPublishing}
          >
            {isPublishing ? "Publicando…" : "Publicar versão"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
