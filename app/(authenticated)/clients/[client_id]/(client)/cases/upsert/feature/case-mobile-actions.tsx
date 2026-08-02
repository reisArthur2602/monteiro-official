"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { buildIntakeDetailHref } from "../../../intakes/utils/build-intakes-href";

type CaseMobileActionsProps = {
  clientId: string;
  formId: string;
  mode: "create" | "edit";
  isPending: boolean;
  onSubmit: () => void;
};

/**
 * Mesma ação secundária do cabeçalho (voltar para a ficha de origem) — só
 * ela existe em qualquer breakpoint, para não haver dois destinos de
 * "cancelar" concorrendo entre si.
 */
export const CaseMobileActions = ({
  clientId,
  formId,
  mode,
  isPending,
  onSubmit,
}: CaseMobileActionsProps) => (
  <nav
    aria-label="Ações do processo"
    className="sticky bottom-0 z-30 -mx-4 grid grid-cols-2 gap-2 border-t bg-card/95 px-4 py-2.5 backdrop-blur-sm sm:hidden"
  >
    <Button asChild variant="outline" size="sm">
      <Link href={buildIntakeDetailHref(clientId, formId)}>Voltar</Link>
    </Button>

    <Button type="button" size="sm" disabled={isPending} onClick={onSubmit}>
      {mode === "edit" ? "Salvar" : "Criar"}
    </Button>
  </nav>
);
