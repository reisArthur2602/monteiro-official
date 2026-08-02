import { ClientStatus, ClientType } from "@/app/generated/prisma/enums";

import type { ClientFormInput } from "../schemas/client-form-schema";

const emptyAddress = () => ({
  postalCode: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  country: "BR",
});

/**
 * Valores iniciais no modo de criação.
 *
 * Todo campo textual começa em string vazia, nunca `undefined`: o React
 * Hook Form precisa de um valor definido para o input não alternar entre
 * controlado e não controlado.
 */
export const createEmptyClientFormValues = (): ClientFormInput => ({
  type: ClientType.PESSOA_FISICA,
  status: ClientStatus.PROSPECTO,
  name: "",
  displayName: "",
  document: "",
  birthDate: "",
  profession: "",
  nationality: "",
  rgNumber: "",
  stateRegistration: "",
  municipalRegistration: "",
  email: "",
  phone: "",
  responsibleId: "",
  notes: "",
  address: emptyAddress(),
});

type ClientRecord = {
  id: string;
  name: string;
  displayName: string | null;
  document: string;
  type: ClientType;
  status: ClientStatus;
  birthDate: Date | null;
  profession: string | null;
  nationality: string | null;
  rgNumber: string | null;
  stateRegistration: string | null;
  municipalRegistration: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  responsibleId: string;
  address: {
    postalCode: string | null;
    street: string | null;
    number: string | null;
    complement: string | null;
    district: string | null;
    city: string | null;
    state: string | null;
    country: string;
  } | null;
};

/**
 * Converte o registro do Prisma nos valores do formulário.
 *
 * `birthDate` é data civil, então vai para o input como `YYYY-MM-DD` a
 * partir do UTC — usar o fuso local deslocaria o dia perto da meia-noite.
 */
export const mapClientToFormValues = (
  client: ClientRecord,
): ClientFormInput => ({
  type: client.type,
  status: client.status,
  name: client.name,
  displayName: client.displayName ?? "",
  document: client.document,
  birthDate: client.birthDate
    ? client.birthDate.toISOString().slice(0, 10)
    : "",
  profession: client.profession ?? "",
  nationality: client.nationality ?? "",
  rgNumber: client.rgNumber ?? "",
  stateRegistration: client.stateRegistration ?? "",
  municipalRegistration: client.municipalRegistration ?? "",
  email: client.email ?? "",
  phone: client.phone ?? "",
  responsibleId: client.responsibleId,
  notes: client.notes ?? "",
  address: client.address
    ? {
        postalCode: client.address.postalCode ?? "",
        street: client.address.street ?? "",
        number: client.address.number ?? "",
        complement: client.address.complement ?? "",
        district: client.address.district ?? "",
        city: client.address.city ?? "",
        state: client.address.state ?? "",
        country: client.address.country,
      }
    : emptyAddress(),
});
