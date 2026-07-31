"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormPanel } from "@/components/shared/form-panel";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  type ClientFormInput,
  NOTES_MAX_LENGTH,
} from "../schemas/client-form-schema";

export const ClientNotesPanel = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ClientFormInput>();

  // Observação granular só do contador de caracteres.
  const notes = useWatch({ control, name: "notes" }) ?? "";

  return (
    <FormPanel
      title="Observações internas"
      description="Informações visíveis somente para a equipe do escritório."
    >
      <Field data-invalid={Boolean(errors.notes)}>
        <FieldLabel htmlFor="client-notes">Observações</FieldLabel>

        <Textarea
          id="client-notes"
          rows={5}
          maxLength={NOTES_MAX_LENGTH}
          placeholder="Ex.: preferência de contato, contexto do atendimento ou informações importantes."
          aria-invalid={Boolean(errors.notes)}
          {...register("notes")}
        />

        <FieldDescription>
          {notes.length}/{NOTES_MAX_LENGTH} caracteres
        </FieldDescription>

        {errors.notes ? <FieldError>{errors.notes.message}</FieldError> : null}
      </Field>
    </FormPanel>
  );
};
