import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  async function sendMessage() {
    const { available } = await window.ai.languageModel.capabilities();
    if (available === "no") {
      alert("Language model not available");
      return;
    }
    setMessages((oldMessages) => [
      ...oldMessages,
      { id: oldMessages.length + 1, content: message, role: "user" },
    ]);
    setMessage("");
    const session = await window.ai.languageModel.create();
    const result = await session.prompt(message);
    setMessages((oldMessages) => [
      ...oldMessages,
      { id: oldMessages.length + 1, content: result, role: "assistant" },
    ]);
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-semibold">AI Chat</h1>
      </header>
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex flex-col gap-2">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "rounded-lg bg-muted p-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="mx-auto flex max-w-3xl gap-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
