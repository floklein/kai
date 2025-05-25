import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between sticky top-0 bg-background z-10">
          <SidebarTrigger className="-ml-2" />
          <ModeToggle />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
