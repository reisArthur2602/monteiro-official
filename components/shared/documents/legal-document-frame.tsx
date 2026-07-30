import { DocumentContent } from "./document-content";
import { DocumentSignatures } from "./document-signatures";
import type {
  DocumentPageSettings,
  DocumentSignature,
  OfficeProfile,
} from "./document-types";
import { InstitutionalFooter } from "./institutional-footer";
import { InstitutionalHeader } from "./institutional-header";
import { LegalDocumentPage } from "./legal-document-page";

type LegalDocumentFrameProps = {
  office: OfficeProfile;
  page: DocumentPageSettings;
  signatures: DocumentSignature[];
  html: string;
  variableValues?: Record<string, string>;
  className?: string;
};

/**
 * Documento institucional completo em folha A4.
 *
 * É um Server Component puro e sem estado, propositalmente independente do
 * módulo de templates: a mesma estrutura serve à prévia da tela, à
 * impressão e à futura geração de PDF pelo Chromium, além de relatórios,
 * fichas e procurações.
 */
export const LegalDocumentFrame = ({
  office,
  page,
  signatures,
  html,
  variableValues,
  className,
}: LegalDocumentFrameProps) => (
  <LegalDocumentPage page={page} className={className}>
    {page.showInstitutionalHeader ? (
      <InstitutionalHeader office={office} />
    ) : null}

    <DocumentContent html={html} />

    <DocumentSignatures
      signatures={signatures}
      variableValues={variableValues}
    />

    {page.showInstitutionalFooter ? (
      <InstitutionalFooter office={office} city={page.city} />
    ) : null}
  </LegalDocumentPage>
);
