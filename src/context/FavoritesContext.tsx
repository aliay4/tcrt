"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface FavoriteItem {
  id: number;
  product_id: number;
  product?: {
    id: number;
    name: string;
    price: number;
    compare_price?: number;
    images?: string[];
  };
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  loading: boolean;
  addToFavorites: (productId: number) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load favorites from database or localStorage
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    
    if (user) {
      // Load from database for authenticated users
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            *,
            product:products (
              id,
              name,
              price,
              compare_price,
              images
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setFavorites(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading favorites:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } else {
      // Load from localStorage for guests
      loadFromLocalStorage();
    }
    
    setLoading(false);
  };

  const loadFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  };

  const saveToLocalStorage = (favoritesItems: FavoriteItem[]) => {
    localStorage.setItem('favorites', JSON.stringify(favoritesItems));
  };

  const addToFavorites = async (productId: number) => {
    if (user) {
      // Add to database for authenticated users
      try {
        const { data, error } = await supabase
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              product_id: productId,
            },
          ])
          .select(`
            *,
            product:products (
              id,
              name,
              price,
              compare_price,
              images
            )
          `)
          .single();

        if (error) throw error;
        setFavorites([...(favorites || []), data]);
      } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
      }
    } else {
      // Add to localStorage for guests
      try {
        const { data: product, error } = await supabase
          .from('products')
          .select('id, name, price, compare_price, images')
          .eq('id', productId)
          .single();

        if (error) throw error;

        const newItem: FavoriteItem = {
          id: Date.now(), // Temporary ID for localStorage
          product_id: productId,
          product: product,
        };

        const updatedFavorites = [...(favorites || []), newItem];
        setFavorites(updatedFavorites);
        saveToLocalStorage(updatedFavorites);
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    }
  };

  const removeFromFavorites = async (productId: number) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        setFavorites((favorites || []).filter(item => item.product_id !== productId));
      } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
      }
    } else {
      const updatedFavorites = (favorites || []).filter(item => item.product_id !== productId);
      setFavorites(updatedFavorites);
      saveToLocalStorage(updatedFavorites);
    }
  };

  const isFavorite = (productId: number): boolean => {
    return (favorites || []).some(item => item.product_id === productId);
  };

  const favoritesCount = (favorites || []).length;

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

