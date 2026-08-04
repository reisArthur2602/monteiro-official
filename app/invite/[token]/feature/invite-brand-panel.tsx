import { MailCheck, ShieldCheck } from "lucide-react";

import { userRoleLabels } from "@/app/(authenticated)/users/utils/user-labels";

import type { InvitationByToken } from "../queries/get-invitation-by-token";

const trustBadges = [
  "Ambiente protegido",
  "Criptografia em trânsito",
  "Acesso individual",
];

type InviteBrandPanelProps = {
  /** `null` quando o convite é inválido/expirado — o painel some o contexto
   *  do convite, mas mantém marca e mensagem de confiança. */
  invitation: InvitationByToken | null;
};

export const InviteBrandPanel = ({ invitation }: InviteBrandPanelProps) => (
  <section className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
    <span className="inline-flex w-fit items-center gap-3">
      <span className="grid size-11 place-items-center rounded-lg border border-white/20 bg-primary/20 font-heading text-2xl font-semibold">
        §
      </span>
      <span>
        <span className="block font-heading text-2xl font-semibold tracking-tight">
          Monteiro
        </span>
        <span className="block font-mono text-[11px] tracking-wide text-white/60 uppercase">
          Gestão jurídica
        </span>
      </span>
    </span>

    <div className="grid gap-7">
      <div className="grid gap-3">
        <p className="font-mono text-[11px] tracking-wide text-primary-foreground/70 uppercase">
          {invitation ? "Convite verificado" : "Convite"}
        </p>

        <h1 className="max-w-[13ch] font-heading text-5xl leading-[0.98] font-semibold tracking-tight">
          {invitation
            ? "Seu acesso começa aqui."
            : "Este link não é mais válido."}
        </h1>

        <p className="max-w-[46ch] text-sm leading-relaxed text-white/70">
          {invitation
            ? "Crie uma senha segura para acessar clientes, processos, prazos e documentos do escritório Monteiro."
            : "Peça a um administrador do escritório para enviar um novo convite."}
        </p>
      </div>

      {invitation ? (
        <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/20 text-white/90">
              <MailCheck className="size-4" />
            </span>

            <div>
              <strong className="block text-xs font-semibold">
                Convite enviado por {invitation.invitedByName}
              </strong>
              <small className="mt-0.5 block text-[10px] text-white/60">
                Este link é individual e válido por 7 dias.
              </small>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-0.5 rounded-lg border border-white/10 bg-black/15 p-2.5">
              <span className="font-mono text-[8px] tracking-wide text-white/50 uppercase">
                Conta
              </span>
              <strong className="truncate text-[11px]">
                {invitation.name}
              </strong>
            </div>

            <div className="grid gap-0.5 rounded-lg border border-white/10 bg-black/15 p-2.5">
              <span className="font-mono text-[8px] tracking-wide text-white/50 uppercase">
                Função
              </span>
              <strong className="truncate text-[11px]">
                {userRoleLabels[invitation.role]}
              </strong>
            </div>
          </div>
        </div>
      ) : null}
    </div>

    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-white/60">
      {trustBadges.map((badge) => (
        <li key={badge} className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3" aria-hidden="true" />
          {badge}
        </li>
      ))}
    </ul>
  </section>
);
