import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
        username: string,
        email: string,
        password: string, 
      };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updates: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function - saves user to localStorage
  const login = (username: string,email: string,  password: string): boolean => {
    if (username && password && email) {
      const userData: User = {username, email, password};
      
      // Save to state
      setUser(userData);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      return true;
    }
    return false;
  };

  // Logout function - removes user from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Update user - updates both state and localStorage
  const updateUser = (updates:User): void => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
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
