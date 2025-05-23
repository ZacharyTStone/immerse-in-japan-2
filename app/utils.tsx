export function highlightWords(
  text: string,
  words: string[] = ["Japan"]
): JSX.Element {
  const parts = text.split(/(Japan)/i);
  return (
    <>
      {parts.map((part, index) =>
        words.includes(part) ? (
          <span key={index} className="text-red-500">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export function formatContentTypeLabel(
  contentType:
    | string
    | undefined
    | "text"
    | "video"
    | "audio"
    | "tool"
    | "game"
    | null
): string {
  const contentTypeLower = contentType?.toLowerCase();

  switch (contentTypeLower) {
    case "text":
      return "Text Review";
    case "video":
      return "Video Review";
    case "audio":
      return "Audio Review";
    case "tool":
      return "Tool Review";
    case "game":
      return "Game Review";
    default:
      return contentType + " Review";
  }
}
