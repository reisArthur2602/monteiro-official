import type { TemplateVariableSource } from "../types/template-types";

export type TemplateVariableDefinition = {
  key: string;
  label: string;
  source: TemplateVariableSource;
  group: string;
  /** Valor usado apenas na prévia, para o documento não ficar cheio de chaves. */
  sampleValue: string;
};

export const templateVariables: TemplateVariableDefinition[] = [
  {
    key: "cliente.nome",
    label: "Nome completo",
    source: "CLIENT",
    group: "Cliente",
    sampleValue: "Mariana Ferreira de Souza",
  },
  {
    key: "cliente.documento",
    label: "CPF ou CNPJ",
    source: "CLIENT",
    group: "Cliente",
    sampleValue: "123.456.789-00",
  },
  {
    key: "cliente.endereco",
    label: "Endereço completo",
    source: "CLIENT",
    group: "Cliente",
    sampleValue: "Rua das Acácias, 128 — Pinheiros, São Paulo/SP",
  },
  {
    key: "cliente.email",
    label: "E-mail",
    source: "CLIENT",
    group: "Cliente",
    sampleValue: "mariana.souza@exemplo.com.br",
  },
  {
    key: "processo.numero",
    label: "Número do processo",
    source: "CASE",
    group: "Processo",
    sampleValue: "0001234-56.2026.8.26.0100",
  },
  {
    key: "processo.vara",
    label: "Vara",
    source: "CASE",
    group: "Processo",
    sampleValue: "3ª Vara Cível",
  },
  {
    key: "processo.comarca",
    label: "Comarca",
    source: "CASE",
    group: "Processo",
    sampleValue: "Comarca de São Paulo",
  },
  {
    key: "processo.valorCausa",
    label: "Valor da causa",
    source: "CASE",
    group: "Processo",
    sampleValue: "R$ 45.000,00",
  },
  {
    key: "escritorio.nome",
    label: "Nome do escritório",
    source: "OFFICE",
    group: "Escritório",
    sampleValue: "Monteiro Advocacia",
  },
  {
    key: "escritorio.advogado",
    label: "Advogado responsável",
    source: "OFFICE",
    group: "Escritório",
    sampleValue: "Dra. Ana Monteiro",
  },
  {
    key: "escritorio.oab",
    label: "Inscrição na OAB",
    source: "OFFICE",
    group: "Escritório",
    sampleValue: "OAB/SP 123.456",
  },
  {
    key: "documento.cidade",
    label: "Cidade de emissão",
    source: "DOCUMENT",
    group: "Documento",
    sampleValue: "São Paulo",
  },
  {
    key: "documento.dataExtenso",
    label: "Data por extenso",
    source: "DOCUMENT",
    group: "Documento",
    sampleValue: "29 de julho de 2026",
  },
];

const variablesByKey = new Map(
  templateVariables.map((variable) => [variable.key, variable]),
);

export const findTemplateVariable = (key: string) => variablesByKey.get(key);

export const templateVariableGroups = [
  ...new Set(templateVariables.map((variable) => variable.group)),
];

/** Valores demonstrativos usados pela prévia. */
export const templateVariableSampleValues: Record<string, string> =
  Object.fromEntries(
    templateVariables.map((variable) => [variable.key, variable.sampleValue]),
  );
