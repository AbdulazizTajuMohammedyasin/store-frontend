import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SiteHeader />

        <main className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
