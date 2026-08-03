/**
 * Empacotamento de blocos de conteúdo em páginas A4.
 *
 * Puro e sem acesso a DOM de propósito: quem mede o conteúdo real e produz
 * os blocos com altura é o hook de cada formato — HTML do editor de
 * templates ou blocos React de uma ficha de atendimento. Isto só decide "o
 * que cabe em cada folha", o que torna o algoritmo testável isoladamente e,
 * mais importante, garante que os dois formatos quebrem página exatamente
 * com o mesmo critério.
 */

export type MeasuredBlock<TPayload> = {
  /** Espaço vertical total ocupado: margem superior + caixa + margem inferior. */
  height: number;
  payload: TPayload;
  /** Sempre inicia uma folha nova (quebra manual do editor). */
  breakBefore?: boolean;
  /**
   * Não pode terminar uma folha. Usado por títulos de seção, que ficariam
   * órfãos no pé da página com o corpo começando só na folha seguinte.
   */
  keepWithNext?: boolean;
};

export type PageBudgets = {
  /** Altura útil de qualquer página que não seja a última — só reserva o
   *  cabeçalho institucional, quando exibido. */
  continuation: number;
  /** Altura útil da última página — reserva também rodapé institucional,
   *  assinaturas e fecho, quando existem. */
  last: number;
};

const sumHeight = <TPayload>(blocks: MeasuredBlock<TPayload>[]) =>
  blocks.reduce((total, block) => total + block.height, 0);

/**
 * Remove do fim da folha a sequência de blocos marcados com `keepWithNext`,
 * para que eles acompanhem o bloco que está mudando de página.
 *
 * Nunca esvazia a folha: se todos os blocos fossem arrastados, o resultado
 * seria uma folha em branco e exatamente o mesmo impasse na folha seguinte.
 */
const detachTrailingKeepWithNext = <TPayload>(
  page: MeasuredBlock<TPayload>[],
): MeasuredBlock<TPayload>[] => {
  const detached: MeasuredBlock<TPayload>[] = [];

  while (page.length > 1 && page[page.length - 1].keepWithNext) {
    const moved = page.pop();

    if (!moved) {
      break;
    }

    detached.unshift(moved);
  }

  return detached;
};

/**
 * Empacota os blocos em folhas.
 *
 * Passo 1: preenche greedily contra o orçamento de continuação. Uma quebra
 * manual sempre inicia folha nova; um bloco maior que uma folha vazia
 * inteira é aceito sozinho em vez de cortado — nunca se corta um bloco ao
 * meio, é o que impede texto, campo ou seção de sair pela metade.
 *
 * Passo 2: a última folha reserva mais espaço (rodapé, assinaturas e fecho)
 * do que o passo 1 considerou, então o excedente vai sendo empurrado para
 * folhas novas até caber, com o mesmo critério de não cortar nada.
 */
export const paginateBlocks = <TPayload>(
  blocks: MeasuredBlock<TPayload>[],
  budgets: PageBudgets,
): MeasuredBlock<TPayload>[][] => {
  const pages: MeasuredBlock<TPayload>[][] = [[]];

  for (const block of blocks) {
    const page = pages[pages.length - 1];

    if (block.breakBefore) {
      // Uma quebra logo no início do documento, ou logo depois de outra,
      // não gera folha em branco.
      if (page.length > 0) {
        pages.push([]);
      }
    } else if (
      page.length > 0 &&
      sumHeight(page) + block.height > budgets.continuation
    ) {
      pages.push(detachTrailingKeepWithNext(page));
    }

    pages[pages.length - 1].push(block);
  }

  let lastPage = pages[pages.length - 1];

  while (sumHeight(lastPage) > budgets.last && lastPage.length > 1) {
    const moved = lastPage.pop();

    if (!moved) {
      break;
    }

    pages.push([...detachTrailingKeepWithNext(lastPage), moved]);
    lastPage = pages[pages.length - 1];
  }

  return pages;
};

/* -------------------------------------------------------------------------
 * Adaptação para conteúdo em HTML (editor de templates)
 * ---------------------------------------------------------------------- */

export type FlattenedListInfo = {
  /** Identifica a lista de origem: blocos da mesma lista voltam a ficar
   *  juntos em `<ul>`/`<ol>` ao montar o HTML de cada página. */
  tag: "ol" | "ul";
  listId: number;
  /** Posição (0-based) dentro da lista original — vira `start` do `<ol>`
   *  quando a lista é dividida entre páginas. */
  itemIndex: number;
};

export type HtmlBlockPayload = {
  /** HTML do bloco (`<p>…</p>` ou `<li>…</li>`), pronto para ser concatenado
   *  ou reagrupado numa lista. */
  html: string;
  list?: FlattenedListInfo;
};

/**
 * Reagrupa blocos de lista consecutivos da mesma lista de origem em um único
 * `<ul>`/`<ol>`, e concatena o restante como veio. Uma lista dividida entre
 * páginas reaparece em cada uma com apenas os itens que couberam, e o `<ol>`
 * da continuação retoma a numeração com `start`.
 */
const renderPageHtml = (blocks: MeasuredBlock<HtmlBlockPayload>[]): string => {
  const parts: string[] = [];
  let index = 0;

  while (index < blocks.length) {
    const { payload } = blocks[index];

    if (!payload.list) {
      parts.push(payload.html);
      index += 1;
      continue;
    }

    const { tag, listId, itemIndex } = payload.list;
    const items: string[] = [];

    while (index < blocks.length) {
      const current = blocks[index].payload;

      if (current.list?.listId !== listId) {
        break;
      }

      items.push(current.html);
      index += 1;
    }

    const startAttr =
      tag === "ol" && itemIndex > 0 ? ` start="${itemIndex + 1}"` : "";
    parts.push(`<${tag}${startAttr}>${items.join("")}</${tag}>`);
  }

  return parts.join("");
};

/** Empacota e já devolve o HTML pronto de cada página. */
export const paginateHtmlBlocks = (
  blocks: MeasuredBlock<HtmlBlockPayload>[],
  budgets: PageBudgets,
): string[] => paginateBlocks(blocks, budgets).map(renderPageHtml);
