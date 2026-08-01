import { Folder, FolderOpen, HardDrive } from 'lucide-react';
import Link from 'next/link';

import { ProcessDocumentRole } from '@/app/generated/prisma/enums';
import { cn } from '@/lib/utils';

import { formatFileSize } from '../../../../../(client)/docs/utils/format-file-size';
import { summarizeCaseDocuments } from '../queries/summarize-case-documents';
import type { ListCaseDocumentsParams } from '../schemas/list-case-documents-params-schema';
import { buildCaseDocsFilterHref } from '../utils/build-case-docs-href';
import { processDocumentRoleFolderLabels } from '../utils/case-document-labels';

type FolderLinkProps = {
    href: string;
    label: string;
    count: number;
    isActive: boolean;
    isRoot?: boolean;
};

const FolderLink = ({ href, label, count, isActive, isRoot }: FolderLinkProps) => {
    const Icon = isRoot || isActive ? FolderOpen : Folder;

    return (
        <Link
            href={href}
            scroll={false}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                'grid min-h-9 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-transparent px-2 text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground',
                isActive && 'border-primary/20 bg-accent text-foreground'
            )}
        >
            <Icon className="size-4 text-chart-4" aria-hidden="true" />

            <span className="truncate text-xs font-semibold">{label}</span>

            <small className="font-mono text-[9px] text-muted-foreground">{count}</small>
        </Link>
    );
};

type CaseDocsFoldersProps = {
    clientId: string;
    caseId: string;
    params: ListCaseDocumentsParams;
};

/**
 * Árvore de pastas do repositório. As pastas são os papéis do documento
 * dentro do processo, não registros — por isso não há criar, renomear nem
 * mover pasta, e a estrutura é plana.
 *
 * Pastas vazias ficam fora da lista para não virar filtro que não leva a
 * lugar nenhum; a única exceção é a pasta selecionada, que precisa
 * continuar visível para o usuário sair dela.
 */
export const CaseDocsFolders = async ({ clientId, caseId, params }: CaseDocsFoldersProps) => {
    const { total, countsByRole, totalBytes } = await summarizeCaseDocuments(clientId, caseId);

    const folders = Object.values(ProcessDocumentRole).filter(
        (role) => countsByRole[role] > 0 || role === params.role
    );

    return (
        <aside className="overflow-hidden rounded-xl border bg-card lg:sticky lg:top-32">
            <header className="border-b px-4 py-3">
                <h2 className="text-sm font-semibold">Pastas</h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                    Estrutura do repositório do processo.
                </p>
            </header>

            <nav aria-label="Pastas do processo" className="grid gap-1.5 p-2.5">
                <FolderLink
                    href={buildCaseDocsFilterHref(clientId, caseId, { search: params.search })}
                    label="Todos os documentos"
                    count={total}
                    isActive={!params.role}
                    isRoot
                />

                {folders.map((role) => (
                    <FolderLink
                        key={role}
                        href={buildCaseDocsFilterHref(clientId, caseId, {
                            search: params.search,
                            role,
                        })}
                        label={processDocumentRoleFolderLabels[role]}
                        count={countsByRole[role]}
                        isActive={params.role === role}
                    />
                ))}
            </nav>

            <div className="m-2.5 grid gap-1.5 rounded-lg border bg-muted p-3">
                <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <HardDrive className="size-3.5" aria-hidden="true" />
                        Armazenamento
                    </span>

                    <strong className="font-mono text-[11px]">{formatFileSize(totalBytes)}</strong>
                </div>

                <small className="text-[10px] text-muted-foreground">
                    {total === 1 ? '1 arquivo vinculado' : `${total} arquivos vinculados`} ao
                    processo.
                </small>
            </div>
        </aside>
    );
};
