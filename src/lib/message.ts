export function getMessageContent(
  message: LanguageModelMessage | undefined,
): string {
  if (message === undefined) {
    return "";
  }
  if (typeof message.content === "string") {
    return message.content;
  }
  const text = message.content.filter((content) => content.type === "text");
  return text.map((content) => content.value).join("");
}
