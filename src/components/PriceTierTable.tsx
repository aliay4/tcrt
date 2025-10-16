"use client";

import { useState } from 'react';
import { PriceTier, calculatePriceByQuantity } from '@/utils/priceCalculator';

interface PriceTierTableProps {
  tiers: PriceTier[];
  basePrice: number;
  currentQuantity: number;
  onQuantityChange?: (quantity: number) => void;
  className?: string;
}

export default function PriceTierTable({
  tiers,
  basePrice,
  currentQuantity,
  onQuantityChange,
  className = ''
}: PriceTierTableProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sort tiers by min_quantity
  const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);

  const formatTierRange = (tier: PriceTier) => {
    const maxDisplay = tier.max_quantity ? `-${tier.max_quantity}` : '+';
    return `${tier.min_quantity}${maxDisplay} adet`;
  };

  const calculateDiscountPercentage = (tierPrice: number) => {
    return ((basePrice - tierPrice) / basePrice) * 100;
  };

  const getCurrentTier = (quantity: number) => {
    return calculatePriceByQuantity(basePrice, tiers, quantity).tier;
  };

  const isCurrentTier = (tier: PriceTier, quantity: number) => {
    const currentTier = getCurrentTier(quantity);
    return currentTier?.id === tier.id;
  };

  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Fiyat Kademeleri</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Table */}
      {isOpen && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adet Aralığı
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birim Fiyat
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İndirim
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasarruf
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Base Price Row */}
                <tr className={`${currentQuantity === 1 ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-sm font-medium ${currentQuantity === 1 ? 'text-orange-900' : 'text-gray-900'}`}>
                      1 adet
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${currentQuantity === 1 ? 'text-orange-600' : 'text-gray-600'}`}>
                      ₺{basePrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-500">-</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-500">-</span>
                  </td>
                </tr>

                {/* Tier Rows */}
                {sortedTiers.map((tier) => {
                  const discountPercentage = tier.discount_percentage || calculateDiscountPercentage(tier.price);
                  const savingsPerUnit = basePrice - tier.price;
                  const isCurrent = isCurrentTier(tier, currentQuantity);
                  
                  return (
                    <tr 
                      key={tier.id} 
                      className={`${isCurrent ? 'bg-orange-50' : 'hover:bg-gray-50'} cursor-pointer`}
                      onClick={() => onQuantityChange?.(tier.min_quantity)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${isCurrent ? 'text-orange-900' : 'text-gray-900'}`}>
                            {formatTierRange(tier)}
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Aktif
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${isCurrent ? 'text-orange-600' : 'text-gray-900'}`}>
                          ₺{tier.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isCurrent ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                        }`}>
                          %{discountPercentage.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-medium ${isCurrent ? 'text-orange-600' : 'text-green-600'}`}>
                          ₺{savingsPerUnit.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      {isOpen && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">Bilgi</span>
          </div>
          <p className="text-sm text-blue-800">
            Adet aralığına tıklayarak o miktarı seçebilirsiniz. Daha fazla adet alarak daha fazla tasarruf edebilirsiniz!
          </p>
        </div>
      )}
    </div>
  );
}
