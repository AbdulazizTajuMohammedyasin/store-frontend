import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export function ChatMessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listItems.length === 0) return;

    const items = listItems.map((item, i) => (
      <li key={i}>{renderInline(item, `li-${blocks.length}-${i}`)}</li>
    ));

    blocks.push(
      listType === "ol" ? (
        <ol key={blocks.length} className="ml-4 list-decimal space-y-0.5">
          {items}
        </ol>
      ) : (
        <ul key={blocks.length} className="ml-4 list-disc space-y-0.5">
          {items}
        </ul>
      ),
    );

    listItems = [];
    listType = null;
  };

  lines.forEach((line, i) => {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/);
    const numberedMatch = line.match(/^\s*\d+\.\s+(.*)/);

    if (bulletMatch) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(bulletMatch[1]);
    } else if (numberedMatch) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(numberedMatch[1]);
    } else {
      flushList();
      if (line.trim() !== "") {
        blocks.push(<p key={`p-${i}`}>{renderInline(line, `p-${i}`)}</p>);
      }
    }
  });

  flushList();

  return <div className="space-y-1">{blocks}</div>;
}
