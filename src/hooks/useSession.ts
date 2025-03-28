import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<AILanguageModel | null>(null);

  async function createSession() {
    const { available } = await window.ai.languageModel.capabilities();
    if (available === "no") {
      alert("Language model not available");
      return;
    }
    const s = await window.ai.languageModel.create();
    setSession(s);
  }

  useEffect(() => {
    createSession();
  }, []);

  return session;
}
