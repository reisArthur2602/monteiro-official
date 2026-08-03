"use client";

import type { ReactNode } from "react";

import { DocumentContent } from "./document-content";
import type {
  DocumentPageSettings,
  DocumentSignature,
  OfficeProfile,
} from "./document-types";
import { PaginatedDocumentSheets } from "./paginated-document-sheets";
import { useDocumentChrome } from "./use-document-chrome";
import { usePaginatedDocument } from "./use-paginated-document";

type LegalDocumentPaginatedFrameProps = {
  office: OfficeProfile;
  page: DocumentPageSettings;
  signatures: DocumentSignature[];
  html: string;
  variableValues?: Record<string, string>;
  className?: string;
};

/**
 * Documento institucional em HTML, dividido em quantas folhas A4 o conteúdo
 * exigir.
 *
 * Mesmo contrato de props que `LegalDocumentFrame`, que continua existindo
 * sem paginação para quem não precisa dela. Para documentos estruturados em
 * seções e campos, use `LegalDocumentBlocksFrame`.
 */
export const LegalDocumentPaginatedFrame = ({
  office,
  page,
  signatures,
  html,
  variableValues,
  className,
}: LegalDocumentPaginatedFrameProps) => {
  const { probe: chromeProbe, budgets } = useDocumentChrome({
    page,
    office,
    signatures,
    variableValues,
  });

  const pages = usePaginatedDocument({ html, page, budgets });

  const bodies: ReactNode[] = pages.map((pageHtml, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: `pages` é regenerada inteira a cada recálculo e nunca reordenada — o índice é a própria identidade da folha.
    <DocumentContent key={index} html={pageHtml} />
  ));

  return (
    <PaginatedDocumentSheets
      page={page}
      office={office}
      signatures={signatures}
      variableValues={variableValues}
      bodies={bodies}
      className={className}
    >
      {chromeProbe}
    </PaginatedDocumentSheets>
  );
};
