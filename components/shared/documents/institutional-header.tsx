import type { OfficeProfile } from "./document-types";

type InstitutionalHeaderProps = {
  office: OfficeProfile;
};

export const InstitutionalHeader = ({ office }: InstitutionalHeaderProps) => (
  <header className="legal-document__header">
    <div className="legal-document__mark" aria-hidden="true">
      §
    </div>

    <div>
      <strong className="legal-document__office-name">{office.name}</strong>

      {office.headerText ? (
        <span className="legal-document__office-meta">{office.headerText}</span>
      ) : null}

      {office.oabRegistration ? (
        <span className="legal-document__office-meta">
          {office.oabRegistration}
        </span>
      ) : null}
    </div>
  </header>
);
