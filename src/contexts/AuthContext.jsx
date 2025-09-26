import { useState } from 'react';
import { AuthContext } from './authContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('studyspot_user', null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username, password) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock authentication w/ hardcoded credentials
    if (username === 'user' && password === '123') {
      const userData = {
        id: 1,
        username: 'user',
        name: 'User'
      };
      setUser(userData);
      setIsLoading(false);
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, error: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}