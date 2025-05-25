import type { Message } from "@/lib/db";

import { MessageImage } from "./MessageImage";
import { MessageText } from "./MessageText";

export function Message({ message }: { message: Message }) {
  if (typeof message.content === "string") {
    return <MessageText role={message.role} text={message.content} />;
  }
  return (
    <>
      {message.content.map((content, index) => {
        if (typeof content.value === "string") {
          return (
            <MessageText key={index} role={message.role} text={content.value} />
          );
        }
        if (content.type === "image") {
          return (
            <MessageImage
              key={index}
              role={message.role}
              image={content.value as Blob}
            />
          );
        }
        return null;
      })}
    </>
  );
}
