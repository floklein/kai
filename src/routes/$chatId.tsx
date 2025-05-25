import { ChatFooter } from "@/components/ChatFooter";
import { Message } from "@/components/Message";
import { useChat } from "@/hooks/useChat";
import { db } from "@/lib/db";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

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

  async function sendMessage(
    text: string,
    blobs: Blob[],
    callback: () => void,
  ) {
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
    callback();
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

  async function sendAudio(blob: Blob) {
    if (!session) {
      alert("No session");
      return;
    }
    const content: LanguageModelMessageContent[] = [
      {
        type: "audio",
        value: blob,
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
      <ChatFooter sendMessage={sendMessage} sendAudio={sendAudio} />
    </div>
  );
}
