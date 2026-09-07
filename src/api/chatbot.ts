import client from "./client";
import type { ChatMessage, ChatRequest, ChatResponse } from "@/types/chatbot";

export const sendMessage = async (
  data: ChatRequest,
): Promise<ChatResponse> => {
  const response = await client.post<ChatResponse>("/chat/", data);

  return response.data;
};

export const getChatHistory = async (): Promise<ChatMessage[]> => {
  const response = await client.get<ChatMessage[]>("/chat/");

  return response.data;
};

export const streamMessage = async (
  data: ChatRequest,
  onChunk: (text: string) => void,
): Promise<void> => {
  const token = localStorage.getItem("access");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat/stream/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok || !response.body) {
    throw new Error(`Chat stream request failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    if (text) onChunk(text);
  }
};
