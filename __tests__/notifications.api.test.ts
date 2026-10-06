import {
  fetchNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi,
  clearAllNotificationsApi,
} from '../src/modules/platform/notifications/services/notifications.api';
import { Storage } from '../src/core/storage/storage';

const NOTIFICATIONS_KEY = '@notifications.list';

const mockTestNotifications = [
  {
    id: 'test-notif-1',
    title: 'Order Confirmed',
    body: 'Your order was placed successfully',
    type: 'order' as const,
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: 'test-notif-2',
    title: 'Weekly Deal',
    body: 'Save 20% on groceries',
    type: 'promo' as const,
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: 'test-notif-3',
    title: 'Account Update',
    body: 'Password changed successfully',
    type: 'system' as const,
    createdAt: new Date().toISOString(),
    isRead: true,
  },
];

describe('Notifications API Service', () => {
  beforeEach(() => {
    Storage.clearAll();
  });

  it('returns empty array when local storage has no notifications', async () => {
    const list = await fetchNotificationsApi();
    expect(list).toEqual([]);
  });

  it('fetches existing notifications from storage', async () => {
    Storage.set(NOTIFICATIONS_KEY, mockTestNotifications);

    const list = await fetchNotificationsApi();
    expect(list).toHaveLength(3);
    expect(list[0].id).toBe('test-notif-1');
  });

  it('marks a single notification as read', async () => {
    Storage.set(NOTIFICATIONS_KEY, mockTestNotifications);

    await markNotificationAsReadApi('test-notif-1');
    const updatedList = await fetchNotificationsApi();
    const updatedItem = updatedList.find(n => n.id === 'test-notif-1');
    expect(updatedItem?.isRead).toBe(true);
  });

  it('marks all notifications as read', async () => {
    Storage.set(NOTIFICATIONS_KEY, mockTestNotifications);

    await markAllNotificationsAsReadApi();
    const updatedList = await fetchNotificationsApi();
    const hasUnread = updatedList.some(n => !n.isRead);
    expect(hasUnread).toBe(false);
  });

  it('deletes a single notification by id', async () => {
    Storage.set(NOTIFICATIONS_KEY, mockTestNotifications);

    await deleteNotificationApi('test-notif-1');
    const listAfter = await fetchNotificationsApi();
    expect(listAfter.find(n => n.id === 'test-notif-1')).toBeUndefined();
    expect(listAfter).toHaveLength(2);
  });

  it('clears all notifications', async () => {
    Storage.set(NOTIFICATIONS_KEY, mockTestNotifications);

    await clearAllNotificationsApi();
    const emptyList = await fetchNotificationsApi();
    expect(emptyList).toEqual([]);
  });
});
