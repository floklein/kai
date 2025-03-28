import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    return redirect({
      to: "/$chatId",
      params: { chatId: crypto.randomUUID() },
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
