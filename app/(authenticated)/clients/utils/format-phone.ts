/**
 * Máscara de telefone brasileiro a partir dos dígitos gravados.
 * Aceita 10 dígitos (fixo) e 11 (celular); qualquer outro tamanho volta
 * sem máscara.
 */
export const formatPhone = (phone: string) => {
  if (phone.length === 10) {
    return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  if (phone.length === 11) {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  return phone;
};
