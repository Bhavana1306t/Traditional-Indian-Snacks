
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

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

  registerCustomer: (
    email: string,
    password: string,
    name: string,
    address: string
  ) => Promise<{ success: boolean; error?: string }>;

  loginCustomer: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  sendPhoneOtp: (
    phone: string
  ) => Promise<{
    success: boolean;
    message: string;
    testOtp?: string;
  }>;

  verifyPhoneOtp: (
    phone: string,
    token: string,
    name?: string,
    address?: string
  ) => Promise<{ success: boolean; error?: string }>;

  loginAdmin: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_AUTH_USER = 'tis_auth_user';
const LS_AUTH_PROFILE = 'tis_auth_profile';
const LS_AUTH_ROLE = 'tis_auth_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRoleType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ----------------------------------------------------
  // FETCH USER PROFILE AND ROLE
  // ----------------------------------------------------

  async function fetchSupabaseUserData(
    userId: string,
    userEmail?: string
  ) {
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      const resolvedRole: UserRoleType =
        roleData?.role ||
        (userEmail?.toLowerCase() === 'admin@gmail.com'
          ? 'admin'
          : 'customer');

      setRole(resolvedRole);

      const existingProfile = await getProfile(userId);

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        const newProfile: Profile = {
          id: userId,
          full_name:
            resolvedRole === 'admin' ? 'Administrator' : 'Valued Customer',
          phone: '',
          address: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const savedProfile = await saveProfile(newProfile);
        setProfile(savedProfile);
      }
    } catch (err) {
      console.error('Error fetching Supabase user data:', err);
    }
  }

  // ----------------------------------------------------
  // INITIALIZE AUTHENTICATION
  // ----------------------------------------------------

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user && mounted) {
            setUser(session.user);

            await fetchSupabaseUserData(
              session.user.id,
              session.user.email
            );
          }
        } else {
          const savedUser = localStorage.getItem(LS_AUTH_USER);
          const savedProfile = localStorage.getItem(LS_AUTH_PROFILE);
          const savedRole = localStorage.getItem(LS_AUTH_ROLE);

          if (savedUser && savedProfile && mounted) {
            setUser(JSON.parse(savedUser));
            setProfile(JSON.parse(savedProfile));
            setRole((savedRole as UserRoleType) || 'customer');
          }
        }
      } catch (err) {
        console.error('Error initializing authentication:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    let subscription: any = null;

    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            setUser(session.user);

            // Defer profile fetching until after the auth callback.
            setTimeout(() => {
              fetchSupabaseUserData(
                session.user.id,
                session.user.email
              );
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
            setRole(null);
          }
        }
      );

      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // ----------------------------------------------------
  // CUSTOMER REGISTRATION - EMAIL AND PASSWORD
  // ----------------------------------------------------

  const registerCustomer = async (
    email: string,
    password: string,
    name: string,
    address: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const cleanAddress = address.trim();

      if (!cleanName) {
        return {
          success: false,
          error: 'Please enter your full name.',
        };
      }

      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return {
          success: false,
          error: 'Please enter a valid email address.',
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'Password must contain at least 6 characters.',
        };
      }

      if (!isSupabaseConfigured) {
        return {
          success: false,
          error: 'Supabase is not configured. Please check your .env file.',
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            address: cleanAddress,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Registration failed. Please try again.',
        };
      }

      // Create the customer profile.
      // Supabase email confirmation is currently disabled in your project,
      // so a session should normally be returned immediately.

      if (data.session) {
        const newProfile: Profile = {
          id: data.user.id,
          full_name: cleanName,
          phone: '',
          address: cleanAddress,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const savedProfile = await saveProfile(newProfile);

        setUser(data.user);
        setProfile(savedProfile);
        setRole('customer');

        localStorage.removeItem(LS_AUTH_USER);
        localStorage.removeItem(LS_AUTH_PROFILE);
        localStorage.removeItem(LS_AUTH_ROLE);
      }

      return { success: true };
    } catch (err: any) {
      console.error('Customer registration error:', err);

      return {
        success: false,
        error: err.message || 'Registration failed. Please try again.',
      };
    }
  };

  // ----------------------------------------------------
  // CUSTOMER LOGIN - EMAIL AND PASSWORD
  // ----------------------------------------------------

  const loginCustomer = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail || !password) {
        return {
          success: false,
          error: 'Please enter your email and password.',
        };
      }

      if (!isSupabaseConfigured) {
        return {
          success: false,
          error: 'Supabase is not configured. Please check your .env file.',
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Login failed. Please try again.',
        };
      }

      // Prevent administrator accounts from using customer login.
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle();

      const resolvedRole =
        roleData?.role ||
        (cleanEmail === 'admin@gmail.com' ? 'admin' : 'customer');

      if (resolvedRole === 'admin') {
        await supabase.auth.signOut();

        return {
          success: false,
          error: 'Please use the administrator login.',
        };
      }

      setUser(data.user);
      setRole('customer');

      const existingProfile = await getProfile(data.user.id);

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        const newProfile: Profile = {
          id: data.user.id,
          full_name:
            data.user.user_metadata?.full_name || 'Valued Customer',
          phone: '',
          address: data.user.user_metadata?.address || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const savedProfile = await saveProfile(newProfile);
        setProfile(savedProfile);
      }

      localStorage.removeItem(LS_AUTH_USER);
      localStorage.removeItem(LS_AUTH_PROFILE);
      localStorage.removeItem(LS_AUTH_ROLE);

      return { success: true };
    } catch (err: any) {
      console.error('Customer login error:', err);

      return {
        success: false,
        error: err.message || 'Login failed. Please try again.',
      };
    }
  };

  // ----------------------------------------------------
  // SEND PHONE OTP - OLD FUNCTION KEPT TEMPORARILY
  // ----------------------------------------------------

  const sendPhoneOtp = async (
    phone: string
  ): Promise<{
    success: boolean;
    message: string;
    testOtp?: string;
  }> => {
    const cleanPhone = phone.trim();

    if (!/^\+[0-9]{10,14}$/.test(cleanPhone)) {
      throw new Error(
        'Please enter a valid mobile number with country code (e.g. +91 9948016716)'
      );
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
        message: `OTP sent successfully via SMS to ${cleanPhone}.`,
      };
    }

    return {
      success: true,
      message: `[Dev Mode] Verification code generated for ${cleanPhone}.`,
      testOtp: '123456',
    };
  };

  // ----------------------------------------------------
  // VERIFY PHONE OTP - OLD FUNCTION KEPT TEMPORARILY
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
      return {
        success: false,
        error: 'Please enter a valid 6-digit OTP code.',
      };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: cleanPhone,
        token: cleanToken,
        type: 'sms',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        const existingProfile = await getProfile(data.user.id);

        const updatedProfile: Profile = {
          id: data.user.id,
          full_name:
            name?.trim() || existingProfile?.full_name || 'Customer',
          phone: cleanPhone,
          address:
            address?.trim() || existingProfile?.address || '',
          created_at:
            existingProfile?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const savedProfile = await saveProfile(updatedProfile);

        setUser(data.user);
        setProfile(savedProfile);
        setRole('customer');

        return { success: true };
      }

      return {
        success: false,
        error: 'Failed to verify phone OTP.',
      };
    }

    // Local sandbox development mode.
    if (cleanToken !== '123456') {
      return {
        success: false,
        error: 'Invalid OTP. In local mode, use 123456.',
      };
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

    await saveProfile(newProfile);

    setUser(mockUser);
    setProfile(newProfile);
    setRole('customer');

    return { success: true };
  };

  // ----------------------------------------------------
  // ADMIN LOGIN - EMAIL AND PASSWORD
  // ----------------------------------------------------

  const loginAdmin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();

    if (cleanEmail.toLowerCase() !== 'admin@gmail.com') {
      return {
        success: false,
        error:
          'Access denied: Only authorized administrator email is permitted.',
      };
    }

    if (!password) {
      return {
        success: false,
        error: 'Password is required.',
      };
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        const { data: roleRow, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (roleError || roleRow?.role !== 'admin') {
          await supabase.auth.signOut();

          return {
            success: false,
            error:
              'Unauthorized: This account does not have administrator privileges.',
          };
        }

        setUser(data.user);
        setRole('admin');

        const existingProfile = await getProfile(data.user.id);

        setProfile(
          existingProfile || {
            id: data.user.id,
            full_name: 'Administrator',
            phone: '',
            address: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        );

        return { success: true };
      }

      return {
        success: false,
        error: 'Admin login failed.',
      };
    }

    // Local sandbox development mode.
    const adminUser = {
      id: 'admin_lakshmipathi_raju',
      email: 'admin@gmail.com',
    };

    const adminProfile: Profile = {
      id: 'admin_lakshmipathi_raju',
      full_name: 'Lakshmipathi Raju (Owner & Master Sweets Chef)',
      phone: '',
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
  // UPDATE USER PROFILE
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

  // ----------------------------------------------------
  // AUTH STATE
  // ----------------------------------------------------

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
        registerCustomer,
        loginCustomer,
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

// ----------------------------------------------------
// USE AUTH
// ----------------------------------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
