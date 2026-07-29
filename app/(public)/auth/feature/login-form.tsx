"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type LoginInput, loginSchema } from "@/schemas/auth/login-schema";

import { login } from "../actions/login";

export const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      persistentSession: false,
    },
  });

  const onSubmit = (values: LoginInput) => {
    startTransition(async () => {
      const result = await login(values);

      if (!result.ok) {
        toast.error(result.message);

        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            if (messages?.[0]) {
              setError(field as keyof LoginInput, { message: messages[0] });
            }
          }
        }

        return;
      }

      toast.success(result.message);
      router.push("/");
      router.refresh();
    });
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            placeholder="nome@escritorio.com.br"
            aria-invalid={Boolean(errors.email)}
            disabled={isPending}
            {...register("email")}
          />
          <FieldDescription>
            Use o endereço profissional vinculado à sua conta.
          </FieldDescription>
          {errors.email ? (
            <FieldError>{errors.email.message}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Digite sua senha"
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
          <FieldDescription>
            A senha deve ter pelo menos 8 caracteres.
          </FieldDescription>
          {errors.password ? (
            <FieldError>{errors.password.message}</FieldError>
          ) : null}
        </Field>

        <Field orientation="horizontal">
          <Controller
            control={control}
            name="persistentSession"
            render={({ field }) => (
              <FieldLabel htmlFor="persistent-session" className="font-normal">
                <Checkbox
                  id="persistent-session"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
                Manter acesso neste dispositivo
              </FieldLabel>
            )}
          />
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Verificando acesso…" : "Entrar"}
      </Button>
    </form>
  );
};
