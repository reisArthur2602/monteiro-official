import { Scale, SquarePen } from "lucide-react";
import Link from "next/link";

import { AttendanceFormStatus } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";

import {
  buildCaseCreateHref,
  buildCaseEditHref,
} from "../../../cases/utils/build-cases-href";
import {
  buildIntakesHref,
  buildIntakeUpsertHref,
} from "../../utils/build-intakes-href";
import { PrintButton } from "./print-button";

type AttendanceDetailActionsPanelProps = {
  clientId: string;
  formId: string;
  status: AttendanceFormStatus;
  /** Presente quando esta ficha já originou um processo. */
  caseId: string | null;
};

export const AttendanceDetailActionsPanel = ({
  clientId,
  formId,
  status,
  caseId,
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
      {/*
        O processo nasce da ficha finalizada, e cada ficha origina no
        máximo um — por isso a ação vira "Abrir processo" depois de criado.
      */}
      {caseId ? (
        <Button asChild>
          <Link href={buildCaseEditHref(clientId, caseId)}>
            <Scale aria-hidden="true" />
            Abrir processo
          </Link>
        </Button>
      ) : status === AttendanceFormStatus.FINALIZADA ? (
        <Button asChild>
          <Link href={buildCaseCreateHref(clientId, formId)}>
            <Scale aria-hidden="true" />
            Gerar processo
          </Link>
        </Button>
      ) : null}

      {/* Vira secundária sempre que a ação do processo ocupa o topo. */}
      <Button
        asChild
        variant={
          caseId || status === AttendanceFormStatus.FINALIZADA
            ? "outline"
            : "default"
        }
      >
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
