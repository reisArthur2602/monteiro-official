import "server-only";

import { headers } from "next/headers";

/**
 * Origem da requisição atual, derivada dos headers em vez de uma variável de
 * ambiente fixa — funciona em qualquer domínio sem precisar configurar
 * `NEXT_PUBLIC_APP_URL`. Só faz sentido dentro de uma Server Action ou Server
 * Component, onde `headers()` tem uma requisição real por trás.
 */
export const getRequestOrigin = async () => {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";

  return `${protocol}://${host}`;
};
