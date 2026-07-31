"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  ProcessClientRole,
  type ProcessStatus,
  ProcessType,
} from "@/app/generated/prisma/enums";
import { FormPanel } from "@/components/shared/form-panel";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  processClientRoleLabels,
  processStatusLabels,
  processTypeLabels,
} from "../../utils/case-labels";
import type { CaseFormValues } from "../schemas/case-form-schema";

type CaseIdentificationPanelProps = {
  /** Cadastro oferece só os status iniciais; edição, todos. */
  statusOptions: ProcessStatus[];
};

export const CaseIdentificationPanel = ({
  statusOptions,
}: CaseIdentificationPanelProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CaseFormValues>();

  return (
    <FormPanel
      title="Identificação"
      description="Dados principais para reconhecer e localizar o processo."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.internalCode)}>
          <FieldLabel htmlFor="case-internal-code">Código interno *</FieldLabel>

          <Input
            id="case-internal-code"
            maxLength={40}
            aria-invalid={Boolean(errors.internalCode)}
            {...register("internalCode")}
          />

          <FieldDescription>Identificador único do escritório.</FieldDescription>

          {errors.internalCode ? (
            <FieldError>{errors.internalCode.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.number)}>
          <FieldLabel htmlFor="case-number">Número do processo</FieldLabel>

          <Input
            id="case-number"
            maxLength={40}
            placeholder="Pode ser informado após a distribuição"
            aria-invalid={Boolean(errors.number)}
            {...register("number")}
          />

          <FieldDescription>
            Número CNJ ou identificador externo.
          </FieldDescription>

          {errors.number ? (
            <FieldError>{errors.number.message}</FieldError>
          ) : null}
        </Field>

        <Field className="sm:col-span-2" data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor="case-title">Assunto principal *</FieldLabel>

          <Input
            id="case-title"
            maxLength={180}
            placeholder="Ex.: ação de cobrança por inadimplemento contratual"
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />

          {errors.title ? (
            <FieldError>{errors.title.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.legalArea)}>
          <FieldLabel htmlFor="case-legal-area">Área jurídica *</FieldLabel>

          <Input
            id="case-legal-area"
            maxLength={80}
            placeholder="Ex.: Cível, Trabalhista, Tributário"
            aria-invalid={Boolean(errors.legalArea)}
            {...register("legalArea")}
          />

          {errors.legalArea ? (
            <FieldError>{errors.legalArea.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.type)}>
          <FieldLabel htmlFor="case-type">Tipo *</FieldLabel>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="case-type"
                  className="w-full"
                  aria-invalid={Boolean(errors.type)}
                >
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(ProcessType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {processTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.type ? <FieldError>{errors.type.message}</FieldError> : null}
        </Field>

        <Field data-invalid={Boolean(errors.clientRole)}>
          <FieldLabel htmlFor="case-client-role">
            Posição do cliente *
          </FieldLabel>

          <Controller
            control={control}
            name="clientRole"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="case-client-role"
                  className="w-full"
                  aria-invalid={Boolean(errors.clientRole)}
                >
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(ProcessClientRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {processClientRoleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.clientRole ? (
            <FieldError>{errors.clientRole.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.status)}>
          <FieldLabel htmlFor="case-status">Status *</FieldLabel>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="case-status"
                  className="w-full"
                  aria-invalid={Boolean(errors.status)}
                >
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>

                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {processStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.status ? (
            <FieldError>{errors.status.message}</FieldError>
          ) : null}
        </Field>
      </div>
    </FormPanel>
  );
};
