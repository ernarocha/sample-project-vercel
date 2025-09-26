import React, { useState } from 'react';
import { Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isLoading } = useAuth();

  // if already authenticated, redirect to origin or home
  if (user) {
    const from = location.state && location.state.from ? location.state.from : null;
    if (from && from.pathname) {
      return <Navigate to={from.pathname + (from.search || '')} replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(credentials.username, credentials.password);
    if (result && result.success) {
      const from = location.state && location.state.from ? location.state.from : null;
      if (from && from.pathname) {
        navigate(from.pathname + (from.search || ''), { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else if (result && result.error) {
      setError(result.error + ' — Try: user / 123');
    } else {
      setError('Invalid username or password. Try: user / 123');
    }
  };

  return (

    <>
    <Header />

    <div className="min-h-calc(100vh - 5rem) flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 pt-28">
        <div>
          <div className="text-center">
            <Link to="/" className="text-3xl font-bold text-[#a88e73] hover:text-[#766351]">
              StudySpot PH
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-stone-600">Access your bookings and manage reservations</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-400 text-stone-900 rounded-t-md focus:outline-1 focus:ring-0 focus-visible:outline-1 focus:z-10 sm:text-sm no-focus-ring focus:border-stone-700"
                placeholder="Username"
                value={credentials.username}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-400 text-stone-900 rounded-b-md focus:outline-none focus:ring-0 focus-visible:outline-none focus:z-10 sm:text-sm no-focus-ring focus:border-stone-700"
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#a88e73] hover:bg-[#766351] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#766351] disabled:bg-stone-300 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-3 h-5 w-5" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="bg-[#f7f3ef] p-4 rounded-lg">
              <p className="text-sm text-[#766351] font-medium mb-2">Demo Credentials:</p>
              <p className="text-sm text-[#7d5b3a]">Username: <code className="bg-white px-2 py-1 rounded">user</code></p>
              <p className="text-sm text-[#7d5b3a]">Password: <code className="bg-white px-2 py-1 rounded">123</code></p>
            </div>
          </div>
        </form>

        <div className="text-center">
          <Link to="/" className="text-[#7d5b3a] hover:text-[#655545] text-sm font-medium">← Back to Browse Spaces</Link>
        </div>
      </div>
    </div>
    </>
  );
}
