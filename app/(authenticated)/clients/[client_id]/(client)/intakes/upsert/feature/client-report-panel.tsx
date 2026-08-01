"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { FormPanel } from "@/components/shared/form-panel";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import {
  type AttendanceFormValues,
  LONG_TEXT_MAX_LENGTH,
} from "../schemas/attendance-form-schema";

export const ClientReportPanel = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AttendanceFormValues>();

  const clientReport = useWatch({ control, name: "clientReport" }) ?? "";

  return (
    <FormPanel
      title="Relato do cliente"
      description="Fatos, contexto, pessoas envolvidas e documentos mencionados."
    >
      <Field data-invalid={Boolean(errors.clientReport)}>
        <FieldLabel htmlFor="intake-client-report">
          Relato apresentado
        </FieldLabel>

        <Textarea
          id="intake-client-report"
          rows={7}
          maxLength={LONG_TEXT_MAX_LENGTH}
          placeholder="Registre fielmente os fatos relatados pelo cliente."
          aria-invalid={Boolean(errors.clientReport)}
          {...register("clientReport")}
        />

        <div className="flex items-center justify-between">
          {errors.clientReport ? (
            <FieldError>{errors.clientReport.message}</FieldError>
          ) : (
            <span />
          )}

          <span className="text-xs text-muted-foreground">
            {clientReport.length}/{LONG_TEXT_MAX_LENGTH} caracteres
          </span>
        </div>
      </Field>
    </FormPanel>
  );
};
