import { Check, ShieldAlert } from "lucide-react";

/**
 * As duas regras que o protótipo destaca na lateral. Ficam visíveis para
 * quem opera a tela porque explicam por que cliente, ficha e responsável
 * não são editáveis aqui.
 */
export const CaseRuleNotes = () => (
  <div className="grid gap-3">
    <section className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5 rounded-lg border border-chart-2/40 bg-chart-2/12 p-3 text-chart-2">
      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />

      <div>
        <strong className="block text-xs">Um processo por ficha</strong>

        <small className="mt-0.5 block text-[11px]">
          O servidor recusa a operação caso outro processo já tenha sido
          criado para esta ficha.
        </small>
      </div>
    </section>

    <section className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5 rounded-lg border border-chart-3/40 bg-chart-3/12 p-3 text-chart-3">
      <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />

      <div>
        <strong className="block text-xs">Validação no servidor</strong>

        <small className="mt-0.5 block text-[11px]">
          Cliente, ficha, responsável e auditoria vêm da sessão — nunca do
          navegador.
        </small>
      </div>
    </section>
  </div>
);
