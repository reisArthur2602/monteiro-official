import { z } from 'zod';

import { ProcessMovementSource } from '@/app/generated/prisma/enums';

const TITLE_MAX_LENGTH = 180;
const DESCRIPTION_MAX_LENGTH = 4000;
const EXTERNAL_CODE_MAX_LENGTH = 100;

/**
 * Os selects guardam `""` enquanto não preenchidos, para o controle do
 * React Hook Form nunca alternar entre não controlado e controlado. `""`
 * não pertence ao enum, então vira erro de "selecione" em vez de erro de
 * formato — mesmo padrão do formulário de processo.
 */
const requiredEnum = <T extends Record<string, string>>(values: T, message: string) =>
    z
        .union([z.literal(''), z.enum(values)])
        .refine((value): value is T[keyof T] => value !== '', { message });

export const createCaseMovementSchema = z.object({
    title: z.string().trim().min(1, 'Informe o título').max(TITLE_MAX_LENGTH),
    description: z.string().trim().min(1, 'Informe a descrição').max(DESCRIPTION_MAX_LENGTH),
    source: requiredEnum(ProcessMovementSource, 'Selecione a origem'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido'),
    externalCode: z.string().trim().max(EXTERNAL_CODE_MAX_LENGTH),
});

/**
 * Forma "crua" mantida pelo formulário: `source` aceita `""` como não
 * preenchido, para o controle do React Hook Form nunca alternar entre não
 * controlado e controlado.
 */
export type CreateCaseMovementFormValues = {
    title: string;
    description: string;
    source: ProcessMovementSource | '';
    date: string;
    time: string;
    externalCode: string;
};

export type CreateCaseMovementParsed = z.infer<typeof createCaseMovementSchema>;
