import { FormPanel } from '@/components/shared/form-panel';

import { formatDocument } from '../../../../../utils/format-document';
import { formatPhone } from '../../../../../utils/format-phone';
import type { ClientContext } from '../../../queries/get-client-context';
import { formatAddressLines } from '../../../utils/format-address';

type SnapshotFieldProps = {
    label: string;
    children: React.ReactNode;
    emphasized?: boolean;
    /** A última linha visual (2 últimos campos num grid de 2 colunas) não leva borda. */
    lastRow?: boolean;
};

const SnapshotField = ({
    label,
    children,
    emphasized = true,
    lastRow = false,
}: SnapshotFieldProps) => (
    <div className={lastRow ? 'py-3' : 'border-b py-3'}>
        <span className="font-mono text-[8px] font-semibold tracking-wider text-muted-foreground uppercase">
            {label}
        </span>

        <span
            className={
                emphasized
                    ? 'mt-1.5 block overflow-hidden text-sm font-semibold text-ellipsis'
                    : 'mt-1.5 block overflow-hidden text-sm text-ellipsis'
            }
        >
            {children}
        </span>
    </div>
);

type ClientSnapshotPanelProps = {
    client: ClientContext;
};

/**
 * Dados cadastrais atuais do cliente, somente leitura.
 *
 * Mostra o cadastro vigente, não o snapshot congelado gravado na ficha:
 * o snapshot existe para o histórico, mas quem preenche a ficha precisa
 * ver o cadastro de agora, como o próprio modelo documenta.
 */
export const ClientSnapshotPanel = ({ client }: ClientSnapshotPanelProps) => {
    const documentLabel = client.type === 'PESSOA_FISICA' ? 'CPF' : 'CNPJ';
    const addressLine = formatAddressLines(client.address).join(' · ');

    return (
        <FormPanel
            title="Contexto cadastral do cliente"
            description="Dados atuais que serão preservados no snapshot histórico da ficha."
        >
            <div className="grid gap-x-6 sm:grid-cols-2">
                <SnapshotField
                    label={client.type === 'PESSOA_FISICA' ? 'Nome completo' : 'Razão social'}
                >
                    {client.name}
                </SnapshotField>

                <SnapshotField label="Nome social/fantasia">
                    {client.displayName ?? (
                        <span className="font-normal text-muted-foreground">Não informado</span>
                    )}
                </SnapshotField>

                <SnapshotField label={documentLabel}>
                    {formatDocument(client.document)}
                </SnapshotField>

                <SnapshotField label="Contato principal">
                    {client.email ?? (
                        <span className="font-normal text-muted-foreground">Não informado</span>
                    )}
                </SnapshotField>

                <SnapshotField label="Telefone" lastRow>
                    {client.phone ? (
                        formatPhone(client.phone)
                    ) : (
                        <span className="font-normal text-muted-foreground">Não informado</span>
                    )}
                </SnapshotField>

                <SnapshotField label="Endereço" emphasized={false} lastRow>
                    {addressLine || <span className="text-muted-foreground">Não informado</span>}
                </SnapshotField>
            </div>
        </FormPanel>
    );
};
