"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Check user role from users table
  // Migrate localStorage data to Supabase when user signs in
  const migrateLocalStorageToSupabase = async (userId: string) => {
    try {
      console.log('🔄 Migrating localStorage data to Supabase for user:', userId);
      
      // Migrate favorites
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          const favorites = JSON.parse(savedFavorites);
          if (Array.isArray(favorites) && favorites.length > 0) {
            console.log('📦 Migrating favorites:', favorites.length);
            
            // Check existing favorites in database
            const { data: existingFavorites } = await supabase
              .from('favorites')
              .select('product_id')
              .eq('user_id', userId);
            
            const existingProductIds = existingFavorites?.map(f => f.product_id) || [];
            
            // Add new favorites
            for (const favorite of favorites) {
              if (!existingProductIds.includes(favorite.product_id)) {
                await supabase
                  .from('favorites')
                  .insert({
                    user_id: userId,
                    product_id: favorite.product_id
                  });
              }
            }
            
            // Clear localStorage favorites
            localStorage.removeItem('favorites');
            console.log('✅ Favorites migrated successfully');
          }
        } catch (error) {
          console.error('Error migrating favorites:', error);
        }
      }
      
      // Migrate cart items
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          if (Array.isArray(cartItems) && cartItems.length > 0) {
            console.log('🛒 Migrating cart items:', cartItems.length);
            
            // Check existing cart items in database
            const { data: existingCart } = await supabase
              .from('cart_items')
              .select('product_id')
              .eq('user_id', userId);
            
            const existingProductIds = existingCart?.map(c => c.product_id) || [];
            
            // Add new cart items
            for (const item of cartItems) {
              if (!existingProductIds.includes(item.product_id)) {
                await supabase
                  .from('cart_items')
                  .insert({
                    user_id: userId,
                    product_id: item.product_id,
                    quantity: item.quantity || 1
                  });
              }
            }
            
            // Clear localStorage cart
            localStorage.removeItem('cart');
            console.log('✅ Cart items migrated successfully');
          }
        } catch (error) {
          console.error('Error migrating cart items:', error);
        }
      }
      
      console.log('🎉 Migration completed successfully');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  };

  const checkUserRole = async (userId: string) => {
    try {
      console.log('🔍 Checking user role for:', userId);
      
      // First try to use the RPC function (if available)
      try {
        const { data: isAdminData, error: rpcError } = await supabase.rpc('is_admin');
        if (!rpcError && isAdminData !== null) {
          console.log('✅ Admin check (RPC):', isAdminData);
          return isAdminData;
        }
      } catch (rpcErr) {
        console.log('⚠️ RPC function not available, using direct query');
      }
      
      // Fallback to direct query
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('❌ Error checking user role:', error);
        return false;
      }
      
      const isAdminUser = data?.role === 'admin';
      console.log('✅ Admin check (direct query):', {
        userId,
        role: data?.role,
        isAdmin: isAdminUser
      });
      
      return isAdminUser;
    } catch (err) {
      console.error('❌ Error checking user role:', err);
      return false;
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const adminStatus = await checkUserRole(session.user.id);
          setIsAdmin(adminStatus);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const adminStatus = await checkUserRole(session.user.id);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const adminStatus = await checkUserRole(data.user.id);
        setIsAdmin(adminStatus);
        
        // localStorage'dan Supabase'e taşı
        await migrateLocalStorageToSupabase(data.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setError(null);
      setLoading(true);

      // Create auth user (trigger will automatically create user in users table)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (authError) throw authError;

      // Update first_name and last_name (trigger only sets email and role)
      if (authData.user) {
        // Wait a bit for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: updateError } = await supabase
          .from('users')
          .update({
            first_name: firstName,
            last_name: lastName,
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.warn('Could not update user details:', updateError);
          // Continue anyway, not critical
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Clear local storage
      localStorage.removeItem('favorites');
      localStorage.removeItem('cart');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state
      setUser(null);
      setIsAdmin(false);
      
      // Force page refresh to clear all state
      window.location.href = '/';
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'Çıkış yapılırken bir hata oluştu');
      setLoading(false);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

