import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  updateUserLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in (stored in localStorage)
    const storedUser = localStorage.getItem('englishLearnerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = () => {
    // Mock Google OAuth login
    const mockUser: User = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      level: 'intermediate'
    };
    
    setUser(mockUser);
    localStorage.setItem('englishLearnerUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('englishLearnerUser');
    localStorage.removeItem('vocabularyWords');
    localStorage.removeItem('savedSentences');
  };

  const updateUserLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (user) {
      const updatedUser = { ...user, level };
      setUser(updatedUser);
      localStorage.setItem('englishLearnerUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserLevel }}>
      {children}
    </AuthContext.Provider>
  );
};