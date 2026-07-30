const CPF_LENGTH = 11;
const CNPJ_LENGTH = 14;

/**
 * Aplica a máscara de CPF ou CNPJ sobre os dígitos vindos do banco.
 * Documentos com tamanho inesperado são devolvidos sem máscara, para nunca
 * exibir um número truncado como se estivesse completo.
 */
export const formatDocument = (document: string) => {
  if (document.length === CPF_LENGTH) {
    return document.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  if (document.length === CNPJ_LENGTH) {
    return document.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }

  return document;
};

/** Só os dígitos, para comparar entrada mascarada com o valor gravado. */
export const onlyDigits = (value: string) => value.replace(/\D/g, "");
