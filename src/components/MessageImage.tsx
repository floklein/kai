import type { Message } from "@/lib/db";
import { cn } from "@/lib/utils";
import { PhotoView } from "react-photo-view";

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
            "whitespace-pre-line overflow-hidden",
            role === "user" && "max-w-[80%] rounded-lg bg-muted",
          )}
        >
          <PhotoView src={imageUrl}>
            <img
              src={imageUrl}
              alt="Image"
              className="w-full h-full object-contain hover:brightness-80"
            />
          </PhotoView>
        </div>
      </div>
    </div>
  );
}
