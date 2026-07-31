"use client";

import { Controller, useFormContext } from "react-hook-form";

import { FormPanel } from "@/components/shared/form-panel";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { brazilianStates } from "../../../../upsert/data/brazilian-states";
import type { CaseFormValues } from "../schemas/case-form-schema";

export const CaseCourtPanel = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CaseFormValues>();

  return (
    <FormPanel
      title="Órgão e distribuição"
      description="Campos opcionais enquanto o processo ainda estiver em preparação."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2" data-invalid={Boolean(errors.court)}>
          <FieldLabel htmlFor="case-court">Tribunal ou órgão</FieldLabel>

          <Input
            id="case-court"
            maxLength={180}
            placeholder="Ex.: Tribunal de Justiça de São Paulo"
            aria-invalid={Boolean(errors.court)}
            {...register("court")}
          />

          {errors.court ? (
            <FieldError>{errors.court.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.courtUnit)}>
          <FieldLabel htmlFor="case-court-unit">Vara ou unidade</FieldLabel>

          <Input
            id="case-court-unit"
            maxLength={180}
            placeholder="Ex.: 3ª Vara Cível"
            aria-invalid={Boolean(errors.courtUnit)}
            {...register("courtUnit")}
          />

          {errors.courtUnit ? (
            <FieldError>{errors.courtUnit.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.jurisdiction)}>
          <FieldLabel htmlFor="case-jurisdiction">
            Comarca ou jurisdição
          </FieldLabel>

          <Input
            id="case-jurisdiction"
            maxLength={160}
            placeholder="Ex.: São Paulo"
            aria-invalid={Boolean(errors.jurisdiction)}
            {...register("jurisdiction")}
          />

          {errors.jurisdiction ? (
            <FieldError>{errors.jurisdiction.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.state)}>
          <FieldLabel htmlFor="case-state">UF</FieldLabel>

          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="case-state"
                  className="w-full"
                  aria-invalid={Boolean(errors.state)}
                >
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>

                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.value} · {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.state ? (
            <FieldError>{errors.state.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.filingDate)}>
          <FieldLabel htmlFor="case-filing-date">
            Data de distribuição
          </FieldLabel>

          <Input
            id="case-filing-date"
            type="date"
            aria-invalid={Boolean(errors.filingDate)}
            {...register("filingDate")}
          />

          {errors.filingDate ? (
            <FieldError>{errors.filingDate.message}</FieldError>
          ) : null}
        </Field>
      </div>
    </FormPanel>
  );
};
