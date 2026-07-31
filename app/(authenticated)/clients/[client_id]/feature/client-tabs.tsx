"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  buildClientHref,
  buildClientIntakesHref,
} from "../../utils/build-clients-href";

type ClientTabsProps = {
  clientId: string;
  intakesCount: number;
};

/**
 * Abas do cliente. Só entram aqui seções com dado real por trás — nada de
 * Processos, Documentos, Atendimentos ou Agenda enquanto esses modelos não
 * existirem, para não linkar para lugar nenhum.
 */
export const ClientTabs = ({ clientId, intakesCount }: ClientTabsProps) => {
  const pathname = usePathname();

  const tabs = [
    { label: "Visão geral", href: buildClientHref(clientId), count: null },
    {
      label: "Fichas",
      href: buildClientIntakesHref(clientId),
      count: intakesCount,
    },
  ];

  return (
    <nav
      aria-label="Navegação do cliente"
      className="sticky top-16 z-20 -mx-4 flex gap-1 overflow-x-auto border-b bg-background/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex min-h-11 items-center gap-2 border-b-2 border-transparent px-3 text-sm font-semibold whitespace-nowrap text-muted-foreground hover:text-foreground",
              isActive && "border-primary text-foreground",
            )}
          >
            {tab.label}

            {tab.count !== null ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-muted px-1 font-mono text-[10px] text-muted-foreground">
                {tab.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
};
