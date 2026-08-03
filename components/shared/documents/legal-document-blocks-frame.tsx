"use client";

import { Fragment, type ReactElement, type ReactNode } from "react";

import type {
  DocumentPageSettings,
  DocumentSignature,
  OfficeProfile,
} from "./document-types";
import { PaginatedDocumentSheets } from "./paginated-document-sheets";
import { useDocumentChrome } from "./use-document-chrome";
import { type DocumentBlock, usePaginatedBlocks } from "./use-paginated-blocks";

type LegalDocumentBlocksFrameProps = {
  office: OfficeProfile;
  page: DocumentPageSettings;
  signatures: DocumentSignature[];
  variableValues?: Record<string, string>;
  /** Conteúdo do documento, na ordem, já dividido em unidades indivisíveis. */
  blocks: DocumentBlock[];
  /** Aparece depois das assinaturas, só na última folha. */
  closing?: ReactElement;
  className?: string;
};

/**
 * Documento institucional montado a partir de blocos React, dividido em
 * quantas folhas A4 o conteúdo exigir.
 *
 * Contraparte de `LegalDocumentPaginatedFrame` (que pagina HTML do editor)
 * para documentos estruturados: fichas de atendimento, relatórios e
 * formulários impressos, onde o conteúdo é uma sequência de seções e campos,
 * não uma string de HTML. Os dois compartilham medição da moldura,
 * algoritmo de empacotamento e apresentação da pilha de folhas — mudam só
 * na forma de descrever o conteúdo.
 */
export const LegalDocumentBlocksFrame = ({
  office,
  page,
  signatures,
  variableValues,
  blocks,
  closing,
  className,
}: LegalDocumentBlocksFrameProps) => {
  const { probe: chromeProbe, budgets } = useDocumentChrome({
    page,
    office,
    signatures,
    variableValues,
    closing,
  });

  const { probe: blocksProbe, pages } = usePaginatedBlocks({
    blocks,
    page,
    budgets,
  });

  // `Fragment` não gera elemento no DOM, então os blocos continuam sendo
  // filhos diretos da folha — que é exatamente o que a medição pressupõe,
  // já que margens de itens flex não colapsam.
  const bodies: ReactNode[] = pages.map((sheet) =>
    sheet.map((block) => <Fragment key={block.id}>{block.content}</Fragment>),
  );

  return (
    <PaginatedDocumentSheets
      page={page}
      office={office}
      signatures={signatures}
      variableValues={variableValues}
      closing={closing}
      bodies={bodies}
      className={className}
    >
      {chromeProbe}
      {blocksProbe}
    </PaginatedDocumentSheets>
  );
};
