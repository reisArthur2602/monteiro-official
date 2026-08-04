import { ShieldAlert } from "lucide-react";

type InvalidInvitationCardProps = {
  officeEmail: string | undefined;
};

export const InvalidInvitationCard = ({
  officeEmail,
}: InvalidInvitationCardProps) => (
  <div className="grid w-full max-w-md justify-items-center gap-4 rounded-2xl border bg-card p-8 text-center shadow-lg">
    <span className="grid size-14 place-items-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
      <ShieldAlert className="size-6" aria-hidden="true" />
    </span>

    <div className="grid gap-1.5">
      <h2 className="font-heading text-xl font-semibold">
        Convite inválido ou expirado
      </h2>

      <p className="text-sm text-muted-foreground">
        Este link já foi usado, expirou ou foi cancelado pelo escritório.
      </p>
    </div>

    {officeEmail ? (
      <a
        href={`mailto:${officeEmail}`}
        className="text-sm font-semibold text-primary hover:underline"
      >
        Falar com o escritório
      </a>
    ) : null}
  </div>
);
