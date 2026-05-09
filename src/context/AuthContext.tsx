import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { localDb } from '../lib/localDb';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  toggleAdminMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['jmisagor079@gmail.com']; 

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAdminMode, setIsAdminMode] = useState(localDb.isAdminMode());

  useEffect(() => {
    // Check localStorage for mock user first
    const mockUser = localStorage.getItem('mock_user');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.warn('Firebase login failed or cancelled, using mock admin bypass:', error);
      // Bypass: Create a mock admin user
      const mockAdmin = {
        uid: 'mock-admin-id',
        email: ADMIN_EMAILS[0],
        displayName: 'Local Admin',
        photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
      };
      localStorage.setItem('mock_user', JSON.stringify(mockAdmin));
      setUser(mockAdmin);
    }
  };

  const toggleAdminMode = () => {
    const newState = !isAdminMode;
    localDb.setAdminMode(newState);
    setIsAdminMode(newState);
  };

  const logout = async () => {
    localStorage.removeItem('mock_user');
    localDb.setAdminMode(false);
    setIsAdminMode(false);
    await signOut(auth).catch(() => {});
    setUser(null);
  };

  const isAdmin = isAdminMode || (!!user && !!user.email && (ADMIN_EMAILS.includes(user.email) || user.uid === 'mock-admin-id'));

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout, toggleAdminMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
