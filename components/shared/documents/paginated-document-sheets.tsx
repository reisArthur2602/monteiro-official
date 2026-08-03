import type { PropsWithChildren, ReactNode } from "react";

import { DocumentSignatures } from "./document-signatures";
import type {
  DocumentPageSettings,
  DocumentSignature,
  OfficeProfile,
} from "./document-types";
import { InstitutionalFooter } from "./institutional-footer";
import { InstitutionalHeader } from "./institutional-header";
import { LegalDocumentPage } from "./legal-document-page";

type PaginatedDocumentSheetsProps = PropsWithChildren<{
  page: DocumentPageSettings;
  office: OfficeProfile;
  signatures: DocumentSignature[];
  variableValues?: Record<string, string>;
  /** Aparece depois das assinaturas, só na última folha. */
  closing?: ReactNode;
  /** Conteúdo já dividido: um item por folha, na ordem. */
  bodies: ReactNode[];
  className?: string;
}>;

/**
 * A pilha de folhas de um documento paginado.
 *
 * É aqui que "comportamento consistente" deixa de ser intenção e vira
 * código: margens, espaçamento entre folhas, centralização no canvas e a
 * regra de onde cada parte da moldura aparece são definidas uma única vez,
 * para qualquer documento paginado do sistema.
 *
 * Cabeçalho institucional repete em toda folha; assinaturas, fecho e rodapé
 * só na última — é a convenção de uma peça continuada, não uma omissão.
 *
 * `children` recebe as sondas de medição de quem chama: elas precisam estar
 * na árvore renderizada para que o navegador as meça, mas nunca aparecem.
 */
export const PaginatedDocumentSheets = ({
  page,
  office,
  signatures,
  variableValues,
  closing,
  bodies,
  className,
  children,
}: PaginatedDocumentSheetsProps) => (
  <div
    data-paginated-document-root
    className="flex flex-col items-center gap-8"
  >
    {bodies.map((body, index) => {
      const isLastSheet = index === bodies.length - 1;

      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: `bodies` é regenerada inteira a cada recálculo e nunca reordenada — o índice é a própria identidade da folha.
        <LegalDocumentPage key={index} page={page} className={className}>
          {page.showInstitutionalHeader ? (
            <InstitutionalHeader office={office} />
          ) : null}

          {body}

          {isLastSheet ? (
            <>
              <DocumentSignatures
                signatures={signatures}
                variableValues={variableValues}
              />

              {closing}

              {page.showInstitutionalFooter ? (
                <InstitutionalFooter office={office} city={page.city} />
              ) : null}
            </>
          ) : null}
        </LegalDocumentPage>
      );
    })}

    {children}
  </div>
);
