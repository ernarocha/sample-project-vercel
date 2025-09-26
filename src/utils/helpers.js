export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatPrice = (price) => {
  return `₱${price.toLocaleString()}`;
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const generateBookingId = () => {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};