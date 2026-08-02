import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Acesso restrito",
};

const UnauthorizedPage = () => (
  <div className="grid min-h-[60vh] place-items-center">
    <div className="grid max-w-md justify-items-center gap-3 text-center">
      <span className="grid size-12 place-items-center rounded-xl border bg-accent text-accent-foreground">
        <ShieldAlert aria-hidden="true" />
      </span>

      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Acesso restrito
      </h1>

      <p className="text-muted-foreground">
        Sua conta não tem permissão para acessar esta área. Se você
        acredita que deveria ter acesso, procure um administrador do
        escritório.
      </p>

      <Button asChild className="mt-2">
        <Link href="/">Voltar para a visão geral</Link>
      </Button>
    </div>
  </div>
);

export default UnauthorizedPage;
