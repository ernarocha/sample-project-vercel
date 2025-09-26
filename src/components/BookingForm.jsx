import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import LoadingSpinner from './LoadingSpinner';

export default function BookingForm({ space, onDateChange }) {
  const { user } = useAuth();
  const { addBooking, isSlotBooked } = useBookings();
  const navigate = useNavigate();
  // Today's date in YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // if date changed, notify parent component
    if (name === 'date' && onDateChange) {
      onDateChange(value);
    }

    // clear messages when user makes changes
    setError('');
    setSuccess('');
  };

  // Helpers: parse HH:mm into a Date on a given day, handle overnight slots
  // Build a local Date from YYYY-MM-DD and HH:mm (ensures local timezone)
  const parseTimeOnDate = (dateStr, timeHHMM) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hh, mm] = (timeHHMM || '00:00').split(':').map(Number);
    // monthIndex is zero-based
    return new Date(year, month - 1, day, hh, mm, 0, 0);
  };

  const getISODate = (d) => d.toISOString().split('T')[0];

  const isSlotEndPastNowForDate = (slot, selectedDateStr) => {
    if (!selectedDateStr || !slot || !slot.end) return false;
    const now = new Date();
    const todayStr = getISODate(now);
    if (selectedDateStr !== todayStr) return false;

    let end = parseTimeOnDate(selectedDateStr, slot.end);
    const start = parseTimeOnDate(selectedDateStr, slot.start || slot.end);

    // Handle special case where end === '00:00' (treat as midnight of next day)
    if (slot.end === '00:00' || end <= start) {
      end = new Date(end.getTime());
      end.setDate(end.getDate() + 1);
    }

    // If current time is after or equal to the slot end, it's in the past
    return now >= end;
  };

  const validateBooking = () => {
    // Check if date is in the past
    if (!formData.date) return 'Please select a date';
    const selectedDate = new Date(formData.date);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Reset time to start of day

    if (selectedDate < startOfToday) {
      return 'Cannot book a date in the past';
    }

    // timeSlot stored as index string
    if (!formData.timeSlot && formData.timeSlot !== 0) return 'Please select a time slot';

    const slot = space.time_slots[Number(formData.timeSlot)];
    if (!slot) return 'Invalid time slot selected';

    // Disallow booking if the slot's end time is already past for today
    if (isSlotEndPastNowForDate(slot, formData.date)) {
      return 'Time passed (Unavailable to be booked)';
    }

    // Check if the slot is already booked (compare by label)
    if (isSlotBooked(space.id, formData.date, slot.label)) {
      return 'This time slot is already booked for the selected date';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validate the booking
    const validationError = validateBooking();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create booking object (store timeSlot as label)
      const selectedSlot = space.time_slots[Number(formData.timeSlot)];
      const booking = {
        userId: user.id,
        userName: user.name,
        spaceId: space.id,
        spaceName: space.name,
        spaceLocation: space.location,
        date: formData.date,
        timeSlot: selectedSlot ? selectedSlot.label : formData.timeSlot,
        notes: formData.notes,
        price: space.price
      };

      addBooking(booking);
      setSuccess('Booking confirmed successfully! Redirecting to My Bookings...');

      // Reset form (no date selected by default)
      setFormData({
        date: '',
        timeSlot: '',
        notes: ''
      });

      // Redirect to My Bookings page after a short delay
      setTimeout(() => {
        navigate('/dashboard/my-bookings');
      }, 2000);

    } catch {
      setError('An error occurred while booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Select Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 hover:cursor-pointer"
            required
          />
        </div>

        {/* Time Slot Selection */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Select Time Slot
          </label>
          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 hover:cursor-pointer"
            required
          >
            <option value="">Choose a time slot</option>
            {space.time_slots.map((slot, index) => {
              const isBooked = formData.date && isSlotBooked(space.id, formData.date, slot.label);
              const isPast = formData.date && isSlotEndPastNowForDate(slot, formData.date);
              return (
                <option
                  key={index}
                  value={String(index)}
                  disabled={isBooked || isPast}
                >
                  {slot.label} {isBooked ? '(Already Booked)' : isPast ? '(Past)' : ''}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Additional Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any special requests or notes..."
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
        />
      </div>

      {/* Booking Summary */}
      {formData.date && (formData.timeSlot !== '' && formData.timeSlot !== null) && (
        <div className="bg-stone-50 p-4 rounded-lg">
          <h4 className="font-semibold text-stone-800 mb-2">Booking Summary</h4>
          <div className="text-sm text-stone-600 space-y-1">
            <p><strong>Space:</strong> {space.name}</p>
            <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {space.time_slots[Number(formData.timeSlot)]?.label}</p>
            <p><strong>Price:</strong> ₱{space.price}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#655545] text-white py-3 rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">Processing Booking...</span>
          </>
        ) : (
          'Confirm Booking'
        )}
      </button>
    </form>
  );
}