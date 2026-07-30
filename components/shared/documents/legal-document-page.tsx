import type { CSSProperties, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

import {
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  type DocumentPageSettings,
} from "./document-types";

type LegalDocumentPageProps = PropsWithChildren<{
  page: DocumentPageSettings;
  className?: string;
}>;

/**
 * A folha física.
 *
 * As dimensões são declaradas em milímetros para que a mesma marcação
 * sirva à tela, à impressão e ao Chromium na futura geração de PDF. O
 * ajuste visual de tamanho é responsabilidade de quem envolve a folha
 * (via zoom/scale), nunca destas medidas.
 */
export const LegalDocumentPage = ({
  page,
  className,
  children,
}: LegalDocumentPageProps) => {
  const isLandscape = page.orientation === "LANDSCAPE";

  const style: CSSProperties = {
    width: `${isLandscape ? A4_HEIGHT_MM : A4_WIDTH_MM}mm`,
    minHeight: `${isLandscape ? A4_WIDTH_MM : A4_HEIGHT_MM}mm`,
    paddingTop: `${page.marginTop}mm`,
    paddingRight: `${page.marginRight}mm`,
    paddingBottom: `${page.marginBottom}mm`,
    paddingLeft: `${page.marginLeft}mm`,
  };

  return (
    <article
      className={cn("legal-document legal-document__page", className)}
      style={style}
      data-orientation={page.orientation}
    >
      {children}
    </article>
  );
};
