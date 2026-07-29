import { Button } from "@/components/ui/button";
import { redirectAuth } from "@/utils/auth";

import { logout } from "./(public)/auth/actions/logout";

const HomePage = async () => {
  const user = await redirectAuth();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm text-muted-foreground">Bem-vindo,</p>
      <h1 className="font-heading text-3xl font-semibold">{user.name}</h1>

      <form action={logout}>
        <Button type="submit" variant="outline">
          Sair
        </Button>
      </form>
    </main>
  );
};

export default HomePage;
