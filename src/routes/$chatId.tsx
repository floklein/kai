import { Chat } from "@/components/Chat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
