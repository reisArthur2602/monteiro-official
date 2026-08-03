import { CircleAlert, Info } from "lucide-react";
import Link from "next/link";

import { buildClientUpsertHref } from "@/app/(authenticated)/clients/utils/build-clients-href";
import type { TemplateUsedVariable } from "@/app/(authenticated)/templates/upsert/types/template-types";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type ClientTemplateReadinessAlertProps = {
  clientId: string;
  missingVariables: TemplateUsedVariable[];
  requiresCase: boolean;
};

/**
 * Só aparece quando há algo a comunicar: dado de cliente faltando, ou uso de
 * variável de processo que esta tela não resolve. Sem lacuna nenhuma, o
 * documento é gerado silenciosamente — o alerta não vira uma segunda barra
 * de status permanente.
 */
export const ClientTemplateReadinessAlert = ({
  clientId,
  missingVariables,
  requiresCase,
}: ClientTemplateReadinessAlertProps) => {
  if (missingVariables.length === 0 && !requiresCase) {
    return null;
  }

  return (
    <div className="grid gap-3">
      {missingVariables.length > 0 ? (
        <Alert>
          <CircleAlert aria-hidden="true" />

          <AlertTitle>
            {missingVariables.length === 1
              ? "1 dado do cliente não está preenchido"
              : `${missingVariables.length} dados do cliente não estão preenchidos`}
          </AlertTitle>

          <AlertDescription>
            {missingVariables.map((variable) => variable.label).join(", ")} —
            esses campos aparecem como texto entre chaves no documento abaixo,
            até serem preenchidos no cadastro do cliente.
          </AlertDescription>

          <AlertAction>
            <Button asChild size="sm" variant="outline">
              <Link href={buildClientUpsertHref(clientId)}>
                Editar cadastro
              </Link>
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      {requiresCase ? (
        <Alert>
          <Info aria-hidden="true" />

          <AlertTitle>Este modelo também usa dados de processo</AlertTitle>

          <AlertDescription>
            Esta tela não tem um processo vinculado para resolver — esses campos
            também aparecem como texto entre chaves no documento.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};
