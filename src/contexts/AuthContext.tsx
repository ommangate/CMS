import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  storeLogin: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const saveTokenAndSetUser = (token: string) => {
    try {
      localStorage.setItem('authToken', token);
      
      const decoded = jwtDecode<DecodedToken>(token);
      const userData: User = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving token:', error);
      logout();
    }
  };

  const checkAuthStatus = useCallback(() => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }
      
      // Set the user state if token is valid
      const userData: User = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { token } = await authService.login(email, password);
      saveTokenAndSetUser(token);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Invalid login credentials');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (token: string) => {
    try {
      setIsLoading(true);
      const { token: authToken } = await authService.googleLogin(token);
      saveTokenAndSetUser(authToken);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Google login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const storeLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { token } = await authService.storeLogin(email, password);
      saveTokenAndSetUser(token);
      toast.success('Staff login successful');
    } catch (error) {
      toast.error('Invalid staff credentials');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const { token } = await authService.register(name, email, password);
      saveTokenAndSetUser(token);
      toast.success('Registration successful');
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        googleLogin,
        storeLogin,
        register,
        logout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};