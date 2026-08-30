import axiosInstance from "./client";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;
}

export const sendMessage = async (
  data: ChatRequest,
): Promise<ChatResponse> => {
  const response = await axiosInstance.post(
    "/chat/",
    data,
  );

  return response.data;
};