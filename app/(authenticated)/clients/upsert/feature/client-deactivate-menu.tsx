"use client";

import { MoreVertical, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ClientDeactivateMenuProps = {
  isInactive: boolean;
  isPending: boolean;
  onDeactivate: () => void;
};

/**
 * Única fonte da ação destrutiva do cadastro, usada tanto no cabeçalho
 * quanto na barra mobile — a mesma definição, só reposicionada por
 * breakpoint, nunca duplicada.
 *
 * Fica em um menu, separada visualmente de Cancelar/Salvar, porque é a
 * única ação destrutiva da tela.
 */
export const ClientDeactivateMenu = ({
  isInactive,
  isPending,
  onDeactivate,
}: ClientDeactivateMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button type="button" variant="ghost" size="icon" aria-label="Mais ações do cliente">
        <MoreVertical aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem
        variant="destructive"
        disabled={isPending || isInactive}
        onSelect={onDeactivate}
      >
        <UserX aria-hidden="true" />
        {isInactive ? "Cliente inativo" : "Desativar cliente"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
