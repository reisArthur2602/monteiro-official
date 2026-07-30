const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * "Hoje, 09:18" e "Ontem, 16:42" para atualizações recentes; data absoluta
 * a partir de dois dias, quando a hora deixa de ser informação útil.
 */
export const formatUpdatedAt = (isoDate: string) => {
  const updatedAt = new Date(isoDate);
  const now = new Date();

  const startOfUpdatedAt = Date.UTC(
    updatedAt.getFullYear(),
    updatedAt.getMonth(),
    updatedAt.getDate(),
  );

  const startOfToday = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const days = Math.round(
    (startOfToday - startOfUpdatedAt) / MILLISECONDS_PER_DAY,
  );

  if (days <= 0) {
    return `Hoje, ${timeFormatter.format(updatedAt)}`;
  }

  if (days === 1) {
    return `Ontem, ${timeFormatter.format(updatedAt)}`;
  }

  return dateFormatter.format(updatedAt);
};
