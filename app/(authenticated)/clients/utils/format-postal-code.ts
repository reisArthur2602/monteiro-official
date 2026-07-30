/** Máscara de CEP a partir dos dígitos gravados: "01310100" -> "01310-100". */
export const formatPostalCode = (postalCode: string) =>
  postalCode.replace(/^(\d{5})(\d{3})$/, "$1-$2");
