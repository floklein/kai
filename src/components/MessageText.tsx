import type { Message } from "@/lib/db";
import { cn } from "@/lib/utils";

import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function MessageText({
  role,
  text,
}: {
  role: Message["role"];
  text: string;
}) {
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
            "rounded-lg bg-muted p-3 text-sm max-w-[80%] whitespace-pre-line",
            role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          <Markdown
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={vscDarkPlus}
                    className="rounded-sm"
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {text}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
