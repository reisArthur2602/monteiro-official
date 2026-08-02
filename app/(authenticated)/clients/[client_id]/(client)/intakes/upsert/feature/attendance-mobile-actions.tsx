"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { buildIntakesHref } from "../../utils/build-intakes-href";
import { AttendanceDeleteMenu } from "./attendance-delete-menu";

type AttendanceMobileActionsProps = {
  clientId: string;
  mode: "create" | "edit";
  isPending: boolean;
  onSaveDraft: () => void;
  onFinalize: () => void;
  onDelete: () => void;
};

/**
 * Mesmo menu de "Excluir ficha" do cabeçalho — só reposicionado, nunca
 * duplicado.
 */
export const AttendanceMobileActions = ({
  clientId,
  mode,
  isPending,
  onSaveDraft,
  onFinalize,
  onDelete,
}: AttendanceMobileActionsProps) => (
  <nav
    aria-label="Ações da ficha"
    className={cn(
      "sticky bottom-0 z-30 -mx-4 grid items-center gap-2 border-t bg-card/95 px-4 py-2.5 backdrop-blur-sm sm:hidden",
      mode === "edit" ? "grid-cols-[1fr_1fr_1fr_auto]" : "grid-cols-3",
    )}
  >
    <Button asChild variant="outline" size="sm">
      <Link href={buildIntakesHref(clientId, {})}>Cancelar</Link>
    </Button>

    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={onSaveDraft}
    >
      Salvar
    </Button>

    <Button type="button" size="sm" disabled={isPending} onClick={onFinalize}>
      Finalizar
    </Button>

    {mode === "edit" ? (
      <AttendanceDeleteMenu isPending={isPending} onDelete={onDelete} />
    ) : null}
  </nav>
);
