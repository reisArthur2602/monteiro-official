import { formatDocument } from "@/app/(authenticated)/clients/utils/format-document";
import { findTemplateVariable } from "@/app/(authenticated)/templates/upsert/data/template-variables";
import type {
  TemplateUsedVariable,
  TemplateVariableSource,
} from "@/app/(authenticated)/templates/upsert/types/template-types";
import { ClientType } from "@/app/generated/prisma/enums";
import type { OfficeProfile } from "@/components/shared/documents/document-types";

import type { ClientContext } from "../../queries/get-client-context";
import { formatAddressLines } from "../../utils/format-address";

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Só resolve variáveis de cliente e de escritório com dados reais — é o
 * único lugar do sistema que faz isso hoje. A prévia do editor de templates
 * usa valores de demonstração de propósito (`templateVariableSampleValues`):
 * ela existe para desenhar o documento, não para gerá-lo para alguém.
 */
const resolveClientValue = (
  key: string,
  client: ClientContext,
): string | null => {
  switch (key) {
    case "cliente.nome":
      return client.displayName || client.name;

    case "cliente.documento":
      return formatDocument(client.document);

    case "cliente.endereco": {
      const lines = formatAddressLines(client.address);

      return lines.length > 0 ? lines.join(" — ") : null;
    }

    case "cliente.email":
      return client.email || null;

    // Campos que só existem para pessoa física — para pessoa jurídica não é
    // "dado faltando", é um dado que não se aplica a este cliente.
    case "cliente.profissao":
      return client.type === ClientType.PESSOA_FISICA
        ? client.profession || null
        : null;

    case "cliente.nacionalidade":
      return client.type === ClientType.PESSOA_FISICA
        ? client.nationality || null
        : null;

    case "cliente.rg":
      return client.type === ClientType.PESSOA_FISICA
        ? client.rgNumber || null
        : null;

    default:
      return null;
  }
};

const resolveOfficeValue = (
  key: string,
  office: OfficeProfile,
  client: ClientContext,
): string | null => {
  switch (key) {
    case "escritorio.nome":
      return office.name || null;

    // Não existe um cadastro de "advogado responsável" pelo escritório — o
    // profissional responsável por este cliente é quem de fato assina pelo
    // escritório neste documento.
    case "escritorio.advogado":
      return client.responsible.name || null;

    case "escritorio.oab":
      return office.oabRegistration || null;

    default:
      return null;
  }
};

const resolveDocumentValue = (
  key: string,
  office: OfficeProfile,
): string | null => {
  switch (key) {
    case "documento.cidade":
      return office.address?.city || null;

    case "documento.dataExtenso":
      return longDateFormatter.format(new Date());

    default:
      return null;
  }
};

/**
 * Valor real de uma variável para este cliente, ou `null` quando o dado
 * necessário não existe. Variáveis de processo (`CASE`) nunca resolvem
 * aqui — esta tela não tem um processo selecionado, só o cliente.
 */
const resolveClientTemplateVariableValue = (
  variable: { key: string; source: TemplateVariableSource },
  client: ClientContext,
  office: OfficeProfile,
): string | null => {
  switch (variable.source) {
    case "CLIENT":
      return resolveClientValue(variable.key, client);

    case "OFFICE":
      return resolveOfficeValue(variable.key, office, client);

    case "DOCUMENT":
      return resolveDocumentValue(variable.key, office);

    case "CASE":
      return null;
  }
};

/**
 * Mapa pronto para `resolveDocumentVariables`/`DocumentSignatures`: só entram
 * as chaves que puderam ser resolvidas — uma variável ausente aqui continua
 * aparecendo como `{{chave}}` no documento, o mesmo comportamento já usado
 * em todo o resto do editor.
 */
export const resolveClientTemplateVariableValues = (
  usedVariables: TemplateUsedVariable[],
  client: ClientContext,
  office: OfficeProfile,
): Record<string, string> => {
  const values: Record<string, string> = {};

  for (const variable of usedVariables) {
    const resolved = resolveClientTemplateVariableValue(
      variable,
      client,
      office,
    );

    if (resolved) {
      values[variable.key] = resolved;
    }
  }

  return values;
};

/** Variáveis de cliente que o template usa e que este cliente não preenche. */
export const getUnresolvedClientVariables = (
  usedVariables: TemplateUsedVariable[],
  client: ClientContext,
): TemplateUsedVariable[] =>
  usedVariables.filter(
    (variable) =>
      variable.source === "CLIENT" && !resolveClientValue(variable.key, client),
  );

export const usesCaseVariables = (usedVariables: TemplateUsedVariable[]) =>
  usedVariables.some((variable) => variable.source === "CASE");

export type ClientReadinessItem = {
  key: string;
  label: string;
  resolved: boolean;
};

export type ClientReadinessGroup = {
  label: string;
  items: ClientReadinessItem[];
};

const IDENTIFICATION_KEYS = [
  "cliente.nome",
  "cliente.documento",
  "cliente.endereco",
];
const REPRESENTATIVE_KEYS = [
  "cliente.rg",
  "cliente.nacionalidade",
  "cliente.profissao",
];
const CONTACT_KEYS = ["cliente.email"];

const buildGroup = (
  label: string,
  keys: string[],
  client: ClientContext,
): ClientReadinessGroup => ({
  label,
  items: keys.map((key) => ({
    key,
    label: findTemplateVariable(key)?.label ?? key,
    resolved: Boolean(resolveClientValue(key, client)),
  })),
});

/**
 * Completude do cadastro do cliente frente às variáveis de cliente que os
 * templates podem usar — independe de qual template está selecionado, é uma
 * visão geral do cadastro.
 *
 * O grupo "Dados do representante" só existe para pessoa física: para
 * pessoa jurídica, RG/nacionalidade/profissão não são um dado pendente, são
 * um dado que não existe para este tipo de cliente.
 */
export const buildClientReadinessGroups = (
  client: ClientContext,
): ClientReadinessGroup[] => {
  const groups = [buildGroup("Identificação", IDENTIFICATION_KEYS, client)];

  if (client.type === ClientType.PESSOA_FISICA) {
    groups.push(
      buildGroup("Dados do representante", REPRESENTATIVE_KEYS, client),
    );
  }

  groups.push(buildGroup("Contato", CONTACT_KEYS, client));

  return groups;
};

export const calculateReadinessScore = (groups: ClientReadinessGroup[]) => {
  const items = groups.flatMap((group) => group.items);
  const resolved = items.filter((item) => item.resolved).length;

  return items.length > 0 ? Math.round((resolved / items.length) * 100) : 100;
};
