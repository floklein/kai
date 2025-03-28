import { useCallback, useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<AILanguageModel | null>(null);

  const createSession = useCallback(async () => {
    const { available } = await window.ai.languageModel.capabilities();
    if (available === "no") {
      alert("Language model not available");
      return;
    }
    const s = await window.ai.languageModel.create();
    setSession(s);
  }, []);

  useEffect(() => {
    createSession();
  }, [createSession]);

  return session;
}
