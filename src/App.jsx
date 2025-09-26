import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext.jsx';
import BookingsProvider from './contexts/BookingsContext.jsx';
import Homepage from './pages/Homepage';
import SpaceDetail from './pages/SpaceDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BookingsProvider>
        <Router>
          <div className="min-h-screen bg-stone-50">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/space/:spaceId" element={<SpaceDetail />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard/my-bookings"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </BookingsProvider>
    </AuthProvider>
  );
}