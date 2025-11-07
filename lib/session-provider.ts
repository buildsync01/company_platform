// lib/session-provider.ts
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<Session | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ 
    user: null, 
    isLoading: true 
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setSession({
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.email ? userData.email.split('@')[0] : 'User',
            },
            isLoading: false
          });
        } else {
          setSession({ user: null, isLoading: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setSession({ user: null, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  // Using React.createElement to avoid potential JSX parsing issues
  return React.createElement(
    AuthContext.Provider,
    { value: session },
    children
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return context;
}

// Sign out function
export async function signOut() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (response.ok) {
      // Clear any client-side cached data if needed
      window.location.href = '/sign-in';
      return true;
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}