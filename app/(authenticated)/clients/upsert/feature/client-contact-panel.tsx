"use client";

import { Controller, useFormContext } from "react-hook-form";

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

import type { AssignableUser } from "../queries/list-assignable-users";
import type { ClientFormInput } from "../schemas/client-form-schema";
import { maskPhone, PHONE_MAX_DIGITS } from "../utils/input-masks";
import { ClientPanel } from "./client-panel";
import { MaskedInput } from "./masked-input";

type ClientContactPanelProps = {
  users: AssignableUser[];
};

export const ClientContactPanel = ({ users }: ClientContactPanelProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ClientFormInput>();

  return (
    <ClientPanel
      title="Contato e responsabilidade"
      description="Dados principais para comunicação e atendimento."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="client-email">E-mail</FieldLabel>

          <Input
            id="client-email"
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />

          {errors.email ? (
            <FieldError>{errors.email.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.phone)}>
          <FieldLabel htmlFor="client-phone">Telefone</FieldLabel>

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <MaskedInput
                id="client-phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(11) 90000-0000"
                aria-invalid={Boolean(errors.phone)}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                mask={maskPhone}
                maxDigits={PHONE_MAX_DIGITS}
              />
            )}
          />

          <FieldDescription>
            Com DDD. Acima de 11 dígitos, o número é tratado como internacional.
          </FieldDescription>

          {errors.phone ? (
            <FieldError>{errors.phone.message}</FieldError>
          ) : null}
        </Field>

        <Field
          className="sm:col-span-2"
          data-invalid={Boolean(errors.responsibleId)}
        >
          <FieldLabel htmlFor="client-responsible">
            Responsável pelo cliente
          </FieldLabel>

          <Controller
            control={control}
            name="responsibleId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="client-responsible"
                  className="w-full"
                  aria-invalid={Boolean(errors.responsibleId)}
                >
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>

                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.responsibleId ? (
            <FieldError>{errors.responsibleId.message}</FieldError>
          ) : null}
        </Field>
      </div>
    </ClientPanel>
  );
};
