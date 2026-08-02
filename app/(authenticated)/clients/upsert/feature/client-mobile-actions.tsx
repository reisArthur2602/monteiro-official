"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CLIENTS_PATH } from "../../utils/build-clients-href";
import { ClientDeactivateMenu } from "./client-deactivate-menu";

type ClientMobileActionsProps = {
  formId: string;
  mode: "create" | "edit";
  isPending: boolean;
  isInactive: boolean;
  onDeactivate: () => void;
};

/**
 * Barra fixa no rodapé em telas estreitas, onde os botões do cabeçalho
 * ficariam fora de alcance depois de rolar os quatro painéis. Mesmo menu de
 * "Desativar cliente" do cabeçalho — só reposicionado, nunca duplicado.
 */
export const ClientMobileActions = ({
  formId,
  mode,
  isPending,
  isInactive,
  onDeactivate,
}: ClientMobileActionsProps) => (
  <nav
    aria-label="Ações do cadastro"
    className={cn(
      "sticky bottom-0 z-30 -mx-4 grid items-center gap-2 border-t bg-card/95 px-4 py-2.5 backdrop-blur-sm sm:hidden",
      mode === "edit"
        ? "grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_auto]"
        : "grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]",
    )}
  >
    <Button asChild variant="outline">
      <Link href={CLIENTS_PATH}>Cancelar</Link>
    </Button>

    <Button type="submit" form={formId} disabled={isPending}>
      {isPending ? "Salvando…" : mode === "edit" ? "Salvar" : "Salvar cliente"}
    </Button>

    {mode === "edit" ? (
      <ClientDeactivateMenu
        isInactive={isInactive}
        isPending={isPending}
        onDeactivate={onDeactivate}
      />
    ) : null}
  </nav>
);
