import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shopnova_token'));
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const savedToken = localStorage.getItem('shopnova_token');
      if (savedToken) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
        } catch (err) {
          console.error('Failed to authenticate stored token:', err.message);
          localStorage.removeItem('shopnova_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: receivedToken, user: loggedUser } = res.data;
      localStorage.setItem('shopnova_token', receivedToken);
      setToken(receivedToken);
      setUser(loggedUser);
      addToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return { success: true, user: loggedUser };
    } catch (err) {
      addToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      const { token: receivedToken, user: registeredUser } = res.data;
      localStorage.setItem('shopnova_token', receivedToken);
      setToken(receivedToken);
      setUser(registeredUser);
      addToast('Account created successfully!', 'success');
      return { success: true, user: registeredUser };
    } catch (err) {
      addToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('shopnova_token');
    setToken(null);
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      setUser(res.data.user);
      addToast('Profile updated successfully', 'success');
      return { success: true };
    } catch (err) {
      addToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
