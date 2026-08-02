"use client";

import { Controller, useFormContext } from "react-hook-form";

import { TemplateCategory } from "@/app/generated/prisma/enums";
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
import { Textarea } from "@/components/ui/textarea";

import { templateCategoryLabels } from "../../utils/template-labels";
import type { TemplateFormValues } from "../types/template-types";

export const GeneralTemplateSettings = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TemplateFormValues>();

  return (
    <FieldGroup>
      <Field data-invalid={Boolean(errors.name)}>
        <FieldLabel htmlFor="template-name">Nome do template</FieldLabel>

        <Input
          id="template-name"
          maxLength={160}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />

        {errors.name ? <FieldError>{errors.name.message}</FieldError> : null}
      </Field>

      <Field data-invalid={Boolean(errors.description)}>
        <FieldLabel htmlFor="template-description">Descrição</FieldLabel>

        <Textarea
          id="template-description"
          rows={3}
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />

        <FieldDescription>
          Aparece na listagem e ajuda a equipe a escolher o modelo certo.
        </FieldDescription>

        {errors.description ? (
          <FieldError>{errors.description.message}</FieldError>
        ) : null}
      </Field>

      <Field data-invalid={Boolean(errors.category)}>
        <FieldLabel htmlFor="template-category">Categoria</FieldLabel>

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="template-category"
                className="w-full"
                aria-invalid={Boolean(errors.category)}
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {Object.values(TemplateCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {templateCategoryLabels[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.category ? (
          <FieldError>{errors.category.message}</FieldError>
        ) : null}
      </Field>

      <Field data-invalid={Boolean(errors.legalArea)}>
        <FieldLabel htmlFor="template-legal-area">Área jurídica</FieldLabel>

        <Input
          id="template-legal-area"
          placeholder="Cível, Trabalhista, Família…"
          aria-invalid={Boolean(errors.legalArea)}
          {...register("legalArea")}
        />

        <FieldDescription>
          Usada como filtro na biblioteca. Deixe em branco para modelos gerais.
        </FieldDescription>

        {errors.legalArea ? (
          <FieldError>{errors.legalArea.message}</FieldError>
        ) : null}
      </Field>
    </FieldGroup>
  );
};
