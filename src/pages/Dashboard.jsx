import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, MapPin, Calendar, Clock, CreditCard, FileText } from 'lucide-react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import spacesData from '../data/spaces.json';

export default function Dashboard() {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking } = useBookings();
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelledBookings, setCancelledBookings] = useState(() => {
    // Try to load cancelled bookings from localStorage for persistence
    const saved = localStorage.getItem('cancelledBookings');
    return saved ? JSON.parse(saved) : [];
  });

  const userBookings = getUserBookings(user?.id || 0);

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    setCancellingBookingId(bookingToCancel.id);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find the cancelled booking details
    const cancelled = userBookings.find(b => b.id === bookingToCancel.id);
    if (cancelled) {
      const updatedCancelled = [
        { ...cancelled, cancelledAt: new Date().toISOString() },
        ...cancelledBookings
      ];
      setCancelledBookings(updatedCancelled);
      localStorage.setItem('cancelledBookings', JSON.stringify(updatedCancelled));
    }
    cancelBooking(bookingToCancel.id);
    setShowCancelModal(false);
    setBookingToCancel(null);
    setCancellingBookingId(null);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helpers to parse time ranges and detect if a slot's end time has passed for a given booking date
  const parseTimeOnDate = (dateStr, timeHHMM) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hh, mm] = (timeHHMM || '00:00').split(':').map(Number);
    return new Date(year, month - 1, day, hh, mm, 0, 0);
  };

  const getISODate = (d) => d.toISOString().split('T')[0];

  const getSlotForBooking = (booking) => {
    const space = spacesData.find(s => s.id === Number(booking.spaceId));
    if (!space || !Array.isArray(space.time_slots)) return null;
    return space.time_slots.find(s => s.label === booking.timeSlot) || null;
  };

  const isPastBooking = (booking) => {
    // If booking date is before today -> past
    const bookingDateOnly = booking.date;
    const today = new Date();
    const todayStr = getISODate(today);
    if (bookingDateOnly < todayStr) return true;

    // If booking is after today -> not past
    if (bookingDateOnly > todayStr) return false;

    // bookingDateOnly === todayStr -> need to check end time of the booked slot
    const slot = getSlotForBooking(booking);
    if (!slot || !slot.end) {
      // Fallback: treat as not past if we can't find slot info
      return false;
    }

    let end = parseTimeOnDate(bookingDateOnly, slot.end);
    const start = parseTimeOnDate(bookingDateOnly, slot.start || slot.end);
    // If end <= start, treat end as next day (overnight)
    if (slot.end === '00:00' || end <= start) {
      end = new Date(end.getTime());
      end.setDate(end.getDate() + 1);
    }

    const now = new Date();
    return now >= end;
  };

  // Separate current and past bookings and sort by latest first
  const currentBookings = userBookings
    .filter(booking => !isPastBooking(booking))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pastBookings = userBookings
    .filter(booking => isPastBooking(booking))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Sort cancelled bookings by cancelledAt (latest first)
  const sortedCancelledBookings = [...cancelledBookings].sort((a, b) => new Date(b.cancelledAt) - new Date(a.cancelledAt));

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="container mx-auto px-8 lg:px-16 xl:px-24 2xl:px-32 py-8 h-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800">My Bookings</h1>
          <Link
            to="/"
            className="bg-[#a88e73] text-white px-4 py-2 rounded-lg hover:bg-[#766351] transition-colors"
          >
            Browse Spaces
          </Link>
        </div>

  {userBookings.length === 0 && sortedCancelledBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <ClipboardList className="mx-auto h-12 w-12 text-stone-400" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">No bookings yet</h3>
            <p className="text-stone-600 mb-6">Start exploring our amazing study spaces and make your first booking!</p>
            <Link
              to="/"
              className="bg-[#766351] text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors"
            >
              Explore Spaces
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Bookings */}
            {currentBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-stone-800 mb-4">
                  Upcoming Bookings ({currentBookings.length})
                </h2>
                <div className="grid gap-4">
                  {currentBookings.map(booking => (
                    <div key={booking.id} className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-stone-800 mb-2">
                            {booking.spaceName}
                          </h3>
                          <div className="space-y-1 text-stone-600">
                            <p className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {booking.spaceLocation}
                            </p>
                            <p className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(booking.date)}
                            </p>
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {booking.timeSlot}
                            </p>
                            <p className="flex items-center">
                              <CreditCard className="h-3 w-3 mr-1" />
                              ₱{booking.price}
                            </p>
                            {booking.notes && (
                              <p className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {booking.notes}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-2">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/space/${booking.spaceId}`}
                            className="bg-stone-100 text-stone-700 px-3 py-2 rounded-lg text-sm hover:bg-stone-200 transition-colors"
                          >
                            View Space
                          </Link>
                          <button
                            onClick={() => handleCancelClick(booking)}
                            disabled={cancellingBookingId === booking.id}
                            className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 flex items-center hover:cursor-pointer"
                          >
                            {cancellingBookingId === booking.id ? (
                              <>
                                <LoadingSpinner size="sm" />
                                <span className="ml-1">Cancelling...</span>
                              </>
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-stone-800 mb-4">
                  Past Bookings ({pastBookings.length})
                </h2>
                <div className="grid gap-4">
                  {pastBookings.map(booking => (
                    <div key={booking.id} className="bg-stone-100 rounded-lg p-6 border border-stone-200 opacity-75">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-stone-800 mb-2">
                            {booking.spaceName}
                          </h3>
                          <div className="space-y-1 text-stone-600">
                            <p className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {booking.spaceLocation}
                            </p>
                            <p className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(booking.date)}
                            </p>
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {booking.timeSlot}
                            </p>
                            <p className="flex items-center">
                              <CreditCard className="h-3 w-3 mr-1" />
                              ₱{booking.price}
                            </p>
                            {booking.notes && (
                              <p className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {booking.notes}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-2">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/space/${booking.spaceId}`}
                            className="bg-stone-200 text-stone-700 px-3 py-2 rounded-lg text-sm hover:bg-stone-300 transition-colors"
                          >
                            Book Again
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Bookings */}
            {sortedCancelledBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-black-700 mb-4">
                  Cancelled Bookings ({sortedCancelledBookings.length})
                </h2>
                <div className="grid gap-4">
                  {sortedCancelledBookings.map(booking => (
                    <div key={booking.id} className="bg-white-200 rounded-lg p-6 border border-stone-200 opacity-80">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-stone-800 mb-2">
                            {booking.spaceName}
                          </h3>
                          <div className="space-y-1 text-stone-700">
                            <p className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {booking.spaceLocation}
                            </p>
                            <p className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(booking.date)}
                            </p>
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {booking.timeSlot}
                            </p>
                            <p className="flex items-center">
                              <CreditCard className="h-3 w-3 mr-1" />
                              ₱{booking.price}
                            </p>
                            {booking.notes && (
                              <p className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {booking.notes}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-2">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </p>
                          <p className="text-xs text-red-500 mt-2">
                            Cancelled on {new Date(booking.cancelledAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={handleCloseCancelModal}
          title="Cancel Booking"
        >
          {bookingToCancel && (
            <div>
              <p className="text-stone-700 mb-4 text-center">
                Are you sure you want to cancel your booking for <strong>{bookingToCancel.spaceName}</strong>?
              </p>
              <div className="bg-stone-50 p-3 rounded-lg mb-4">
                <div className="text-sm text-stone-600 space-y-1">
                  <p><strong>Date:</strong> {formatDate(bookingToCancel.date)}</p>
                  <p><strong>Time:</strong> {bookingToCancel.timeSlot}</p>
                  <p><strong>Price:</strong> ₱{bookingToCancel.price}</p>
                </div>
              </div>
              <p className="text-red-600 text-sm mb-6">
                This action cannot be undone.
              </p>
              {cancellingBookingId === bookingToCancel.id ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <LoadingSpinner size="md" />
                  <span className="text-stone-600 text-sm">Cancelling your booking...</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseCancelModal}
                    className="flex-1 bg-stone-200 text-stone-800 py-2 rounded-lg hover:bg-stone-300 transition-colors hover:cursor-pointer"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors hover:cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}