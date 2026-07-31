"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { FormPanel } from "@/components/shared/form-panel";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import {
  type AttendanceFormValues,
  LONG_TEXT_MAX_LENGTH,
} from "../schemas/attendance-form-schema";

export const PreliminaryAnalysisPanel = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AttendanceFormValues>();

  const preliminaryAnalysis =
    useWatch({ control, name: "preliminaryAnalysis" }) ?? "";

  return (
    <FormPanel
      title="Análise preliminar do caso"
      description="Avaliação inicial realizada pelo profissional responsável pelo atendimento."
    >
      <Field data-invalid={Boolean(errors.preliminaryAnalysis)}>
        <FieldLabel htmlFor="intake-preliminary-analysis">
          Análise preliminar
        </FieldLabel>

        <Textarea
          id="intake-preliminary-analysis"
          rows={7}
          maxLength={LONG_TEXT_MAX_LENGTH}
          placeholder="Registre o enquadramento jurídico inicial, pontos que precisam de confirmação e documentos relevantes para análise."
          aria-invalid={Boolean(errors.preliminaryAnalysis)}
          {...register("preliminaryAnalysis")}
        />

        <div className="flex items-center justify-between">
          {errors.preliminaryAnalysis ? (
            <FieldError>{errors.preliminaryAnalysis.message}</FieldError>
          ) : (
            <span />
          )}

          <span className="text-xs text-muted-foreground">
            {preliminaryAnalysis.length}/{LONG_TEXT_MAX_LENGTH} caracteres
          </span>
        </div>
      </Field>
    </FormPanel>
  );
};
