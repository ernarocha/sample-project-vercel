import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Lock, CheckCircle, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingForm from '../components/BookingForm';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import spacesData from '../data/spaces.json';

export default function SpaceDetail() {
  const { spaceId } = useParams();
  const { user } = useAuth();
  const { isSlotBooked, getUserBookings } = useBookings();
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get today's date for default
  const today = new Date().toISOString().split('T')[0];

  const handleDateChange = (date) => {
    setSelectedDate(date || today);
  };

  // Helpers for time parsing & overnight slot detection (local time)
  const parseTimeOnDate = (dateStr, timeHHMM) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hh, mm] = (timeHHMM || '00:00').split(':').map(Number);
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
    if (slot.end === '00:00' || end <= start) {
      end = new Date(end.getTime());
      end.setDate(end.getDate() + 1);
    }

    return now >= end;
  };

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const foundSpace = spacesData.find(s => s.id === parseInt(spaceId));
      setSpace(foundSpace);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [spaceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-white">
        <Header />
        <div className="flex flex-col justify-center items-center py-20">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-stone-200 max-w-md">
            <LoadingSpinner size="lg" />
            <p className="text-stone-600 mt-6 text-center font-medium">Loading premium workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-white">
        <Header />
        <div className="container mx-auto px-8 lg:px-16 xl:px-24 2xl:px-32 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-12 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏢</span>
            </div>
            <h1 className="text-3xl font-light text-stone-800 mb-4">Space Not Found</h1>
            <p className="text-stone-600 mb-8 leading-relaxed">The premium workspace you're looking for doesn't exist or has been moved.</p>
            <Link
              to="/"
              className="bg-gradient-to-r from-amber-800 to-stone-800 text-white px-8 py-3 rounded-full hover:from-amber-700 hover:to-stone-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allImages = [space.main_image, ...(space.images || [])];

  // Upcoming bookings for this user in this space (future or today)
  const upcomingSpaceBookings = user
    ? getUserBookings(user.id)
        .filter(b => b.spaceId === space.id && b.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  const hasBookings = upcomingSpaceBookings.length > 0;
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-white">
      <Header />

      <div className="container mx-auto px-8 lg:px-16 xl:px-24 2xl:px-32 py-8">
        {/* Elegant Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/"
            className="group flex items-center text-stone-600 hover:text-amber-800 transition-all duration-300 font-medium"
          >
            <div className="w-8 h-8 bg-stone-100 group-hover:bg-amber-100 rounded-full flex items-center justify-center mr-3 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>Back to Premium Spaces</span>
          </Link>
        </nav>

        {/* existing booking notification */}
        {isAuthenticated && hasBookings && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-green-800 mb-1">
                  You have {upcomingSpaceBookings.length}  booking{upcomingSpaceBookings.length !== 1 ? 's' : ''} for this space
                </h3>
                <div className="text-sm text-green-700">
                  {upcomingSpaceBookings.map((booking, index) => (
                    <div key={booking.id || index} className="mb-1">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {booking.timeSlot}
                    </div>
                  ))}
                </div>
                <Link
                  to="/dashboard/my-bookings"
                  className="inline-flex items-center text-sm font-medium text-green-800 hover:text-green-900 mt-2">
                  Manage your bookings
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/50 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Enhanced Image Gallery */}
            <div className="relative">
              <div className="flex items-center justify-center py-8">
                {/* Fixed-height gallery image to avoid layout shift when changing thumbnails */}
                <div className="w-full max-w-xl overflow-hidden rounded-2xl shadow-lg border border-stone-200">
                  <div className="w-full h-80 lg:h-96 bg-center bg-cover bg-no-repeat"
                    role="img"
                    aria-label={space.name}
                    style={{ backgroundImage: `url(${allImages[currentImageIndex]})` }}
                  >
                    {/* Hidden image for screen readers and image fallback handling */}
                    <img
                      src={allImages[currentImageIndex]}
                      alt={space.name}
                      className="sr-only"
                      onError={(e) => {

                        e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop';
                        if (e.target.parentElement && e.target.parentElement.style) {
                          e.target.parentElement.style.backgroundImage = `url(${e.target.src})`;
                        }
                      }}
                    />
                  </div>
                </div>
              </div>


            </div>

            {/* Premium Space Info */}
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-light text-stone-900 mb-2">{space.name}</h1>
                  <div className="flex items-center gap-4 text-stone-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">{space.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{space.hours}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl p-4">
                  <span className="text-3xl font-md text-stone-900">₱{space.price}</span>
                  <p className="text-stone-600 text-sm font-medium">per session</p>
                </div>
              </div>

              <p className="text-stone-700 mb-6 leading-relaxed text-lg">
                {space.description}
              </p>

              {/* Image Gallery Selector */}
              {allImages.length > 1 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-stone-700 mb-3">View More Images</h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-full h-16 rounded-lg overflow-hidden border-2 transition-all hover:cursor-pointer ${
                          currentImageIndex === index
                            ? 'border-amber-600 shadow-lg scale-105'
                            : 'border-stone-300 hover:border-amber-400'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${space.name} ${index + 1}`}
                          className="w-full h-full object-cover block"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&h=64&fit=crop';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Amenities & Time Slots Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Premium Amenities */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200/50 p-8">
            <h3 className="text-2xl font-light text-stone-900 mb-6">Premium Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {space.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-stone-50 to-amber-50 rounded-xl border border-stone-200/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-[#a88e73] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-stone-700 font-medium text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Time Slots */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200/50 p-8">
            <h3 className="text-2xl font-light text-stone-900 mb-6">Available Sessions</h3>
            <div className="mb-4 text-sm text-stone-600">
              Showing availability for: <span className="font-medium text-stone-800">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="space-y-3">
              {space.time_slots.map((slot, index) => {
                const isBooked = isSlotBooked(space.id, selectedDate, slot.label);
                const isPast = isSlotEndPastNowForDate(slot, selectedDate);
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                      isBooked
                        ? 'bg-red-50 border-red-200'
                        : isPast
                        ? 'bg-stone-50 border-stone-200/30 opacity-60'
                        : 'bg-gradient-to-r from-stone-50 to-white border-stone-200/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`h-5 w-5 ${isBooked ? 'text-red-600' : isPast ? 'text-stone-400' : 'text-amber-700'}`} />
                      <span className={`font-medium ${isBooked ? 'text-red-800' : isPast ? 'text-stone-500' : 'text-stone-800'}`}>
                        {slot.label}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isBooked
                        ? 'bg-red-100 text-red-800'
                        : isPast
                        ? 'bg-stone-100 text-stone-700'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isBooked ? 'Booked' : isPast ? 'Past' : 'Available'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-stone-500">
              Select a date in the booking form to see real-time availability
            </div>
          </div>
        </div>

        {/* Luxury Booking Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/50 overflow-hidden">
          <div className="bg-[#655545] text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-light mb-2">Reserve Your Space</h2>
                <p className="text-amber-100">Secure your premium workspace experience today</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-light">₱{space.price}</div>
                <div className="text-amber-100 text-sm">per session</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {user ? (
              <BookingForm space={space} onDateChange={handleDateChange} />
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-2xl font-light text-stone-800 mb-4">Sign In Required</h3>
                <p className="text-stone-600 mb-2 text-lg">Please log in to reserve this premium workspace.</p>
                <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                  Create your account to access exclusive booking features and manage your reservations seamlessly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}