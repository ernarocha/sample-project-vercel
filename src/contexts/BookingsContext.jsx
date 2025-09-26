import React from 'react';
import { BookingsContext } from './bookingsContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function BookingsProvider({ children }) {
  const [bookings, setBookings] = useLocalStorage('studyspot_bookings', []);

  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
      ...booking,
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const getUserBookings = (userId) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const isSlotBooked = (spaceId, date, timeSlot) => {
    return bookings.some(
      booking =>
        booking.spaceId === spaceId &&
        booking.date === date &&
        booking.timeSlot === timeSlot
    );
  };

  const value = {
    bookings,
    addBooking,
    cancelBooking,
    getUserBookings,
    isSlotBooked
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}