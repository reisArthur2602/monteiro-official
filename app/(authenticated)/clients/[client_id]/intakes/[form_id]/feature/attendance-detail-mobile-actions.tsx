import { SquarePen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { buildIntakeUpsertHref } from "../../utils/build-intakes-href";
import { PrintButton } from "./print-button";

type AttendanceDetailMobileActionsProps = {
  clientId: string;
  formId: string;
};

export const AttendanceDetailMobileActions = ({
  clientId,
  formId,
}: AttendanceDetailMobileActionsProps) => (
  <nav
    aria-label="Ações da ficha"
    className="sticky bottom-0 z-30 -mx-4 grid grid-cols-2 gap-2 border-t bg-card/95 px-4 py-2.5 backdrop-blur-sm sm:hidden"
  >
    <PrintButton fullWidth />

    <Button asChild>
      <Link href={buildIntakeUpsertHref(clientId, formId)}>
        <SquarePen aria-hidden="true" />
        Editar
      </Link>
    </Button>
  </nav>
);
