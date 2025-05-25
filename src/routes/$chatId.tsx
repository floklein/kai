import { Message } from "@/components/Message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/useChat";
import { db } from "@/lib/db";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";

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
              <Message key={messageId} message={messages[messageId]} />
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
          <div className="relative flex-1">
            <Textarea
              autoFocus
              placeholder="Type your message..."
              className="flex-1 resize-none pb-10"
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 left-2 h-6 w-6 rounded-full"
              asChild
            >
              <label htmlFor="file-input">
                <Plus className="h-4 w-4" />
              </label>
            </Button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={handleFilesChange}
            />
          </div>
          <Button type="submit" className="self-end" disabled={!text.length}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
