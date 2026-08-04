import { z } from "zod";

import {
  isPasswordStrongEnough,
  PASSWORD_MIN_LENGTH,
} from "../utils/evaluate-password-strength";

export const acceptInvitationSchema = z
  .object({
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`,
      )
      .refine(isPasswordStrongEnough, {
        message:
          "A senha precisa de letra maiúscula, número e símbolo, além do tamanho mínimo",
      }),
    confirmPassword: z.string().min(1, "Confirme a senha"),
    // `boolean()` (não `literal(true)`) para o tipo do formulário continuar
    // `boolean` do primeiro ao último render — o checkbox precisa existir
    // como `false` antes de ser marcado.
    acceptedTerms: z.boolean().refine((value) => value === true, {
      message: "É necessário confirmar para continuar",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
