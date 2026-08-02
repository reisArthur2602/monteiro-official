"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { ClientStatus, ClientType } from "@/app/generated/prisma/enums";
import { FormPanel } from "@/components/shared/form-panel";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  clientStatusLabels,
  clientTypeLabels,
} from "../../utils/client-labels";
import type { ClientFormInput } from "../schemas/client-form-schema";
import { documentMaxDigits, maskDocument } from "../utils/input-masks";
import { MaskedInput } from "./masked-input";

export const ClientIdentificationPanel = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ClientFormInput>();

  // O tipo comanda rótulos, máscara e quais campos existem, então é a
  // única observação necessária neste painel.
  const type = useWatch({ control, name: "type" }) ?? ClientType.PESSOA_FISICA;
  const isNaturalPerson = type === ClientType.PESSOA_FISICA;

  return (
    <FormPanel
      title="Identificação"
      description="Tipo, nome e documento principal do cliente."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="client-type-PESSOA_FISICA">
            Tipo de cliente
          </FieldLabel>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 gap-1.5 rounded-lg border bg-muted p-1.5 xs:grid-cols-2 sm:grid-cols-2"
              >
                {Object.values(ClientType).map((option) => (
                  <FieldLabel
                    key={option}
                    htmlFor={`client-type-${option}`}
                    // O rádio fica escondido, mas continua sendo o
                    // controle real: foco, teclado e leitor de tela
                    // seguem funcionando como um grupo de rádio.
                    className={cn(
                      "flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-semibold text-muted-foreground transition-colors",
                      "has-data-[state=checked]:bg-card has-data-[state=checked]:text-foreground has-data-[state=checked]:shadow-xs",
                      "has-focus-visible:ring-2 has-focus-visible:ring-ring",
                    )}
                  >
                    <RadioGroupItem
                      id={`client-type-${option}`}
                      value={option}
                      className="sr-only"
                    />
                    {clientTypeLabels[option]}
                  </FieldLabel>
                ))}
              </RadioGroup>
            )}
          />
        </Field>

        <Field className="sm:col-span-2" data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="client-name">
            {isNaturalPerson ? "Nome completo" : "Razão social"}
          </FieldLabel>

          <Input
            id="client-name"
            autoComplete="name"
            maxLength={160}
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />

          {errors.name ? <FieldError>{errors.name.message}</FieldError> : null}
        </Field>

        <Field data-invalid={Boolean(errors.displayName)}>
          <FieldLabel htmlFor="client-display-name">
            {isNaturalPerson ? "Nome social" : "Nome fantasia"}
          </FieldLabel>

          <Input
            id="client-display-name"
            maxLength={160}
            aria-invalid={Boolean(errors.displayName)}
            {...register("displayName")}
          />

          <FieldDescription>
            {isNaturalPerson
              ? "Opcional. Nome pelo qual a pessoa é chamada."
              : "Nome comercial pelo qual a empresa é conhecida."}
          </FieldDescription>

          {errors.displayName ? (
            <FieldError>{errors.displayName.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.document)}>
          <FieldLabel htmlFor="client-document">
            {isNaturalPerson ? "CPF" : "CNPJ"}
          </FieldLabel>

          <Controller
            control={control}
            name="document"
            render={({ field }) => (
              <MaskedInput
                id="client-document"
                placeholder={
                  isNaturalPerson ? "000.000.000-00" : "00.000.000/0000-00"
                }
                aria-invalid={Boolean(errors.document)}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                mask={(digits) => maskDocument(digits, type)}
                maxDigits={documentMaxDigits(type)}
              />
            )}
          />

          {errors.document ? (
            <FieldError>{errors.document.message}</FieldError>
          ) : null}
        </Field>

        {isNaturalPerson ? (
          <>
            <Field data-invalid={Boolean(errors.birthDate)}>
              <FieldLabel htmlFor="client-birth-date">
                Data de nascimento
              </FieldLabel>

              <Input
                id="client-birth-date"
                type="date"
                aria-invalid={Boolean(errors.birthDate)}
                {...register("birthDate")}
              />

              {errors.birthDate ? (
                <FieldError>{errors.birthDate.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.rgNumber)}>
              <FieldLabel htmlFor="client-rg-number">RG</FieldLabel>

              <Input
                id="client-rg-number"
                maxLength={20}
                aria-invalid={Boolean(errors.rgNumber)}
                {...register("rgNumber")}
              />

              {errors.rgNumber ? (
                <FieldError>{errors.rgNumber.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.nationality)}>
              <FieldLabel htmlFor="client-nationality">
                Nacionalidade
              </FieldLabel>

              <Input
                id="client-nationality"
                placeholder="Brasileira"
                maxLength={60}
                aria-invalid={Boolean(errors.nationality)}
                {...register("nationality")}
              />

              {errors.nationality ? (
                <FieldError>{errors.nationality.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.profession)}>
              <FieldLabel htmlFor="client-profession">Profissão</FieldLabel>

              <Input
                id="client-profession"
                maxLength={120}
                aria-invalid={Boolean(errors.profession)}
                {...register("profession")}
              />

              {errors.profession ? (
                <FieldError>{errors.profession.message}</FieldError>
              ) : null}
            </Field>
          </>
        ) : (
          <>
            <Field data-invalid={Boolean(errors.stateRegistration)}>
              <FieldLabel htmlFor="client-state-registration">
                Inscrição estadual
              </FieldLabel>

              <Input
                id="client-state-registration"
                maxLength={30}
                aria-invalid={Boolean(errors.stateRegistration)}
                {...register("stateRegistration")}
              />

              {errors.stateRegistration ? (
                <FieldError>{errors.stateRegistration.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.municipalRegistration)}>
              <FieldLabel htmlFor="client-municipal-registration">
                Inscrição municipal
              </FieldLabel>

              <Input
                id="client-municipal-registration"
                maxLength={30}
                aria-invalid={Boolean(errors.municipalRegistration)}
                {...register("municipalRegistration")}
              />

              {errors.municipalRegistration ? (
                <FieldError>{errors.municipalRegistration.message}</FieldError>
              ) : null}
            </Field>
          </>
        )}

        <Field>
          <FieldLabel htmlFor="client-status">Status</FieldLabel>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="client-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(ClientStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {clientStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
    </FormPanel>
  );
};
