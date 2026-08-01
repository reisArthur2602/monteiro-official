import type { ClientDocumentCategory } from "@/app/generated/prisma/enums";
import { cn } from "@/lib/utils";

import {
  clientDocumentCategoryLabels,
  clientDocumentFolderTokens,
} from "../utils/document-labels";
import { formatFileExtension, formatFileSize } from "../utils/format-file-size";

type DocumentFolderPreviewProps = {
  category: ClientDocumentCategory;
  originalName: string;
  sizeBytes: number;
  rotateAlternate: boolean;
};

/**
 * Ilustração de pasta com a folha do documento espiando por cima, no
 * espírito do protótipo — só que com os tokens de cor do Design System
 * (`primary`/`chart-1..5`) no lugar da paleta própria do protótipo.
 */
export const DocumentFolderPreview = ({
  category,
  originalName,
  sizeBytes,
  rotateAlternate,
}: DocumentFolderPreviewProps) => {
  const tokens = clientDocumentFolderTokens[category];
  const extension = formatFileExtension(originalName);

  return (
    <div className="relative mx-auto h-[128px] w-[178px] drop-shadow-[0_14px_16px_rgba(11,18,32,0.16)]">
      <div
        className={cn(
          "absolute inset-x-0 top-3.5 bottom-2.5 rounded-t-[10px] rounded-b-lg border",
          tokens.back,
        )}
      />

      <span
        className={cn(
          "absolute top-0 left-0 flex h-6 max-w-[112px] items-center overflow-hidden rounded-t-md px-2.5 font-mono text-[7px] font-semibold tracking-wide uppercase",
          tokens.tab,
        )}
      >
        <span className="truncate">
          {clientDocumentCategoryLabels[category]}
        </span>
      </span>

      <div
        className={cn(
          "absolute top-1.5 left-8 grid h-[92px] w-[108px] gap-1 rounded-[3px] border border-[#d8ddd9] bg-white p-2.5 font-heading text-[#18201d] shadow-[0_7px_14px_rgba(11,18,32,0.12)]",
          rotateAlternate ? "rotate-[2deg]" : "-rotate-[2deg]",
        )}
      >
        <span
          className={cn(
            "font-mono text-[9px] font-bold",
            tokens.accentText,
          )}
        >
          {extension}
        </span>

        <span className="h-[3px] w-full rounded-full bg-[#d9dfdc]" />
        <span className="h-[3px] w-[78%] rounded-full bg-[#d9dfdc]" />
        <span className="h-[3px] w-[55%] rounded-full bg-[#d9dfdc]" />
      </div>

      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 grid h-[68px] content-end gap-0.5 rounded-t-md rounded-b-[10px] border px-3.5 py-2.5 shadow-[inset_0_1px_rgba(255,255,255,0.28)]",
          tokens.front,
        )}
      >
        <span className="font-mono text-[9px] font-semibold">
          {extension} · {formatFileSize(sizeBytes)}
        </span>
      </div>
    </div>
  );
};
