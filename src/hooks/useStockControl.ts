"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './useToast';

interface StockInfo {
  productId: number;
  currentStock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  lastUpdated: Date;
}

export const useStockControl = (productId: number) => {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { showWarning, showError } = useToast();

  const checkStock = async (productId: number) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('id, stock_quantity, quantity')
        .eq('id', productId)
        .single();

      if (error) throw error;

      console.log('Stock check data:', data);
      const currentStock = data.stock_quantity || data.quantity || 0;
      const lowStockThreshold = 5; // Sabit değer
      
      const stockData: StockInfo = {
        productId,
        currentStock,
        isLowStock: currentStock > 0 && currentStock <= lowStockThreshold,
        isOutOfStock: currentStock === 0,
        lastUpdated: new Date()
      };

      setStockInfo(stockData);
      return stockData;
    } catch (error) {
      console.error('Stock check error:', error);
      showError('Stok kontrolü hatası', 'Ürün stok durumu kontrol edilemedi');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: number, quantityChange: number) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, quantity')
        .eq('id', productId)
        .single();

      if (error) throw error;

      const currentStock = data.stock_quantity || data.quantity || 0;
      const newQuantity = Math.max(0, currentStock - quantityChange);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Stok bilgisini güncelle
      await checkStock(productId);
      
      // Düşük stok uyarısı
      if (newQuantity > 0 && newQuantity <= 5) {
        showWarning('Düşük Stok', 'Bu ürünün stoku azalıyor');
      }
      
      // Stok tükendi uyarısı
      if (newQuantity === 0) {
        showWarning('Stok Tükendi', 'Bu ürün artık stokta yok');
      }

      return newQuantity;
    } catch (error) {
      console.error('Stock update error:', error);
      showError('Stok güncelleme hatası', 'Stok güncellenirken bir hata oluştu');
      throw error;
    }
  };

  const reserveStock = async (productId: number, quantity: number) => {
    try {
      const stockData = await checkStock(productId);
      
      if (!stockData) {
        throw new Error('Stok bilgisi alınamadı');
      }

      if (stockData.isOutOfStock) {
        throw new Error('Ürün stokta yok');
      }

      if (stockData.currentStock < quantity) {
        throw new Error(`Stokta sadece ${stockData.currentStock} adet var`);
      }

      return true;
    } catch (error) {
      console.error('Stock reservation error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (productId) {
      checkStock(productId);
    }
  }, [productId]);

  return {
    stockInfo,
    loading,
    checkStock,
    updateStock,
    reserveStock,
    isLowStock: stockInfo?.isLowStock || false,
    isOutOfStock: stockInfo?.isOutOfStock || false,
    currentStock: stockInfo?.currentStock || 0
  };
};

export const useBulkStockControl = (productIds: number[]) => {
  const [stockData, setStockData] = useState<Map<number, StockInfo>>(new Map());
  const [loading, setLoading] = useState(true);

  const checkBulkStock = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('id, stock_quantity, quantity')
        .in('id', productIds);

      if (error) throw error;

      const stockMap = new Map<number, StockInfo>();
      
      data.forEach(product => {
        const currentStock = product.stock_quantity || product.quantity || 0;
        const lowStockThreshold = 5; // Sabit değer
        
        stockMap.set(product.id, {
          productId: product.id,
          currentStock,
          isLowStock: currentStock > 0 && currentStock <= lowStockThreshold,
          isOutOfStock: currentStock === 0,
          lastUpdated: new Date()
        });
      });

      setStockData(stockMap);
    } catch (error) {
      console.error('Bulk stock check error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productIds.length > 0) {
      checkBulkStock();
    }
  }, [productIds.join(',')]);

  return {
    stockData,
    loading,
    checkBulkStock,
    getStockInfo: (productId: number) => stockData.get(productId),
    getLowStockProducts: () => Array.from(stockData.values()).filter(info => info.isLowStock),
    getOutOfStockProducts: () => Array.from(stockData.values()).filter(info => info.isOutOfStock)
  };
};
