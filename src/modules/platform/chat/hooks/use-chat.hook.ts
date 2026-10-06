import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chat.service';
import type { IMessage, ISendMessageInput } from '../types/chat.types';

export const useChatMessages = (channelId: string) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!channelId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = chatService.getMessagesListener(
      channelId,
      updated => {
        setMessages(updated);
        setLoading(false);
      },
      err => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [channelId]);

  const sendMessage = useCallback(
    async (input: Omit<ISendMessageInput, 'channelId'>) => {
      return chatService.sendMessage({ ...input, channelId });
    },
    [channelId]
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
};

