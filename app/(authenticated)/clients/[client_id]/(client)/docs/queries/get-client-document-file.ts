import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

/**
 * Metadados necessários para servir o arquivo. O `clientId` entra no
 * `where` para que um id de documento de outro cliente simplesmente não
 * seja encontrado, em vez de vazar a existência do registro.
 */
export const getClientDocumentFile = cache(
  async (clientId: string, documentId: string) => {
    await verifyAuth();

    const document = await prisma.clientDocument.findUnique({
      where: {
        id: documentId,
        clientId,
        deletedAt: null,
      },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
        storageKey: true,
      },
    });

    return document;
  },
);
