import { useMutation } from "@tanstack/react-query";

import {sendMessage,type ChatRequest,} from "@/api/chatbot";


export const useChatbot = () => {
  return useMutation({
    mutationFn: (data: ChatRequest) =>
      sendMessage(data),
  });
};