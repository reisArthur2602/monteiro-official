import { Download } from "lucide-react";

import { ClientDocumentStatus } from "@/app/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { formatUpdatedAt } from "../../../utils/format-updated-at";
import { formatCivilDate } from "../../utils/format-date";
import type { ClientDocumentListItem } from "../queries/list-client-documents";
import { buildDocumentDownloadHref } from "../utils/build-docs-href";
import {
  clientDocumentCategoryLabels,
  clientDocumentVisibilityBadgeClasses,
  clientDocumentVisibilityLabels,
} from "../utils/document-labels";
import { DocumentDeleteDialog } from "./document-delete-dialog";
import { DocumentFolderPreview } from "./document-folder-preview";

type DocumentCardProps = {
  clientId: string;
  document: ClientDocumentListItem;
  /** Alterna a leve rotação da folha do documento, como no protótipo. */
  index: number;
};

export const DocumentCard = ({
  clientId,
  document,
  index,
}: DocumentCardProps) => {
  const isArchived = document.status === ClientDocumentStatus.ARQUIVADO;

  return (
    <article
      className={cn(
        "grid min-h-95 grid-rows-[184px_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border bg-card shadow-xs transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm",
        isArchived && "opacity-70",
      )}
    >
      <div
        className="relative overflow-hidden border-b bg-muted p-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 76% 12%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 28%)",
        }}
      >
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          {isArchived ? (
            <Badge variant="outline" className="bg-card font-bold">
              Arquivado
            </Badge>
          ) : null}

          <Badge
            variant="outline"
            className={cn(
              "gap-1.5 font-bold",
              clientDocumentVisibilityBadgeClasses[document.visibility],
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {clientDocumentVisibilityLabels[document.visibility]}
          </Badge>
        </div>

        <DocumentFolderPreview
          category={document.category}
          originalName={document.originalName}
          sizeBytes={document.sizeBytes}
          rotateAlternate={index % 2 === 1}
        />
      </div>

      <div className="grid content-start gap-2.5 p-4">
        <span className="font-mono text-[9px] font-semibold tracking-wider text-primary uppercase">
          {clientDocumentCategoryLabels[document.category]}
        </span>

        <h3 className="line-clamp-2 font-heading text-xl leading-tight font-semibold tracking-tight">
          {document.title}
        </h3>

        {document.description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {document.description}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-muted-foreground">
          {document.documentDate ? (
            <span>Documento de {formatCivilDate(document.documentDate)}</span>
          ) : null}

          <span>Enviado por {document.uploadedBy.name}</span>
        </div>

        {document.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {document.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex h-5.5 items-center rounded-full border bg-muted px-2 text-[8px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <footer className="flex min-h-13 items-center justify-between gap-3 border-t px-3.5 text-[10px] text-muted-foreground">
        <span className="truncate">
          Atualizado {formatUpdatedAt(document.updatedAt)}
        </span>

        <div className="flex shrink-0 items-center">
          {/*
            Link direto para o Route Handler: o download é uma navegação do
            próprio navegador, então o arquivo nunca passa pelo JavaScript da
            página.
          */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <a
              href={buildDocumentDownloadHref(clientId, document.id)}
              aria-label={`Baixar ${document.title}`}
            >
              <Download aria-hidden="true" />
            </a>
          </Button>

          <DocumentDeleteDialog
            clientId={clientId}
            documentId={document.id}
            title={document.title}
          />
        </div>
      </footer>
    </article>
  );
};
