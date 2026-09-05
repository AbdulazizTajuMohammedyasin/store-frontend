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
