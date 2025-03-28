import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Markdown from "react-markdown";

interface Message {
  content: string;
  role: "user" | "assistant";
}

export function Chat() {
  const session = useSession();

  const [messages, setMessages] = useState<Record<string, Message>>({});
  const [messagesList, setMessagesList] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function addMessage(message: Message): string {
    const uuid = crypto.randomUUID();
    setMessages((oldMessages) => ({
      ...oldMessages,
      [uuid]: message,
    }));
    setMessagesList((oldMessagesList) => [...oldMessagesList, uuid]);
    return uuid;
  }

  async function sendMessage() {
    if (!session) {
      alert("No session");
      return;
    }
    addMessage({ content: message, role: "user" });
    setMessage("");
    const newAssistantMessageUuid = addMessage({
      content: "",
      role: "assistant",
    });
    const stream = session.promptStreaming(message);
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      setMessages((oldMessages) => {
        const newMessage = oldMessages[newAssistantMessageUuid];
        return {
          ...oldMessages,
          [newAssistantMessageUuid]: {
            ...newMessage,
            content: newMessage.content + value,
          },
        };
      });
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-semibold">AI Chat</h1>
      </header>
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex flex-col gap-2">
            {messagesList.map((messageId) => (
              <div key={messageId} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "rounded-lg bg-muted p-3 text-sm",
                    messages[messageId]?.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <Markdown>{messages[messageId]?.content}</Markdown>
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
