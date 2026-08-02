"use client";

import { ArrowLeft, MoreVertical, Save, Settings2 } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldError } from "@/components/ui/field";

import type { TemplateFormValues } from "../types/template-types";
import { TemplateAutosaveStatus } from "./template-autosave-status";
import { useTemplateUpsert } from "./template-form-provider";

type TemplateTopbarProps = {
  onOpenSettings: () => void;
  onOpenPublish: () => void;
};

export const TemplateTopbar = ({
  onOpenSettings,
  onOpenPublish,
}: TemplateTopbarProps) => {
  const { autosave, isPublishing } = useTemplateUpsert();

  const {
    register,
    formState: { errors },
  } = useFormContext<TemplateFormValues>();

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b bg-card/90 px-3 py-2 backdrop-blur-sm sm:gap-4 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="shrink-0">
        <Link href="/templates">
          <ArrowLeft aria-hidden="true" />
          <span className="hidden sm:inline">Templates</span>
        </Link>
      </Button>

      <div className="min-w-0">
        <input
          {...register("name")}
          aria-label="Nome do template"
          aria-invalid={Boolean(errors.name)}
          placeholder="Nome do template"
          className="w-full truncate border-0 bg-transparent text-center font-heading text-lg font-semibold tracking-tight outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:underline focus-visible:underline-offset-4 sm:text-2xl"
        />

        {errors.name ? (
          <FieldError className="justify-center text-center">
            {errors.name.message}
          </FieldError>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <TemplateAutosaveStatus
          state={autosave.autosaveState}
          message={autosave.autosaveMessage}
          className="hidden lg:inline-flex"
        />

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Ações do template"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => void autosave.flush()}>
              <Save />
              Salvar rascunho agora
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/templates">Voltar para a listagem</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
