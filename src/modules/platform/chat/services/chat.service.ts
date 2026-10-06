import { isFirebaseConfigured, getFirebaseDatabase } from '@core/firebase/firebase';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type DocumentData,
  type QuerySnapshot,
} from '@react-native-firebase/firestore';
import { Storage, getJson } from '@core/storage/storage';
import type { IMessage, ISendMessageInput } from '../types/chat.types';

const CHAT_STORAGE_PREFIX = '@chat.channel.';

class ChatService {
  private static instance: ChatService;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Listens for real-time messages in a channel.
   * Uses Firebase Firestore if configured, otherwise falls back to local storage sync.
   */
  public getMessagesListener(
    channelId: string,
    onUpdate: (messages: IMessage[]) => void,
    onError?: (error: unknown) => void
  ): () => void {
    if (isFirebaseConfigured()) {
      try {
        const firestore = getFirebaseDatabase();
        const messagesRef = collection(firestore, 'channels', channelId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

        return onSnapshot(
          messagesQuery,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const messages: IMessage[] = snapshot?.docs.map(item => {
              const data = item.data();
              const createdAt = data?.createdAt?.seconds
                ? new Date(data.createdAt.seconds * 1000)
                : new Date();
              return {
                id: item.id,
                channelId,
                text: data.text ?? '',
                senderId: data.senderId ?? '',
                senderName: data.senderName,
                imageUri: data.imageUri,
                createdAt,
                status: data.status ?? 'sent',
              };
            }) ?? [];
            onUpdate(messages);
          },
          (err: unknown) => {
            onError?.(err);
          }
        );
      } catch (e) {
        onError?.(e);
      }
    }

    // Offline / fallback listener using local storage
    const local = getJson<IMessage[]>(`${CHAT_STORAGE_PREFIX}${channelId}`) ?? [];
    onUpdate(local);
    return () => {};
  }

  /**
   * Sends a message into the channel.
   */
  public async sendMessage(input: ISendMessageInput): Promise<IMessage> {
    const newMessage: IMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channelId: input.channelId,
      text: input.text,
      senderId: input.senderId,
      senderName: input.senderName,
      imageUri: input.imageUri,
      createdAt: new Date(),
      status: 'sent',
    };

    if (isFirebaseConfigured()) {
      try {
        const firestore = getFirebaseDatabase();
        const docRef = doc(firestore, 'channels', input.channelId, 'messages', newMessage.id);
        await setDoc(docRef, {
          ...newMessage,
          createdAt: { seconds: Math.floor(newMessage.createdAt.getTime() / 1000) },
        });
      } catch {
        // Fallback to storing locally if network/firebase error
      }

    }

    const key = `${CHAT_STORAGE_PREFIX}${input.channelId}`;
    const existing = getJson<IMessage[]>(key) ?? [];
    Storage.set(key, [...existing, newMessage]);

    return newMessage;
  }
}

export const chatService = ChatService.getInstance();
