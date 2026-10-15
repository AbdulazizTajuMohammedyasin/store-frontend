import axios from "axios";
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

const postStream = (data: ChatRequest, token: string | null) =>
  fetch(`${import.meta.env.VITE_API_URL}/chat/stream/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

// fetch bypasses the Axios interceptor in ./client, so refresh an expired
// access token here the same way: once, and clear the tokens if it fails.
const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/jwt/refresh/`,
      { refresh },
    );

    localStorage.setItem("access", response.data.access);
    return response.data.access;
  } catch {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return null;
  }
};

export const streamMessage = async (
  data: ChatRequest,
  onChunk: (text: string) => void,
): Promise<void> => {
  let response = await postStream(data, localStorage.getItem("access"));

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) response = await postStream(data, newToken);
  }

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
