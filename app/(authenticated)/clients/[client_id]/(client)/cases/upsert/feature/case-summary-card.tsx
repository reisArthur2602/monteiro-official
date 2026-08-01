"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  processStatusBadgeClasses,
  processStatusLabels,
} from "../../utils/case-labels";
import type { CaseFormValues } from "../schemas/case-form-schema";

type SummaryRowProps = {
  label: string;
  children: React.ReactNode;
};

const SummaryRow = ({ label, children }: SummaryRowProps) => (
  <div className="flex items-start justify-between gap-3 border-t pt-2.5">
    <span className="shrink-0 text-xs text-muted-foreground">{label}</span>

    <span className="max-w-[62%] truncate text-right text-xs font-semibold">
      {children}
    </span>
  </div>
);

const NotProvided = () => (
  <span className="font-normal text-muted-foreground">Não informado</span>
);

type CaseSummaryCardProps = {
  clientName: string;
  originLabel: string;
  responsibleName: string;
};

export const CaseSummaryCard = ({
  clientName,
  originLabel,
  responsibleName,
}: CaseSummaryCardProps) => {
  const { control } = useFormContext<CaseFormValues>();

  const [internalCode, title, status] = useWatch({
    control,
    name: ["internalCode", "title", "status"],
  });

  return (
    <section className="grid gap-3.5 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-sm font-bold">Resumo do cadastro</strong>

        {status ? (
          <span
            className={cn(
              "inline-flex h-6 items-center gap-1.5 rounded-full border px-2 text-[10px] font-bold",
              processStatusBadgeClasses[status],
            )}
          >
            {processStatusLabels[status]}
          </span>
        ) : null}
      </div>

      <div className="grid gap-2.5">
        <SummaryRow label="Cliente">{clientName}</SummaryRow>
        <SummaryRow label="Ficha">{originLabel}</SummaryRow>
        <SummaryRow label="Responsável">{responsibleName}</SummaryRow>

        <SummaryRow label="Código">
          {internalCode.trim() || <NotProvided />}
        </SummaryRow>

        <SummaryRow label="Assunto">
          {title.trim() || <NotProvided />}
        </SummaryRow>
      </div>
    </section>
  );
};
