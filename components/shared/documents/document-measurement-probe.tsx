import type { PropsWithChildren, Ref } from "react";

type DocumentMeasurementProbeProps = PropsWithChildren<{
  ref: Ref<HTMLDivElement>;
}>;

/**
 * Cópia invisível de uma folha, montada só para medir alturas reais antes de
 * decidir a paginação.
 *
 * Precisa ficar no fluxo do documento (e não em `display: none`) para que o
 * navegador aplique tipografia, quebras de linha e margens de verdade — daí
 * o deslocamento para fora da tela em vez de simplesmente esconder. Sai da
 * árvore de acessibilidade e da impressão porque não é conteúdo, é régua.
 *
 * O que a sonda desenha é uma folha real, com os mesmos filhos diretos e na
 * mesma ordem — é isso que permite localizar cada parte pela posição, sem
 * marcar nada. Marcar via `cloneElement` não funcionaria: quando o bloco é
 * um componente, o atributo iria parar nas props dele em vez de no elemento
 * do DOM, e a medição casaria alturas com os blocos errados.
 */
export const DocumentMeasurementProbe = ({
  ref,
  children,
}: DocumentMeasurementProbeProps) => (
  <div
    ref={ref}
    aria-hidden="true"
    className="pointer-events-none absolute top-0 left-[-9999px] opacity-0 print:hidden"
  >
    {children}
  </div>
);
