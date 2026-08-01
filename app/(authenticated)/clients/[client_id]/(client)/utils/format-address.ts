import { formatPostalCode } from '../../../utils/format-postal-code';

type Address = {
    postalCode: string | null;
    street: string | null;
    number: string | null;
    complement: string | null;
    district: string | null;
    city: string | null;
    state: string | null;
} | null;

/**
 * Endereço em duas linhas para exibição: "Rua X, 123 - Complemento" e
 * "Bairro - Cidade/UF - CEP". Cada segmento só aparece se estiver
 * preenchido, e uma linha inteira some se nenhum dos seus segmentos tiver
 * valor — evita "- -" ou vírgulas soltas quando o cadastro é parcial.
 */
export const formatAddressLines = (address: Address): string[] => {
    if (!address) {
        return [];
    }

    const line1 = [address.street, address.number ? `${address.number}` : null]
        .filter(Boolean)
        .join(', ');

    const streetLine = [line1 || null, address.complement].filter(Boolean).join(' - ');

    const cityState =
        address.city && address.state
            ? `${address.city}/${address.state}`
            : (address.city ?? address.state);

    const localityLine = [
        address.district,
        cityState,
        address.postalCode ? formatPostalCode(address.postalCode) : null,
    ]
        .filter(Boolean)
        .join(' - ');

    return [streetLine, localityLine].filter((line) => line.length > 0);
};
