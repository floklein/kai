import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ModeToggle } from "./ModeToggle";

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

  async function sendMessage(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (!message.length) {
      return;
    }
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

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
        <h1 className="text-lg font-semibold">kAI</h1>
        <ModeToggle />
      </header>
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex flex-col gap-2">
            {messagesList.map((messageId) => (
              <div key={messageId} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "flex",
                    messages[messageId]?.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg bg-muted p-3 text-sm max-w-[80%] whitespace-pre-line",
                      messages[messageId]?.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <Markdown
                      components={{
                        code(props) {
                          const { children, className, node, ...rest } = props;
                          const match = /language-(\w+)/.exec(className || "");
                          return match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              language={match[1]}
                              style={vscDarkPlus}
                              className="rounded-sm"
                            />
                          ) : (
                            <code {...rest} className={className}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {messages[messageId]?.content}
                    </Markdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 z-10 border-t bg-background p-4">
        <form onSubmit={sendMessage} className="mx-auto flex max-w-3xl gap-2">
          <Textarea
            autoFocus
            placeholder="Type your message..."
            className="flex-1 resize-none"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Button type="submit" className="self-end" disabled={!message.length}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
