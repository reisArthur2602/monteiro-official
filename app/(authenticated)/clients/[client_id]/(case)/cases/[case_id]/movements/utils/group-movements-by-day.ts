const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
const dayMonthFormatter = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' });

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Chave civil do dia no fuso de quem está vendo a tela — não em UTC. */
const dayKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const formatDayHeading = (date: Date) => {
    const now = new Date();
    const today = dayKey(now);
    const yesterday = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const key = dayKey(date);

    if (key === today) {
        return `Hoje, ${dayMonthFormatter.format(date)}`;
    }

    if (key === yesterday) {
        return `Ontem, ${dayMonthFormatter.format(date)}`;
    }

    return `${capitalize(weekdayFormatter.format(date))}, ${dayMonthFormatter.format(date)}`;
};

type MovementLike = { movementAt: string };

export type MovementDayGroup<T extends MovementLike> = {
    key: string;
    heading: string;
    items: T[];
};

/**
 * Agrupa por dia civil dentro da página atual. Os grupos não cruzam
 * páginas: um dia partido ao meio na paginação continua com o cabeçalho e
 * a contagem corretos em cada página, só que exibidos em duas seções.
 */
export const groupMovementsByDay = <T extends MovementLike>(
    items: T[]
): MovementDayGroup<T>[] => {
    const groups: MovementDayGroup<T>[] = [];

    for (const item of items) {
        const date = new Date(item.movementAt);
        const key = dayKey(date);
        const lastGroup = groups.at(-1);

        if (lastGroup?.key === key) {
            lastGroup.items.push(item);
            continue;
        }

        groups.push({ key, heading: formatDayHeading(date), items: [item] });
    }

    return groups;
};
