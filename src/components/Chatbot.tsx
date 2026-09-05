import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

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
import { useChatHistory, useSendMessage } from "@/hooks/useChatbot";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chatbot";

let localMessageId = -1;

export default function Chatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const hydrated = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const history = useChatHistory(open && !!user);
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (history.data && !hydrated.current) {
      setMessages(history.data);
      hydrated.current = true;
    }
  }, [history.data]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, sendMessage.isPending]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = input.trim();
    if (!text || sendMessage.isPending) return;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: localMessageId--,
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const response = await sendMessage.mutateAsync({ message: text });

      setMessages((prev) => [
        ...prev,
        {
          id: localMessageId--,
          role: "assistant",
          content: response.message,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: localMessageId--,
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    }
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

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {message.content}
              </div>
            ))}

            {sendMessage.isPending && (
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                Typing...
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={sendMessage.isPending}
              />

              <Button
                type="submit"
                size="icon"
                disabled={sendMessage.isPending || !input.trim()}
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
