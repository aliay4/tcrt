// Price calculation utilities for tiered pricing system

export interface PriceTier {
  id: number;
  product_id: number;
  min_quantity: number;
  max_quantity: number | null;
  price: number;
  discount_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PriceCalculationResult {
  price: number;
  tier: PriceTier | null;
  savings: number;
  originalPrice: number;
  discountPercentage: number;
}

/**
 * Calculate the price for a given quantity based on price tiers
 * @param basePrice - The base price of the product (when no tiers apply)
 * @param tiers - Array of price tiers for the product
 * @param quantity - The quantity to calculate price for
 * @returns PriceCalculationResult with calculated price and tier info
 */
export function calculatePriceByQuantity(
  basePrice: number,
  tiers: PriceTier[],
  quantity: number
): PriceCalculationResult {
  // Sort tiers by min_quantity to ensure proper order
  const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  
  // Find the applicable tier for the given quantity
  const applicableTier = getTierForQuantity(sortedTiers, quantity);
  
  if (applicableTier) {
    const savings = (basePrice - applicableTier.price) * quantity;
    const discountPercentage = applicableTier.discount_percentage || 
      ((basePrice - applicableTier.price) / basePrice) * 100;
    
    return {
      price: applicableTier.price,
      tier: applicableTier,
      savings: Math.max(0, savings),
      originalPrice: basePrice,
      discountPercentage: Math.max(0, discountPercentage)
    };
  }
  
  // No tier applies, use base price
  return {
    price: basePrice,
    tier: null,
    savings: 0,
    originalPrice: basePrice,
    discountPercentage: 0
  };
}


/**
 * Find the appropriate tier for a given quantity
 * @param tiers - Array of price tiers (should be sorted by min_quantity)
 * @param quantity - The quantity to find tier for
 * @returns The applicable tier or null if no tier applies
 */
export function getTierForQuantity(tiers: PriceTier[], quantity: number): PriceTier | null {
  // Find the highest tier that applies (highest min_quantity <= quantity)
  let applicableTier: PriceTier | null = null;
  
  for (const tier of tiers) {
    if (tier.min_quantity <= quantity) {
      // Check if max_quantity constraint is satisfied
      if (tier.max_quantity === null || tier.max_quantity >= quantity) {
        applicableTier = tier;
      }
    }
  }
  
  return applicableTier;
}

/**
 * Format price range display for product listings
 * @param tiers - Array of price tiers
 * @param basePrice - Base price when no tiers apply
 * @returns Formatted price range string
 */
export function formatPriceRange(tiers: PriceTier[], basePrice: number): string {
  if (!tiers || tiers.length === 0) {
    return `₺${basePrice.toFixed(2)}`;
  }
  
  const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  const lowestTier = sortedTiers[0];
  const highestTier = sortedTiers[sortedTiers.length - 1];
  
  if (lowestTier.price === highestTier.price) {
    return `₺${lowestTier.price.toFixed(2)}`;
  }
  
  return `₺${Math.min(lowestTier.price, basePrice).toFixed(2)} - ₺${basePrice.toFixed(2)}`;
}

/**
 * Get the lowest price available (considering tiers and base price)
 * @param tiers - Array of price tiers
 * @param basePrice - Base price when no tiers apply
 * @returns The lowest available price
 */
export function getLowestPrice(tiers: PriceTier[], basePrice: number): number {
  if (!tiers || tiers.length === 0) {
    return basePrice;
  }
  
  const tierPrices = tiers.map(tier => tier.price);
  return Math.min(...tierPrices, basePrice);
}

/**
 * Check if a product has price tiers
 * @param product - Product object with has_price_tiers property
 * @returns Boolean indicating if product has tiers
 */
export function hasPriceTiers(product: any): boolean {
  return product && product.has_price_tiers === true;
}

/**
 * Get savings amount for a specific quantity
 * @param basePrice - Base price of the product
 * @param tiers - Array of price tiers
 * @param quantity - Quantity to calculate savings for
 * @returns Savings amount
 */
export function getSavingsForQuantity(
  basePrice: number,
  tiers: PriceTier[],
  quantity: number
): number {
  const result = calculatePriceByQuantity(basePrice, tiers, quantity);
  return result.savings;
}

/**
 * Get discount percentage for a specific quantity
 * @param basePrice - Base price of the product
 * @param tiers - Array of price tiers
 * @param quantity - Quantity to calculate discount for
 * @returns Discount percentage
 */
export function getDiscountPercentageForQuantity(
  basePrice: number,
  tiers: PriceTier[],
  quantity: number
): number {
  const result = calculatePriceByQuantity(basePrice, tiers, quantity);
  return result.discountPercentage;
}

/**
 * Format tier display text
 * @param tier - Price tier object
 * @returns Formatted tier display string
 */
export function formatTierDisplay(tier: PriceTier): string {
  const maxDisplay = tier.max_quantity ? `-${tier.max_quantity}` : '+';
  return `${tier.min_quantity}${maxDisplay} adet`;
}

/**
 * Get tier badge text for UI display
 * @param tier - Price tier object
 * @param basePrice - Base price for comparison
 * @returns Badge text
 */
export function getTierBadgeText(tier: PriceTier, basePrice: number): string {
  const discount = tier.discount_percentage || 
    ((basePrice - tier.price) / basePrice) * 100;
  
  if (discount > 0) {
    return `%${Math.round(discount)} İndirim`;
  }
  
  return 'Toptan Fiyat';
}

/**
 * Validate if tiers are properly configured
 * @param tiers - Array of price tiers to validate
 * @returns Object with validation result and errors
 */
export function validateTiers(tiers: PriceTier[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!tiers || tiers.length === 0) {
    return { isValid: true, errors: [] };
  }
  
  const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  
  // Check for overlapping ranges
  for (let i = 0; i < sortedTiers.length - 1; i++) {
    const current = sortedTiers[i];
    const next = sortedTiers[i + 1];
    
    const currentMax = current.max_quantity || Infinity;
    const nextMin = next.min_quantity;
    
    if (currentMax >= nextMin) {
      errors.push(`Kademe ${i + 1} ve ${i + 2} arasında çakışma var`);
    }
  }
  
  // Check for invalid quantities
  for (let i = 0; i < sortedTiers.length; i++) {
    const tier = sortedTiers[i];
    
    if (tier.min_quantity < 1) {
      errors.push(`Kademe ${i + 1}: Minimum adet 1'den küçük olamaz`);
    }
    
    if (tier.max_quantity && tier.max_quantity < tier.min_quantity) {
      errors.push(`Kademe ${i + 1}: Maksimum adet minimum adetten küçük olamaz`);
    }
    
    if (tier.price <= 0) {
      errors.push(`Kademe ${i + 1}: Fiyat 0'dan büyük olmalı`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
