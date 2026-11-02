import React from 'react';
import { BUSINESS_CONFIG } from '../../lib/constants';
import { DecorativeLotus } from './DecorativeLotus';
import { PoornaluVisual } from './PoornaluArtwork';
import { Phone, Award, Sparkles, ShieldCheck } from 'lucide-react';

export const PoornaluHeroPoster: React.FC<{ onOrderClick?: () => void }> = ({ onOrderClick }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C69A45] bg-[#7B211F] text-[#FFF3DD]">
      {/* Decorative Outer Gold Inlay Border */}
      <div className="absolute inset-1.5 border border-[#C69A45]/40 rounded-[22px] pointer-events-none" />
      <div className="absolute inset-3 border border-[#F8E7CB]/20 rounded-[18px] pointer-events-none" />

      {/* Traditional Indian Festive Backdrop with Kolam/Rangoli motif */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F8E7CB_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Poster Header */}
      <div className="relative pt-8 pb-4 px-6 text-center border-b border-[#C69A45]/40 bg-gradient-to-b from-[#5A1715] to-[#7B211F]">
        {/* Top auspicious invocation */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <DecorativeLotus size={24} color="#C69A45" />
          <span className="text-[#C69A45] font-serif tracking-[0.25em] text-xs uppercase font-semibold">
            Authentic Andhra Homemade Sweets
          </span>
          <DecorativeLotus size={24} color="#C69A45" />
        </div>

        {/* Telugu Brand Heading */}
        <p className="text-[#F8E7CB] text-lg md:text-xl font-serif font-medium tracking-wide text-amber-200/90 mb-1">
          సాంప్రదాయ ఆంధ్రా పూర్ణాలు (పూర్ణం బూరెలు)
        </p>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-wider text-[#FFF3DD] drop-shadow-md">
          {BUSINESS_CONFIG.name}
        </h1>

        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-transparent to-[#C69A45]" />
          <p className="text-[#C69A45] font-serif text-sm md:text-base font-bold tracking-widest uppercase">
            {BUSINESS_CONFIG.tagline}
          </p>
          <span className="w-8 md:w-16 h-0.5 bg-gradient-to-l from-transparent to-[#C69A45]" />
        </div>
      </div>

      {/* Poster Body: Food Presentation & Details */}
      <div className="relative p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#7B211F] via-[#681C1A] to-[#5A1715]">
        {/* Left Column: Visual Artwork of Poornam Boorelu on Brass Plate */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="relative group w-full max-w-sm">
            {/* Glow Aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#C69A45]/30 to-[#9B302A]/40 rounded-3xl blur-md" />
            
            {/* The Visual */}
            <PoornaluVisual variant="brass-plate" size="md" className="w-full h-auto aspect-square" />
            
            {/* Floating Quality Stamp */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-br from-[#FFE082] via-[#C69A45] to-[#8A621C] text-[#553322] p-2.5 rounded-full shadow-lg border-2 border-[#FFF3DD] flex flex-col items-center justify-center text-center w-16 h-16 transform rotate-6">
              <Sparkles className="w-4 h-4 text-[#7B211F] mb-0.5" />
              <span className="text-[9px] font-black leading-tight uppercase tracking-tighter">100% PURE GHEE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Poster Information, Highlights & Order Button */}
        <div className="md:col-span-6 space-y-5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#553322]/80 border border-[#C69A45]/50 text-xs text-[#F8E7CB]">
            <Award className="w-4 h-4 text-[#C69A45]" />
            <span>Master Sweets Chef: <strong>{BUSINESS_CONFIG.owner}</strong></span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF3DD] tracking-wide leading-tight">
              Crisp Outside, Heavenly Poornam Inside!
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#F8E7CB]/90 font-sans leading-relaxed">
              Prepared traditionally with fermented urad dal-rice crust, rich organic jaggery, slow-cooked chana dal, grated coconut, and fragrant cardamom fried fresh in cow ghee.
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <div className="bg-[#5A1715]/70 p-2.5 rounded-xl border border-[#C69A45]/30 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C69A45] flex-shrink-0" />
              <span>Zero Preservatives</span>
            </div>
            <div className="bg-[#5A1715]/70 p-2.5 rounded-xl border border-[#C69A45]/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C69A45] flex-shrink-0" />
              <span>Pure Cow Ghee</span>
            </div>
            <div className="bg-[#5A1715]/70 p-2.5 rounded-xl border border-[#C69A45]/30 flex items-center gap-2">
              <DecorativeLotus size={16} color="#C69A45" className="flex-shrink-0" />
              <span>Fresh Made to Order</span>
            </div>
            <div className="bg-[#5A1715]/70 p-2.5 rounded-xl border border-[#C69A45]/30 flex items-center gap-2">
              <span className="text-[#C69A45] font-bold">₹</span>
              <span>Fair Traditional Price</span>
            </div>
          </div>

          {/* CTA & Direct Phone */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
            {onOrderClick && (
              <button
                onClick={onOrderClick}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#FFE082] via-[#C69A45] to-[#B88728] text-[#553322] font-serif font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-[#FFF3DD]/40"
              >
                Order Fresh Poornalu Now
              </button>
            )}
            <a
              href={`tel:${BUSINESS_CONFIG.phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#553322]/90 hover:bg-[#3D0D0B] text-[#FFF3DD] text-sm font-medium border border-[#C69A45]/60 transition-all"
            >
              <Phone className="w-4 h-4 text-[#C69A45]" />
              <span>{BUSINESS_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Poster Footer Ribbon */}
      <div className="py-3 px-6 bg-[#3D0D0B] border-t border-[#C69A45]/40 flex flex-wrap items-center justify-between gap-4 text-xs text-[#F8E7CB]/80">
        <div className="flex items-center gap-2">
          <span className="text-[#C69A45] text-sm">🪔</span>
          <span>Lakshmipathi Raju • Traditional Homemade Andhra Sweets</span>
        </div>
        <div className="text-right flex items-center gap-2">
          <span>WhatsApp / Call:</span>
          <strong className="text-[#C69A45]">{BUSINESS_CONFIG.phone}</strong>
        </div>
      </div>
    </div>
  );
};

