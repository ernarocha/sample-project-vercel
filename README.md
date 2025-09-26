# StudySpot PH

A modern single-page web application for booking co-working spaces and study hubs across the Philippines. Built with React, React Router, and Tailwind CSS.

## 🌟 Features

### ✅ Core Requirements Completed

- **Homepage**: Displays all 12+ study spaces with functional real-time search by name or location
- **Space Detail Page**: Dynamic routing (`/space/:spaceId`) showing detailed space information
- **Booking System**: Complete booking form with date/time validation for logged-in users
- **Authentication**: Global state management using Context API with mock authentication
- **Protected Dashboard**: Route protection for `/dashboard/my-bookings` (login required)
- **Booking Management**: Display all user bookings with cancel functionality
- **Confirmation Modal**: Cancel booking confirmation modal before deletion
- **Data Persistence**: User session and bookings persist using custom `useLocalStorage` hook
- **Code Quality**: Clean, well-organized code structure with proper folder organization

### 🎨 Design & UX

- **Clean Minimalist Design**: Brown and white color scheme with luxury feel
- **Mobile Responsive**: Optimized for all screen sizes
- **Loading States**: Spinners and loading indicators throughout the app
- **Error Handling**: Error boundaries and user-friendly error messages
- **Accessibility**: Proper focus management and keyboard navigation

## � Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Demo Credentials

- **Username**: `user`
- **Password**: `123`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── SpaceCard.jsx
│   ├── BookingForm.jsx
│   ├── Modal.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorBoundary.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Route components
│   ├── Homepage.jsx
│   ├── SpaceDetail.jsx
│   └── Dashboard.jsx
├── contexts/           # Global state management
│   ├── AuthContext.jsx
│   └── BookingsContext.jsx
├── hooks/              # Custom hooks
│   └── useLocalStorage.js
├── utils/              # Helper functions
│   ├── helpers.js
│   └── axiosInstance.js
├── data/               # Static data
│   └── spaces.json
└── assets/             # Images and static files
```

## 🛠 Technologies Used

- **React 19** - Component-based UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Context API** - Global state management
- **LocalStorage** - Data persistence

## 🔧 Key Features Implementation

### Authentication System
- Mock authentication with hardcoded credentials
- Persistent login state using localStorage
- Protected routes with automatic redirection

### Booking System
- Date validation (prevents past bookings)
- Time slot conflict detection
- Real-time availability checking
- Booking persistence per user

### Search Functionality
- Real-time search as you type
- Filters by space name and location
- Responsive search results

### Data Management
- Custom `useLocalStorage` hook for persistence
- Separate contexts for authentication and bookings
- Efficient state management with React hooks

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎯 Future Enhancements

- User registration and profile management
- Payment integration
- Real-time notifications
- Reviews and ratings system
- Advanced filtering and sorting
- Email confirmations
- Admin dashboard

## 🧪 Testing

To run the application:

1. Start the development server: `npm run dev`
2. Test the following user flows:
   - Browse spaces on homepage
   - Search for spaces by name/location
   - View space details
   - Login with demo credentials
   - Book a space (select future date)
   - View bookings in dashboard
   - Cancel a booking with confirmation

## 📄 License

This project is for educational purposes as part of web development course.

---
