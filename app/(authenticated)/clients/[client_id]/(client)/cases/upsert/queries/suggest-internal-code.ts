import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/utils/auth";

const SEQUENCE_LENGTH = 4;

/**
 * Próximo código interno livre no padrão `PROC-<ano>-<sequência>`.
 *
 * É apenas uma sugestão para o formulário: o campo continua editável e o
 * índice único de `internalCode` é quem garante a unicidade real, já que
 * dois cadastros simultâneos podem receber a mesma sugestão.
 *
 * A busca ignora `deletedAt` de propósito — o índice único também alcança
 * registros excluídos logicamente, então reaproveitar um código gravado
 * antes daria colisão.
 */
export const suggestInternalCode = cache(async () => {
  await verifyAuth();

  const prefix = `PROC-${new Date().getFullYear()}-`;

  const last = await prisma.process.findFirst({
    where: { internalCode: { startsWith: prefix } },
    select: { internalCode: true },
    orderBy: { internalCode: "desc" },
  });

  const lastSequence = last
    ? Number.parseInt(last.internalCode.slice(prefix.length), 10)
    : 0;

  const nextSequence = Number.isFinite(lastSequence) ? lastSequence + 1 : 1;

  return `${prefix}${String(nextSequence).padStart(SEQUENCE_LENGTH, "0")}`;
});
