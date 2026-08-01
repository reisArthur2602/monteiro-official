const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
});

/** Data e hora separadas, para os dois níveis da linha do tempo do processo. */
export const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);

    return {
        date: dateFormatter.format(date),
        time: timeFormatter.format(date),
    };
};

const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit' });
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

/** Dia e mês abreviado para o selo de data dos cartões de prazo ("03 / AGO"). */
export const formatDeadlineBadge = (isoDate: string) => {
    const date = new Date(isoDate);

    return {
        day: dayFormatter.format(date),
        month: monthFormatter.format(date).replace('.', '').toUpperCase(),
    };
};
