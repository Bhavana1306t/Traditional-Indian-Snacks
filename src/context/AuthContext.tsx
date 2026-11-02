import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, UserRoleType } from '../lib/types';
import { getProfile, saveProfile } from '../lib/api';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  role: UserRoleType | null;
  isLoading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; message: string; testOtp?: string }>;
  verifyPhoneOtp: (phone: string, token: string, name?: string, address?: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_AUTH_USER = 'tis_auth_user';
const LS_AUTH_PROFILE = 'tis_auth_profile';
const LS_AUTH_ROLE = 'tis_auth_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRoleType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            setUser(session.user);
            await fetchSupabaseUserData(session.user.id, session.user.email);
          }
        } else {
          // Local sandbox mode
          const savedUser = localStorage.getItem(LS_AUTH_USER);
          const savedProfile = localStorage.getItem(LS_AUTH_PROFILE);
          const savedRole = localStorage.getItem(LS_AUTH_ROLE);

          if (savedUser && savedProfile) {
            setUser(JSON.parse(savedUser));
            setProfile(JSON.parse(savedProfile));
            setRole((savedRole as UserRoleType) || 'customer');
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen for auth state changes if Supabase is active
    let subscription: any = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchSupabaseUserData(session.user.id, session.user.email);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  async function fetchSupabaseUserData(userId: string, userEmail?: string) {
    try {
      // 1. Fetch user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      const resolvedRole: UserRoleType = roleData?.role || (userEmail?.toLowerCase() === 'admin@gmail.com' ? 'admin' : 'customer');
      setRole(resolvedRole);

      // 2. Fetch profile
      const prof = await getProfile(userId);
      if (prof) {
        setProfile(prof);
      } else {
        // Create initial profile if missing
        const newProf: Profile = {
          id: userId,
          full_name: resolvedRole === 'admin' ? 'Administrator' : 'Valued Customer',
          phone: '',
          address: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const saved = await saveProfile(newProf);
        setProfile(saved);
      }
    } catch (err) {
      console.error('Error fetching Supabase user role/profile:', err);
    }
  }

  // ----------------------------------------------------
  // SEND PHONE OTP
  // ----------------------------------------------------
  const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; message: string; testOtp?: string }> => {
    // Basic phone validation
    const cleanPhone = phone.trim();
    if (!/^\+?[0-9]{10,14}$/.test(cleanPhone)) {
      throw new Error('Please enter a valid mobile number with country code (e.g. +91 9948016716)');
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOtp({
        phone: cleanPhone,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: `OTP sent successfully via SMS to ${cleanPhone}. Please check your phone.`,
      };
    }

    // Local sandbox dev mode
    const simulatedOtp = '123456';
    return {
      success: true,
      message: `[Dev Mode] Verification code generated for ${cleanPhone}.`,
      testOtp: simulatedOtp,
    };
  };

  // ----------------------------------------------------
  // VERIFY PHONE OTP
  // ----------------------------------------------------
  const verifyPhoneOtp = async (
    phone: string,
    token: string,
    name?: string,
    address?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanPhone = phone.trim();
    const cleanToken = token.trim();

    if (!cleanToken || cleanToken.length < 6) {
      return { success: false, error: 'Please enter a valid 6-digit OTP code' };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: cleanPhone,
        token: cleanToken,
        type: 'sms',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        // Create or update profile
        let existingProfile = await getProfile(data.user.id);
        const resolvedName = name?.trim() || existingProfile?.full_name || 'Customer';
        const resolvedAddress = address?.trim() || existingProfile?.address || '';

        const updatedProfile: Profile = {
          id: data.user.id,
          full_name: resolvedName,
          phone: cleanPhone,
          address: resolvedAddress,
          created_at: existingProfile?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const saved = await saveProfile(updatedProfile);
        setProfile(saved);
        setRole('customer');
        return { success: true };
      }

      return { success: false, error: 'Failed to verify phone OTP' };
    }

    // Local sandbox dev mode verification
    if (cleanToken !== '123456') {
      return { success: false, error: 'Invalid verification code. In local sandbox mode, use 123456.' };
    }

    const mockUserId = `cust_${cleanPhone.replace(/\D/g, '')}`;
    const mockUser = {
      id: mockUserId,
      phone: cleanPhone,
      email: `${cleanPhone.replace(/\D/g, '')}@phone.tis.in`,
    };

    const newProfile: Profile = {
      id: mockUserId,
      full_name: name?.trim() || 'Poornam Sweet Lover',
      phone: cleanPhone,
      address: address?.trim() || 'Andhra Pradesh, India',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(LS_AUTH_USER, JSON.stringify(mockUser));
    localStorage.setItem(LS_AUTH_PROFILE, JSON.stringify(newProfile));
    localStorage.setItem(LS_AUTH_ROLE, 'customer');

    // Also persist in local storage profiles list
    await saveProfile(newProfile);

    setUser(mockUser);
    setProfile(newProfile);
    setRole('customer');

    return { success: true };
  };

  // ----------------------------------------------------
  // ADMIN LOGIN (EMAIL/PASSWORD)
  // ----------------------------------------------------
  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    if (cleanEmail.toLowerCase() !== 'admin@gmail.com') {
      return { success: false, error: 'Access denied: Only authorized administrator email is permitted.' };
    }

    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Check admin role in user_roles
        const { data: roleRow, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (roleError || roleRow?.role !== 'admin') {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Unauthorized: This account does not possess administrator privileges in user_roles table.',
          };
        }

        setUser(data.user);
        setRole('admin');
        const prof = await getProfile(data.user.id);
        setProfile(prof || {
          id: data.user.id,
          full_name: 'Owner (Lakshmipathi Raju)',
          phone: '+91 9948016716',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        return { success: true };
      }

      return { success: false, error: 'Admin login failed' };
    }

    // Local sandbox dev mode admin login
    const adminUser = {
      id: 'admin_lakshmipathi_raju',
      email: 'Admin@gmail.com',
    };

    const adminProfile: Profile = {
      id: 'admin_lakshmipathi_raju',
      full_name: 'Lakshmipathi Raju (Owner & Master Sweets Chef)',
      phone: '+91 9948016716',
      address: 'Traditional Indian Snacks Kitchen, Andhra Pradesh',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(LS_AUTH_USER, JSON.stringify(adminUser));
    localStorage.setItem(LS_AUTH_PROFILE, JSON.stringify(adminProfile));
    localStorage.setItem(LS_AUTH_ROLE, 'admin');

    setUser(adminUser);
    setProfile(adminProfile);
    setRole('admin');

    return { success: true };
  };

  // ----------------------------------------------------
  // UPDATE PROFILE
  // ----------------------------------------------------
  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const updated = await saveProfile({
      ...profile,
      ...updates,
      updated_at: new Date().toISOString(),
    });
    setProfile(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem(LS_AUTH_PROFILE, JSON.stringify(updated));
    }
  };

  // ----------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LS_AUTH_USER);
    localStorage.removeItem(LS_AUTH_PROFILE);
    localStorage.removeItem(LS_AUTH_ROLE);
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        isAdmin,
        isCustomer,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginAdmin,
        updateUserProfile,
        logout,
      }}
    >
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
