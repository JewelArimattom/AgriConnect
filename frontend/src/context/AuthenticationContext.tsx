import  { createContext, useState, useContext,type ReactNode, useEffect } from 'react';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. Initialize user state by reading from localStorage
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const storedUser = localStorage.getItem('farmConnectUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // 2. Use an effect to automatically update localStorage whenever the user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('farmConnectUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('farmConnectUser');
    }
  }, [user]);

  const signup = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data); // This will trigger the useEffect to save the user
    } else {
      throw new Error(data.message || 'Failed to sign up');
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data); // This will trigger the useEffect to save the user
    } else {
      throw new Error(data.message || 'Failed to log in');
    }
  };

  const logout = () => {
    setUser(null); // This will trigger the useEffect to remove the user
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

