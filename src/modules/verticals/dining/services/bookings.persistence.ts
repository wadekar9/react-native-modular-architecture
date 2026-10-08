import { localDatabase, type IDatabaseRecord } from '@core/database';

const DINING_BOOKINGS_COLLECTION = 'dining_bookings';

export interface DiningBooking extends IDatabaseRecord {
  id: string;
  eventId: string;
  bookingReference: string;
  ticketCount: number;
  attendeeName: string;
  attendeeEmail: string;
  session: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export const getDiningBookingsCollection = () => {
  return localDatabase.collection<DiningBooking>(DINING_BOOKINGS_COLLECTION);
};

export const persistDiningBooking = (booking: DiningBooking): DiningBooking => {
  const collection = getDiningBookingsCollection();
  return collection.upsert(booking);
};

export const loadPersistedDiningBookings = (): DiningBooking[] => {
  const collection = getDiningBookingsCollection();
  return collection.find(undefined, {
    sort: { field: 'createdAt', order: 'desc' },
  });
};

export const clearPersistedDiningBookings = (): void => {
  const collection = getDiningBookingsCollection();
  collection.clear();
};

