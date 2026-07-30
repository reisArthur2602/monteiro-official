import { cache } from "react";

import type { OfficeProfile } from "@/components/shared/documents/document-types";
import { verifyAuth } from "@/utils/auth";

/**
 * Perfil institucional do escritório.
 *
 * Ponto único de substituição: hoje é uma constante lida no servidor,
 * amanhã vira uma tabela de configurações. Os componentes recebem o perfil
 * por props, então trocar a origem não toca em nenhuma tela.
 *
 * Estes dados nunca são gravados no template: o documento guarda apenas os
 * interruptores `showInstitutionalHeader` e `showInstitutionalFooter`.
 */
const OFFICE_PROFILE: OfficeProfile = {
  name: "Monteiro Advocacia",
  legalName: "Monteiro Sociedade Individual de Advocacia",
  oabRegistration: "OAB/SP 123.456",
  headerText: "Estratégia, precisão e responsabilidade jurídica",
  address: {
    street: "Avenida Paulista",
    number: "1000",
    complement: "conjunto 142",
    district: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    postalCode: "01310-100",
  },
  phone: "(11) 4000-0000",
  email: "contato@monteiro.adv.br",
};

export const getOfficeProfile = cache(async (): Promise<OfficeProfile> => {
  await verifyAuth();

  return OFFICE_PROFILE;
});
