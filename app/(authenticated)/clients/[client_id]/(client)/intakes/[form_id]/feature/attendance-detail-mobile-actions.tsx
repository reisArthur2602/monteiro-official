import { SquarePen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { buildIntakeUpsertHref } from "../../utils/build-intakes-href";
import { AttendanceEmailDialog } from "./attendance-email-dialog";
import { PrintButton } from "./print-button";

type AttendanceDetailMobileActionsProps = {
  clientId: string;
  formId: string;
  canSendEmail: boolean;
  subject: string;
  clientName: string;
  clientEmail: string | null;
};

export const AttendanceDetailMobileActions = ({
  clientId,
  formId,
  canSendEmail,
  subject,
  clientName,
  clientEmail,
}: AttendanceDetailMobileActionsProps) => (
  <nav
    aria-label="Ações da ficha"
    className={cn(
      "sticky bottom-0 z-30 -mx-4 grid gap-2 border-t bg-card/95 px-4 py-2.5 backdrop-blur-sm sm:hidden",
      canSendEmail ? "grid-cols-3" : "grid-cols-2",
    )}
  >
    <PrintButton fullWidth />

    <Button asChild>
      <Link href={buildIntakeUpsertHref(clientId, formId)}>
        <SquarePen aria-hidden="true" />
        Editar
      </Link>
    </Button>

    {canSendEmail ? (
      <AttendanceEmailDialog
        clientId={clientId}
        formId={formId}
        subject={subject}
        clientName={clientName}
        clientEmail={clientEmail}
        triggerClassName="w-full"
      />
    ) : null}
  </nav>
);
