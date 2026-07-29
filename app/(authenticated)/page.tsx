import type { Metadata } from "next";

import { redirectAuth } from "@/utils/auth";

export const metadata: Metadata = {
  title: "Visão geral",
};

const DashboardPage = async () => {
  const user = await redirectAuth();

  return (
    <div className="grid gap-2">
      <p className="font-mono text-xs tracking-wider text-primary uppercase">
        Visão geral
      </p>

      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Bem-vindo, {user.name}.
      </h1>

      <p className="text-muted-foreground">
        Acompanhe o que exige sua atenção e o andamento operacional do
        escritório.
      </p>
    </div>
  );
};

export default DashboardPage;
