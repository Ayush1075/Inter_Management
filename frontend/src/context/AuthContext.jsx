import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        const decodedToken = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();
        
        if (isExpired) {
          logout();
        } else {
          setUser(decodedToken.user);
        }
      }
    } catch (error) {
      console.error("Failed to decode or validate token:", error);
      logout();
    } finally {
      setLoading(false); // Set loading to false after token check
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true); // Set loading during login
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      const decodedToken = jwtDecode(token);
      setUser(decodedToken.user);
    } finally {
      setLoading(false); // Clear loading after login attempt
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 