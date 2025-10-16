import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { User } from '../types';
import { registerUser, loginUser } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  authCheckComplete: boolean; // New property to track if auth check is complete
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState<boolean>(false); // New state

  // Check for existing token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    // Mark auth check as complete whether we found tokens or not
    setAuthCheckComplete(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginUser({ email, password });
      
      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        
        setUser(userData);
        setToken(userToken);
        
        // Store in localStorage
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return true;
      } else {
        setError(response.data.message);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(userData);
      
      if (response.data.success) {
        // After registration, automatically log the user in
        const loginSuccess = await login(userData.email, userData.password);
        return loginSuccess;
      } else {
        setError(response.data.message);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthCheckComplete(true); // Ensure we mark as complete on logout
  };

  const value = useMemo(() => ({
    isAuthenticated: !!token,
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
    authCheckComplete, // Include new property
  }), [user, token, loading, error, authCheckComplete]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};