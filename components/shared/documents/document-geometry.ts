import {
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  type DocumentPageSettings,
} from "./document-types";

/**
 * Geometria física da folha, compartilhada por todos os formatos de
 * documento paginado.
 *
 * `px` é uma unidade de referência fixa em CSS (96px = 1in = 25.4mm),
 * independente do DPI real do dispositivo — a conversão não precisa de
 * nenhuma sondagem no DOM. É por isso que a paginação não muda com o
 * tamanho da janela nem com o zoom da prévia: o cálculo é sempre sobre a
 * folha real, não sobre o que está na tela.
 */

export const MM_TO_PX = 96 / 25.4;

export const mmToPx = (mm: number) => mm * MM_TO_PX;

export const getPageSizeMm = (page: DocumentPageSettings) => {
  const isLandscape = page.orientation === "LANDSCAPE";

  return {
    widthMm: isLandscape ? A4_HEIGHT_MM : A4_WIDTH_MM,
    heightMm: isLandscape ? A4_WIDTH_MM : A4_HEIGHT_MM,
  };
};

/** Largura em px da área de conteúdo, já descontadas as margens. */
export const getContentWidthPx = (page: DocumentPageSettings) =>
  mmToPx(getPageSizeMm(page).widthMm - page.marginLeft - page.marginRight);

/** Altura em px da área de conteúdo, já descontadas as margens. */
export const getContentHeightPx = (page: DocumentPageSettings) =>
  mmToPx(getPageSizeMm(page).heightMm - page.marginTop - page.marginBottom);

/**
 * Fator de escala aplicado por um `transform` em algum ancestral.
 *
 * A prévia desenha o documento dentro de um `transform: scale()` para o
 * zoom, e `getBoundingClientRect()` devolve medidas já escaladas. Descobrir
 * o fator no próprio elemento medido — comparando a caixa renderizada com a
 * caixa de layout — dispensa qualquer acordo entre o paginador e quem
 * controla o zoom.
 */
export const getRenderScale = (element: HTMLElement) => {
  const layoutWidth = element.offsetWidth;

  if (layoutWidth <= 0) {
    return 1;
  }

  const scale = element.getBoundingClientRect().width / layoutWidth;

  return scale > 0 ? scale : 1;
};

/**
 * Espaço vertical total que um elemento consome na folha: margem superior +
 * caixa + margem inferior.
 *
 * As folhas usam `display: flex; flex-direction: column`, e margens de itens
 * flex nunca colapsam — nem entre irmãos, nem com o contêiner. Por isso
 * somar as duas margens à altura da caixa dá exatamente o espaço ocupado,
 * sem nenhum caso especial de colapso de margem.
 *
 * A altura vem de `getBoundingClientRect()`, e não de `offsetHeight`, porque
 * este último arredonda para pixel inteiro: até meio pixel de erro por
 * bloco, que se acumula ao longo da folha e acabaria empurrando conteúdo
 * para fora do pé da página.
 */
export const measureOuterHeight = (element: HTMLElement, scale = 1) => {
  const style = getComputedStyle(element);
  const marginTop = Number.parseFloat(style.marginTop) || 0;
  const marginBottom = Number.parseFloat(style.marginBottom) || 0;

  return (
    marginTop + element.getBoundingClientRect().height / scale + marginBottom
  );
};
