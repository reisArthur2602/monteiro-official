import { ClientType } from "@/app/generated/prisma/enums";

import { formatDocument } from "../../utils/format-document";
import { formatPhone } from "../../utils/format-phone";
import type { ClientContext } from "../queries/get-client-context";
import { formatAddressLines } from "../utils/format-address";
import { formatCivilDate } from "../utils/format-date";

type InfoFieldProps = {
  label: string;
  children: React.ReactNode;
};

const InfoField = ({ label, children }: InfoFieldProps) => (
  <div className="grid gap-1 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
    <span className="font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
      {label}
    </span>

    <span className="text-sm font-semibold">{children}</span>
  </div>
);

type ClientInfoPanelProps = {
  client: ClientContext;
};

/**
 * Resumo dos dados cadastrais do cliente. Campos específicos de pessoa
 * física ou jurídica só aparecem quando fazem sentido para o tipo — e só
 * quando preenchidos, já que nem todo cadastro está completo.
 */
export const ClientInfoPanel = ({ client }: ClientInfoPanelProps) => {
  const isNaturalPerson = client.type === ClientType.PESSOA_FISICA;
  const documentLabel = isNaturalPerson ? "CPF" : "CNPJ";
  const addressLines = formatAddressLines(client.address);

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <header className="flex min-h-14 items-center border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Dados cadastrais</h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Resumo das informações principais.
          </p>
        </div>
      </header>

      <div className="grid gap-x-6 p-4 sm:grid-cols-2 sm:p-5">
        <InfoField label={isNaturalPerson ? "Nome completo" : "Razão social"}>
          {client.name}
        </InfoField>

        <InfoField label={isNaturalPerson ? "Nome social" : "Nome fantasia"}>
          {client.displayName ?? (
            <span className="font-normal text-muted-foreground">
              Não informado
            </span>
          )}
        </InfoField>

        <InfoField label={documentLabel}>
          {formatDocument(client.document)}
        </InfoField>

        {isNaturalPerson ? (
          client.birthDate ? (
            <InfoField label="Data de nascimento">
              {formatCivilDate(client.birthDate)}
            </InfoField>
          ) : null
        ) : (
          <>
            {client.stateRegistration ? (
              <InfoField label="Inscrição estadual">
                {client.stateRegistration}
              </InfoField>
            ) : null}

            {client.municipalRegistration ? (
              <InfoField label="Inscrição municipal">
                {client.municipalRegistration}
              </InfoField>
            ) : null}
          </>
        )}

        <InfoField label="E-mail">
          {client.email ?? (
            <span className="font-normal text-muted-foreground">
              Não informado
            </span>
          )}
        </InfoField>

        <InfoField label="Telefone">
          {client.phone ? (
            formatPhone(client.phone)
          ) : (
            <span className="font-normal text-muted-foreground">
              Não informado
            </span>
          )}
        </InfoField>

        {addressLines.length > 0 ? (
          <InfoField label="Endereço">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </InfoField>
        ) : null}
      </div>

      {client.notes ? (
        <div className="border-t px-4 py-4 sm:px-5">
          <span className="font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
            Observações
          </span>

          <p className="mt-1.5 text-sm whitespace-pre-wrap">{client.notes}</p>
        </div>
      ) : null}
    </section>
  );
};
