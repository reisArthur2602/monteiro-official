import type {
  ProcessClientRole,
  ProcessStatus,
  ProcessType,
} from "@/app/generated/prisma/enums";

import type { CaseFormValues } from "../schemas/case-form-schema";

type CreateEmptyInput = {
  /** Código sugerido pelo servidor; o usuário pode alterar. */
  internalCode: string;
  /** Área herdada da ficha de origem, quando ela tiver uma. */
  legalArea: string;
  /** Assunto herdado da ficha de origem, quando ela tiver um. */
  title: string;
};

export const createEmptyCaseFormValues = ({
  internalCode,
  legalArea,
  title,
}: CreateEmptyInput): CaseFormValues => ({
  internalCode,
  number: "",
  title,
  legalArea,
  type: "",
  clientRole: "",
  status: "EM_ANALISE",
  court: "",
  courtUnit: "",
  jurisdiction: "",
  state: "",
  filingDate: "",
  notes: "",
});

type CaseRecord = {
  internalCode: string;
  number: string | null;
  title: string;
  legalArea: string;
  type: ProcessType;
  clientRole: ProcessClientRole;
  status: ProcessStatus;
  court: string | null;
  courtUnit: string | null;
  jurisdiction: string | null;
  state: string | null;
  /** `@db.Date` serializado em ISO pela query. */
  filingDate: string | null;
  notes: string | null;
};

/** `filingDate` volta ao formato do input `type="date"` sem virar de dia. */
const toDateInputValue = (isoDate: string | null) =>
  isoDate ? isoDate.slice(0, 10) : "";

export const mapCaseToValues = (item: CaseRecord): CaseFormValues => ({
  internalCode: item.internalCode,
  number: item.number ?? "",
  title: item.title,
  legalArea: item.legalArea,
  type: item.type,
  clientRole: item.clientRole,
  status: item.status,
  court: item.court ?? "",
  courtUnit: item.courtUnit ?? "",
  jurisdiction: item.jurisdiction ?? "",
  state: item.state ?? "",
  filingDate: toDateInputValue(item.filingDate),
  notes: item.notes ?? "",
});
