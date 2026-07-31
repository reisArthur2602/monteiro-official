const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "30/07/2026 às 10:20", no fuso de quem está vendo a tela. */
export const formatDateTime = (isoDate: string) => {
  const formatted = dateTimeFormatter.format(new Date(isoDate));
  const [datePart, timePart] = formatted.split(", ");

  return timePart ? `${datePart} às ${timePart}` : formatted;
};
