"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Circle,
  CircleCheck,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/get-initials";

import { acceptInvitation } from "../actions/accept-invitation";
import type { InvitationByToken } from "../queries/get-invitation-by-token";
import {
  type AcceptInvitationInput,
  acceptInvitationSchema,
} from "../schemas/accept-invitation-schema";
import {
  countMetPasswordRequirements,
  evaluatePasswordStrength,
  type PasswordRequirementKey,
} from "../utils/evaluate-password-strength";

const STRENGTH_LABELS = ["Não informada", "Fraca", "Razoável", "Boa", "Forte"];

const REQUIREMENT_LABELS: Record<PasswordRequirementKey, string> = {
  length: "Pelo menos 10 caracteres",
  uppercase: "Uma letra maiúscula",
  number: "Um número",
  symbol: "Um símbolo",
};

type AcceptInvitationFormProps = {
  token: string;
  invitation: InvitationByToken;
};

export const AcceptInvitationForm = ({
  token,
  invitation,
}: AcceptInvitationFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AcceptInvitationInput>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { password: "", confirmPassword: "", acceptedTerms: false },
  });

  const password = useWatch({ control, name: "password" }) ?? "";
  const requirements = evaluatePasswordStrength(password);
  const score = countMetPasswordRequirements(requirements);

  const onSubmit = (values: AcceptInvitationInput) => {
    startTransition(async () => {
      const result = await acceptInvitation(token, values);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/");
      router.refresh();
    });
  };

  return (
    <div className="grid w-full max-w-md gap-6 rounded-2xl border bg-card p-6 shadow-lg sm:p-8">
      <header className="grid gap-2">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-primary uppercase">
          <KeyRound className="size-3" aria-hidden="true" />
          Última etapa
        </span>

        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Crie sua senha
        </h2>

        <p className="text-sm text-muted-foreground">
          Defina uma senha exclusiva para concluir a criação da sua conta.
        </p>
      </header>

      <div className="flex items-center gap-2.5 rounded-lg border bg-muted p-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-[10px] font-bold text-primary">
          {getInitials(invitation.name)}
        </span>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold">{invitation.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {invitation.email}
          </p>
        </div>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-5">
          <Field data-invalid={Boolean(errors.password)}>
            <FieldLabel htmlFor="invite-password">Nova senha</FieldLabel>

            <div className="relative">
              <Input
                id="invite-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Digite uma senha segura"
                className="pr-10"
                aria-invalid={Boolean(errors.password)}
                disabled={isPending}
                {...register("password")}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>

            {errors.password ? (
              <FieldError>{errors.password.message}</FieldError>
            ) : null}
          </Field>

          <div className="grid gap-2.5 rounded-lg border bg-muted p-3">
            <div className="flex items-center justify-between gap-3">
              <strong className="text-xs font-semibold">
                Segurança da senha
              </strong>
              <span className="font-mono text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                {STRENGTH_LABELS[password ? score : 0]}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full bg-border",
                    index < score && "bg-primary",
                  )}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {(
                Object.keys(REQUIREMENT_LABELS) as PasswordRequirementKey[]
              ).map((key) => {
                const isValid = requirements[key];

                return (
                  <span
                    key={key}
                    className={cn(
                      "flex items-center gap-1.5 text-[11px] text-muted-foreground",
                      isValid && "text-chart-2",
                    )}
                  >
                    {isValid ? (
                      <CircleCheck className="size-3" aria-hidden="true" />
                    ) : (
                      <Circle className="size-3" aria-hidden="true" />
                    )}
                    {REQUIREMENT_LABELS[key]}
                  </span>
                );
              })}
            </div>
          </div>

          <Field data-invalid={Boolean(errors.confirmPassword)}>
            <FieldLabel htmlFor="invite-confirm-password">
              Confirmar senha
            </FieldLabel>

            <div className="relative">
              <Input
                id="invite-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Digite a senha novamente"
                className="pr-10"
                aria-invalid={Boolean(errors.confirmPassword)}
                disabled={isPending}
                {...register("confirmPassword")}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2"
                aria-label={
                  showConfirmPassword
                    ? "Ocultar confirmação"
                    : "Mostrar confirmação"
                }
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((previous) => !previous)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>

            {errors.confirmPassword ? (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            ) : null}
          </Field>

          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <ShieldCheck
              className="mt-0.5 size-3.5 shrink-0 text-chart-2"
              aria-hidden="true"
            />
            O escritório não consegue visualizar sua senha. Em caso de perda,
            será necessário solicitar uma redefinição.
          </p>

          <Field
            orientation="horizontal"
            data-invalid={Boolean(errors.acceptedTerms)}
          >
            <Controller
              control={control}
              name="acceptedTerms"
              render={({ field }) => (
                <FieldLabel
                  htmlFor="invite-terms"
                  className="items-start font-normal"
                >
                  <Checkbox
                    id="invite-terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                    aria-invalid={Boolean(errors.acceptedTerms)}
                  />

                  <span className="text-[11px] text-muted-foreground">
                    Confirmo que este convite foi destinado a mim e concordo em
                    manter meu acesso sob responsabilidade pessoal.
                  </span>
                </FieldLabel>
              )}
            />

            {errors.acceptedTerms ? (
              <FieldError>{errors.acceptedTerms.message}</FieldError>
            ) : null}
          </Field>
        </FieldGroup>

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Criando conta…" : "Criar conta e acessar"}
        </Button>
      </form>
    </div>
  );
};
