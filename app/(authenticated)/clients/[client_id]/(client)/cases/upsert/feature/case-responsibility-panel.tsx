"use client";

import { useFormContext } from "react-hook-form";

import { FormPanel } from "@/components/shared/form-panel";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { NOTES_MAX_LENGTH } from "../schemas/case-form-schema";
import type { CaseFormValues } from "../schemas/case-form-schema";

type CaseResponsibilityPanelProps = {
  responsibleName: string;
  /** Ausente no cadastro: a data só existe depois de salvar. */
  createdAtLabel: string;
};

export const CaseResponsibilityPanel = ({
  responsibleName,
  createdAtLabel,
}: CaseResponsibilityPanelProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CaseFormValues>();

  return (
    <FormPanel
      title="Responsabilidade e observações"
      description="O responsável inicial é o usuário autenticado."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {/*
          Campos desabilitados e fora do formulário: são exibidos para
          contexto, mas o servidor os resolve pela sessão e pela auditoria.
        */}
        <Field>
          <FieldLabel htmlFor="case-responsible">Responsável</FieldLabel>

          <Input id="case-responsible" value={responsibleName} disabled />

          <FieldDescription>
            Preenchido a partir da sessão autenticada.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="case-created-at">Data de criação</FieldLabel>

          <Input id="case-created-at" value={createdAtLabel} disabled />

          <FieldDescription>
            Não é enviada pelo formulário.
          </FieldDescription>
        </Field>

        <Field className="sm:col-span-2" data-invalid={Boolean(errors.notes)}>
          <FieldLabel htmlFor="case-notes">Observações internas</FieldLabel>

          <Textarea
            id="case-notes"
            rows={5}
            maxLength={NOTES_MAX_LENGTH}
            placeholder="Contexto adicional, estratégia inicial ou informações para a equipe."
            aria-invalid={Boolean(errors.notes)}
            {...register("notes")}
          />

          {errors.notes ? (
            <FieldError>{errors.notes.message}</FieldError>
          ) : null}
        </Field>
      </div>
    </FormPanel>
  );
};
