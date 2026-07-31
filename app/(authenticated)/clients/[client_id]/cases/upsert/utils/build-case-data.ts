import type { CaseFormParsed } from "../schemas/case-form-schema";

/**
 * Campos escalares gravados no processo. Fora daqui ficam de propósito
 * `clientId`, `attendanceFormId`, `responsibleId` e a auditoria: nenhum
 * deles pode vir do formulário.
 */
export const buildCaseScalarData = (values: CaseFormParsed) => ({
  internalCode: values.internalCode,
  number: values.number ?? null,
  title: values.title,
  legalArea: values.legalArea,
  type: values.type,
  clientRole: values.clientRole,
  status: values.status,
  court: values.court ?? null,
  courtUnit: values.courtUnit ?? null,
  jurisdiction: values.jurisdiction ?? null,
  state: values.state ?? null,
  // Coluna `@db.Date`: fixar meia-noite UTC evita que o fuso do servidor
  // empurre a data um dia para trás.
  filingDate: values.filingDate
    ? new Date(`${values.filingDate}T00:00:00Z`)
    : null,
  notes: values.notes ?? null,
});
