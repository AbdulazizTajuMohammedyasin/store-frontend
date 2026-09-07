import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, RotateCcw, Send, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <Card className="flex h-[28rem] w-80 flex-col p-0 shadow-lg sm:w-96">
          <CardHeader className="flex flex-row items-center justify-between border-b py-3">
            <CardTitle>Shopping Assistant</CardTitle>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>

          <CardContent
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto py-3"
          >
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
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
                  className={cn(
                    "flex items-end gap-2",
                    isUser && "flex-row-reverse",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-foreground",
                    )}
                  >
                    {isUser ? (
                      <User className="size-3.5" />
                    ) : (
                      <Bot className="size-3.5" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                      isStreamingPlaceholder && "text-muted-foreground",
                    )}
                  >
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
              <div className="flex items-center justify-between gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <span>Something went wrong.</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1"
                  onClick={handleRetry}
                >
                  <RotateCcw className="size-3.5" />
                  Retry
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={streamMessage.isPending}
              />

              <Button
                type="submit"
                size="icon"
                disabled={streamMessage.isPending || !input.trim()}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        size="icon-lg"
        className="size-12 rounded-full shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="size-5" />
      </Button>
    </div>
  );
}
