"use client";

import { cn } from "@/lib/utils";

import type { SaveState } from "../types/template-types";

const DOT_CLASSES: Record<Exclude<SaveState, "clean">, string> = {
  dirty: "bg-chart-4",
  saving: "animate-pulse bg-chart-3",
  saved: "bg-chart-2",
  error: "bg-destructive",
};

type TemplateSaveStatusProps = {
  state: SaveState;
  message: string;
  className?: string;
};

/**
 * Nada é renderizado em `clean`: não há o que reportar antes de qualquer
 * ação real do usuário, e um rótulo permanente tipo "Sem alterações" é
 * exatamente o ruído que este indicador deixou de mostrar.
 */
export const TemplateSaveStatus = ({
  state,
  message,
  className,
}: TemplateSaveStatusProps) => {
  if (state === "clean") {
    return null;
  }

  return (
    <span
      // `polite` para o leitor de tela anunciar a gravação sem interromper
      // o que a pessoa está digitando.
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] whitespace-nowrap text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", DOT_CLASSES[state])}
      />
      {message}
    </span>
  );
};
