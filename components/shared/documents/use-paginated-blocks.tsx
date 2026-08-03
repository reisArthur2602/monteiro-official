"use client";

import {
  Fragment,
  type ReactElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getRenderScale, measureOuterHeight } from "./document-geometry";
import { DocumentMeasurementProbe } from "./document-measurement-probe";
import type { DocumentPageSettings } from "./document-types";
import { LegalDocumentPage } from "./legal-document-page";
import {
  type MeasuredBlock,
  type PageBudgets,
  paginateBlocks,
} from "./paginate-document";

export type DocumentBlock = {
  /** Estável entre renders: é a identidade do bloco na medição e na folha. */
  id: string;
  /**
   * Precisa renderizar exatamente um elemento raiz: a medição casa os filhos
   * diretos da folha com esta lista, posição a posição. Um bloco é a menor
   * porção indivisível do documento — o paginador move blocos inteiros entre
   * folhas e nunca corta um pelo meio.
   */
  content: ReactElement;
  /** Sempre inicia uma folha nova. */
  breakBefore?: boolean;
  /** Não pode terminar uma folha — use em títulos de seção. */
  keepWithNext?: boolean;
};

const isSameHeights = (a: number[], b: number[]) =>
  a.length === b.length && a.every((height, index) => height === b[index]);

export type UsePaginatedBlocksOptions = {
  blocks: DocumentBlock[];
  page: DocumentPageSettings;
  /** Altura útil por folha, medida por `useDocumentChrome`. */
  budgets: PageBudgets;
};

export type UsePaginatedBlocksResult = {
  /** Precisa ser renderizado pelo chamador para que a medição aconteça. */
  probe: ReactElement;
  /** Blocos já distribuídos: um array por folha, na ordem. */
  pages: DocumentBlock[][];
};

/**
 * Distribui blocos React em folhas A4.
 *
 * É a contraparte de `usePaginatedDocument` para conteúdo estruturado —
 * fichas, relatórios, formulários impressos —, onde o documento não é uma
 * string de HTML mas uma sequência de seções, campos e listas. Os dois
 * caminhos medem a folha do mesmo jeito e empacotam com o mesmo algoritmo:
 * só muda o que está sendo medido.
 *
 * Cada bloco é medido uma vez numa folha invisível que reproduz a formatação
 * real. Medir na folha de verdade (em vez de estimar) é o que garante que
 * nada seja cortado: a altura considerada é exatamente a que o navegador vai
 * usar ao desenhar.
 */
export const usePaginatedBlocks = ({
  blocks,
  page,
  budgets,
}: UsePaginatedBlocksOptions): UsePaginatedBlocksResult => {
  const probeRef = useRef<HTMLDivElement | null>(null);
  const [heights, setHeights] = useState<number[]>([]);

  // `page` não aparece no corpo do efeito, e por isso a análise estática do
  // linter o considera dispensável — mas é ele que define a largura útil da
  // sonda, e largura é o que decide em quantas linhas cada bloco quebra.
  // Sem esta dependência, mudar margem ou orientação manteria as alturas
  // antigas e a paginação passaria a mentir.
  // biome-ignore lint/correctness/useExhaustiveDependencies: ver comentário acima.
  useLayoutEffect(() => {
    const measure = () => {
      const root = probeRef.current;

      if (!root) {
        return;
      }

      const sheet = root.querySelector<HTMLElement>(".legal-document__page");
      const measured = Array.from(sheet?.children ?? []);

      // A sonda desenha exatamente `blocks`, na ordem, e cada bloco é um
      // único elemento: os filhos da folha casam um a um com a lista. Um
      // descasamento significa que algum bloco renderizou nada ou mais de
      // uma raiz — aí não há como saber qual altura é de quem, e manter tudo
      // numa folha só é melhor do que paginar com alturas trocadas.
      if (measured.length !== blocks.length) {
        setHeights((previous) => (previous.length === 0 ? previous : []));
        return;
      }

      const scale = getRenderScale(root);

      const next = measured.map((element) =>
        element instanceof HTMLElement ? measureOuterHeight(element, scale) : 0,
      );

      // Devolver o array anterior quando nada mudou faz o React desistir do
      // re-render, o que impede o laço medir → gravar → renderizar → medir.
      setHeights((previous) =>
        isSameHeights(previous, next) ? previous : next,
      );
    };

    measure();

    // A fonte do documento pode terminar de carregar depois da primeira
    // medição; sem isto, a paginação usaria as métricas da fonte de fallback.
    document.fonts?.ready?.then(measure);
  }, [blocks, page]);

  const pages = useMemo<DocumentBlock[][]>(() => {
    // Antes da primeira medição não há como decidir nada: mantém tudo numa
    // folha só em vez de piscar uma divisão errada.
    if (heights.length !== blocks.length) {
      return [blocks];
    }

    const measured: MeasuredBlock<DocumentBlock>[] = blocks.map(
      (block, index) => ({
        height: heights[index],
        payload: block,
        breakBefore: block.breakBefore,
        keepWithNext: block.keepWithNext,
      }),
    );

    return paginateBlocks(measured, budgets).map((sheet) =>
      sheet.map((block) => block.payload),
    );
  }, [blocks, heights, budgets]);

  const probe = (
    <DocumentMeasurementProbe ref={probeRef}>
      <LegalDocumentPage page={page}>
        {blocks.map((block) => (
          <Fragment key={block.id}>{block.content}</Fragment>
        ))}
      </LegalDocumentPage>
    </DocumentMeasurementProbe>
  );

  return { probe, pages };
};
