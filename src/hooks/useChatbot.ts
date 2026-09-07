import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getChatHistory, sendMessage, streamMessage } from "@/api/chatbot";
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

export const useStreamMessage = () => {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const send = useCallback(
    async (data: ChatRequest, onChunk: (text: string) => void) => {
      setIsPending(true);

      try {
        await streamMessage(data, onChunk);
        queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      } finally {
        setIsPending(false);
      }
    },
    [queryClient],
  );

  return { send, isPending };
};
