"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useFormState } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import { createTemplateDraft } from "../actions/create-template-draft";
import { updateTemplateDraft } from "../actions/update-template-draft";
import type { SaveState, TemplateFormValues } from "../types/template-types";

type UseTemplateSaveOptions = {
  form: UseFormReturn<TemplateFormValues>;
  templateId: string | null;
  revision: number;
  onTemplateCreated: (templateId: string, revision: number) => void;
  onRevisionChanged: (revision: number) => void;
};

export type UseTemplateSaveResult = {
  saveState: SaveState;
  saveMessage: string;
  isDirty: boolean;
  /** Grava imediatamente o rascunho pendente. Usado pelo botão Salvar, o
   *  atalho de teclado e antes de publicar. Não faz nada se não há
   *  alteração pendente. */
  save: () => Promise<boolean>;
  /**
   * Revisão e id gravados mais recentemente, lidos direto das refs
   * internas.
   *
   * Existem porque `revision`/`templateId` (props) só se atualizam no
   * próximo render depois de `onRevisionChanged`/`onTemplateCreated` — quem
   * chama `save()` e precisa do valor novo dentro do mesmo `handlePublish`
   * (sem esperar um re-render) usa isto em vez do que capturou no
   * fechamento. Sem isto, publicar direto sem ter salvo antes falharia
   * sempre: no modo criação com "rascunho ainda não foi criado" (o
   * `templateId` do fechamento continua `null`), e no modo edição com
   * conflito de revisão (o `revision` do fechamento fica um passo atrás do
   * que `save()` acabou de gravar).
   */
  getRevision: () => number;
  getTemplateId: () => string | null;
};

const SAVE_MESSAGES: Record<SaveState, string> = {
  // `clean` não é exibido em lugar nenhum — ver `template-save-status.tsx`.
  clean: "",
  dirty: "Alterações não salvas",
  saving: "Salvando…",
  saved: "Salvo com sucesso",
  error: "Não foi possível salvar",
};

/**
 * Salvamento explícito do rascunho — sem gravação automática enquanto se
 * digita. `isDirty` vem do React Hook Form; o estado de exibição
 * (`saveState`) só muda em resposta a uma gravação real disparada pelo
 * usuário, nunca sozinho.
 */
export const useTemplateSave = ({
  form,
  templateId,
  revision,
  onTemplateCreated,
  onRevisionChanged,
}: UseTemplateSaveOptions): UseTemplateSaveResult => {
  const router = useRouter();
  const { getValues, reset, control } = form;
  const { isDirty } = useFormState({ control });

  const [saveState, setSaveState] = useState<SaveState>("clean");

  // Refs porque `save()` precisa enxergar sempre o valor mais recente, sem
  // recriar a função a cada mudança de prop.
  const templateIdRef = useRef(templateId);
  const revisionRef = useRef(revision);
  const inFlightRef = useRef(false);

  templateIdRef.current = templateId;
  revisionRef.current = revision;

  const save = useCallback(async (): Promise<boolean> => {
    // Uma gravação por vez: evita que um duplo clique em Salvar (ou Salvar
    // disparado por Publicar enquanto o clique manual ainda está em voo)
    // crie dois templates no modo de criação.
    if (inFlightRef.current) {
      return false;
    }

    if (!form.formState.isDirty) {
      return true;
    }

    inFlightRef.current = true;
    setSaveState("saving");

    try {
      const values = getValues();
      const currentTemplateId = templateIdRef.current;

      if (!currentTemplateId) {
        const result = await createTemplateDraft({ values });

        if (!result.ok || !result.data) {
          setSaveState("error");
          return false;
        }

        templateIdRef.current = result.data.templateId;
        revisionRef.current = result.data.revision;
        onTemplateCreated(result.data.templateId, result.data.revision);

        // A URL passa a carregar o id sem recarregar a rota, de modo que
        // um refresh reabra o mesmo rascunho.
        router.replace(
          `/templates/upsert?templateId=${result.data.templateId}`,
          { scroll: false },
        );
      } else {
        const result = await updateTemplateDraft({
          templateId: currentTemplateId,
          revision: revisionRef.current,
          values,
        });

        if (!result.ok || !result.data) {
          setSaveState("error");
          return false;
        }

        revisionRef.current = result.data.revision;
        onRevisionChanged(result.data.revision);
      }

      // Mantém os valores em tela e zera o `isDirty`, para a próxima
      // edição voltar a marcar "Alterações não salvas" a partir daqui.
      reset(getValues(), {
        keepValues: true,
        keepErrors: true,
        keepDirty: false,
      });

      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    } finally {
      inFlightRef.current = false;
    }
  }, [form, getValues, onRevisionChanged, onTemplateCreated, reset, router]);

  // Uma edição nova sempre sobrepõe um rótulo "salvo" ou "erro" parado:
  // continuar mostrando "Salvo com sucesso" depois de uma tecla nova seria
  // exatamente o estado engessado que este requisito pede para remover.
  const displayState: SaveState = isDirty
    ? saveState === "saving"
      ? "saving"
      : "dirty"
    : saveState === "clean"
      ? "clean"
      : saveState;

  const getRevision = useCallback(() => revisionRef.current, []);
  const getTemplateId = useCallback(() => templateIdRef.current, []);

  return {
    saveState: displayState,
    saveMessage: SAVE_MESSAGES[displayState],
    isDirty,
    save,
    getRevision,
    getTemplateId,
  };
};
