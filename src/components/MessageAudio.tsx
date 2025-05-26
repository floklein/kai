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
            "whitespace-pre-line",
            role === "user" && "max-w-[80%]",
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
