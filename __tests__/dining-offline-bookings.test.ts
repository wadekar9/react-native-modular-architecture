import {
  clearPersistedDiningBookings,
  loadPersistedDiningBookings,
  persistDiningBooking,
  type DiningBooking,
} from '../src/modules/verticals/dining/services/bookings.persistence';
import { offlineSync } from '../src/core/database/offline-sync.service';

describe('Dining Bookings Offline Local Database & Sync', () => {
  beforeEach(() => {
    clearPersistedDiningBookings();
    offlineSync.clearAll();
  });

  const mockBooking = (ref: string, createdAt: string): DiningBooking => ({
    id: ref,
    eventId: 'event-wine-tasting',
    bookingReference: ref,
    ticketCount: 2,
    attendeeName: 'Jane Smith',
    attendeeEmail: 'jane@example.com',
    session: '7:00 PM',
    status: 'Confirmed',
    createdAt,
  });

  it('persists dining bookings to local database and retrieves them in descending order', () => {
    persistDiningBooking(mockBooking('TABLE-AAA', '2026-10-01T18:00:00.000Z'));
    persistDiningBooking(mockBooking('TABLE-BBB', '2026-10-02T19:00:00.000Z'));

    const bookings = loadPersistedDiningBookings();
    expect(bookings).toHaveLength(2);
    expect(bookings[0].bookingReference).toBe('TABLE-BBB');
    expect(bookings[1].bookingReference).toBe('TABLE-AAA');
  });

  it('enqueues dining booking mutation into offline sync outbox', () => {
    const booking = mockBooking('TABLE-CCC', new Date().toISOString());

    persistDiningBooking(booking);
    offlineSync.enqueue('dining_booking', 'create', booking);

    const pending = offlineSync.getPendingMutations();
    expect(pending).toHaveLength(1);
    expect(pending[0].entityType).toBe('dining_booking');
    expect(pending[0].payload.bookingReference).toBe('TABLE-CCC');
  });

  it('clears persisted bookings on logout', () => {
    persistDiningBooking(mockBooking('TABLE-DDD', new Date().toISOString()));
    expect(loadPersistedDiningBookings()).toHaveLength(1);

    clearPersistedDiningBookings();
    expect(loadPersistedDiningBookings()).toHaveLength(0);
  });
});

