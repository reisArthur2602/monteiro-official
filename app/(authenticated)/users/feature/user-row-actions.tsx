"use client";

import {
  MailPlus,
  MoreHorizontal,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deactivateUser } from "../actions/deactivate-user";
import { reactivateUser } from "../actions/reactivate-user";
import { resendInvitation } from "../actions/resend-invitation";
import { revokeInvitation } from "../actions/revoke-invitation";
import type { UserListItem } from "../queries/list-users";
import { UserListStatus } from "../schemas/list-users-params-schema";

type UserRowActionsProps = {
  item: UserListItem;
};

/**
 * Uma ação por linha, condicionada ao tipo (usuário real ou convite
 * pendente) e ao status atual — nunca as duas juntas (ex.: "Desativar" e
 * "Reativar" no mesmo menu).
 */
export const UserRowActions = ({ item }: UserRowActionsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<
    "deactivate" | "revoke" | null
  >(null);

  const run = (action: () => Promise<{ ok: boolean; message: string }>) => {
    startTransition(async () => {
      const result = await action();

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setConfirmAction(null);
      router.refresh();
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Mais ações para ${item.name}`}
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {item.kind === "user" && item.status === UserListStatus.ATIVO ? (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                setConfirmAction("deactivate");
              }}
            >
              <UserX aria-hidden="true" />
              Desativar usuário
            </DropdownMenuItem>
          ) : null}

          {item.kind === "user" && item.status === UserListStatus.INATIVO ? (
            <DropdownMenuItem
              disabled={isPending}
              onSelect={() => run(() => reactivateUser(item.id))}
            >
              <UserCheck aria-hidden="true" />
              Reativar usuário
            </DropdownMenuItem>
          ) : null}

          {item.kind === "invitation" ? (
            <DropdownMenuItem
              disabled={isPending}
              onSelect={() => run(() => resendInvitation(item.id))}
            >
              <MailPlus aria-hidden="true" />
              Reenviar convite
            </DropdownMenuItem>
          ) : null}

          {item.kind === "invitation" ? (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                setConfirmAction("revoke");
              }}
            >
              <XCircle aria-hidden="true" />
              Cancelar convite
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "revoke"
                ? "Cancelar convite?"
                : "Desativar usuário?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {confirmAction === "revoke" ? (
                <>
                  O link enviado para <strong>{item.email}</strong> deixa de
                  funcionar.
                </>
              ) : (
                <>
                  <strong>{item.name}</strong> perde acesso ao sistema
                  imediatamente. A conta pode ser reativada depois.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();

                if (confirmAction === "revoke") {
                  run(() => revokeInvitation(item.id));
                  return;
                }

                run(() => deactivateUser(item.id));
              }}
              disabled={isPending}
            >
              {isPending
                ? "Aguarde..."
                : confirmAction === "revoke"
                  ? "Cancelar convite"
                  : "Desativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
