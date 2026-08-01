"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { buildIntakesHref } from "../../utils/build-intakes-href";

type AttendanceMobileActionsProps = {
  clientId: string;
  isPending: boolean;
  onSaveDraft: () => void;
  onFinalize: () => void;
};

export const AttendanceMobileActions = ({
  clientId,
  isPending,
  onSaveDraft,
  onFinalize,
}: AttendanceMobileActionsProps) => (
  <nav
    aria-label="Ações da ficha"
    className="sticky bottom-0 z-30 -mx-4 grid grid-cols-3 gap-2 border-t bg-card/95 px-4 py-2.5 backdrop-blur-sm sm:hidden"
  >
    <Button asChild variant="outline" size="sm">
      <Link href={buildIntakesHref(clientId, {})}>Cancelar</Link>
    </Button>

    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={onSaveDraft}
    >
      Salvar
    </Button>

    <Button type="button" size="sm" disabled={isPending} onClick={onFinalize}>
      Finalizar
    </Button>
  </nav>
);
