"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type SendDocumentEmailInput,
  sendDocumentEmailSchema,
} from "@/schemas/document-email/send-document-email-schema";
import type { ActionResult } from "@/utils";

type DocumentEmailDialogProps = {
  /** Nome do documento, usado na descrição do dialog ("...antes de enviar 'X'"). */
  documentName: string;
  defaultValues: SendDocumentEmailInput;
  /** Mostra a dica de onde o "Para" veio, quando preenchido do cadastro. */
  hasClientEmail: boolean;
  sendAction: (values: SendDocumentEmailInput) => Promise<ActionResult<null>>;
  /** Ex.: `"w-full"`, quando o gatilho precisa acompanhar um grupo de botões empilhados. */
  triggerClassName?: string;
};

/**
 * Dialog de envio por e-mail de um documento — qualquer um: modelo
 * preenchido, ficha de atendimento, futuros relatórios. O formulário é
 * sempre o mesmo (Para/Cc/Assunto/Mensagem); só o que muda entre
 * consumidores é o valor padrão dos campos e a Server Action chamada ao
 * enviar.
 */
export const DocumentEmailDialog = ({
  documentName,
  defaultValues,
  hasClientEmail,
  sendAction,
  triggerClassName,
}: DocumentEmailDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendDocumentEmailInput>({
    resolver: zodResolver(sendDocumentEmailSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: sendAction,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Não foi possível enviar o e-mail");
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset(defaultValues);
        }

        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" className={triggerClassName}>
          <Send aria-hidden="true" />
          Enviar por e-mail
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100vh-2.5rem)] overflow-y-auto sm:max-w-lg">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Enviar documento por e-mail</DialogTitle>

            <DialogDescription>
              Revise o destinatário e a mensagem antes de enviar "{documentName}
              ".
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={Boolean(errors.to)}>
              <FieldLabel htmlFor="document-email-to">Para</FieldLabel>

              <Input
                id="document-email-to"
                type="email"
                aria-invalid={Boolean(errors.to)}
                {...register("to")}
              />

              {hasClientEmail ? (
                <FieldDescription>E-mail principal do cliente</FieldDescription>
              ) : null}

              {errors.to ? <FieldError>{errors.to.message}</FieldError> : null}
            </Field>

            <Field data-invalid={Boolean(errors.cc)}>
              <FieldLabel htmlFor="document-email-cc">
                Cc{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </FieldLabel>

              <Input
                id="document-email-cc"
                type="email"
                placeholder="outro@email.com.br"
                aria-invalid={Boolean(errors.cc)}
                {...register("cc")}
              />

              {errors.cc ? <FieldError>{errors.cc.message}</FieldError> : null}
            </Field>

            <Field data-invalid={Boolean(errors.subject)}>
              <FieldLabel htmlFor="document-email-subject">Assunto</FieldLabel>

              <Input
                id="document-email-subject"
                aria-invalid={Boolean(errors.subject)}
                {...register("subject")}
              />

              {errors.subject ? (
                <FieldError>{errors.subject.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.message)}>
              <FieldLabel htmlFor="document-email-message">Mensagem</FieldLabel>

              <Textarea
                id="document-email-message"
                rows={7}
                aria-invalid={Boolean(errors.message)}
                {...register("message")}
              />

              {errors.message ? (
                <FieldError>{errors.message.message}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Enviando..." : "Enviar e-mail"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
