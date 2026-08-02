"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ClientStatus } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";

import { CLIENTS_PATH } from "../../utils/build-clients-href";
import { createClient } from "../actions/create-client";
import { updateClient } from "../actions/update-client";
import type { AssignableUser } from "../queries/list-assignable-users";
import {
  type ClientFormInput,
  type ClientFormValues,
  clientFormSchema,
} from "../schemas/client-form-schema";
import { ClientAddressPanel } from "./client-address-panel";
import { ClientContactPanel } from "./client-contact-panel";
import { ClientDeactivateMenu } from "./client-deactivate-menu";
import { ClientIdentificationPanel } from "./client-identification-panel";
import { ClientMobileActions } from "./client-mobile-actions";
import { ClientNotesPanel } from "./client-notes-panel";
import { ClientSummaryCard } from "./client-summary-card";

const FORM_ID = "client-upsert-form";

type ClientUpsertScreenProps = {
  mode: "create" | "edit";
  clientId?: string;
  initialValues: ClientFormInput;
  users: AssignableUser[];
};

export const ClientUpsertScreen = ({
  mode,
  clientId,
  initialValues,
  users,
}: ClientUpsertScreenProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Os três genéricos separam o que o formulário guarda (strings) do que a
  // validação entrega (campos opcionais já normalizados).
  const form = useForm<ClientFormInput, unknown, ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // `form` já é o valor de retorno de `useForm`, não algo consumido via
  // `useFormContext` — por isso `status` pode ser lido aqui em cima, antes
  // do `FormProvider`, sem precisar mover o cabeçalho para dentro dele.
  const status = useWatch({ control: form.control, name: "status" });
  const isInactive = status === ClientStatus.INATIVO;

  const handleSubmit = async (values: ClientFormValues) => {
    setIsPending(true);

    try {
      const result =
        mode === "edit" && clientId
          ? await updateClient({ clientId, values })
          : await createClient(values);

      if (!result.ok) {
        // Erros por campo vindos do servidor são reassociados ao campo
        // correspondente, não só jogados no toast.
        for (const [field, messages] of Object.entries(result.errors ?? {})) {
          const message = messages?.[0];

          if (message) {
            form.setError(field as keyof ClientFormInput, { message });
          }
        }

        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      // Só navega depois do sucesso, para não descartar o que foi digitado.
      router.push(CLIENTS_PATH);
    } catch {
      toast.error("Não foi possível concluir a operação");
    } finally {
      setIsPending(false);
    }
  };

  const handleDeactivate = () => {
    form.setValue("status", ClientStatus.INATIVO, { shouldDirty: true });

    toast.info("Status alterado para inativo. Salve para aplicar a mudança.");
  };

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="grid max-w-2xl gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Relacionamento
          </span>

          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            {mode === "edit" ? "Editar cliente" : "Novo cliente"}
          </h1>

          <p className="text-muted-foreground">
            Registre os dados principais, endereço e responsável pelo
            relacionamento.
          </p>
        </div>

        <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
          <Button asChild variant="outline">
            <Link href={CLIENTS_PATH}>Cancelar</Link>
          </Button>

          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending
              ? "Salvando…"
              : mode === "edit"
                ? "Salvar alterações"
                : "Salvar cliente"}
          </Button>

          {mode === "edit" ? (
            <ClientDeactivateMenu
              isInactive={isInactive}
              isPending={isPending}
              onDeactivate={handleDeactivate}
            />
          ) : null}
        </div>
      </header>

      <FormProvider {...form}>
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
          className="grid items-start gap-5 lg:grid-cols-[2fr_1fr]"
        >
          <div className="grid gap-4">
            <ClientIdentificationPanel />
            <ClientContactPanel users={users} />
            <ClientAddressPanel />
            <ClientNotesPanel />
          </div>

          <aside className="grid gap-4 lg:sticky lg:top-20">
            <ClientSummaryCard users={users} />
          </aside>
        </form>
      </FormProvider>

      <ClientMobileActions
        formId={FORM_ID}
        mode={mode}
        isPending={isPending}
        isInactive={isInactive}
        onDeactivate={handleDeactivate}
      />
    </div>
  );
};
