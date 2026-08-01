import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { formatUpdatedAt } from '../../../../utils/format-updated-at';
import {
    attendanceFormFooterVerb,
    attendanceFormStatusBadgeClasses,
    attendanceFormStatusLabels,
} from '../../utils/attendance-form-labels';
import type { AttendanceFormListItem } from '../queries/list-client-attendance-forms';
import { buildIntakeDetailHref } from '../utils/build-intakes-href';

type AttendanceFormCardProps = {
    clientId: string;
    form: AttendanceFormListItem;
    /** Alterna a leve rotação do mockup de página, como no protótipo. */
    index: number;
};

const UNTITLED_SUBJECT = 'Ficha sem assunto';

/**
 * Mockup decorativo de página, no estilo carta timbrada. É só ilustração
 * — as linhas e campos não representam dados reais, o mesmo papel que um
 * ícone de arquivo cumpriria, só que mais elaborado.
 */
const FormPagePreview = ({
    title,
    rotateAlternate,
}: {
    title: string;
    rotateAlternate: boolean;
}) => (
    <div
        className={cn(
            'relative mx-auto w-[132px] min-h-[166px] -rotate-[1.2deg] border border-[#d8ddd9] bg-white p-[17px_14px] font-heading text-[#18201d] shadow-[0_12px_28px_rgba(11,18,32,0.14)] after:absolute after:inset-0 after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]',
            rotateAlternate && 'rotate-[1deg]'
        )}
    >
        <div className="mb-3 flex items-center gap-1.5 border-b border-[#17349d] pb-[7px] text-[6px] font-semibold text-[#17349d]">
            <span className="grid size-3.5 place-items-center rounded border border-[#17349d] text-[8px] leading-none">
                §
            </span>
            <span>MONTEIRO ADVOCACIA</span>
        </div>

        <h4 className="mb-2.5 line-clamp-2 text-center text-[7px] leading-tight uppercase">
            {title}
        </h4>

        <div className="mb-[5px] h-[3px] rounded-full bg-[#d9dfdc]" />
        <div className="mb-[5px] h-[3px] w-[82%] rounded-full bg-[#d9dfdc]" />
        <div className="h-[3px] w-[62%] rounded-full bg-[#d9dfdc]" />

        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <span className="h-[18px] rounded-[2px] border border-[#d9dfdc] bg-[#fafbf9]" />
            <span className="h-[18px] rounded-[2px] border border-[#d9dfdc] bg-[#fafbf9]" />
            <span className="h-[18px] rounded-[2px] border border-[#d9dfdc] bg-[#fafbf9]" />
            <span className="h-[18px] rounded-[2px] border border-[#d9dfdc] bg-[#fafbf9]" />
        </div>
    </div>
);

export const AttendanceFormCard = ({ clientId, form, index }: AttendanceFormCardProps) => {
    const subject = form.subject ?? UNTITLED_SUBJECT;

    return (
        <article className="grid min-h-[340px] grid-rows-[176px_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border bg-card shadow-xs transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm">
            <div
                className="relative overflow-hidden border-b bg-muted p-[18px]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 75% 12%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 26%)',
                }}
            >
                <Badge
                    variant="outline"
                    className={cn(
                        'absolute top-3 right-3 gap-1.5 font-bold',
                        attendanceFormStatusBadgeClasses[form.status]
                    )}
                >
                    <span className="size-1.5 rounded-full bg-current" />
                    {attendanceFormStatusLabels[form.status]}
                </Badge>

                <FormPagePreview title={subject} rotateAlternate={index % 2 === 1} />
            </div>

            <div className="grid content-start gap-2.5 p-4">
                {form.legalArea ? (
                    <span className="font-mono text-[9px] font-semibold tracking-wider text-primary uppercase">
                        {form.legalArea}
                    </span>
                ) : null}

                <h3 className="font-heading text-xl leading-tight font-semibold tracking-tight">
                    <Link
                        href={buildIntakeDetailHref(clientId, form.id)}
                        className="outline-none hover:text-primary focus-visible:underline focus-visible:underline-offset-4"
                    >
                        {subject}
                    </Link>
                </h3>

                {form.clientReport ? (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {form.clientReport}
                    </p>
                ) : (
                    <p className="text-xs leading-relaxed text-muted-foreground italic">
                        Sem relato registrado.
                    </p>
                )}

                <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-muted-foreground">
                    <span>
                        {form.actionsCount} {form.actionsCount === 1 ? 'ação' : 'ações'}
                    </span>

                    <span>Revisão {form.revision}</span>
                </div>
            </div>

            <footer className="flex min-h-13 items-center justify-between gap-3 border-t px-3.5 text-[10px] text-muted-foreground">
                <span>
                    {attendanceFormFooterVerb[form.status]} {formatUpdatedAt(form.updatedAt)}
                </span>

                <span>{form.responsible.name}</span>
            </footer>
        </article>
    );
};
