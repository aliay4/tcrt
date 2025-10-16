// Validation utilities for price tiers and other forms

import { PriceTier } from './priceCalculator';

/**
 * Check if a new tier overlaps with existing tiers
 * @param newTier - The new tier to check
 * @param existingTiers - Array of existing tiers
 * @returns Object with overlap info and conflicting tiers
 */
export function checkTierOverlap(
  newTier: Omit<PriceTier, 'id' | 'product_id' | 'created_at' | 'updated_at'>,
  existingTiers: PriceTier[]
): {
  hasOverlap: boolean;
  conflictingTiers: PriceTier[];
  errors: string[];
} {
  const errors: string[] = [];
  const conflictingTiers: PriceTier[] = [];
  
  const newMin = newTier.min_quantity;
  const newMax = newTier.max_quantity || Infinity;
  
  for (const existingTier of existingTiers) {
    const existingMin = existingTier.min_quantity;
    const existingMax = existingTier.max_quantity || Infinity;
    
    // Check for overlap
    const overlap = !(newMax < existingMin || newMin > existingMax);
    
    if (overlap) {
      conflictingTiers.push(existingTier);
      
      if (newMin >= existingMin && newMin <= existingMax) {
        errors.push(
          `Yeni kademenin başlangıcı (${newMin}) mevcut kademe ${existingMin}-${existingMax} aralığında`
        );
      }
      
      if (newMax >= existingMin && newMax <= existingMax) {
        errors.push(
          `Yeni kademenin sonu (${newMax === Infinity ? 'sınırsız' : newMax}) mevcut kademe ${existingMin}-${existingMax} aralığında`
        );
      }
    }
  }
  
  return {
    hasOverlap: conflictingTiers.length > 0,
    conflictingTiers,
    errors
  };
}

/**
 * Validate price tiers array
 * @param tiers - Array of price tiers to validate
 * @returns Validation result with errors
 */
export function validatePriceTiers(tiers: PriceTier[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!tiers || tiers.length === 0) {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  // Sort tiers by min_quantity
  const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  
  // Check individual tier validity
  for (let i = 0; i < sortedTiers.length; i++) {
    const tier = sortedTiers[i];
    
    // Required fields
    if (!tier.min_quantity || tier.min_quantity < 1) {
      errors.push(`Kademe ${i + 1}: Minimum adet 1'den büyük olmalı`);
    }
    
    if (!tier.price || tier.price <= 0) {
      errors.push(`Kademe ${i + 1}: Fiyat 0'dan büyük olmalı`);
    }
    
    // Max quantity validation
    if (tier.max_quantity && tier.max_quantity < tier.min_quantity) {
      errors.push(`Kademe ${i + 1}: Maksimum adet minimum adetten küçük olamaz`);
    }
    
    // Discount percentage validation
    if (tier.discount_percentage !== undefined) {
      if (tier.discount_percentage < 0 || tier.discount_percentage > 100) {
        errors.push(`Kademe ${i + 1}: İndirim yüzdesi 0-100 arasında olmalı`);
      }
    }
  }
  
  // Check for gaps or overlaps
  for (let i = 0; i < sortedTiers.length - 1; i++) {
    const current = sortedTiers[i];
    const next = sortedTiers[i + 1];
    
    const currentMax = current.max_quantity || Infinity;
    const nextMin = next.min_quantity;
    
    // Check for gaps
    if (currentMax + 1 < nextMin) {
      warnings.push(
        `Kademe ${i + 1} ve ${i + 2} arasında ${currentMax + 1}-${nextMin - 1} adet aralığı kapsamıyor`
      );
    }
    
    // Check for overlaps
    if (currentMax >= nextMin) {
      errors.push(
        `Kademe ${i + 1} ve ${i + 2} arasında çakışma var (${currentMax} >= ${nextMin})`
      );
    }
  }
  
  // Check if first tier starts from 1
  if (sortedTiers.length > 0 && sortedTiers[0].min_quantity > 1) {
    warnings.push('İlk kademe 1 adetten başlamıyor');
  }
  
  // Check if last tier has no upper limit
  const lastTier = sortedTiers[sortedTiers.length - 1];
  if (lastTier && lastTier.max_quantity !== null) {
    warnings.push('Son kademenin üst sınırı yok (sınırsız olmalı)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a single price tier
 * @param tier - Tier to validate
 * @returns Validation result
 */
export function validateSingleTier(
  tier: Omit<PriceTier, 'id' | 'product_id' | 'created_at' | 'updated_at'>
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Required fields
  if (!tier.min_quantity || tier.min_quantity < 1) {
    errors.push('Minimum adet 1\'den büyük olmalı');
  }
  
  if (!tier.price || tier.price <= 0) {
    errors.push('Fiyat 0\'dan büyük olmalı');
  }
  
  // Max quantity validation
  if (tier.max_quantity !== undefined && tier.max_quantity !== null) {
    if (tier.max_quantity < tier.min_quantity) {
      errors.push('Maksimum adet minimum adetten küçük olamaz');
    }
  }
  
  // Discount percentage validation
  if (tier.discount_percentage !== undefined) {
    if (tier.discount_percentage < 0 || tier.discount_percentage > 100) {
      errors.push('İndirim yüzdesi 0-100 arasında olmalı');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate product data
 * @param productData - Product data to validate
 * @returns Validation result
 */
export function validateProductData(productData: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Required fields
  if (!productData.name || productData.name.trim() === '') {
    errors.push('Ürün adı gereklidir');
  }
  
  if (!productData.price || productData.price <= 0) {
    errors.push('Fiyat 0\'dan büyük olmalı');
  }
  
  if (!productData.category_id) {
    errors.push('Kategori seçimi gereklidir');
  }
  
  // Optional validations
  if (productData.quantity !== undefined && productData.quantity < 0) {
    errors.push('Stok miktarı negatif olamaz');
  }
  
  if (productData.compare_price !== undefined && productData.compare_price !== null) {
    if (productData.compare_price <= productData.price) {
      errors.push('Karşılaştırma fiyatı normal fiyattan büyük olmalı');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate quantity input
 * @param quantity - Quantity to validate
 * @param maxQuantity - Maximum allowed quantity (optional)
 * @returns Validation result
 */
export function validateQuantity(
  quantity: number,
  maxQuantity?: number
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!quantity || quantity < 1) {
    errors.push('Adet 1\'den büyük olmalı');
  }
  
  if (!Number.isInteger(quantity)) {
    errors.push('Adet tam sayı olmalı');
  }
  
  if (maxQuantity !== undefined && quantity > maxQuantity) {
    errors.push(`Stokta sadece ${maxQuantity} adet var`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize and format tier data before saving
 * @param tierData - Raw tier data
 * @returns Sanitized tier data
 */
export function sanitizeTierData(tierData: any): {
  min_quantity: number;
  max_quantity: number | null;
  price: number;
  discount_percentage?: number;
} {
  return {
    min_quantity: parseInt(tierData.min_quantity) || 1,
    max_quantity: tierData.max_quantity ? parseInt(tierData.max_quantity) : null,
    price: parseFloat(tierData.price) || 0,
    discount_percentage: tierData.discount_percentage ? 
      parseFloat(tierData.discount_percentage) : undefined
  };
}

/**
 * Format validation errors for display
 * @param errors - Array of error messages
 * @returns Formatted error string
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return '';
  
  if (errors.length === 1) {
    return errors[0];
  }
  
  return `• ${errors.join('\n• ')}`;
}
