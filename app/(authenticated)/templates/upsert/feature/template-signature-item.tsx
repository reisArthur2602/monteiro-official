"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
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

import { templateVariables } from "../data/template-variables";
import type { TemplateFormValues } from "../types/template-types";

type TemplateSignatureItemProps = {
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export const TemplateSignatureItem = ({
  index,
  isFirst,
  isLast,
  onRemove,
  onMoveUp,
  onMoveDown,
}: TemplateSignatureItemProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TemplateFormValues>();

  // Única observação do item: a origem do nome decide qual campo aparece.
  const nameSource = useWatch({
    control,
    name: `document.signatures.${index}.nameSource`,
  });

  const signatureErrors = errors.document?.signatures?.[index];

  return (
    <article className="grid gap-3 rounded-lg border bg-muted p-3">
      <header className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          Assinatura {index + 1}
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Mover assinatura ${index + 1} para cima`}
            disabled={isFirst}
            onClick={onMoveUp}
          >
            <ChevronUp />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Mover assinatura ${index + 1} para baixo`}
            disabled={isLast}
            onClick={onMoveDown}
          >
            <ChevronDown />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remover assinatura ${index + 1}`}
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        </div>
      </header>

      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(signatureErrors?.label)}>
          <FieldLabel htmlFor={`signature-label-${index}`}>
            Identificação
          </FieldLabel>

          <Input
            id={`signature-label-${index}`}
            placeholder="Contratante"
            aria-invalid={Boolean(signatureErrors?.label)}
            {...register(`document.signatures.${index}.label`)}
          />

          {signatureErrors?.label ? (
            <FieldError>{signatureErrors.label.message}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor={`signature-source-${index}`}>
            Origem do nome
          </FieldLabel>

          <Controller
            control={control}
            name={`document.signatures.${index}.nameSource`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={`signature-source-${index}`}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="VARIABLE">
                    Variável do documento
                  </SelectItem>
                  <SelectItem value="FIXED">Nome fixo</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {nameSource === "VARIABLE" ? (
          <Field data-invalid={Boolean(signatureErrors?.nameVariable)}>
            <FieldLabel htmlFor={`signature-variable-${index}`}>
              Variável do nome
            </FieldLabel>

            <Controller
              control={control}
              name={`document.signatures.${index}.nameVariable`}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={`signature-variable-${index}`}
                    className="w-full"
                    aria-invalid={Boolean(signatureErrors?.nameVariable)}
                  >
                    <SelectValue placeholder="Selecione uma variável" />
                  </SelectTrigger>

                  <SelectContent>
                    {templateVariables.map((variable) => (
                      <SelectItem key={variable.key} value={variable.key}>
                        {variable.group} · {variable.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {signatureErrors?.nameVariable ? (
              <FieldError>{signatureErrors.nameVariable.message}</FieldError>
            ) : null}
          </Field>
        ) : (
          <Field data-invalid={Boolean(signatureErrors?.fixedName)}>
            <FieldLabel htmlFor={`signature-fixed-${index}`}>
              Nome impresso
            </FieldLabel>

            <Input
              id={`signature-fixed-${index}`}
              placeholder="Dra. Ana Monteiro"
              aria-invalid={Boolean(signatureErrors?.fixedName)}
              {...register(`document.signatures.${index}.fixedName`)}
            />

            {signatureErrors?.fixedName ? (
              <FieldError>{signatureErrors.fixedName.message}</FieldError>
            ) : null}
          </Field>
        )}

        <Field data-invalid={Boolean(signatureErrors?.role)}>
          <FieldLabel htmlFor={`signature-role-${index}`}>
            Complemento
          </FieldLabel>

          <Input
            id={`signature-role-${index}`}
            placeholder="OAB/SP 123.456"
            aria-invalid={Boolean(signatureErrors?.role)}
            {...register(`document.signatures.${index}.role`)}
          />

          {signatureErrors?.role ? (
            <FieldError>{signatureErrors.role.message}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>
    </article>
  );
};
