export type NotificationType = 'order' | 'promo' | 'system' | 'chat' | 'general';

export type NotificationFilter = 'all' | 'unread' | 'order' | 'system' | 'promo';

export interface INotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  data?: Record<string, any>;
  route?: string;
}

export interface INotificationState {
  notifications: INotification[];
  unreadCount: number;
}

