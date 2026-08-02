"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { CLIENTS_PATH } from "../../utils/build-clients-href";

type ClientMobileActionsProps = {
  formId: string;
  mode: "create" | "edit";
  isPending: boolean;
};

/**
 * Barra fixa no rodapé em telas estreitas, onde os botões do cabeçalho
 * ficariam fora de alcance depois de rolar os quatro painéis.
 */
export const ClientMobileActions = ({
  formId,
  mode,
  isPending,
}: ClientMobileActionsProps) => (
  <nav
    aria-label="Ações do cadastro"
    className="sticky bottom-0 z-30 -mx-4 grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] gap-2 border-t bg-card/95 px-4 py-2.5 backdrop-blur-sm sm:hidden"
  >
    <Button asChild variant="outline">
      <Link href={CLIENTS_PATH}>Cancelar</Link>
    </Button>

    <Button type="submit" form={formId} disabled={isPending}>
      {isPending ? "Salvando…" : mode === "edit" ? "Salvar" : "Salvar cliente"}
    </Button>
  </nav>
);
