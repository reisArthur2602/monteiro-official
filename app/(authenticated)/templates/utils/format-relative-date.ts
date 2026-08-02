const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/**
 * Converte a data de atualização em um texto curto e relativo,
 * voltando para a data absoluta quando a diferença passa de uma semana.
 *
 * Não é o mesmo `formatUpdatedAt` de `clients/utils` — aquele devolve
 * "Hoje, 09:18" (com horário, para atualizações recentes); este devolve
 * "hoje" / "há 3 dias" / "em 12/03/2026". Nomes iguais para comportamentos
 * diferentes já causaram confusão, por isso o nome próprio aqui.
 */
export const formatRelativeDate = (isoDate: string) => {
  const updatedAt = new Date(isoDate);

  const startOfUpdatedAt = Date.UTC(
    updatedAt.getFullYear(),
    updatedAt.getMonth(),
    updatedAt.getDate(),
  );

  const now = new Date();

  const startOfToday = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const days = Math.round(
    (startOfToday - startOfUpdatedAt) / MILLISECONDS_PER_DAY,
  );

  if (days <= 0) {
    return "hoje";
  }

  if (days === 1) {
    return "ontem";
  }

  if (days <= 7) {
    return `há ${days} dias`;
  }

  return `em ${dateFormatter.format(updatedAt)}`;
};
