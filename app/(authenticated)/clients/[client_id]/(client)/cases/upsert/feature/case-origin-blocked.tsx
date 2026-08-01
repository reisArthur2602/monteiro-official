import { FileWarning } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { buildIntakeDetailHref } from "../../../intakes/utils/build-intakes-href";
import { buildCaseEditHref, buildCasesHref } from "../../utils/build-cases-href";

type CaseOriginBlockedProps = {
  clientId: string;
  formId: string;
  reason: "not-finalized" | "already-has-case";
  /** Presente quando a ficha já originou um processo. */
  existingCaseId?: string;
};

/**
 * A ficha existe e é deste cliente, mas não pode originar um processo
 * agora. Explicar o motivo é mais útil que devolver 404 — o usuário chegou
 * aqui por um caminho legítimo.
 */
export const CaseOriginBlocked = ({
  clientId,
  formId,
  reason,
  existingCaseId,
}: CaseOriginBlockedProps) => (
  <Empty className="rounded-xl border bg-card">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FileWarning />
      </EmptyMedia>

      <EmptyTitle>
        {reason === "already-has-case"
          ? "Esta ficha já possui um processo"
          : "A ficha ainda não foi finalizada"}
      </EmptyTitle>

      <EmptyDescription>
        {reason === "already-has-case"
          ? "Cada ficha pode originar somente um processo. Abra o processo existente para consultar ou editar."
          : "Só fichas finalizadas podem originar um processo. Conclua a ficha para seguir com o cadastro."}
      </EmptyDescription>
    </EmptyHeader>

    <EmptyContent>
      {reason === "already-has-case" && existingCaseId ? (
        <Button asChild>
          <Link href={buildCaseEditHref(clientId, existingCaseId)}>
            Abrir processo
          </Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href={buildIntakeDetailHref(clientId, formId)}>
            Abrir ficha
          </Link>
        </Button>
      )}

      <Button asChild variant="outline">
        <Link href={buildCasesHref(clientId, {})}>Ver processos</Link>
      </Button>
    </EmptyContent>
  </Empty>
);
