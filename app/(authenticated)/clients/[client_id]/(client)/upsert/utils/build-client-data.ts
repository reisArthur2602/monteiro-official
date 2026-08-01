import type { Prisma } from "@/app/generated/prisma/client";

import type { ClientFormValues } from "../schemas/client-form-schema";

/**
 * Campos escalares do cliente, já normalizados para o Prisma.
 *
 * Campos exclusivos do outro tipo são zerados de propósito: alternar de
 * pessoa jurídica para física precisa apagar as inscrições que ficaram no
 * registro, senão o cliente guardaria dado incoerente com o próprio tipo.
 */
export const buildClientScalarData = (values: ClientFormValues) => {
  const isNaturalPerson = values.type === "PESSOA_FISICA";

  return {
    type: values.type,
    status: values.status,
    name: values.name,
    displayName: values.displayName ?? null,
    document: values.document,
    email: values.email ?? null,
    phone: values.phone ?? null,
    notes: values.notes ?? null,
    responsibleId: values.responsibleId,
    birthDate:
      isNaturalPerson && values.birthDate ? new Date(values.birthDate) : null,
    stateRegistration: isNaturalPerson
      ? null
      : (values.stateRegistration ?? null),
    municipalRegistration: isNaturalPerson
      ? null
      : (values.municipalRegistration ?? null),
  };
};

type AddressFields = {
  postalCode: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  country: string;
};

/**
 * Endereço preenchido ou `null` quando o usuário não informou nada além do
 * país, que tem valor padrão. Devolver `null` sinaliza a quem chama que o
 * registro de endereço deve deixar de existir, em vez de virar uma linha
 * com todos os campos vazios.
 */
export const buildClientAddressData = (
  values: ClientFormValues,
): AddressFields | null => {
  const { address } = values;

  const hasContent = Boolean(
    address.postalCode ||
      address.street ||
      address.number ||
      address.complement ||
      address.district ||
      address.city ||
      address.state,
  );

  if (!hasContent) {
    return null;
  }

  return {
    postalCode: address.postalCode ?? null,
    street: address.street ?? null,
    number: address.number ?? null,
    complement: address.complement ?? null,
    district: address.district ?? null,
    city: address.city ?? null,
    state: address.state ?? null,
    country: address.country,
  };
};

/**
 * Sincroniza o endereço do cliente dentro de uma transação.
 *
 * Usa `deleteMany` em vez de `delete` porque o cliente pode simplesmente
 * não ter endereço — `delete` lançaria "Record to delete does not exist",
 * enquanto `deleteMany` é uma operação vazia nesse caso.
 */
export const persistClientAddress = async (
  tx: Prisma.TransactionClient,
  clientId: string,
  address: AddressFields | null,
) => {
  if (!address) {
    await tx.clientAddress.deleteMany({ where: { clientId } });
    return;
  }

  await tx.clientAddress.upsert({
    where: { clientId },
    create: { ...address, clientId },
    update: address,
  });
};
