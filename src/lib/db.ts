import Dexie, { EntityTable } from "dexie";

interface Message extends AILanguageModelPrompt {
  uuid: string;
}

interface Chat {
  id: number;
  messages: Record<string, Message>;
  messagesList: string[];
}

const db = new Dexie("chat") as Dexie & {
  chats: EntityTable<Chat, "id">;
};

db.version(1).stores({
  chats: "++id, messages, messagesList",
});

export { db };
export type { Chat, Message };
