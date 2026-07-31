import { SquarePen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  buildIntakesHref,
  buildIntakeUpsertHref,
} from "../../utils/build-intakes-href";
import { PrintButton } from "./print-button";

type AttendanceDetailActionsPanelProps = {
  clientId: string;
  formId: string;
};

export const AttendanceDetailActionsPanel = ({
  clientId,
  formId,
}: AttendanceDetailActionsPanelProps) => (
  <section className="overflow-hidden rounded-xl border bg-card">
    <header className="flex min-h-14 items-center border-b px-4 py-3">
      <div>
        <h2 className="text-sm font-semibold">Ações</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Operações disponíveis.
        </p>
      </div>
    </header>

    <div className="grid gap-2 p-4">
      <Button asChild>
        <Link href={buildIntakeUpsertHref(clientId, formId)}>
          <SquarePen aria-hidden="true" />
          Editar ficha
        </Link>
      </Button>

      <PrintButton fullWidth />

      <Button asChild variant="outline">
        <Link href={buildIntakesHref(clientId, {})}>Voltar para fichas</Link>
      </Button>
    </div>
  </section>
);
