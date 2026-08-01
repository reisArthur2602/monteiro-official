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

type UpdateClientInput = {
  clientId: string;
  values: ClientFormInput;
};

export const updateClient = async (
  input: UpdateClientInput,
): Promise<ActionResult<null>> => {
  try {
    await verifyAuth();

    const parsed = clientFormSchema.safeParse(input.values);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    // Autorização por recurso: só clientes vivos podem ser alterados, e o
    // id vem da rota, nunca de um campo do formulário.
    const client = await prisma.client.findFirst({
      where: {
        id: input.clientId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!client) {
      return {
        ok: false,
        message: "Cliente não encontrado ou acesso negado",
      };
    }

    const values = parsed.data;

    // O documento é único: mudá-lo para o de outro cliente precisa virar
    // erro de campo, não erro de banco.
    const documentOwner = await prisma.client.findUnique({
      where: { document: values.document },
      select: { id: true, deletedAt: true },
    });

    if (documentOwner && documentOwner.id !== client.id) {
      return {
        ok: false,
        message: "Já existe um cliente com este documento",
        errors: {
          document: [
            documentOwner.deletedAt
              ? "Este documento pertence a um cliente excluído"
              : "Já existe um cliente com este documento",
          ],
        },
      };
    }

    const address = buildClientAddressData(values);

    await prisma.$transaction(async (tx) => {
      await tx.client.update({
        where: { id: client.id },
        data: buildClientScalarData(values),
      });

      await persistClientAddress(tx, client.id, address);
    });

    revalidatePath("/clients");
    revalidatePath("/clients/upsert");

    return {
      ok: true,
      message: "Cliente atualizado com sucesso",
      data: null,
    };
  } catch (error) {
    console.error("[updateClient]", error);

    return {
      ok: false,
      message: "Não foi possível atualizar o cliente",
    };
  }
};
