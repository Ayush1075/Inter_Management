import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  // Check token expiration
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Validate and set user from token
  const validateAndSetUser = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      if (isTokenExpired(token)) {
        logout();
        return false;
      }
      setUser(decodedToken.user);
      return true;
    } catch (error) {
      console.error("Failed to decode token:", error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setAuthToken(token);
          if (!validateAndSetUser(token)) {
            return;
          }
        }
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Set up axios interceptor for automatic logout on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token } = res.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      setAuthToken(token);
      
      if (!validateAndSetUser(token)) {
        throw new Error('Invalid token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      logout();
      throw error;
    } finally {
      setLoading(false);
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