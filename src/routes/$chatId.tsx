import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/useChat";
import { db } from "@/lib/db";
import { getMessageContent } from "@/lib/message";
import { cn } from "@/lib/utils";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { X } from "lucide-react";
import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const Route = createFileRoute("/$chatId")({
  beforeLoad: async ({ params }) => {
    try {
      const chat = await db.chats.get(Number(params.chatId));
      if (!chat) {
        throw new Error("Chat not found");
      }
    } catch (error) {
      console.error(error);
      return redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const chatId = Number(Route.useParams().chatId);

  const { session, messages, messagesList, addMessage, appendMessage } =
    useChat(chatId);

  const [text, setText] = useState("");
  const [blobs, setBlobs] = useState<Blob[]>([]);

  async function sendMessage(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (!text.length) {
      return;
    }
    if (!session) {
      alert("No session");
      return;
    }
    const content: LanguageModelMessageContent[] = [
      ...blobs.map(
        (blob): LanguageModelMessageContent => ({
          type: "image",
          value: blob,
        }),
      ),
      {
        type: "text",
        value: text,
      },
    ];
    const stream = session.promptStreaming([
      {
        role: "user",
        content,
      },
    ]);
    await addMessage({
      role: "user",
      content,
    });
    setText("");
    setBlobs([]);
    const newAssistantMessageUuid = await addMessage({
      role: "assistant",
      content: "",
    });
    if (!newAssistantMessageUuid) {
      alert("Failed to add message");
      return;
    }
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      await appendMessage(newAssistantMessageUuid, value);
    }
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) {
      return;
    }
    const imageFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => new Blob([file]));
    setBlobs((oldBlobs) => [...oldBlobs, ...imageFiles]);
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const files = e.clipboardData.files;
    if (!files.length) {
      return;
    }
    const imageFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => new Blob([file]));
    setBlobs((oldBlobs) => [...oldBlobs, ...imageFiles]);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleRemoveBlob(index: number) {
    return () => {
      setBlobs((oldBlobs) => oldBlobs.filter((_, i) => i !== index));
    };
  }

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex flex-col gap-2">
            {messagesList.map((messageId) => (
              <div key={messageId} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "flex",
                    messages[messageId]?.role === "user"
                      ? "justify-end"
                      : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg bg-muted p-3 text-sm max-w-[80%] whitespace-pre-line",
                      messages[messageId]?.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
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
                      {getMessageContent(messages[messageId])}
                    </Markdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 z-10 border-t bg-background p-4">
        {blobs.length > 0 && (
          <div className="mx-auto max-w-3xl flex gap-2 mb-4 overflow-x-auto">
            {blobs.map((blob, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(blob)}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleRemoveBlob(index)}
                  className="absolute top-1 right-1 h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={sendMessage} className="mx-auto flex max-w-3xl gap-2">
          <Textarea
            autoFocus
            placeholder="Type your message..."
            className="flex-1 resize-none"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
          />
          <Button type="submit" className="self-end" disabled={!text.length}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
