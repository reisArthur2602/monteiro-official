"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { createTemplateDraft } from "../actions/create-template-draft";
import { updateTemplateDraft } from "../actions/update-template-draft";
import type {
  AutosaveState,
  TemplateFormValues,
} from "../types/template-types";

const AUTOSAVE_DEBOUNCE_MS = 1000;

type UseTemplateAutosaveOptions = {
  form: UseFormReturn<TemplateFormValues>;
  templateId: string | null;
  revision: number;
  onTemplateCreated: (templateId: string, revision: number) => void;
  onRevisionChanged: (revision: number) => void;
};

export type UseTemplateAutosaveResult = {
  autosaveState: AutosaveState;
  autosaveMessage: string;
  /** Grava imediatamente o que estiver pendente. Usado antes de publicar. */
  flush: () => Promise<boolean>;
  /** Suspende o autosave enquanto a publicação está em curso. */
  setPaused: (paused: boolean) => void;
};

const AUTOSAVE_MESSAGES: Record<AutosaveState, string> = {
  idle: "Sem alterações",
  saving: "Salvando",
  saved: "Salvo agora",
  error: "Não foi possível salvar",
};

export const useTemplateAutosave = ({
  form,
  templateId,
  revision,
  onTemplateCreated,
  onRevisionChanged,
}: UseTemplateAutosaveOptions): UseTemplateAutosaveResult => {
  const router = useRouter();
  const { getValues, subscribe, formState, reset } = form;

  const [autosaveState, setAutosaveState] = useState<AutosaveState>("idle");

  // Refs em vez de estado: o agendamento não deve provocar re-render, e o
  // callback precisa enxergar sempre o valor mais recente.
  const templateIdRef = useRef(templateId);
  const revisionRef = useRef(revision);
  const pausedRef = useRef(false);
  const inFlightRef = useRef(false);
  const dirtyRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  templateIdRef.current = templateId;
  revisionRef.current = revision;
  dirtyRef.current = formState.isDirty;

  const persist = useCallback(async (): Promise<boolean> => {
    // Uma gravação por vez impede que o primeiro autosave do modo de
    // criação seja disparado duas vezes e gere dois templates.
    if (inFlightRef.current || pausedRef.current) {
      return false;
    }

    if (!dirtyRef.current) {
      return true;
    }

    inFlightRef.current = true;
    setAutosaveState("saving");

    try {
      const values = getValues();
      const currentTemplateId = templateIdRef.current;

      if (!currentTemplateId) {
        const result = await createTemplateDraft({ values });

        if (!result.ok || !result.data) {
          setAutosaveState("error");
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
          setAutosaveState("error");
          return false;
        }

        revisionRef.current = result.data.revision;
        onRevisionChanged(result.data.revision);
      }

      // Mantém os valores em tela e zera o `isDirty`, para o próximo
      // autosave só disparar se houver alteração nova.
      reset(getValues(), {
        keepValues: true,
        keepErrors: true,
        keepDirty: false,
      });
      dirtyRef.current = false;

      setAutosaveState("saved");
      return true;
    } catch {
      setAutosaveState("error");
      return false;
    } finally {
      inFlightRef.current = false;
    }
  }, [getValues, onRevisionChanged, onTemplateCreated, reset, router]);

  const schedule = useCallback(() => {
    if (pausedRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      void persist();
    }, AUTOSAVE_DEBOUNCE_MS);
  }, [persist]);

  useEffect(() => {
    // `subscribe` observa os valores sem re-renderizar quem chama o hook.
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: () => schedule(),
    });

    return () => {
      unsubscribe();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [subscribe, schedule]);

  const flush = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return persist();
  }, [persist]);

  const setPaused = useCallback((paused: boolean) => {
    pausedRef.current = paused;

    if (paused && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    autosaveState,
    autosaveMessage: AUTOSAVE_MESSAGES[autosaveState],
    flush,
    setPaused,
  };
};
