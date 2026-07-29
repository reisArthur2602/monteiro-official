import { cookies } from "next/headers";
import type { PropsWithChildren } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirectAuth } from "@/utils/auth";

import { AppSidebar } from "./feature/app-sidebar";
import { AppTopbar } from "./feature/app-topbar";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

const AuthenticatedLayout = async ({ children }: PropsWithChildren) => {
  const user = await redirectAuth();

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={user} />

      <SidebarInset>
        <AppTopbar />

        <div className="mx-auto w-full max-w-360 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;
