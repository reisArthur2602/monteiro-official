import type {
  TemplateCategory,
  TemplateStatus,
} from "@/app/generated/prisma/enums";
import type {
  DocumentPageSettings,
  DocumentSignature,
} from "@/components/shared/documents/document-types";

export type TemplateUpsertMode = "create" | "edit";

export type TemplateView = "editor" | "preview";

export type AutosaveState = "idle" | "saving" | "saved" | "error";

export type TemplateVariableSource = "CLIENT" | "CASE" | "OFFICE" | "DOCUMENT";

export type TemplateUsedVariable = {
  key: string;
  label: string;
  source: TemplateVariableSource;
};

export type TemplateDocumentValues = {
  contentJson: Record<string, unknown>;
  contentHtml: string;
  usedVariables: TemplateUsedVariable[];
  signatures: DocumentSignature[];
  page: DocumentPageSettings;
};

export type TemplateFormValues = {
  id?: string;
  name: string;
  description: string;
  category: TemplateCategory;
  legalArea: string;
  document: TemplateDocumentValues;
};

/**
 * Dados que só o servidor conhece e que não pertencem ao formulário:
 * identidade do rascunho, revisão para controle de concorrência e
 * versão publicada. Ficam fora do React Hook Form de propósito.
 */
export type TemplateEditorMeta = {
  templateId: string;
  revision: number;
  currentVersion: number;
  status: TemplateStatus;
};

export type TemplateForEdit = {
  values: TemplateFormValues;
  meta: TemplateEditorMeta;
};
