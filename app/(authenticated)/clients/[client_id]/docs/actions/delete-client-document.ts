"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

type DeleteClientDocumentInput = {
  clientId: string;
  documentId: string;
};

/**
 * Exclusão lógica: só marca `deletedAt`. O arquivo permanece no FTP para
 * que o registro continue restaurável, conforme a política de soft delete
 * do projeto.
 */
export const deleteClientDocument = async (
  input: DeleteClientDocumentInput,
): Promise<ActionResult<null>> => {
  try {
    const user = await verifyAuth();

    // O `clientId` entra no `where` para que um id de outro cliente não
    // seja encontrado, em vez de revelar que o documento existe.
    const existing = await prisma.clientDocument.findFirst({
      where: {
        id: input.documentId,
        clientId: input.clientId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existing) {
      return {
        ok: false,
        message: "Documento não encontrado ou acesso negado",
      };
    }

    await prisma.clientDocument.update({
      where: { id: existing.id },
      data: {
        deletedAt: new Date(),
        updatedById: user.id,
      },
    });

    revalidatePath(`/clients/${input.clientId}/docs`);
    revalidatePath(`/clients/${input.clientId}`);

    return {
      ok: true,
      message: "Documento excluído com sucesso",
      data: null,
    };
  } catch (error) {
    console.error("[deleteClientDocument]", error);

    return {
      ok: false,
      message: "Não foi possível excluir o documento",
    };
  }
};
