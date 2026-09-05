import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getChatHistory, sendMessage } from "@/api/chatbot";
import type { ChatRequest } from "@/types/chatbot";

export const useChatHistory = (enabled: boolean) => {
  return useQuery({
    queryKey: ["chat-history"],
    queryFn: getChatHistory,
    enabled,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatRequest) => sendMessage(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
    },
  });
};
