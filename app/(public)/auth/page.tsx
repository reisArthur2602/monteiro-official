import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { redirectIfAuthenticated } from "@/utils/auth";

import { LoginForm } from "./feature/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

const securityHighlights = [
  "Sessões podem ser identificadas e revogadas pelo administrador.",
  "Ações relevantes permanecem registradas na trilha de auditoria.",
  "O acesso respeita o papel e as permissões de cada usuário.",
];

const AuthPage = async () => {
  await redirectIfAuthenticated("/");

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
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

        <div className="grid gap-8">
          <div className="grid gap-4">
            <h1 className="max-w-[13ch] font-heading text-5xl leading-[0.98] font-semibold tracking-tight">
              O trabalho jurídico, com contexto preservado.
            </h1>
            <p className="max-w-[52ch] text-base leading-relaxed text-white/70">
              Acesse processos, prazos, documentos e histórico operacional em um
              ambiente centralizado para a equipe do escritório.
            </p>
          </div>

          <ul className="grid gap-3">
            {securityHighlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-white/80"
              >
                <span className="grid size-7 flex-none place-items-center rounded-full border border-white/20 bg-primary/15 text-white">
                  <ShieldCheck className="size-3.5" />
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-dashed border-white/25 px-3 py-2 font-mono text-[11px] tracking-wide text-white/70 uppercase">
          Acesso seguro · Sessão auditável
        </span>
      </section>

      <section className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="grid w-full max-w-md gap-8">
          <header className="grid gap-3">
            <p className="font-mono text-xs tracking-wide text-primary uppercase">
              Área restrita
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              Entre na sua conta
            </h2>
            <p className="text-sm text-muted-foreground">
              Use o e-mail profissional cadastrado pelo escritório.
            </p>
          </header>

          <LoginForm />

          <p className="text-center text-xs text-muted-foreground">
            Ao entrar, você concorda com as regras de uso e a política de
            privacidade do escritório.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
