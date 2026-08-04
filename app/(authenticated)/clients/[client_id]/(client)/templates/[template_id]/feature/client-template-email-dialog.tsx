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

import { sendClientTemplateEmail } from "../actions/send-client-template-email";
import {
  type SendClientTemplateEmailInput,
  sendClientTemplateEmailSchema,
} from "../schemas/send-client-template-email-schema";

type ClientTemplateEmailDialogProps = {
  clientId: string;
  templateId: string;
  templateName: string;
  clientName: string;
  clientEmail: string | null;
};

const buildDefaultValues = (
  templateName: string,
  clientName: string,
  clientEmail: string | null,
): SendClientTemplateEmailInput => ({
  to: clientEmail ?? "",
  cc: "",
  subject: `${templateName} — ${clientName}`,
  message: `Olá,\n\nSegue em anexo o documento "${templateName}" preparado para ${clientName}.\n\nAtenciosamente.`,
});

export const ClientTemplateEmailDialog = ({
  clientId,
  templateId,
  templateName,
  clientName,
  clientEmail,
}: ClientTemplateEmailDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues = buildDefaultValues(
    templateName,
    clientName,
    clientEmail,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendClientTemplateEmailInput>({
    resolver: zodResolver(sendClientTemplateEmailSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (values: SendClientTemplateEmailInput) =>
      sendClientTemplateEmail(clientId, templateId, values),
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
        <Button type="button">
          <Send aria-hidden="true" />
          Enviar por e-mail
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100vh-2.5rem)] overflow-y-auto sm:max-w-lg">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Enviar documento por e-mail</DialogTitle>

            <DialogDescription>
              Revise o destinatário e a mensagem antes de enviar "{templateName}
              ".
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={Boolean(errors.to)}>
              <FieldLabel htmlFor="client-template-email-to">Para</FieldLabel>

              <Input
                id="client-template-email-to"
                type="email"
                aria-invalid={Boolean(errors.to)}
                {...register("to")}
              />

              {clientEmail ? (
                <FieldDescription>E-mail principal do cliente</FieldDescription>
              ) : null}

              {errors.to ? <FieldError>{errors.to.message}</FieldError> : null}
            </Field>

            <Field data-invalid={Boolean(errors.cc)}>
              <FieldLabel htmlFor="client-template-email-cc">
                Cc{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </FieldLabel>

              <Input
                id="client-template-email-cc"
                type="email"
                placeholder="outro@email.com.br"
                aria-invalid={Boolean(errors.cc)}
                {...register("cc")}
              />

              {errors.cc ? <FieldError>{errors.cc.message}</FieldError> : null}
            </Field>

            <Field data-invalid={Boolean(errors.subject)}>
              <FieldLabel htmlFor="client-template-email-subject">
                Assunto
              </FieldLabel>

              <Input
                id="client-template-email-subject"
                aria-invalid={Boolean(errors.subject)}
                {...register("subject")}
              />

              {errors.subject ? (
                <FieldError>{errors.subject.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.message)}>
              <FieldLabel htmlFor="client-template-email-message">
                Mensagem
              </FieldLabel>

              <Textarea
                id="client-template-email-message"
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
