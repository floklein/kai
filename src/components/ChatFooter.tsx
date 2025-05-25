import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, X } from "lucide-react";
import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useState,
} from "react";
import { RecordButton } from "./RecordButton";

export function ChatFooter({
  sendMessage,
  sendAudio,
}: {
  sendMessage: (
    text: string,
    blobs: Blob[],
    callback: () => void,
  ) => Promise<void>;
  sendAudio: (blob: Blob) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [blobs, setBlobs] = useState<Blob[]>([]);

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }
    const imageFiles = Array.from(e.target.files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => new Blob([file]));
    setBlobs((oldBlobs) => [...oldBlobs, ...imageFiles]);
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    if (!e.clipboardData.files.length) {
      return;
    }
    const imageFiles = Array.from(e.clipboardData.files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => new Blob([file]));
    setBlobs((oldBlobs) => [...oldBlobs, ...imageFiles]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sendMessage(text, blobs, () => {
      setText("");
      setBlobs([]);
    });
  }

  async function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage(text, blobs, () => {
        setText("");
        setBlobs([]);
      });
    }
  }

  function handleRemoveBlob(index: number) {
    return () => {
      setBlobs((oldBlobs) => oldBlobs.filter((_, i) => i !== index));
    };
  }

  return (
    <div className="sticky bottom-0 z-10 border-t bg-background p-4">
      {blobs.length > 0 && (
        <div className="mx-auto max-w-3xl flex gap-2 mb-4 overflow-x-auto">
          {blobs.map((blob, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(blob)}
                alt={`Preview ${index + 1}`}
                className="h-20 w-20 object-cover rounded-lg"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={handleRemoveBlob(index)}
                className="absolute top-1 right-1 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2">
        <div className="relative flex-1">
          <Textarea
            autoFocus
            placeholder="Type your message..."
            className="flex-1 resize-none pb-13"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-2 left-2 rounded-full"
                asChild
              >
                <label htmlFor="file-input">
                  <Plus />
                </label>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add an image</TooltipContent>
          </Tooltip>
          <input
            id="file-input"
            value=""
            type="file"
            accept="image/*"
            hidden
            multiple
            onChange={handleFilesChange}
          />
          <RecordButton
            className="absolute bottom-2 right-2"
            onRecord={sendAudio}
          />
        </div>
      </form>
    </div>
  );
}
