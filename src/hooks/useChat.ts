import { db, Message } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useState } from "react";

export function useChat(chatId: number) {
  const [session, setSession] = useState<LanguageModel | null>(null);

  const createSession = useCallback(async () => {
    const chat = await db.chats.get(chatId);
    if (!chat) {
      alert("Chat not found");
      return;
    }
    const availability = await LanguageModel.availability();
    if (availability === "unavailable") {
      alert("Language model not available");
      setSession(null);
      return;
    }
    const s = await LanguageModel.create({
      initialPrompts: chat.messagesList.map((uuid) => chat.messages[uuid]),
    });
    setSession(s);
  }, [chatId]);

  useEffect(() => {
    createSession();
  }, [createSession]);

  async function appendMessage(messageId: string, content: string) {
    const chat = await db.chats.get(chatId);
    if (!chat) {
      alert("Chat not found");
      return;
    }
    const { messages } = chat;
    await db.chats.update(chatId, {
      messages: {
        ...messages,
        [messageId]: {
          ...messages[messageId],
          content: messages[messageId].content + content,
        },
      },
    });
  }

  async function addMessage(message: Omit<Message, "uuid">) {
    const chat = await db.chats.get(chatId);
    if (!chat) {
      alert("Chat not found");
      return;
    }
    const uuid = crypto.randomUUID();
    await db.chats.update(chat.id, {
      messages: {
        ...chat.messages,
        [uuid]: { ...message, uuid },
      },
      messagesList: [...chat.messagesList, uuid],
    });
    return uuid;
  }

  const chat = useLiveQuery(() => db.chats.get(chatId), [chatId]);

  return {
    session,
    messages: chat?.messages ?? {},
    messagesList: chat?.messagesList ?? [],
    addMessage,
    appendMessage,
  };
}
