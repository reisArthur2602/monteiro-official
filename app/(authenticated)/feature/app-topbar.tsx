import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ThemeToggle } from "./theme-toggle";

export const AppTopbar = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
      <SidebarTrigger />

      <Separator orientation="vertical" className="mr-1 h-4" />

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
};
