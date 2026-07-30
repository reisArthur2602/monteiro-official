"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
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
import { Switch } from "@/components/ui/switch";

import type { TemplateFormValues } from "../types/template-types";

const MARGIN_FIELDS = [
  { name: "document.page.marginTop", label: "Superior" },
  { name: "document.page.marginRight", label: "Direita" },
  { name: "document.page.marginBottom", label: "Inferior" },
  { name: "document.page.marginLeft", label: "Esquerda" },
] as const;

export const DocumentPageSettings = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TemplateFormValues>();

  const pageErrors = errors.document?.page;

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="page-orientation">Orientação</FieldLabel>

        <Controller
          control={control}
          name="document.page.orientation"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="page-orientation" className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PORTRAIT">Retrato</SelectItem>
                <SelectItem value="LANDSCAPE">Paisagem</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <fieldset className="grid gap-3">
        <legend className="mb-1 font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Margens (mm)
        </legend>

        <div className="grid grid-cols-2 gap-3">
          {MARGIN_FIELDS.map((margin) => {
            const error =
              pageErrors?.[
                margin.name.split(".").at(-1) as
                  | "marginTop"
                  | "marginRight"
                  | "marginBottom"
                  | "marginLeft"
              ];

            return (
              <Field key={margin.name} data-invalid={Boolean(error)}>
                <FieldLabel htmlFor={margin.name}>{margin.label}</FieldLabel>

                <Input
                  id={margin.name}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={80}
                  aria-invalid={Boolean(error)}
                  {...register(margin.name, { valueAsNumber: true })}
                />

                {error ? <FieldError>{error.message}</FieldError> : null}
              </Field>
            );
          })}
        </div>
      </fieldset>

      <Field data-invalid={Boolean(pageErrors?.city)}>
        <FieldLabel htmlFor="document-city">Cidade padrão</FieldLabel>

        <Input
          id="document-city"
          placeholder="São Paulo"
          aria-invalid={Boolean(pageErrors?.city)}
          {...register("document.page.city")}
        />

        <FieldDescription>
          Usada no rodapé institucional e na variável de cidade de emissão.
        </FieldDescription>

        {pageErrors?.city ? (
          <FieldError>{pageErrors.city.message}</FieldError>
        ) : null}
      </Field>

      <Field orientation="horizontal">
        <FieldLabel htmlFor="show-header" className="font-normal">
          Exibir cabeçalho institucional
        </FieldLabel>

        <Controller
          control={control}
          name="document.page.showInstitutionalHeader"
          render={({ field }) => (
            <Switch
              id="show-header"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field orientation="horizontal">
        <FieldLabel htmlFor="show-footer" className="font-normal">
          Exibir rodapé institucional
        </FieldLabel>

        <Controller
          control={control}
          name="document.page.showInstitutionalFooter"
          render={({ field }) => (
            <Switch
              id="show-footer"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </Field>

      <FieldDescription>
        Os dados do escritório (nome, OAB, endereço e contato) vêm do perfil
        institucional e não são editados aqui.
      </FieldDescription>
    </FieldGroup>
  );
};
