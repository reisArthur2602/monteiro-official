"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  getContentWidthPx,
  getRenderScale,
  measureOuterHeight,
} from "./document-geometry";
import type { DocumentPageSettings } from "./document-types";
import {
  type HtmlBlockPayload,
  type MeasuredBlock,
  type PageBudgets,
  paginateHtmlBlocks,
} from "./paginate-document";

/**
 * Extrai os blocos medíveis dos filhos diretos do HTML renderizado.
 *
 * `<p>` vira um bloco; `<ul>`/`<ol>` são expandidos em um bloco por `<li>`,
 * para o empacotador poder dividir a lista sem cortar um item ao meio. A
 * quebra manual não vira bloco: ela só marca o bloco seguinte como início de
 * folha — assim uma quebra no fim do documento não gera folha em branco, e a
 * linha tracejada que ela desenha no editor não ocupa espaço na folha.
 */
const flattenHtmlBlocks = (
  container: HTMLElement,
): MeasuredBlock<HtmlBlockPayload>[] => {
  const blocks: MeasuredBlock<HtmlBlockPayload>[] = [];
  const scale = getRenderScale(container);
  let listId = 0;
  let pendingBreak = false;

  const push = (block: MeasuredBlock<HtmlBlockPayload>) => {
    blocks.push(pendingBreak ? { ...block, breakBefore: true } : block);
    pendingBreak = false;
  };

  for (const child of Array.from(container.children)) {
    if (!(child instanceof HTMLElement)) {
      continue;
    }

    if (child.hasAttribute("data-page-break")) {
      pendingBreak = true;
      continue;
    }

    if (child.tagName === "UL" || child.tagName === "OL") {
      const tag = child.tagName === "UL" ? "ul" : "ol";
      const currentListId = listId;
      listId += 1;

      const listStyle = getComputedStyle(child);
      const listMarginTop = Number.parseFloat(listStyle.marginTop) || 0;
      const listMarginBottom = Number.parseFloat(listStyle.marginBottom) || 0;

      const items = Array.from(child.children).filter(
        (item): item is HTMLElement =>
          item instanceof HTMLElement && item.tagName === "LI",
      );

      items.forEach((item, itemIndex) => {
        // As margens da lista não pertencem a nenhum `<li>`, mas ocupam
        // espaço na folha: entram na conta do primeiro e do último item,
        // que são os que encostam nas bordas da lista.
        const listEdges =
          (itemIndex === 0 ? listMarginTop : 0) +
          (itemIndex === items.length - 1 ? listMarginBottom : 0);

        push({
          height: measureOuterHeight(item, scale) + listEdges,
          payload: {
            html: item.outerHTML,
            list: { tag, listId: currentListId, itemIndex },
          },
        });
      });

      continue;
    }

    push({
      height: measureOuterHeight(child, scale),
      payload: { html: child.outerHTML },
    });
  }

  return blocks;
};

const isSamePages = (a: string[], b: string[]) =>
  a.length === b.length && a.every((html, index) => html === b[index]);

export type UsePaginatedDocumentOptions = {
  /** HTML já com as variáveis resolvidas — o mesmo que uma folha única
   *  receberia. */
  html: string;
  page: DocumentPageSettings;
  /** Altura útil por folha, medida por `useDocumentChrome`. */
  budgets: PageBudgets;
};

/**
 * Divide o HTML do documento em folhas A4, recalculando quando o conteúdo,
 * a formatação da folha ou o espaço reservado pela moldura mudam.
 *
 * A geometria é física (mm), então redimensionar a janela não entra como
 * gatilho — o número de folhas não depende do viewport. Zoom também não: a
 * paginação é calculada em dimensões reais, e quem exibe o resultado é quem
 * aplica o `transform: scale()`.
 */
export const usePaginatedDocument = ({
  html,
  page,
  budgets,
}: UsePaginatedDocumentOptions): string[] => {
  const [pages, setPages] = useState<string[]>(() => [html]);

  // Criado uma vez, fora da árvore visível — nunca acompanha o `render`.
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (typeof document !== "undefined" && containerRef.current === null) {
    const element = document.createElement("div");

    element.className = "legal-document";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.top = "0";
    element.style.visibility = "hidden";
    element.style.pointerEvents = "none";

    containerRef.current = element;
  }

  useEffect(() => {
    return () => {
      containerRef.current?.remove();
    };
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const recompute = () => {
      if (!container.isConnected) {
        document.body.appendChild(container);
      }

      container.style.width = `${getContentWidthPx(page)}px`;
      container.innerHTML = html;

      const next = paginateHtmlBlocks(flattenHtmlBlocks(container), budgets);

      setPages((previous) => (isSamePages(previous, next) ? previous : next));
    };

    recompute();

    // A fonte "Source Serif 4" pode terminar de carregar depois da primeira
    // medição — sem isto, a paginação ficaria calculada com as métricas da
    // fonte de fallback.
    document.fonts?.ready?.then(recompute);
  }, [html, page, budgets]);

  return pages;
};
