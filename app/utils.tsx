export function highlightWords(
  text: string,
  words: string[] = ["Japan"]
): JSX.Element {
  const parts = text.split(/(Japan)/i);
  return (
    <>
      {parts.map((part, index) =>
        words.includes(part) ? (
          <span key={index} style={{ color: "red" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
