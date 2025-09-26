import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Calendar, LogOut, Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Check active pages
  const isMyBookingsActive = location.pathname === '/dashboard/my-bookings';
  const isSpacesActive = location.pathname === '/';

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-stone-200/50 sticky top-0 z-50 h-20">
      <div className="container mx-auto px-8 lg:px-16 xl:px-24 2xl:px-32 h-full flex items-center">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#a88e73] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-light text-stone-900 tracking-wide">StudySpot</span>
              <span className="text-xs text-amber-800 font-medium uppercase tracking-wider">Philippines</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/"
                  className={`group flex items-center gap-2 transition-all duration-300 font-medium ${
                    isSpacesActive
                      ? 'text-amber-800 bg-amber-50 px-3 py-2 rounded-full border border-amber-200'
                      : 'text-stone-700 hover:text-amber-800'
                  }`}
                >
                  <Building className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                    isSpacesActive ? 'text-amber-800' : ''
                  }`} />
                  <span>Spaces</span>

                </Link>

                <Link
                  to="/dashboard/my-bookings"
                  className={`group flex items-center gap-2 transition-all duration-300 font-medium ${
                    isMyBookingsActive
                      ? 'text-amber-800 bg-amber-50 px-3 py-2 rounded-full border border-amber-200'
                      : 'text-stone-700 hover:text-amber-800'
                  }`}
                >
                  <Calendar className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                    isMyBookingsActive ? 'text-amber-800' : ''
                  }`} />
                  <span>My Bookings</span>
                </Link>

                <div className="relative">
                  <button
                    className="flex items-center gap-3 px-4 py-2 bg-stone-50 rounded-full border border-stone-200 focus:outline-none hover:cursor-pointer hover:bg-stone-200"
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                  >
                    <div className="w-8 h-8 bg-[#7d5b3a] rounded-full flex items-center justify-center hover:cursor-pointer">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-stone-700 font-medium text-sm">{user.name}</span>
                  </button>
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-27 bg-white rounded-xl shadow-lg border border-stone-200 z-50">
                      <button
                        onClick={() => { setShowUserDropdown(false); logout(); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-stone-800 hover:bg-stone-100 rounded-xl font-medium transition-colors hover:cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-red-700" />
                        <span className="text-red-700">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/"
                  className={`group flex items-center gap-2 transition-all duration-300 font-medium ${
                    isSpacesActive
                      ? 'text-amber-800 bg-amber-50 px-3 py-2 rounded-full border border-amber-200'
                      : 'text-stone-700 hover:text-amber-800'
                  }`}
                >
                  <Building className={`h-4 w-4 group-hover:scale-110 transition-transform ${isSpacesActive ? 'text-amber-800' : ''}`} />
                  <span>Spaces</span>
                </Link>

                <button
                  onClick={() => navigate('/login', { state: { from: location } })}
                  className="bg-[#a88e73] text-white px-6 py-2.5 rounded-full hover:bg-[#766351] hover:cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  Login
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}