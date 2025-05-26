import type { Message } from "@/lib/db";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { MessageAudio } from "./MessageAudio";
import { MessageImage } from "./MessageImage";
import { MessageText } from "./MessageText";

export function Message({ message }: { message: Message }) {
  if (typeof message.content === "string") {
    return <MessageText role={message.role} text={message.content} />;
  }
  return (
    <PhotoProvider maskOpacity={0.75}>
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
        if (content.type === "audio") {
          return (
            <MessageAudio
              key={index}
              role={message.role}
              audio={content.value as Blob}
            />
          );
        }
        return null;
      })}
    </PhotoProvider>
  );
}
