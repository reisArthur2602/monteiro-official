type ClientLocation = {
  city: string | null;
  state: string | null;
} | null;

/**
 * "São Paulo/SP" quando há cidade e UF, e o que existir quando falta um
 * dos dois. Devolve `null` para cliente sem endereço, deixando a decisão
 * do texto de ausência para quem exibe.
 */
export const formatLocation = (address: ClientLocation) => {
  if (!address) {
    return null;
  }

  if (address.city && address.state) {
    return `${address.city}/${address.state}`;
  }

  return address.city ?? address.state ?? null;
};
