"use client";

import {
  type ReactElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getContentHeightPx,
  getRenderScale,
  measureOuterHeight,
} from "./document-geometry";
import { DocumentMeasurementProbe } from "./document-measurement-probe";
import { DocumentSignatures } from "./document-signatures";
import type {
  DocumentPageSettings,
  DocumentSignature,
  OfficeProfile,
} from "./document-types";
import { InstitutionalFooter } from "./institutional-footer";
import { InstitutionalHeader } from "./institutional-header";
import { LegalDocumentPage } from "./legal-document-page";
import type { PageBudgets } from "./paginate-document";

type ChromeHeights = {
  header: number;
  footer: number;
  signatures: number;
  closing: number;
};

const EMPTY_HEIGHTS: ChromeHeights = {
  header: 0,
  footer: 0,
  signatures: 0,
  closing: 0,
};

const CHROME_CLASS_NAMES = [
  "legal-document__header",
  "legal-document__footer",
  "legal-document__signatures",
];

const measureSelector = (
  root: HTMLElement,
  selector: string,
  scale: number,
) => {
  const element = root.querySelector<HTMLElement>(selector);

  return element ? measureOuterHeight(element, scale) : 0;
};

/**
 * O fecho é o único filho da folha que não veio de um componente nosso, e
 * por isso não tem classe conhecida: ele é identificado por exclusão.
 *
 * A alternativa seria marcá-lo com `cloneElement`, mas o atributo iria para
 * as props do componente em vez do elemento do DOM sempre que o fecho não
 * fosse uma tag simples — e o espaço reservado ficaria zerado sem nenhum
 * sinal de erro.
 */
const measureClosing = (root: HTMLElement, scale: number) => {
  const sheet = root.querySelector<HTMLElement>(".legal-document__page");

  const element = Array.from(sheet?.children ?? []).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement &&
      !CHROME_CLASS_NAMES.some((className) =>
        child.classList.contains(className),
      ),
  );

  return element ? measureOuterHeight(element, scale) : 0;
};

const isSameHeights = (a: ChromeHeights, b: ChromeHeights) =>
  a.header === b.header &&
  a.footer === b.footer &&
  a.signatures === b.signatures &&
  a.closing === b.closing;

export type UseDocumentChromeOptions = {
  page: DocumentPageSettings;
  office: OfficeProfile;
  signatures: DocumentSignature[];
  variableValues?: Record<string, string>;
  /**
   * Fecho do documento: o que aparece depois das assinaturas, só na última
   * folha. Precisa renderizar exatamente um elemento raiz, que é o que a
   * medição identifica dentro da folha.
   */
  closing?: ReactElement;
};

export type UseDocumentChromeResult = {
  /** Precisa ser renderizado pelo chamador para que a medição aconteça. */
  probe: ReactElement;
  budgets: PageBudgets;
};

/**
 * Mede o espaço que a moldura institucional reserva em cada folha e converte
 * isso no orçamento de altura disponível para o conteúdo.
 *
 * Cabeçalho, rodapé, assinaturas e fecho não têm altura fixa: dependem da
 * fonte, dos dados do escritório e de quantas assinaturas o documento tem.
 * Medir a folha real é a única forma de o paginador saber quanto conteúdo
 * cabe — e é o que faz templates e fichas quebrarem página no mesmo ponto.
 */
export const useDocumentChrome = ({
  page,
  office,
  signatures,
  variableValues,
  closing,
}: UseDocumentChromeOptions): UseDocumentChromeResult => {
  const probeRef = useRef<HTMLDivElement | null>(null);
  const [heights, setHeights] = useState<ChromeHeights>(EMPTY_HEIGHTS);

  // O efeito só lê `probeRef.current` — o DOM que a sonda abaixo já
  // desenhou —, nunca `page`/`office`/`signatures`/`closing` diretamente,
  // e por isso a análise estática do linter os considera dispensáveis. Mas
  // são exatamente eles que mudam o que a sonda desenha: sem essas
  // dependências a medição rodaria só no mount e nunca acompanharia uma
  // troca de margem, orientação, escritório ou assinatura adicionada
  // depois. `variableValues` fica de fora de propósito — nomes resolvidos
  // têm largura variável, mas a altura de uma linha de assinatura não
  // depende do texto, só da fonte.
  // biome-ignore lint/correctness/useExhaustiveDependencies: ver comentário acima.
  useLayoutEffect(() => {
    const measure = () => {
      const root = probeRef.current;

      if (!root) {
        return;
      }

      const scale = getRenderScale(root);

      const next: ChromeHeights = {
        header: measureSelector(root, ".legal-document__header", scale),
        footer: measureSelector(root, ".legal-document__footer", scale),
        signatures: measureSelector(root, ".legal-document__signatures", scale),
        closing: measureClosing(root, scale),
      };

      // Devolver o objeto anterior quando nada mudou faz o React desistir
      // do re-render. Sem isso, um `signatures` recriado a cada render (o
      // caso comum de `props.signatures ?? []`) mediria, gravaria um objeto
      // novo, renderizaria e mediria de novo — em laço infinito.
      setHeights((previous) =>
        isSameHeights(previous, next) ? previous : next,
      );
    };

    measure();

    // A fonte do documento pode terminar de carregar depois da primeira
    // medição; sem isto, a moldura ficaria dimensionada pelas métricas da
    // fonte de fallback.
    document.fonts?.ready?.then(measure);
  }, [page, office, signatures, closing]);

  const budgets = useMemo<PageBudgets>(() => {
    const usableHeightPx = getContentHeightPx(page);
    const headerReserve = page.showInstitutionalHeader ? heights.header : 0;
    const footerReserve = page.showInstitutionalFooter ? heights.footer : 0;

    return {
      continuation: usableHeightPx - headerReserve,
      last:
        usableHeightPx -
        headerReserve -
        footerReserve -
        heights.signatures -
        heights.closing,
    };
  }, [page, heights]);

  const probe = (
    <DocumentMeasurementProbe ref={probeRef}>
      <LegalDocumentPage page={page}>
        <InstitutionalHeader office={office} />

        <DocumentSignatures
          signatures={signatures}
          variableValues={variableValues}
        />

        {closing}

        <InstitutionalFooter office={office} city={page.city} />
      </LegalDocumentPage>
    </DocumentMeasurementProbe>
  );

  return { probe, budgets };
};
