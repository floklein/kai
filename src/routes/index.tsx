import { db } from "@/lib/db";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const firstChat = await db.chats.reverse().first();
    return redirect(
      firstChat
        ? {
            to: `/$chatId`,
            params: { chatId: firstChat.id.toString() },
          }
        : { to: "/new" }
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/"!</div>;
}
