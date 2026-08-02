"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { DocumentContent } from "./document-content";
import { DocumentSignatures } from "./document-signatures";
import type { DocumentPageSettings, DocumentSignature, OfficeProfile } from "./document-types";
import { InstitutionalFooter } from "./institutional-footer";
import { InstitutionalHeader } from "./institutional-header";
import { LegalDocumentPage } from "./legal-document-page";
import { usePaginatedDocument } from "./use-paginated-document";

type LegalDocumentPaginatedFrameProps = {
    office: OfficeProfile;
    page: DocumentPageSettings;
    signatures: DocumentSignature[];
    html: string;
    variableValues?: Record<string, string>;
    className?: string;
};

type MeasuredHeights = {
    header: number;
    footer: number;
    signatures: number;
};

const EMPTY_MEASUREMENT: MeasuredHeights = { header: 0, footer: 0, signatures: 0 };

/**
 * Mede um bloco pelo seletor real, não por um wrapper — a página usa
 * `display: flex; flex-direction: column`, que já impede colapso de
 * margem entre irmãos, mas medir o elemento de verdade (em vez de um
 * `<div>` em volta dele) elimina qualquer ambiguidade mesmo assim.
 */
const measureBlock = (
    root: HTMLElement | null,
    selector: string,
    marginSide: 'marginTop' | 'marginBottom'
) => {
    const el = root?.querySelector<HTMLElement>(selector);

    if (!el) {
        return 0;
    }

    const margin = Number.parseFloat(getComputedStyle(el)[marginSide]) || 0;

    return el.offsetHeight + margin;
};

/**
 * Documento institucional completo, dividido em quantas folhas A4 o
 * conteúdo exigir.
 *
 * Mesmo contrato de props que `LegalDocumentFrame`, que continua existindo
 * sem paginação para quem não precisa dela — relatórios, fichas e
 * procurações futuras. Cabeçalho institucional repete em toda página;
 * rodapé e assinaturas só na última, como uma petição continuada de
 * verdade.
 */
export const LegalDocumentPaginatedFrame = ({
    office,
    page,
    signatures,
    html,
    variableValues,
    className,
}: LegalDocumentPaginatedFrameProps) => {
    const probeRef = useRef<HTMLDivElement | null>(null);
    const [measured, setMeasured] = useState<MeasuredHeights>(EMPTY_MEASUREMENT);

    // O efeito só lê `probeRef.current` (o DOM já renderizado pela sonda
    // abaixo), nunca `page`/`office`/`signatures` diretamente — por isso a
    // análise estática do linter os considera dispensáveis. Mas são
    // exatamente eles que mudam o que a sonda desenha; sem essas
    // dependências, a medição só rodaria uma vez, no mount, e nunca
    // acompanharia uma mudança de margem, orientação ou assinatura
    // adicionada depois. `variableValues` fica de fora de propósito: nomes
    // resolvidos têm largura variável, mas a altura de uma linha de
    // assinatura não depende do texto, só da fonte.
    // biome-ignore lint/correctness/useExhaustiveDependencies: ver comentário acima.
    useLayoutEffect(() => {
        setMeasured({
            header: measureBlock(probeRef.current, '.legal-document__header', 'marginBottom'),
            footer: measureBlock(probeRef.current, '.legal-document__footer', 'marginTop'),
            signatures: measureBlock(
                probeRef.current,
                '.legal-document__signatures',
                'marginTop'
            ),
        });
    }, [page, office, signatures]);

    const pages = usePaginatedDocument({
        html,
        page,
        headerHeightPx: measured.header,
        footerHeightPx: measured.footer,
        signaturesHeightPx: measured.signatures,
    });

    return (
        <div data-paginated-document-root className="flex flex-col items-center gap-8">
            {pages.map((pageHtml, index) => {
                const isLastPage = index === pages.length - 1;

                return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: `pages` é regenerada inteira a cada recálculo, nunca reordenada — o índice é a própria identidade da página.
                    <LegalDocumentPage key={index} page={page} className={className}>
                        {page.showInstitutionalHeader ? (
                            <InstitutionalHeader office={office} />
                        ) : null}

                        <DocumentContent html={pageHtml} />

                        {isLastPage ? (
                            <DocumentSignatures
                                signatures={signatures}
                                variableValues={variableValues}
                            />
                        ) : null}

                        {isLastPage && page.showInstitutionalFooter ? (
                            <InstitutionalFooter office={office} city={page.city} />
                        ) : null}
                    </LegalDocumentPage>
                );
            })}

            {/*
        Sonda invisível, só para medir a altura real do cabeçalho, do
        rodapé e do bloco de assinaturas nesta formatação de folha — o
        paginador precisa saber quanto espaço cada um reserva antes de
        decidir quanto conteúdo cabe em cada página.
      */}
            <div
                ref={probeRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-[-9999px] opacity-0 print:hidden"
            >
                <LegalDocumentPage page={page}>
                    <InstitutionalHeader office={office} />
                    <InstitutionalFooter office={office} city={page.city} />
                    <DocumentSignatures signatures={signatures} variableValues={variableValues} />
                </LegalDocumentPage>
            </div>
        </div>
    );
};
