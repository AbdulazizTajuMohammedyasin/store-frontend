import * as React from "react";
import {
  LayoutDashboardIcon,
  PackageIcon,
  FolderIcon,
  ShoppingCartIcon,
  UsersIcon,
  SettingsIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: <PackageIcon />,
    },
    {
      title: "Collections",
      url: "/admin/collections",
      icon: <FolderIcon />,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: <UsersIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: <SettingsIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/admin">
                <span className="text-base font-semibold">DexShop Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
