"use client";

import { Input } from "@/components/ui/input";

type MaskedInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange"
> & {
  /** Dígitos guardados no formulário. */
  value: string;
  onValueChange: (digits: string) => void;
  /** Monta o texto exibido a partir dos dígitos. */
  mask: (digits: string) => string;
  maxDigits: number;
};

/**
 * Campo numérico com máscara de exibição.
 *
 * O formulário guarda apenas dígitos — o mesmo formato do banco — e a
 * máscara existe só na tela. Como os separadores são acrescentados ao fim
 * do que já foi digitado, o cursor acompanha naturalmente a digitação da
 * esquerda para a direita; editar no meio do valor leva o cursor para o
 * fim, limitação conhecida desta abordagem.
 */
export const MaskedInput = ({
  value,
  onValueChange,
  mask,
  maxDigits,
  ...props
}: MaskedInputProps) => (
  <Input
    {...props}
    inputMode="numeric"
    autoComplete="off"
    value={mask(value)}
    onChange={(event) =>
      onValueChange(event.target.value.replace(/\D/g, "").slice(0, maxDigits))
    }
  />
);
