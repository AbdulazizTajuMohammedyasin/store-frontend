import { useEffect, useRef, useState } from "react";
import { MessageCircle, RotateCcw, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useChatHistory, useStreamMessage } from "@/hooks/useChatbot";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chatbot";
import { ChatMessageContent } from "./ChatMessageContent";

let localMessageId = -1;

export default function Chatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [failedText, setFailedText] = useState<string | null>(null);

  const hydrated = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const history = useChatHistory(open && !!user);
  const streamMessage = useStreamMessage();

  useEffect(() => {
    if (history.data && !hydrated.current) {
      setMessages(history.data);
      hydrated.current = true;
    }
  }, [history.data]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streamMessage.isPending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!user) return null;

  const sendMessageText = async (text: string) => {
    setFailedText(null);

    setMessages((prev) => [
      ...prev,
      {
        id: localMessageId--,
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      },
    ]);

    const assistantId = localMessageId--;

    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      },
    ]);

    const appendToAssistant = (chunk: string) => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? { ...message, content: message.content + chunk }
            : message,
        ),
      );
    };

    try {
      await streamMessage.send({ message: text }, appendToAssistant);
    } catch {
      setMessages((prev) => prev.filter((message) => message.id !== assistantId));
      setFailedText(text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = input.trim();
    if (!text || streamMessage.isPending) return;

    setInput("");
    await sendMessageText(text);
  };

  const handleRetry = () => {
    if (failedText) sendMessageText(failedText);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          id="chat-panel"
          aria-label="Shopping assistant"
          className="flex h-[min(32rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-xl sm:w-96"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border py-1 pr-1 pl-4">
            <h2 className="font-display text-base font-semibold [font-stretch:112%]">
              Shopping assistant
            </h2>

            <Button
              variant="ghost"
              size="icon"
              className="size-11 rounded-none"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="size-5" />
            </Button>
          </div>

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <p className="max-w-[30ch] text-sm text-muted-foreground">
                Ask me about products, orders, or anything else about the
                store.
              </p>
            )}

            {messages.map((message) => {
              const isStreamingPlaceholder =
                message.role === "assistant" &&
                message.content === "" &&
                streamMessage.isPending;

              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={cn("flex", isUser && "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] px-3 py-2 text-sm leading-relaxed",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-tile text-foreground",
                      isStreamingPlaceholder && "text-muted-foreground",
                    )}
                  >
                    <span className="sr-only">
                      {isUser ? "You:" : "Assistant:"}
                    </span>
                    {isStreamingPlaceholder ? (
                      "Typing..."
                    ) : (
                      <ChatMessageContent content={message.content} />
                    )}
                  </div>
                </div>
              );
            })}

            {failedText && (
              <div
                role="alert"
                className="flex items-center justify-between gap-3 border border-destructive/30 bg-destructive/5 py-1 pr-1 pl-3 text-sm text-destructive"
              >
                <span>Something went wrong.</span>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 gap-1.5 rounded-none bg-background px-3 text-foreground"
                  onClick={handleRetry}
                >
                  <RotateCcw className="size-4" />
                  Retry
                </Button>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-border p-3"
          >
            <label htmlFor="chat-message" className="sr-only">
              Message
            </label>
            <Input
              id="chat-message"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
              className="h-11 rounded-none"
              disabled={streamMessage.isPending}
            />

            <Button
              type="submit"
              size="icon"
              className="size-11 shrink-0 rounded-none"
              disabled={streamMessage.isPending || !input.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </section>
      )}

      <Button
        size="icon-lg"
        className="size-12 rounded-none shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        aria-controls={open ? "chat-panel" : undefined}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}
