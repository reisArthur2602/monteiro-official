'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { createCaseMovement } from '../actions/create-case-movement';
import {
    type CreateCaseMovementFormValues,
    createCaseMovementSchema,
} from '../schemas/create-case-movement-schema';
import { MANUAL_MOVEMENT_SOURCES, processMovementSourceLabels } from '../utils/movement-labels';

type CreateCaseMovementDialogProps = {
    clientId: string;
    caseId: string;
};

const buildDefaultValues = (): CreateCaseMovementFormValues => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, '0');

    return {
        title: '',
        description: '',
        source: '',
        date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
        time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
        externalCode: '',
    };
};

export const CreateCaseMovementDialog = ({ clientId, caseId }: CreateCaseMovementDialogProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CreateCaseMovementFormValues>({
        resolver: zodResolver(createCaseMovementSchema),
        defaultValues: buildDefaultValues(),
    });

    const mutation = useMutation({
        mutationFn: (values: CreateCaseMovementFormValues) =>
            createCaseMovement({ clientId, caseId, values }),
        onSuccess: (result) => {
            if (!result.ok) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            reset(buildDefaultValues());
            setIsOpen(false);
            router.refresh();
        },
        onError: () => {
            toast.error('Não foi possível registrar a movimentação');
        },
    });

    const onSubmit = handleSubmit((values) => mutation.mutate(values));

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                // Formulário só é descartado ao fechar, para que um erro de envio
                // preserve o que já foi preenchido.
                if (!open) {
                    reset(buildDefaultValues());
                }

                setIsOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus aria-hidden="true" />
                    Nova movimentação
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[calc(100vh-2.5rem)] overflow-y-auto sm:max-w-xl">
                <form onSubmit={onSubmit} noValidate>
                    <DialogHeader>
                        <DialogTitle>Nova movimentação</DialogTitle>

                        <DialogDescription>
                            Registre um novo andamento no histórico do processo.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="py-4">
                        <Field data-invalid={Boolean(errors.title)}>
                            <FieldLabel htmlFor="movement-title">Título</FieldLabel>

                            <Input
                                id="movement-title"
                                maxLength={180}
                                placeholder="Ex.: Despacho inicial publicado"
                                aria-invalid={Boolean(errors.title)}
                                {...register('title')}
                            />

                            {errors.title ? <FieldError>{errors.title.message}</FieldError> : null}
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Field data-invalid={Boolean(errors.date)}>
                                <FieldLabel htmlFor="movement-date">Data</FieldLabel>

                                <Input
                                    id="movement-date"
                                    type="date"
                                    aria-invalid={Boolean(errors.date)}
                                    {...register('date')}
                                />

                                {errors.date ? <FieldError>{errors.date.message}</FieldError> : null}
                            </Field>

                            <Field data-invalid={Boolean(errors.time)}>
                                <FieldLabel htmlFor="movement-time">Horário</FieldLabel>

                                <Input
                                    id="movement-time"
                                    type="time"
                                    aria-invalid={Boolean(errors.time)}
                                    {...register('time')}
                                />

                                {errors.time ? <FieldError>{errors.time.message}</FieldError> : null}
                            </Field>

                            <Field data-invalid={Boolean(errors.source)}>
                                <FieldLabel htmlFor="movement-source-field">Origem</FieldLabel>

                                <Controller
                                    control={control}
                                    name="source"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id="movement-source-field"
                                                className="w-full"
                                                aria-invalid={Boolean(errors.source)}
                                            >
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {MANUAL_MOVEMENT_SOURCES.map((source) => (
                                                    <SelectItem key={source} value={source}>
                                                        {processMovementSourceLabels[source]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.source ? (
                                    <FieldError>{errors.source.message}</FieldError>
                                ) : null}
                            </Field>
                        </div>

                        <Field data-invalid={Boolean(errors.description)}>
                            <FieldLabel htmlFor="movement-description">Descrição</FieldLabel>

                            <Textarea
                                id="movement-description"
                                rows={5}
                                maxLength={4000}
                                placeholder="Descreva objetivamente o andamento ocorrido."
                                aria-invalid={Boolean(errors.description)}
                                {...register('description')}
                            />

                            {errors.description ? (
                                <FieldError>{errors.description.message}</FieldError>
                            ) : null}
                        </Field>

                        <Field data-invalid={Boolean(errors.externalCode)}>
                            <FieldLabel htmlFor="movement-external-code">Código externo</FieldLabel>

                            <Input
                                id="movement-external-code"
                                maxLength={100}
                                placeholder="Opcional, usado em registros importados"
                                aria-invalid={Boolean(errors.externalCode)}
                                {...register('externalCode')}
                            />

                            {errors.externalCode ? (
                                <FieldError>{errors.externalCode.message}</FieldError>
                            ) : null}
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={mutation.isPending}
                        >
                            Cancelar
                        </Button>

                        <Button type="submit" disabled={mutation.isPending}>
                            <Save aria-hidden="true" />
                            {mutation.isPending ? 'Salvando...' : 'Salvar movimentação'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
