import { db } from "@/lib/db";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/new")({
  beforeLoad: async () => {
    const id = await db.chats.add({
      messages: {},
      messagesList: [],
    });
    return redirect({
      to: "/$chatId",
      params: { chatId: id.toString() },
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
