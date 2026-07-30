"use client";

import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";

import type { TemplateFormValues } from "../types/template-types";
import { TemplateSignatureItem } from "./template-signature-item";

export const TemplateSignatures = () => {
  const { control } = useFormContext<TemplateFormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "document.signatures",
  });

  return (
    <div className="grid gap-3">
      {fields.length === 0 ? (
        <FieldDescription>
          Nenhuma assinatura configurada. O documento será gerado sem bloco de
          assinaturas.
        </FieldDescription>
      ) : (
        fields.map((field, index) => (
          <TemplateSignatureItem
            key={field.id}
            index={index}
            isFirst={index === 0}
            isLast={index === fields.length - 1}
            onRemove={() => remove(index)}
            onMoveUp={() => move(index, index - 1)}
            onMoveDown={() => move(index, index + 1)}
          />
        ))
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            label: "",
            nameSource: "VARIABLE",
            nameVariable: undefined,
            fixedName: undefined,
            role: undefined,
          })
        }
      >
        <Plus aria-hidden="true" />
        Adicionar assinatura
      </Button>
    </div>
  );
};
