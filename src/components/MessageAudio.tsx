import type { Message } from "@/lib/db";
import { cn } from "@/lib/utils";

export function MessageAudio({
  role,
  audio,
}: {
  role: Message["role"];
  audio: Blob;
}) {
  const audioUrl = URL.createObjectURL(audio);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex",
          role === "user" ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn(
            "rounded-lg bg-muted text-sm max-w-[80%] whitespace-pre-line overflow-hidden",
            role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
          </audio>
        </div>
      </div>
    </div>
  );
}
