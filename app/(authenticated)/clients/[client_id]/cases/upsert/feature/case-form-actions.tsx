"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { buildIntakeDetailHref } from "../../../intakes/utils/build-intakes-href";
import { buildCasesHref } from "../../utils/build-cases-href";

type CaseFormActionsProps = {
  clientId: string;
  formId: string;
  mode: "create" | "edit";
  isPending: boolean;
  onSubmit: () => void;
};

export const CaseFormActions = ({
  clientId,
  formId,
  mode,
  isPending,
  onSubmit,
}: CaseFormActionsProps) => (
  <section className="grid gap-2 rounded-xl border bg-card p-3.5">
    <Button type="button" disabled={isPending} onClick={onSubmit}>
      {isPending
        ? "Salvando…"
        : mode === "edit"
          ? "Salvar alterações"
          : "Criar processo"}
    </Button>

    <Button asChild variant="outline">
      <Link href={buildCasesHref(clientId, {})}>Cancelar</Link>
    </Button>

    <Button asChild variant="outline">
      <Link href={buildIntakeDetailHref(clientId, formId)}>
        Revisar ficha de origem
      </Link>
    </Button>
  </section>
);
