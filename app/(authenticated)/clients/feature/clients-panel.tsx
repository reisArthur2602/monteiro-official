import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ClientListItem } from "../queries/list-clients";
import { ClientRow } from "./client-row";

type ClientsPanelProps = {
  clients: ClientListItem[];
  total: number;
};

/**
 * Carteira em tabela, para telas largas.
 *
 * A tabela tem largura mínima e rola horizontalmente dentro do painel: a
 * página em si nunca ganha rolagem lateral. Abaixo de `md`, este painel sai
 * de cena e os cards assumem.
 */
export const ClientsPanel = ({ clients, total }: ClientsPanelProps) => (
  <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
    <header className="flex min-h-14 items-center justify-between gap-4 border-b px-4">
      <strong className="text-sm">Carteira de clientes</strong>

      <span className="font-mono text-[10px] text-muted-foreground">
        {total} {total === 1 ? "resultado" : "resultados"}
      </span>
    </header>

    <div className="overflow-x-auto">
      {/* Sete colunas não cabem confortavelmente abaixo disto; o excedente
          rola dentro do painel. */}
      <Table className="min-w-240">
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Localidade</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atualização</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {clients.map((client) => (
            <ClientRow key={client.id} client={client} />
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
