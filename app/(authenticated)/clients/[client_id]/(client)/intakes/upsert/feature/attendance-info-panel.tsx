'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { AttendanceChannel } from '@/app/generated/prisma/enums';
import { FormPanel } from '@/components/shared/form-panel';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { attendanceChannelLabels } from '../../../utils/attendance-form-labels';
import type { AttendanceFormValues } from '../schemas/attendance-form-schema';

export const AttendanceInfoPanel = () => {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<AttendanceFormValues>();

    return (
        <FormPanel
            title="Informações do atendimento"
            description="Classificação básica e identificação do contato."
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(errors.channel)}>
                    <FieldLabel htmlFor="intake-channel">Canal de atendimento</FieldLabel>

                    <Controller
                        control={control}
                        name="channel"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="intake-channel"
                                    className="w-full"
                                    aria-invalid={Boolean(errors.channel)}
                                >
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>

                                <SelectContent>
                                    {Object.values(AttendanceChannel).map((channel) => (
                                        <SelectItem key={channel} value={channel}>
                                            {attendanceChannelLabels[channel]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.channel ? <FieldError>{errors.channel.message}</FieldError> : null}
                </Field>

                <Field data-invalid={Boolean(errors.contactPerson)}>
                    <FieldLabel htmlFor="intake-contact-person">Pessoa de contato</FieldLabel>

                    <Input
                        id="intake-contact-person"
                        maxLength={160}
                        placeholder="Nome de quem participou do atendimento"
                        aria-invalid={Boolean(errors.contactPerson)}
                        {...register('contactPerson')}
                    />

                    {errors.contactPerson ? (
                        <FieldError>{errors.contactPerson.message}</FieldError>
                    ) : null}
                </Field>

                <Field data-invalid={Boolean(errors.legalArea)}>
                    <FieldLabel htmlFor="intake-legal-area">Área jurídica</FieldLabel>

                    <Input
                        id="intake-legal-area"
                        maxLength={80}
                        placeholder="Ex.: Cível, Trabalhista, Família"
                        aria-invalid={Boolean(errors.legalArea)}
                        {...register('legalArea')}
                    />

                    {errors.legalArea ? <FieldError>{errors.legalArea.message}</FieldError> : null}
                </Field>

                <Field data-invalid={Boolean(errors.subject)}>
                    <FieldLabel htmlFor="intake-subject">Assunto principal</FieldLabel>

                    <Input
                        id="intake-subject"
                        maxLength={180}
                        placeholder="Ex.: inadimplemento contratual de fornecedor"
                        aria-invalid={Boolean(errors.subject)}
                        {...register('subject')}
                    />

                    {errors.subject ? <FieldError>{errors.subject.message}</FieldError> : null}
                </Field>
            </div>
        </FormPanel>
    );
};
