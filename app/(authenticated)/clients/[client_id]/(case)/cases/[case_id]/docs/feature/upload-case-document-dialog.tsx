'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FileUp, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ClientDocumentVisibility, ProcessDocumentRole } from '@/app/generated/prisma/enums';
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UPLOAD_ACCEPT_ATTRIBUTE } from '@/lib/ftp-limits';
import { cn } from '@/lib/utils';

import { clientDocumentVisibilityLabels } from '../../../../../(client)/docs/utils/document-labels';
import {
    formatFileExtension,
    formatFileSize,
} from '../../../../../(client)/docs/utils/format-file-size';
import {
    uploadCaseDocumentFormSchema,
    type UploadCaseDocumentFormInput,
} from '../schemas/upload-case-document-form-schema';
import { buildCaseDocsUploadHref } from '../utils/build-case-docs-href';
import { processDocumentRoleFolderLabels } from '../utils/case-document-labels';

type UploadCaseDocumentDialogProps = {
    clientId: string;
    caseId: string;
    /** Pasta aberta na árvore, usada como destino sugerido. */
    defaultRole?: ProcessDocumentRole;
};

type UploadResponse = {
    ok: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>;
};

export const UploadCaseDocumentDialog = ({
    clientId,
    caseId,
    defaultRole,
}: UploadCaseDocumentDialogProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultValues: UploadCaseDocumentFormInput = {
        title: '',
        description: '',
        role: defaultRole ?? ProcessDocumentRole.OUTRO,
        visibility: ClientDocumentVisibility.EQUIPE,
        documentDate: '',
        // `File` ausente só para o resolver ter um valor do tipo certo; a
        // validação recusa enquanto nada for selecionado.
        file: undefined as unknown as File,
    };

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UploadCaseDocumentFormInput>({
        resolver: zodResolver(uploadCaseDocumentFormSchema),
        defaultValues,
    });

    const selectedFile = watch('file');

    const selectFile = (file: File | undefined) => {
        setValue('file', file as File, { shouldValidate: true });

        // Sem título, o servidor deriva do nome do arquivo — mas se o usuário
        // já digitou algo, a escolha dele não é sobrescrita.
        if (file && !watch('title')) {
            setValue('title', file.name.replace(/\.[^./\\]+$/, ''));
        }
    };

    const mutation = useMutation({
        mutationFn: async (values: UploadCaseDocumentFormInput) => {
            const formData = new FormData();

            formData.set('file', values.file);
            formData.set('role', values.role);
            formData.set('visibility', values.visibility);

            if (values.title) {
                formData.set('title', values.title);
            }

            if (values.description) {
                formData.set('description', values.description);
            }

            if (values.documentDate) {
                formData.set('documentDate', values.documentDate);
            }

            const response = await fetch(buildCaseDocsUploadHref(clientId, caseId), {
                method: 'POST',
                body: formData,
            });

            const result = (await response.json()) as UploadResponse;

            if (!response.ok || !result.ok) {
                throw new Error(result.message);
            }

            return result;
        },
        onSuccess: (result) => {
            toast.success(result.message);
            reset(defaultValues);
            setIsOpen(false);
            router.refresh();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Não foi possível enviar o documento');
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
                    reset(defaultValues);
                }

                setIsOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    <Upload aria-hidden="true" />
                    Enviar documento
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[calc(100vh-2.5rem)] overflow-y-auto sm:max-w-2xl">
                <form onSubmit={onSubmit} noValidate>
                    <DialogHeader>
                        <DialogTitle>Enviar documento</DialogTitle>

                        <DialogDescription>
                            O arquivo é armazenado no servidor de arquivos do escritório, entra no
                            arquivo geral do cliente e passa a constar neste processo.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="py-4">
                        <Field data-invalid={Boolean(errors.file)}>
                            <FieldLabel htmlFor="case-document-file" className="sr-only">
                                Arquivo
                            </FieldLabel>

                            {selectedFile?.size ? (
                                <div className="flex items-center gap-3 rounded-lg border bg-muted p-3">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-md border bg-card font-mono text-[8px] font-bold text-primary">
                                        {formatFileExtension(selectedFile.name)}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {formatFileSize(selectedFile.size)}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Remover arquivo"
                                        onClick={() => selectFile(undefined)}
                                    >
                                        <X aria-hidden="true" />
                                    </Button>
                                </div>
                            ) : (
                                // biome-ignore lint/a11y/noStaticElementInteractions: drag & drop é conveniência extra — a seleção acessível por teclado já existe no botão "Selecionar arquivo" abaixo.
                                <div
                                    className={cn(
                                        'grid min-h-37.5 place-items-center rounded-xl border-2 border-dashed bg-muted p-6 text-center transition-colors',
                                        isDragging ? 'border-primary bg-accent' : 'border-primary/40'
                                    )}
                                    onDragEnter={(event) => {
                                        event.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDragLeave={(event) => {
                                        event.preventDefault();
                                        setIsDragging(false);
                                    }}
                                    onDrop={(event) => {
                                        event.preventDefault();
                                        setIsDragging(false);
                                        selectFile(event.dataTransfer.files?.[0]);
                                    }}
                                >
                                    <div className="grid justify-items-center gap-2">
                                        <span className="grid size-12 place-items-center rounded-xl border bg-card text-primary">
                                            <FileUp className="size-5" aria-hidden="true" />
                                        </span>

                                        <p className="text-xs font-semibold">
                                            Arraste o arquivo para esta área
                                        </p>

                                        <p className="text-[10px] text-muted-foreground">
                                            PDF, DOCX, XLSX, JPG ou PNG · até 25 MB
                                        </p>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-1"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Selecionar arquivo
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                id="case-document-file"
                                type="file"
                                className="sr-only"
                                accept={UPLOAD_ACCEPT_ATTRIBUTE}
                                onChange={(event) => selectFile(event.target.files?.[0])}
                            />

                            {errors.file ? <FieldError>{errors.file.message}</FieldError> : null}
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field data-invalid={Boolean(errors.role)}>
                                <FieldLabel htmlFor="case-document-role">
                                    Pasta de destino
                                </FieldLabel>

                                <Controller
                                    control={control}
                                    name="role"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id="case-document-role"
                                                className="w-full"
                                                aria-invalid={Boolean(errors.role)}
                                            >
                                                <SelectValue placeholder="Selecione a pasta" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {Object.values(ProcessDocumentRole).map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {processDocumentRoleFolderLabels[role]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                <FieldDescription>
                                    Define a pasta no processo e a categoria no arquivo do cliente.
                                </FieldDescription>

                                {errors.role ? <FieldError>{errors.role.message}</FieldError> : null}
                            </Field>

                            <Field data-invalid={Boolean(errors.visibility)}>
                                <FieldLabel htmlFor="case-document-visibility">
                                    Visibilidade
                                </FieldLabel>

                                <Controller
                                    control={control}
                                    name="visibility"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id="case-document-visibility"
                                                className="w-full"
                                                aria-invalid={Boolean(errors.visibility)}
                                            >
                                                <SelectValue placeholder="Selecione a visibilidade" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {Object.values(ClientDocumentVisibility).map(
                                                    (visibility) => (
                                                        <SelectItem
                                                            key={visibility}
                                                            value={visibility}
                                                        >
                                                            {
                                                                clientDocumentVisibilityLabels[
                                                                    visibility
                                                                ]
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.visibility ? (
                                    <FieldError>{errors.visibility.message}</FieldError>
                                ) : null}
                            </Field>

                            <Field data-invalid={Boolean(errors.documentDate)}>
                                <FieldLabel htmlFor="case-document-date">
                                    Data do documento
                                </FieldLabel>

                                <Input
                                    id="case-document-date"
                                    type="date"
                                    aria-invalid={Boolean(errors.documentDate)}
                                    {...register('documentDate')}
                                />

                                {errors.documentDate ? (
                                    <FieldError>{errors.documentDate.message}</FieldError>
                                ) : null}
                            </Field>

                            <Field data-invalid={Boolean(errors.title)}>
                                <FieldLabel htmlFor="case-document-title">
                                    Título ou identificação
                                </FieldLabel>

                                <Input
                                    id="case-document-title"
                                    maxLength={200}
                                    placeholder="Opcional"
                                    aria-invalid={Boolean(errors.title)}
                                    {...register('title')}
                                />

                                <FieldDescription>
                                    Sem título, será usado o nome do arquivo.
                                </FieldDescription>

                                {errors.title ? <FieldError>{errors.title.message}</FieldError> : null}
                            </Field>
                        </div>

                        <Field data-invalid={Boolean(errors.description)}>
                            <FieldLabel htmlFor="case-document-description">Descrição</FieldLabel>

                            <Textarea
                                id="case-document-description"
                                rows={3}
                                maxLength={500}
                                placeholder="Contexto ou observação aplicável ao documento."
                                aria-invalid={Boolean(errors.description)}
                                {...register('description')}
                            />

                            {errors.description ? (
                                <FieldError>{errors.description.message}</FieldError>
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
                            {mutation.isPending ? 'Enviando...' : 'Enviar documento'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
