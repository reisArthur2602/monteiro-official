const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Mesmos campos, lidos em UTC — usado só por `formatCivilDate`. */
const civilDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Timestamp exibido no fuso de quem está vendo a tela ("14/02/2024").
 * Use para `createdAt`, `updatedAt` e qualquer `DateTime` que registre um
 * instante — o mesmo critério de `formatUpdatedAt`.
 */
export const formatDate = (isoDate: string) =>
  dateFormatter.format(new Date(isoDate));

/**
 * Data civil exibida sem conversão de fuso ("16/04/1986").
 *
 * Colunas `@db.Date` (como `birthDate`) chegam do Prisma como meia-noite
 * UTC do dia gravado. Formatar isso no fuso local do servidor desloca a
 * data um dia para trás em qualquer fuso negativo — exatamente o caso do
 * Brasil. Use para qualquer campo que seja data civil, não instante.
 */
export const formatCivilDate = (isoDate: string) =>
  civilDateFormatter.format(new Date(isoDate));
