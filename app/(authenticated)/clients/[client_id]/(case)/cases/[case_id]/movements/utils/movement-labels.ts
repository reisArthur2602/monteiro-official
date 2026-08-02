import type { ProcessMovementSource } from '@/app/generated/prisma/enums';

export const processMovementSourceLabels: Record<ProcessMovementSource, string> = {
    MANUAL: 'Manual',
    TRIBUNAL: 'Tribunal',
    IMPORTACAO: 'Importação',
    SISTEMA: 'Sistema',
};

/**
 * Mesmo padrão de tinta leve usado nos outros selos do projeto, só com
 * tokens já existentes no Design System.
 */
export const processMovementSourceBadgeClasses: Record<ProcessMovementSource, string> = {
    TRIBUNAL: 'border-primary/20 bg-accent text-primary',
    MANUAL: 'border-chart-2/25 bg-chart-2/12 text-chart-2',
    IMPORTACAO: 'border-chart-3/25 bg-chart-3/12 text-chart-3',
    SISTEMA: 'border-border bg-muted text-muted-foreground',
};

/**
 * Origens que o formulário manual oferece. `SISTEMA` e `IMPORTACAO` são
 * geradas automaticamente por integrações que ainda não existem — não faz
 * sentido oferecê-las como opção de um registro digitado à mão.
 */
export const MANUAL_MOVEMENT_SOURCES: ProcessMovementSource[] = ['MANUAL', 'TRIBUNAL'];
