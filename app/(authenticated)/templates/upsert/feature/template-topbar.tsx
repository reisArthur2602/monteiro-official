"use client";

import { ArrowLeft, Save, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import type { TemplateFormValues } from "../types/template-types";
import { useTemplateUpsert } from "./template-form-provider";
import { TemplateSaveStatus } from "./template-save-status";

type TemplateTopbarProps = {
  onOpenSettings: () => void;
  onOpenPublish: () => void;
};

const UNTITLED_TEMPLATE = "Sem título";

export const TemplateTopbar = ({
  onOpenSettings,
  onOpenPublish,
}: TemplateTopbarProps) => {
  const router = useRouter();
  const { isDirty, saveState, saveMessage, save, isPublishing } =
    useTemplateUpsert();
  const { control } = useFormContext<TemplateFormValues>();

  const name = useWatch({ control, name: "name" });
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const goToTemplates = () => router.push("/templates");

  const handleBack = () => {
    if (isDirty) {
      setIsLeaveConfirmOpen(true);
      return;
    }

    goToTemplates();
  };

  const handleSaveAndLeave = async () => {
    setIsSaving(true);

    try {
      await save();
      setIsLeaveConfirmOpen(false);
      goToTemplates();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = async () => {
    const saved = await save();

    // O ponto/rótulo de estado já cobre desktop; em telas menores, onde ele
    // fica escondido, o toast é o único aviso de que a gravação falhou.
    if (!saved) {
      toast.error("Não foi possível salvar o template");
    }
  };

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b bg-card/90 px-3 py-2 backdrop-blur-sm sm:gap-4 sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0"
        onClick={handleBack}
      >
        <ArrowLeft aria-hidden="true" />
        <span className="hidden sm:inline">Templates</span>
      </Button>

      {/*
        Só leitura aqui: o título passou a ser editado dentro de
        Configurações (`GeneralTemplateSettings`), junto do resto dos
        metadados do template — a topbar não precisa mais de um campo.
      */}
      <h1 className="min-w-0 truncate text-center font-heading text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
        {name?.trim() || (
          <span className="font-normal text-muted-foreground">
            {UNTITLED_TEMPLATE}
          </span>
        )}
      </h1>

      <div className="flex shrink-0 items-center gap-2">
        {/*
          Mesmo ponto de corte dos botões Salvar/Configurações/Publicar
          logo abaixo — sem isto, existiria uma faixa de largura (`md` até
          `lg`) com os botões visíveis mas nenhum feedback de estado.
        */}
        <TemplateSaveStatus
          state={saveState}
          message={saveMessage}
          className="hidden md:inline-flex"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden md:inline-flex"
          disabled={!isDirty || isPublishing}
          onClick={handleSaveClick}
        >
          <Save aria-hidden="true" />
          Salvar
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden md:inline-flex"
          onClick={onOpenSettings}
        >
          <Settings2 aria-hidden="true" />
          Configurações
        </Button>

        <Button
          type="button"
          size="sm"
          className="hidden md:inline-flex"
          disabled={isPublishing}
          onClick={onOpenPublish}
        >
          {isPublishing ? "Publicando…" : "Publicar"}
        </Button>
      </div>

      <AlertDialog open={isLeaveConfirmOpen} onOpenChange={setIsLeaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair sem salvar?</AlertDialogTitle>

            <AlertDialogDescription>
              Há alterações não salvas neste template. Elas serão perdidas se
              você sair sem salvar.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>
              Cancelar
            </AlertDialogCancel>

            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={goToTemplates}
            >
              Sair sem salvar
            </Button>

            <AlertDialogAction
              disabled={isSaving}
              onClick={(event) => {
                event.preventDefault();
                void handleSaveAndLeave();
              }}
            >
              {isSaving ? "Salvando…" : "Salvar e sair"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};
