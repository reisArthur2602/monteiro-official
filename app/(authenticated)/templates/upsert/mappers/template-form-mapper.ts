import { TemplateCategory } from "@/app/generated/prisma/enums";
import type {
  DocumentPageSettings,
  DocumentSignature,
} from "@/components/shared/documents/document-types";

import type {
  TemplateFormValues,
  TemplateUsedVariable,
} from "../types/template-types";

const EMPTY_DOCUMENT = {
  type: "doc",
  content: [{ type: "paragraph" }],
} satisfies Record<string, unknown>;

export const defaultPageSettings = (): DocumentPageSettings => ({
  format: "A4",
  orientation: "PORTRAIT",
  marginTop: 20,
  marginRight: 20,
  marginBottom: 20,
  marginLeft: 20,
  showInstitutionalHeader: true,
  showInstitutionalFooter: true,
  city: "",
});

export const createEmptyTemplateFormValues = (): TemplateFormValues => ({
  name: "",
  description: "",
  category: TemplateCategory.CONTRATO,
  legalArea: "",
  document: {
    contentJson: structuredClone(EMPTY_DOCUMENT),
    contentHtml: "<p></p>",
    usedVariables: [],
    signatures: [],
    page: defaultPageSettings(),
  },
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const readNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const readBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

/**
 * Os campos `Json` do Prisma chegam como `unknown`. Estas funções trazem
 * cada bloco de volta ao tipo do formulário, aplicando o valor padrão
 * sempre que o registro estiver incompleto — rascunhos antigos não podem
 * quebrar a tela.
 */
export const parsePageSettings = (value: unknown): DocumentPageSettings => {
  const defaults = defaultPageSettings();

  if (!isRecord(value)) {
    return defaults;
  }

  return {
    format: "A4",
    orientation:
      value.orientation === "LANDSCAPE" ? "LANDSCAPE" : defaults.orientation,
    marginTop: readNumber(value.marginTop, defaults.marginTop),
    marginRight: readNumber(value.marginRight, defaults.marginRight),
    marginBottom: readNumber(value.marginBottom, defaults.marginBottom),
    marginLeft: readNumber(value.marginLeft, defaults.marginLeft),
    showInstitutionalHeader: readBoolean(
      value.showInstitutionalHeader,
      defaults.showInstitutionalHeader,
    ),
    showInstitutionalFooter: readBoolean(
      value.showInstitutionalFooter,
      defaults.showInstitutionalFooter,
    ),
    city: readString(value.city),
  };
};

export const parseSignatures = (value: unknown): DocumentSignature[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((signature) => ({
    id: typeof signature.id === "string" ? signature.id : undefined,
    label: readString(signature.label),
    nameSource: signature.nameSource === "FIXED" ? "FIXED" : "VARIABLE",
    nameVariable:
      typeof signature.nameVariable === "string"
        ? signature.nameVariable
        : undefined,
    fixedName:
      typeof signature.fixedName === "string" ? signature.fixedName : undefined,
    role: typeof signature.role === "string" ? signature.role : undefined,
  }));
};

export const parseUsedVariables = (value: unknown): TemplateUsedVariable[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).flatMap((variable) => {
    const key = variable.key;

    if (typeof key !== "string") {
      return [];
    }

    const source = variable.source;

    return [
      {
        key,
        label: readString(variable.label, key),
        source:
          source === "CLIENT" ||
          source === "CASE" ||
          source === "OFFICE" ||
          source === "DOCUMENT"
            ? source
            : "DOCUMENT",
      },
    ];
  });
};

export const parseContentJson = (value: unknown): Record<string, unknown> =>
  isRecord(value) ? value : structuredClone(EMPTY_DOCUMENT);

type TemplateRecord = {
  id: string;
  name: string;
  description: string | null;
  category: TemplateCategory;
  legalArea: string | null;
  draft: {
    contentJson: unknown;
    contentHtml: string;
    variables: unknown;
    signatures: unknown;
    pageSettings: unknown;
  } | null;
};

/**
 * Converte o registro do Prisma em `TemplateFormValues`.
 *
 * O resultado é totalmente serializável: nenhuma entidade do Prisma
 * atravessa a fronteira para os Client Components.
 */
export const mapTemplateToFormValues = (
  template: TemplateRecord,
): TemplateFormValues => {
  const empty = createEmptyTemplateFormValues();

  return {
    id: template.id,
    name: template.name,
    description: template.description ?? "",
    category: template.category,
    legalArea: template.legalArea ?? "",
    document: template.draft
      ? {
          contentJson: parseContentJson(template.draft.contentJson),
          contentHtml: template.draft.contentHtml,
          usedVariables: parseUsedVariables(template.draft.variables),
          signatures: parseSignatures(template.draft.signatures),
          page: parsePageSettings(template.draft.pageSettings),
        }
      : empty.document,
  };
};
