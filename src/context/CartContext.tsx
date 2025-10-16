"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/useToast';
import { priceTierApi } from '@/services/api';
import { calculatePriceByQuantity, PriceTier } from '@/utils/priceCalculator';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  applied_price?: number; // Price applied from tiers
  product?: {
    id: number;
    name: string;
    price: number;
    compare_price?: number;
    images?: string[];
    has_price_tiers?: boolean;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  recalculateCartPrices: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  // Load cart items from database or localStorage
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    setLoading(true);
    
    if (user) {
      // Load from database for authenticated users
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            *,
            product:products (
              id,
              name,
              price,
              compare_price,
              images,
              has_price_tiers
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading cart:', error);
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
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setItems([]);
      }
    }
  };

  const saveToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (user) {
      // Add to database for authenticated users
      try {
        // Check if item already exists
        const existingItem = (items || []).find(item => item.product_id === productId);
        
        if (existingItem) {
          // Update quantity
          await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
          // Calculate applied price for new item
          let appliedPrice = null;
          try {
            const { data: productData } = await supabase
              .from('products')
              .select('price, has_price_tiers')
              .eq('id', productId)
              .single();

            if (productData?.has_price_tiers) {
              const tiersResponse = await priceTierApi.getByProductId(productId);
              const calculation = calculatePriceByQuantity(
                productData.price,
                tiersResponse.data,
                quantity
              );
              appliedPrice = calculation.price;
            }
          } catch (error) {
            console.error('Error calculating price for cart item:', error);
          }

          // Add new item
          const { data, error } = await supabase
            .from('cart_items')
            .insert([
              {
                user_id: user.id,
                product_id: productId,
                quantity: quantity,
                applied_price: appliedPrice,
              },
            ])
            .select(`
              *,
              product:products (
                id,
                name,
                price,
                compare_price,
                images,
                has_price_tiers
              )
            `)
            .single();

          if (error) throw error;
          setItems([...items, data]);
          showSuccess('Ürün sepete eklendi!', 'Ürün başarıyla sepete eklendi');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Sepete ekleme hatası', 'Ürün sepete eklenirken bir hata oluştu');
        throw error;
      }
    } else {
      // Add to localStorage for guests
      const existingItemIndex = (items || []).findIndex(item => item.product_id === productId);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...(items || [])];
        updatedItems[existingItemIndex].quantity += quantity;
        setItems(updatedItems);
        saveToLocalStorage(updatedItems);
        showSuccess('Miktar güncellendi!', 'Ürün miktarı artırıldı');
      } else {
        // Fetch product details and calculate price
        try {
          const { data: product, error } = await supabase
            .from('products')
            .select('id, name, price, compare_price, images, has_price_tiers')
            .eq('id', productId)
            .single();

          if (error) throw error;

          // Calculate applied price for localStorage
          let appliedPrice = null;
          if (product.has_price_tiers) {
            try {
              const tiersResponse = await priceTierApi.getByProductId(productId);
              const calculation = calculatePriceByQuantity(
                product.price,
                tiersResponse.data,
                quantity
              );
              appliedPrice = calculation.price;
            } catch (error) {
              console.error('Error calculating price for localStorage cart item:', error);
            }
          }

          const newItem: CartItem = {
            id: Date.now(), // Temporary ID for localStorage
            product_id: productId,
            quantity: quantity,
            applied_price: appliedPrice,
            product: product,
          };

          const updatedItems = [...(items || []), newItem];
          setItems(updatedItems);
          saveToLocalStorage(updatedItems);
          showSuccess('Ürün sepete eklendi!', 'Ürün başarıyla sepete eklendi');
        } catch (error) {
          console.error('Error fetching product:', error);
          showError('Ürün bilgisi alınamadı', 'Ürün sepete eklenirken bir hata oluştu');
          throw error;
        }
      }
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
        setItems((items || []).filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
      }
    } else {
      const updatedItems = (items || []).filter(item => item.id !== itemId);
      setItems(updatedItems);
      saveToLocalStorage(updatedItems);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    if (user) {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId)
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
        
        setItems((items || []).map(item => item.id === itemId ? data : item));
      } catch (error) {
        console.error('Error updating quantity:', error);
        throw error;
      }
    } else {
      const updatedItems = (items || []).map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      saveToLocalStorage(updatedItems);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        setItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    } else {
      setItems([]);
      localStorage.removeItem('cart');
    }
  };

  const recalculateCartPrices = async () => {
    if (!items.length) return;

    try {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          if (!item.product?.has_price_tiers) {
            return item;
          }

          try {
            const tiersResponse = await priceTierApi.getByProductId(item.product_id);
            const calculation = calculatePriceByQuantity(
              item.product.price,
              tiersResponse.data,
              item.quantity
            );

            return {
              ...item,
              applied_price: calculation.price
            };
          } catch (error) {
            console.error('Error calculating price for item:', item.product_id, error);
            return item;
          }
        })
      );

      setItems(updatedItems);

      // Update database if user is authenticated
      if (user) {
        await Promise.all(
          updatedItems.map(async (item) => {
            if (item.applied_price && item.applied_price !== item.product?.price) {
              try {
                await supabase
                  .from('cart_items')
                  .update({ applied_price: item.applied_price })
                  .eq('id', item.id);
              } catch (error) {
                console.error('Error updating applied price in database:', error);
              }
            }
          })
        );
      }
    } catch (error) {
      console.error('Error recalculating cart prices:', error);
    }
  };

  const cartCount = (items || []).reduce((total, item) => total + item.quantity, 0);
  const cartTotal = (items || []).reduce((total, item) => {
    const price = item.applied_price || item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);

  const value = {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    recalculateCartPrices,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

