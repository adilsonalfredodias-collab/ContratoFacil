import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { AuthService, DbService } from '../services/api';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (e: string, p: string) => Promise<void>;
  register: (e: string, p: string, n: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!user?.uid) return;
    const updated = await DbService.getUser(user.uid);
    if (updated) setUser(updated);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (mounted) setUser(currentUser);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();

    // Listen to Supabase Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
         let profile = await DbService.getUser(session.user.id);
         
         // Retry mechanism / Create profile if missing (resilience)
         if (!profile) {
             const newProfile: UserProfile = {
                 uid: session.user.id,
                 email: session.user.email || '',
                 displayName: session.user.user_metadata.display_name || session.user.user_metadata.full_name || 'Novo Usuário',
                 planType: 'free',
                 contractsCreatedThisMonth: 0,
                 subscriptionStatus: 'active'
             };
             try {
                // Use upsert via createProfile to avoid race conditions
                await DbService.createProfile(newProfile);
                profile = newProfile;
             } catch (e) {
                 console.error("Error ensuring profile exists:", e);
             }
         }
         
         if (mounted && profile) setUser(profile);
         if (mounted) setLoading(false);

      } else if (event === 'SIGNED_OUT') {
         if (mounted) setUser(null);
         if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const u = await AuthService.login(email, pass);
    setUser(u);
  };

  const register = async (email: string, pass: string, name: string) => {
    // register checks for email confirmation requirement
    // if confirmation needed, it throws 'CONFIRM_EMAIL'
    const u = await AuthService.register(email, pass, name);
    // If we get here, registration didn't require immediate confirmation (or auto-confirmed)
    // Supabase usually requires confirmation by default, so 'u' might be null depending on config
    if (u) setUser(u);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);