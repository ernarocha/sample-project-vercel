import { useContext } from 'react';
import { BookingsContext } from '../contexts/bookingsContext';

export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}