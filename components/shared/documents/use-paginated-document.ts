"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { A4_HEIGHT_MM, A4_WIDTH_MM, type DocumentPageSettings } from "./document-types";
import {
    type FlattenedUnit,
    type PageBudgets,
    paginateDocumentToHtml,
} from "./paginate-document";

/**
 * `px` é uma unidade de referência física fixa em CSS (96px = 1in =
 * 25.4mm), independente do DPI real do dispositivo — não precisa de
 * nenhuma sondagem no DOM.
 */
const MM_TO_PX = 96 / 25.4;
const mmToPx = (mm: number) => mm * MM_TO_PX;

/**
 * Extrai as unidades medíveis dos filhos diretos do container.
 *
 * `<p>` e `<div data-page-break>` viram uma unidade cada; `<ul>`/`<ol>`
 * são expandidos em uma unidade por `<li>`, para o empacotador poder
 * dividir a lista sem cortar um item ao meio. A quebra manual não carrega
 * altura nem HTML próprio — ela só existe aqui como sinal de corte forçado;
 * a linha tracejada que ela desenha no editor não faz sentido depois que
 * páginas de verdade existem.
 */
const flattenMeasuredUnits = (container: HTMLElement): FlattenedUnit[] => {
    const units: FlattenedUnit[] = [];
    let listId = 0;

    for (const child of Array.from(container.children)) {
        if (!(child instanceof HTMLElement)) {
            continue;
        }

        if (child.hasAttribute("data-page-break")) {
            units.push({ kind: "pageBreak" });
            continue;
        }

        if (child.tagName === "UL" || child.tagName === "OL") {
            const tag = child.tagName === "UL" ? "ul" : "ol";
            const currentListId = listId;
            listId += 1;

            const items = Array.from(child.children).filter(
                (item): item is HTMLElement =>
                    item instanceof HTMLElement && item.tagName === "LI",
            );

            items.forEach((item, itemIndex) => {
                const marginBottom = Number.parseFloat(getComputedStyle(item).marginBottom) || 0;

                units.push({
                    kind: "content",
                    html: item.outerHTML,
                    height: item.offsetHeight + marginBottom,
                    list: { tag, listId: currentListId, itemIndex },
                });
            });

            continue;
        }

        const marginBottom = Number.parseFloat(getComputedStyle(child).marginBottom) || 0;

        units.push({
            kind: "content",
            html: child.outerHTML,
            height: child.offsetHeight + marginBottom,
        });
    }

    return units;
};

export type UsePaginatedDocumentOptions = {
    /** HTML já com as variáveis resolvidas — o mesmo que uma folha única
     *  receberia. */
    html: string;
    page: DocumentPageSettings;
    /** Alturas em px de sondas já renderizadas pelo componente chamador —
     *  este hook não sabe montar `InstitutionalHeader`/`InstitutionalFooter`/
     *  `DocumentSignatures`, só reserva o espaço que elas ocupam. */
    headerHeightPx: number;
    footerHeightPx: number;
    signaturesHeightPx: number;
};

/**
 * Divide o HTML do documento em páginas A4, recalculando quando o
 * conteúdo, a formatação da folha ou as alturas reservadas mudam.
 *
 * A geometria é física (mm), então redimensionar a janela do navegador não
 * entra como gatilho — o número de páginas não depende do viewport. Zoom
 * também não: a paginação é calculada em dimensões reais, e quem exibe o
 * resultado é quem aplica o `transform: scale()`.
 */
export const usePaginatedDocument = ({
    html,
    page,
    headerHeightPx,
    footerHeightPx,
    signaturesHeightPx,
}: UsePaginatedDocumentOptions): string[] => {
    const [pages, setPages] = useState<string[]>(() => [html]);

    // Criado uma vez, fora da árvore visível — nunca acompanha o `render`.
    const containerRef = useRef<HTMLDivElement | null>(null);

    if (typeof document !== "undefined" && containerRef.current === null) {
        const el = document.createElement("div");

        el.className = "legal-document";
        el.style.position = "absolute";
        el.style.left = "-9999px";
        el.style.top = "0";
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";

        containerRef.current = el;
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

            const isLandscape = page.orientation === "LANDSCAPE";
            const pageWidthMm = isLandscape ? A4_HEIGHT_MM : A4_WIDTH_MM;
            const pageHeightMm = isLandscape ? A4_WIDTH_MM : A4_HEIGHT_MM;
            const contentWidthMm = pageWidthMm - page.marginLeft - page.marginRight;

            container.style.width = `${mmToPx(contentWidthMm)}px`;
            container.innerHTML = html;

            const units = flattenMeasuredUnits(container);

            const usableHeightPx = mmToPx(pageHeightMm - page.marginTop - page.marginBottom);
            const headerReserve = page.showInstitutionalHeader ? headerHeightPx : 0;
            const footerReserve = page.showInstitutionalFooter ? footerHeightPx : 0;

            const budgets: PageBudgets = {
                continuation: usableHeightPx - headerReserve,
                last: usableHeightPx - headerReserve - footerReserve - signaturesHeightPx,
            };

            setPages(paginateDocumentToHtml(units, budgets));
        };

        recompute();

        // A fonte "Source Serif 4" pode terminar de carregar depois da
        // primeira medição — sem isto, a paginação ficaria calculada com as
        // métricas da fonte de fallback.
        document.fonts?.ready?.then(recompute);
    }, [html, page, headerHeightPx, footerHeightPx, signaturesHeightPx]);

    return pages;
};
