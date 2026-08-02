"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

import {
  type ClientFormInput,
  clientFormSchema,
} from "../schemas/client-form-schema";
import {
  buildClientAddressData,
  buildClientScalarData,
  persistClientAddress,
} from "../utils/build-client-data";

export type CreateClientResult = {
  clientId: string;
};

export const createClient = async (
  input: ClientFormInput,
): Promise<ActionResult<CreateClientResult | null>> => {
  try {
    await verifyAuth();

    const parsed = clientFormSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const values = parsed.data;
    const scalars = buildClientScalarData(values);
    const address = buildClientAddressData(values);

    // `document` é único e a exclusão é lógica, então o documento de um
    // cliente já excluído continua ocupando o índice. Antes de inserir,
    // verificamos se é o caso de restaurar aquele registro.
    const existing = await prisma.client.findUnique({
      where: { document: values.document },
      select: { id: true, deletedAt: true },
    });

    if (existing && !existing.deletedAt) {
      return {
        ok: false,
        message: "Já existe um cliente com este documento",
        errors: { document: ["Já existe um cliente com este documento"] },
      };
    }

    // Cliente e endereço precisam ir juntos: um endereço órfão ou um
    // cliente restaurado com o endereço antigo seriam estados inválidos.
    const client = await prisma.$transaction(async (tx) => {
      const saved = existing
        ? await tx.client.update({
            where: { id: existing.id },
            data: { ...scalars, deletedAt: null },
            select: { id: true },
          })
        : await tx.client.create({
            data: scalars,
            select: { id: true },
          });

      await persistClientAddress(tx, saved.id, address);

      return saved;
    });

    revalidatePath("/clients");

    return {
      ok: true,
      message: existing
        ? "Cliente restaurado com os novos dados"
        : "Cliente criado com sucesso",
      data: { clientId: client.id },
    };
  } catch (error) {
    console.error("[createClient]", error);

    return {
      ok: false,
      message: "Não foi possível criar o cliente",
    };
  }
};
