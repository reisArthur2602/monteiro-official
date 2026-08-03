import { CircleAlert, CircleCheck } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { ClientContext } from "../../queries/get-client-context";
import {
  buildClientReadinessGroups,
  calculateReadinessScore,
} from "../utils/resolve-client-template-variables";

type ClientDataReadinessPanelProps = {
  client: ClientContext;
};

/**
 * Completude do cadastro do cliente frente aos dados que os modelos podem
 * usar. Não é específico de um template — é a mesma leitura para qualquer
 * modelo que use variáveis de cliente.
 */
export const ClientDataReadinessPanel = ({
  client,
}: ClientDataReadinessPanelProps) => {
  const groups = buildClientReadinessGroups(client);
  const score = calculateReadinessScore(groups);

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <header className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Dados disponíveis</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Variáveis reutilizadas pelos modelos.
        </p>
      </header>

      <div className="grid gap-4 p-4">
        <div className="grid gap-2">
          <div className="flex items-end justify-between gap-3">
            <strong className="font-mono text-2xl leading-none">
              {score}%
            </strong>
            <span className="text-xs text-muted-foreground">
              cadastro completo
            </span>
          </div>

          <Progress value={score} />
        </div>

        <div className="grid gap-2">
          {groups.flatMap((group) =>
            group.items.map((item) => (
              <div
                key={item.key}
                className={cn(
                  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border p-2.5",
                  item.resolved
                    ? "bg-muted/40"
                    : "border-chart-3/40 bg-chart-3/8",
                )}
              >
                {item.resolved ? (
                  <CircleCheck
                    aria-hidden="true"
                    className="size-4 text-chart-2"
                  />
                ) : (
                  <CircleAlert
                    aria-hidden="true"
                    className="size-4 text-chart-3"
                  />
                )}

                <div className="grid min-w-0 gap-0.5">
                  <strong className="truncate text-xs font-semibold">
                    {item.label}
                  </strong>
                  <small className="text-[11px] text-muted-foreground">
                    {group.label}
                  </small>
                </div>

                <small className="text-[11px] whitespace-nowrap text-muted-foreground">
                  {item.resolved ? "Completo" : "Pendente"}
                </small>
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
};
