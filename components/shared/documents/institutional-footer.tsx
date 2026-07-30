import type { OfficeProfile } from "./document-types";

type InstitutionalFooterProps = {
  office: OfficeProfile;
  city: string;
};

const buildAddressLine = (office: OfficeProfile) => {
  const address = office.address;

  if (!address) {
    return null;
  }

  const street = [address.street, address.number, address.complement]
    .filter(Boolean)
    .join(", ");

  const locality = [address.district, address.city, address.state]
    .filter(Boolean)
    .join(" · ");

  return [street, locality, address.postalCode].filter(Boolean).join(" — ");
};

export const InstitutionalFooter = ({
  office,
  city,
}: InstitutionalFooterProps) => {
  const addressLine = buildAddressLine(office);
  const contactLine = [office.phone, office.email, office.website]
    .filter(Boolean)
    .join(" · ");

  return (
    <footer className="legal-document__footer">
      <span>
        {city || office.address?.city || "Cidade não informada"} · documento
        gerado pela plataforma Monteiro
      </span>

      {office.footerText ? <span>{office.footerText}</span> : null}
      {addressLine ? <span>{addressLine}</span> : null}
      {contactLine ? <span>{contactLine}</span> : null}
    </footer>
  );
};
