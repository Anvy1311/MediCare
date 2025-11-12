import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { storage } from '@/lib/storage';
import { initializeMockData } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'patient' | 'doctor') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    // Check for existing session
    const savedUser = storage.get<User | null>('currentUser', null);
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = storage.get<User[]>('users', []);
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      storage.set('currentUser', foundUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive"
    });
    return false;
  };

  const register = async (email: string, password: string, name: string, role: 'patient' | 'doctor'): Promise<boolean> => {
    const users = storage.get<User[]>('users', []);
    
    if (users.some(u => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already exists",
        variant: "destructive"
      });
      return false;
    }

    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      password,
      role,
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.set('users', users);
    
    setUser(newUser);
    storage.set('currentUser', newUser);
    
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    storage.remove('currentUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
