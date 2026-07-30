"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { brazilianStates } from "../data/brazilian-states";
import type { ClientFormInput } from "../schemas/client-form-schema";
import { maskPostalCode, POSTAL_CODE_LENGTH } from "../utils/input-masks";
import { ClientPanel } from "./client-panel";
import { MaskedInput } from "./masked-input";

export const ClientAddressPanel = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ClientFormInput>();

  const addressErrors = errors.address;

  return (
    <ClientPanel
      title="Endereço"
      description="Endereço principal usado nos documentos e comunicações."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={Boolean(addressErrors?.postalCode)}>
          <FieldLabel htmlFor="client-postal-code">CEP</FieldLabel>

          <Controller
            control={control}
            name="address.postalCode"
            render={({ field }) => (
              <MaskedInput
                id="client-postal-code"
                placeholder="00000-000"
                aria-invalid={Boolean(addressErrors?.postalCode)}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                mask={maskPostalCode}
                maxDigits={POSTAL_CODE_LENGTH}
              />
            )}
          />

          {addressErrors?.postalCode ? (
            <FieldError>{addressErrors.postalCode.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(addressErrors?.street)}>
          <FieldLabel htmlFor="client-street">Logradouro</FieldLabel>

          <Input
            id="client-street"
            autoComplete="address-line1"
            maxLength={160}
            aria-invalid={Boolean(addressErrors?.street)}
            {...register("address.street")}
          />

          {addressErrors?.street ? (
            <FieldError>{addressErrors.street.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(addressErrors?.number)}>
          <FieldLabel htmlFor="client-number">Número</FieldLabel>

          <Input
            id="client-number"
            maxLength={30}
            aria-invalid={Boolean(addressErrors?.number)}
            {...register("address.number")}
          />

          {addressErrors?.number ? (
            <FieldError>{addressErrors.number.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(addressErrors?.complement)}>
          <FieldLabel htmlFor="client-complement">Complemento</FieldLabel>

          <Input
            id="client-complement"
            autoComplete="address-line2"
            maxLength={100}
            aria-invalid={Boolean(addressErrors?.complement)}
            {...register("address.complement")}
          />

          {addressErrors?.complement ? (
            <FieldError>{addressErrors.complement.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(addressErrors?.district)}>
          <FieldLabel htmlFor="client-district">Bairro</FieldLabel>

          <Input
            id="client-district"
            maxLength={100}
            aria-invalid={Boolean(addressErrors?.district)}
            {...register("address.district")}
          />

          {addressErrors?.district ? (
            <FieldError>{addressErrors.district.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(addressErrors?.city)}>
          <FieldLabel htmlFor="client-city">Cidade</FieldLabel>

          <Input
            id="client-city"
            maxLength={100}
            aria-invalid={Boolean(addressErrors?.city)}
            {...register("address.city")}
          />

          {addressErrors?.city ? (
            <FieldError>{addressErrors.city.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(addressErrors?.state)}>
          <FieldLabel htmlFor="client-state">Estado</FieldLabel>

          <Controller
            control={control}
            name="address.state"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="client-state"
                  className="w-full"
                  aria-invalid={Boolean(addressErrors?.state)}
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

          {addressErrors?.state ? (
            <FieldError>{addressErrors.state.message}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="client-country">País</FieldLabel>

          {/* Um país só, por enquanto: o campo existe para o dia em que
              houver cliente no exterior, mas não há o que escolher. */}
          <Input
            id="client-country"
            value="Brasil"
            readOnly
            disabled
            className="disabled:opacity-100"
          />
        </Field>
      </div>
    </ClientPanel>
  );
};
