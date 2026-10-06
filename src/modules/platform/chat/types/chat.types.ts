export interface IMessage {
  id: string;
  channelId: string;
  text: string;
  senderId: string;
  senderName?: string;
  imageUri?: string;
  createdAt: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface IChatRoom {
  id: string;
  channelId: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: number;
}

export interface ISendMessageInput {
  channelId: string;
  text: string;
  senderId: string;
  senderName?: string;
  imageUri?: string;
}

