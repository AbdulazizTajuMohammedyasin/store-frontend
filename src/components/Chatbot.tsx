import { useState } from "react";

import { useChatbot } from "@/hooks/useChatbot";

const Chatbot = () => {
  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);

  const [input, setInput] = useState("");

  const chatbot = useChatbot();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const response = await chatbot.mutateAsync({
      message: input,
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response.message[0]["text"],
      },
    ]);

    setInput("");
  };

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.role}</strong>
          <p>{message.content}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
