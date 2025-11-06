"use client";

import { useState, useEffect } from "react";
import { priceTierApi } from "@/services/api";
import { PriceTier } from "@/utils/priceCalculator";
import {
  validatePriceTiers,
  checkTierOverlap,
  validateSingleTier,
} from "@/utils/validators";

interface PriceTierManagerProps {
  productId: number;
  basePrice: number;
  onTiersChange?: (tiers: PriceTier[]) => void;
}

export default function PriceTierManager({
  productId,
  basePrice,
  onTiersChange,
}: PriceTierManagerProps) {
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTier, setEditingTier] = useState<PriceTier | null>(null);
  const [newTier, setNewTier] = useState({
    min_quantity: 1,
    max_quantity: "",
    price: 0,
    discount_percentage: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (productId) {
      loadTiers();
    }
  }, [productId, basePrice]);

  const loadTiers = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);
      const response = await priceTierApi.getByProductId(productId);
      setTiers(response.data || []);
      onTiersChange?.(response.data || []);
    } catch (error) {
      console.error("Error loading tiers:", error);
      setErrors(["Fiyat kademeleri yüklenemedi"]);
      setTiers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTier = async (e: React.FormEvent) => {
    e.preventDefault();

    const tierData = {
      min_quantity: newTier.min_quantity,
      max_quantity: newTier.max_quantity
        ? parseInt(newTier.max_quantity)
        : null,
      price: newTier.price,
      discount_percentage: newTier.discount_percentage
        ? parseFloat(newTier.discount_percentage)
        : undefined,
    };

    // Validate single tier
    const singleValidation = validateSingleTier(tierData);
    if (!singleValidation.isValid) {
      setErrors(singleValidation.errors);
      return;
    }

    // Check for overlaps with existing tiers
    const overlapCheck = checkTierOverlap(tierData, tiers);
    if (overlapCheck.hasOverlap) {
      setErrors(overlapCheck.errors);
      return;
    }

    try {
      setSaving(true);
      setErrors([]);

      const response = await priceTierApi.create({
        product_id: productId,
        ...tierData,
      });

      const updatedTiers = [...tiers, response.data];
      setTiers(updatedTiers);
      onTiersChange?.(updatedTiers);

      // Reset form
      setNewTier({
        min_quantity: 1,
        max_quantity: "",
        price: 0,
        discount_percentage: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding tier:", error);
      setErrors(["Kademe eklenemedi"]);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTier = async (
    tierId: number,
    updatedData: Partial<PriceTier>,
  ) => {
    try {
      setSaving(true);

      const response = await priceTierApi.update(tierId, updatedData);

      const updatedTiers = tiers.map((tier) =>
        tier.id === tierId ? { ...tier, ...response.data } : tier,
      );

      setTiers(updatedTiers);
      onTiersChange?.(updatedTiers);
      setEditingTier(null);
    } catch (error) {
      console.error("Error updating tier:", error);
      setErrors(["Kademe güncellenemedi"]);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTier = async (tierId: number) => {
    if (!confirm("Bu kademeyi silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      setSaving(true);

      await priceTierApi.delete(tierId);

      const updatedTiers = tiers.filter((tier) => tier.id !== tierId);
      setTiers(updatedTiers);
      onTiersChange?.(updatedTiers);
    } catch (error) {
      console.error("Error deleting tier:", error);
      setErrors(["Kademe silinemedi"]);
    } finally {
      setSaving(false);
    }
  };

  const calculateDiscountPercentage = (tierPrice: number) => {
    return ((basePrice - tierPrice) / basePrice) * 100;
  };

  const formatTierRange = (tier: PriceTier) => {
    const maxDisplay = tier.max_quantity ? `-${tier.max_quantity}` : "+";
    return `${tier.min_quantity}${maxDisplay} adet`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Fiyat Kademeleri
            </h3>
            <p className="text-sm text-gray-600">
              Ürün için adet bazlı fiyat kademeleri
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-3 text-gray-600">
            Fiyat kademeleri yükleniyor...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Fiyat Kademeleri
          </h3>
          <p className="text-sm text-gray-600">
            Ürün için adet bazlı fiyat kademeleri
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Kademe Ekle
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Hatalar:</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-900">
                  Kademe Düzenle
                </h4>
                <button
                  onClick={() => setEditingTier(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Minimum Adet *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingTier.min_quantity}
                    onChange={(e) =>
                      setEditingTier({
                        ...editingTier,
                        min_quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Maksimum Adet
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Sınırsız için boş bırakın"
                    value={editingTier.max_quantity || ""}
                    onChange={(e) =>
                      setEditingTier({
                        ...editingTier,
                        max_quantity: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Fiyat (₺) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={editingTier.price}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      const discount =
                        price > 0
                          ? (((basePrice - price) / basePrice) * 100).toFixed(2)
                          : "";
                      setEditingTier({
                        ...editingTier,
                        price,
                        discount_percentage: parseFloat(discount),
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    İndirim %
                  </label>
                  <input
                    type="text"
                    value={
                      editingTier.discount_percentage?.toFixed(2) ||
                      calculateDiscountPercentage(editingTier.price).toFixed(2)
                    }
                    readOnly
                    placeholder="Otomatik hesaplanır"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingTier(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    disabled={saving}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateTier(editingTier.id, {
                        min_quantity: editingTier.min_quantity,
                        max_quantity: editingTier.max_quantity,
                        price: editingTier.price,
                        discount_percentage: editingTier.discount_percentage,
                      });
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? "Güncelleniyor..." : "Güncelle"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Yeni Fiyat Kademesi
          </h4>
          <form onSubmit={handleAddTier} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Minimum Adet *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newTier.min_quantity}
                  onChange={(e) =>
                    setNewTier({
                      ...newTier,
                      min_quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Maksimum Adet
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Sınırsız için boş bırakın"
                  value={newTier.max_quantity}
                  onChange={(e) =>
                    setNewTier({ ...newTier, max_quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Fiyat (₺) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newTier.price}
                  onChange={(e) => {
                    const price = parseFloat(e.target.value) || 0;
                    const discount =
                      price > 0
                        ? (((basePrice - price) / basePrice) * 100).toFixed(2)
                        : "";
                    setNewTier({
                      ...newTier,
                      price,
                      discount_percentage: discount,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  İndirim %
                </label>
                <input
                  type="text"
                  value={newTier.discount_percentage}
                  readOnly
                  placeholder="Otomatik hesaplanır"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                disabled={saving}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Kaydediliyor..." : "Kademe Ekle"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tiers List */}
      {tiers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-2">💰</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Henüz fiyat kademesi yok
          </h4>
          <p className="text-gray-600 mb-4">
            Ürün için adet bazlı fiyat kademeleri ekleyebilirsiniz
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            İlk Kademeyi Ekle
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Adet Aralığı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    İndirim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tasarruf (1 adet)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tiers
                  .sort((a, b) => a.min_quantity - b.min_quantity)
                  .map((tier) => {
                    const discountPercentage =
                      tier.discount_percentage ||
                      calculateDiscountPercentage(tier.price);
                    const savingsPerUnit = basePrice - tier.price;

                    return (
                      <tr key={tier.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {formatTierRange(tier)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-orange-600">
                            ₺{tier.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            %{discountPercentage.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-green-600 font-medium">
                            ₺{savingsPerUnit.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setEditingTier(tier)}
                              className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={saving}
                              title="Kademeyi düzenle"
                            >
                              {saving ? "..." : "Düzenle"}
                            </button>
                            <button
                              onClick={() => handleDeleteTier(tier.id)}
                              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={saving}
                              title="Kademeyi sil"
                            >
                              {saving ? "..." : "Sil"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview */}
      {tiers.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Önizleme:
          </h4>
          <div className="text-sm text-blue-800">
            {tiers
              .sort((a, b) => a.min_quantity - b.min_quantity)
              .map((tier, index) => {
                const discountPercentage =
                  tier.discount_percentage ||
                  calculateDiscountPercentage(tier.price);
                return (
                  <span key={tier.id}>
                    {formatTierRange(tier)}: ₺{tier.price.toFixed(2)} (%
                    {discountPercentage.toFixed(1)} indirim)
                    {index < tiers.length - 1 && ", "}
                  </span>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
