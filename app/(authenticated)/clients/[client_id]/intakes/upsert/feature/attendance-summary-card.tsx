"use client";

import { useFormContext, useWatch } from "react-hook-form";

import type { AttendanceFormStatus } from "@/app/generated/prisma/enums";
import { cn } from "@/lib/utils";

import {
  attendanceChannelLabels,
  attendanceFormStatusBadgeClasses,
  attendanceFormStatusLabels,
} from "../../../utils/attendance-form-labels";
import { attendanceActionLabels } from "../data/attendance-action-catalog";
import type { AttendanceFormValues } from "../schemas/attendance-form-schema";

const REQUIRED_SLOTS = 6;

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

type AttendanceSummaryCardProps = {
  clientName: string;
  responsibleName: string;
  status: AttendanceFormStatus;
};

export const AttendanceSummaryCard = ({
  clientName,
  responsibleName,
  status,
}: AttendanceSummaryCardProps) => {
  const { control } = useFormContext<AttendanceFormValues>();

  const [
    channel,
    legalArea,
    subject,
    clientReport,
    preliminaryAnalysis,
    actions,
  ] = useWatch({
    control,
    name: [
      "channel",
      "legalArea",
      "subject",
      "clientReport",
      "preliminaryAnalysis",
      "actions",
    ],
  });

  const completedFields = [
    channel,
    legalArea,
    subject.trim(),
    clientReport.trim(),
    preliminaryAnalysis.trim(),
  ].filter(Boolean).length;

  const completion = Math.round(
    ((completedFields + (actions.length > 0 ? 1 : 0)) / REQUIRED_SLOTS) * 100,
  );

  return (
    <section className="grid gap-3.5 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-sm font-bold">Resumo da ficha</strong>

        <span
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-full border px-2 text-[10px] font-bold",
            attendanceFormStatusBadgeClasses[status],
          )}
        >
          {attendanceFormStatusLabels[status]}
        </span>
      </div>

      <div className="grid gap-1.5">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Preenchimento</span>
          <strong>{completion}%</strong>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="grid gap-2.5">
        <SummaryRow label="Cliente">{clientName}</SummaryRow>
        <SummaryRow label="Responsável">{responsibleName}</SummaryRow>

        <SummaryRow label="Canal">
          {channel ? (
            attendanceChannelLabels[channel]
          ) : (
            <span className="font-normal text-muted-foreground">
              Não informado
            </span>
          )}
        </SummaryRow>

        <SummaryRow label="Área jurídica">
          {legalArea || (
            <span className="font-normal text-muted-foreground">
              Não informada
            </span>
          )}
        </SummaryRow>

        <SummaryRow label="Assunto">
          {subject || (
            <span className="font-normal text-muted-foreground">
              Não informado
            </span>
          )}
        </SummaryRow>

        <SummaryRow label="Ações selecionadas">{actions.length}</SummaryRow>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold">Encaminhamentos</p>

        {actions.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nenhuma ação selecionada.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {actions.map((action) => (
              <span
                key={action}
                className="inline-flex h-6 items-center rounded-full border bg-muted px-2 text-[10px] text-muted-foreground"
              >
                {attendanceActionLabels[action]}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
