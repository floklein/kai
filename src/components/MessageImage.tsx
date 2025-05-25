import type { Message } from "@/lib/db";
import { cn } from "@/lib/utils";

export function MessageImage({
  role,
  image,
}: {
  role: Message["role"];
  image: Blob;
}) {
  const imageUrl = URL.createObjectURL(image);
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
          <img
            src={imageUrl}
            alt="Image"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
