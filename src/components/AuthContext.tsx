'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  department: string;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  signInMock: (email: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_PROFILE: UserProfile = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'shero@peramgroup.com',
  full_name: 'Shero',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  role: 'Operations Head',
  department: 'Operations',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use local storage mock user if Supabase is offline/not initialized
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setProfile(MOCK_PROFILE);
      setLoading(false);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else if (!localStorage.getItem('crm_user')) {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      if (data) {
        setProfile(data);
      } else {
        setProfile(MOCK_PROFILE);
      }
    } catch (err) {
      setProfile(MOCK_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const signInMock = (email: string) => {
    const mockUserObj = { id: MOCK_PROFILE.id, email };
    localStorage.setItem('crm_user', JSON.stringify(mockUserObj));
    setUser(mockUserObj);
    setProfile(MOCK_PROFILE);
  };

  const logout = async () => {
    localStorage.removeItem('crm_user');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInMock, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
