"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserRole } from "@/app/generated/prisma/enums";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { inviteUser } from "../actions/invite-user";
import {
  type InviteUserInput,
  inviteUserSchema,
} from "../schemas/invite-user-schema";
import { userRoleLabels } from "../utils/user-labels";

const DEFAULT_VALUES: InviteUserInput = {
  name: "",
  email: "",
  role: UserRole.COLABORADOR,
};

export const InviteUserDialog = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const mutation = useMutation({
    mutationFn: inviteUser,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      reset(DEFAULT_VALUES);
      setIsOpen(false);
      router.refresh();
    },
    onError: () => {
      toast.error("Não foi possível enviar o convite");
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset(DEFAULT_VALUES);
        }

        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">
          <UserPlus aria-hidden="true" />
          Convidar usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Convidar usuário</DialogTitle>

            <DialogDescription>
              O destinatário receberá um e-mail para criar a própria conta.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="invite-user-name">Nome completo</FieldLabel>

              <Input
                id="invite-user-name"
                placeholder="Ex.: João da Silva"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />

              {errors.name ? (
                <FieldError>{errors.name.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="invite-user-email">
                E-mail profissional
              </FieldLabel>

              <Input
                id="invite-user-email"
                type="email"
                placeholder="joao@monteiro.adv.br"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />

              {errors.email ? (
                <FieldError>{errors.email.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.role)}>
              <FieldLabel htmlFor="invite-user-role">Função</FieldLabel>

              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="invite-user-role"
                      className="w-full"
                      aria-invalid={Boolean(errors.role)}
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {userRoleLabels[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <FieldDescription>
                A função define o conjunto inicial de permissões.
              </FieldDescription>

              {errors.role ? (
                <FieldError>{errors.role.message}</FieldError>
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
              {mutation.isPending ? "Enviando..." : "Enviar convite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
