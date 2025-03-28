import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { BotMessageSquare } from "lucide-react";

function createLinks(quantity: number) {
  return Array.from({ length: quantity }, (_, i) => ({
    title: `Chat ${i + 1}`,
    url: `/${crypto.randomUUID()}`,
  }));
}

const data = [
  {
    title: "Today",
    items: createLinks(2),
  },
  {
    title: "This week",
    items: createLinks(5),
  },
  {
    title: "This month",
    items: createLinks(10),
  },
  {
    title: "Others",
    items: createLinks(20),
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 px-4 flex flex-row items-center gap-2">
        <BotMessageSquare className="w-6 h-6" />
        <h1 className="text-lg font-semibold">kAI</h1>
      </SidebarHeader>
      <SidebarContent>
        {data.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
