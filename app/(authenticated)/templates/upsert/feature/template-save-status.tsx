"use client";

import { cn } from "@/lib/utils";

import type { AutosaveState } from "../types/template-types";

const DOT_CLASSES: Record<AutosaveState, string> = {
  idle: "bg-muted-foreground/50",
  saving: "animate-pulse bg-chart-3",
  saved: "bg-chart-2",
  error: "bg-destructive",
};

type TemplateAutosaveStatusProps = {
  state: AutosaveState;
  message: string;
  className?: string;
};

export const TemplateAutosaveStatus = ({
  state,
  message,
  className,
}: TemplateAutosaveStatusProps) => (
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
