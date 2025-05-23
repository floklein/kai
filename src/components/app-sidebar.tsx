import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import { getMessageContent } from "@/lib/message";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import {
  BotMessageSquare,
  CirclePlus,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { ComponentProps } from "react";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const router = useRouter();

  const chats = useLiveQuery(() => db.chats.reverse().toArray());

  function deleteChat(id: number) {
    return async () => {
      await db.chats.delete(id);
      router.navigate({
        to: "/",
      });
    };
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 px-4 flex flex-row items-center gap-2">
        <BotMessageSquare className="w-6 h-6" />
        <h1 className="text-lg font-semibold">kAI</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/new"}>
                  <Link to="/new">
                    <CirclePlus />
                    <span>New chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats?.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/${chat.id}`}
                  >
                    <Link to="/$chatId" params={{ chatId: chat.id.toString() }}>
                      <span className="truncate">
                        {getMessageContent(
                          chat.messages[chat.messagesList[0]],
                        ) || "New chat"}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={deleteChat(chat.id)}>
                        <Trash2 />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
