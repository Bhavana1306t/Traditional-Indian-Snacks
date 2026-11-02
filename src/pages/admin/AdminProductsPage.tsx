import React, { useState, useEffect } from 'react';
import { Product } from '../../lib/types';
import { getProducts, updateProduct } from '../../lib/api';
import { PoornaluVisual } from '../../components/common/PoornaluArtwork';
import { BUSINESS_CONFIG } from '../../lib/constants';
import {
  Tag,
  Save,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [priceInput, setPriceInput] = useState<string>('0');
  const [description, setDescription] = useState<string>('');
  const [unit, setUnit] = useState<string>('Box of 10 pcs');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const prods = await getProducts();
      if (prods.length > 0) {
        const p = prods[0];
        setProduct(p);
        setPriceInput(String(p.price || 0));
        setDescription(p.description || '');
        setUnit(p.unit || 'Box of 10 pcs');
        setIsAvailable(p.is_available ?? true);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setError(null);
    setSuccess(false);

    const numericPrice = parseFloat(priceInput) || 0;
    if (numericPrice < 0) {
      setError('Price cannot be negative.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateProduct(product.id, {
        price: numericPrice,
        description: description.trim(),
        unit: unit.trim(),
        is_available: isAvailable,
      });

      setProduct(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Failed to update product details');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C69A45]/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#7B211F]">
            Product & Pricing Management
          </h1>
          <p className="text-xs sm:text-sm text-[#553322]/80 mt-1">
            Configure unit pricing, stock availability, and recipe notes for Andhra Poornalu
          </p>
        </div>

        <button
          onClick={loadProduct}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] text-xs font-semibold border border-[#C69A45]/50 transition flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Product Data</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-900 flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Product pricing and details saved successfully! All customer orders will calculate totals using this configured rate.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs sm:text-sm text-rose-900 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Edit Form */}
        <div className="lg:col-span-7 bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/40 p-6 sm:p-8 shadow-md">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Product Title */}
            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Product Name
              </label>
              <input
                type="text"
                disabled
                value={BUSINESS_CONFIG.productName}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 text-sm font-semibold cursor-not-allowed"
              />
              <p className="text-[11px] text-[#553322]/60 mt-0.5">
                Traditional Indian Snacks exclusively crafts authentic Andhra Poornam Boorelu.
              </p>
            </div>

            {/* Price Configuration */}
            <div className="bg-[#F8E7CB]/70 p-4 rounded-2xl border border-[#C69A45]/40 space-y-2">
              <label className="block text-xs font-semibold text-[#7B211F] uppercase tracking-wider">
                Configured Unit Price (₹ INR)
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3.5 top-2.5 font-bold text-base text-[#7B211F]">₹</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-[#C69A45] bg-white text-base font-bold text-[#7B211F] focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
                />
              </div>

              {/* Price Behavior Explanatory Note */}
              <div className="text-[11px] text-[#553322]/80 space-y-1 pt-1">
                {parseFloat(priceInput) <= 0 ? (
                  <p className="text-amber-800 font-semibold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    <span>Price is currently <strong>₹0</strong>: The storefront will display "<strong>Contact us for price</strong>" so you can quote customized rates per occasion.</span>
                  </p>
                ) : (
                  <p className="text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active fixed rate: Customers ordering 2 boxes will see estimated total of <strong>₹{(parseFloat(priceInput) * 2).toFixed(2)}</strong>.</span>
                  </p>
                )}
              </div>
            </div>

            {/* Packaging Unit */}
            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Packaging / Serving Unit
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Box of 10 pcs, Box of 15 pcs, or Half Kg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
              />
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8E7CB]/70 border border-[#C69A45]/40">
              <div>
                <span className="font-serif font-bold text-sm text-[#7B211F] block">
                  Kitchen Availability / Taking Orders
                </span>
                <span className="text-xs text-[#553322]/70">
                  {isAvailable
                    ? 'In Stock: Customers can place new orders.'
                    : 'Kitchen Paused: New customer orders temporarily halted.'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-bold ${
                  isAvailable
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-700 text-white'
                }`}
              >
                {isAvailable ? 'Accepting Orders' : 'Kitchen Closed'}
              </button>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Product Description & Culinary Details
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-3 px-8 rounded-xl bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-50 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Updating Database...' : 'Save Product Changes'}</span>
            </button>
          </form>
        </div>

        {/* Right: Live Preview & Strict Image Rule Reminder */}
        <div className="lg:col-span-5 space-y-6">
          {/* Strict Image Policy Card */}
          <div className="bg-[#7B211F] text-[#FFF3DD] p-6 rounded-3xl border-2 border-[#C69A45] shadow-md space-y-3">
            <div className="flex items-center gap-2 text-amber-200">
              <ShieldAlert className="w-5 h-5 text-[#FFE082]" />
              <h4 className="font-serif font-bold text-sm">Strict Food Photography Policy</h4>
            </div>
            <p className="text-xs text-[#F8E7CB]/90 leading-relaxed">
              Every food photograph on the website is strictly confined to <strong>Poornalu / Poornam Boorelu</strong> only. Other sweets (laddus, mysore pak, jalebi) or unrelated snacks are strictly forbidden from display.
            </p>
          </div>

          {/* Visual Showcase */}
          <div className="bg-[#F8E7CB] p-6 rounded-3xl border border-[#C69A45]/40 shadow-sm space-y-4 text-center">
            <h4 className="font-serif font-bold text-sm text-[#7B211F]">
              Live Storefront Representation
            </h4>
            <PoornaluVisual variant="brass-plate" size="md" className="mx-auto" />
            <div className="text-xs text-[#553322]/80 space-y-1">
              <p className="font-bold text-[#7B211F]">{BUSINESS_CONFIG.productName}</p>
              <p>Current Price: <strong>{parseFloat(priceInput) > 0 ? `₹${priceInput} / ${unit}` : 'Contact us for price'}</strong></p>
              <p>Status: <span className={isAvailable ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{isAvailable ? 'Available for Orders' : 'Paused'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
