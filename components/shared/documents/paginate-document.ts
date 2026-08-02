/**
 * Empacotamento de blocos de conteúdo em páginas A4.
 *
 * Puro e sem acesso a DOM de propósito — quem mede o HTML real e produz os
 * `FlattenedUnit[]` é `use-paginated-document.ts`. Isto só decide "o que
 * cabe em cada folha", o que torna o algoritmo testável isoladamente.
 */

export type FlattenedListInfo = {
    tag: "ol" | "ul";
    /** Identifica a lista de origem: unidades da mesma lista ficam juntas
     *  de novo em `<ul>`/`<ol>` ao montar o HTML de cada página. */
    listId: number;
    /** Posição (0-based) dentro da lista original — vira `start` do `<ol>`
     *  quando a lista é dividida entre páginas. */
    itemIndex: number;
};

export type FlattenedUnit =
    | { kind: 'pageBreak' }
    | {
          kind: 'content';
          /** HTML do bloco (`<p>…</p>` ou `<li>…</li>`), pronto para ser
           *  concatenado ou reagrupado numa lista. */
          html: string;
          /** Altura em px já somando a margem inferior — a margem superior
           *  dos blocos deste editor é sempre 0. */
          height: number;
          list?: FlattenedListInfo;
      };

export type PageBudgets = {
    /** Altura útil de qualquer página que não seja a última — só reserva o
     *  cabeçalho institucional, quando exibido. */
    continuation: number;
    /** Altura útil da última página — reserva cabeçalho, rodapé
     *  institucional e o bloco de assinaturas, quando existem. */
    last: number;
};

/**
 * Reagrupa unidades de lista consecutivas da mesma lista de origem em um
 * único `<ul>`/`<ol>`, e concatena o restante como veio. Uma lista dividida
 * entre páginas reaparece em cada uma com apenas os itens que couberam,
 * e o `<ol>` da continuação retoma a numeração com `start`.
 */
const renderPageHtml = (units: FlattenedUnit[]): string => {
    const parts: string[] = [];
    let index = 0;

    while (index < units.length) {
        const unit = units[index];

        if (unit.kind !== 'content') {
            index += 1;
            continue;
        }

        if (!unit.list) {
            parts.push(unit.html);
            index += 1;
            continue;
        }

        const { tag, listId, itemIndex } = unit.list;
        const items: string[] = [];

        while (index < units.length) {
            const current = units[index];

            if (current.kind !== 'content' || current.list?.listId !== listId) {
                break;
            }

            items.push(current.html);
            index += 1;
        }

        const startAttr = tag === 'ol' && itemIndex > 0 ? ` start="${itemIndex + 1}"` : '';
        parts.push(`<${tag}${startAttr}>${items.join('')}</${tag}>`);
    }

    return parts.join('');
};

const sumHeight = (units: FlattenedUnit[]) =>
    units.reduce((total, unit) => total + (unit.kind === 'content' ? unit.height : 0), 0);

/**
 * Empacota as unidades em páginas.
 *
 * Passo 1: preenche greedily contra o orçamento de continuação; uma quebra
 * manual sempre inicia página nova; uma unidade maior que uma página vazia
 * inteira é aceita sozinha em vez de cortada.
 *
 * Passo 2: a última página, que reserva mais espaço (rodapé + assinaturas),
 * pode não caber no que o passo 1 empacotou pensando só no cabeçalho — o
 * excedente vai sendo empurrado para páginas novas até caber, com o mesmo
 * critério de nunca cortar uma unidade ao meio.
 */
export const paginateDocument = (
    units: FlattenedUnit[],
    budgets: PageBudgets
): FlattenedUnit[][] => {
    const pages: FlattenedUnit[][] = [[]];
    let currentHeight = 0;

    for (const unit of units) {
        if (unit.kind === 'pageBreak') {
            if (pages[pages.length - 1].length > 0) {
                pages.push([]);
                currentHeight = 0;
            }

            continue;
        }

        if (currentHeight > 0 && currentHeight + unit.height > budgets.continuation) {
            pages.push([]);
            currentHeight = 0;
        }

        pages[pages.length - 1].push(unit);
        currentHeight += unit.height;
    }

    let lastPage = pages[pages.length - 1];

    while (sumHeight(lastPage) > budgets.last && lastPage.length > 1) {
        const moved = lastPage.pop();

        if (!moved) {
            break;
        }

        pages.push([moved]);
        lastPage = pages[pages.length - 1];
    }

    return pages;
};

/** Empacota e já devolve o HTML pronto de cada página. */
export const paginateDocumentToHtml = (units: FlattenedUnit[], budgets: PageBudgets): string[] =>
    paginateDocument(units, budgets).map(renderPageHtml);
