import React from 'react';
import { BUSINESS_CONFIG } from '../lib/constants';
import { TraditionalDivider } from '../components/common/TraditionalDivider';
import { DecorativeLotus } from '../components/common/DecorativeLotus';
import { PoornaluVisual } from '../components/common/PoornaluArtwork';
import { Sparkles, Heart, Award, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC<{ onOpenOrderModal: () => void }> = ({ onOpenOrderModal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FFF3DD] text-[#553322]">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8E7CB] border border-[#C69A45]/40 text-xs font-serif font-bold text-[#7B211F]">
          <DecorativeLotus size={16} color="#7B211F" />
          <span>Our Roots & Heritage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-[#7B211F]">
          About Traditional Indian Snacks
        </h1>
        <p className="text-sm sm:text-base text-[#553322]/80 leading-relaxed font-sans">
          The story of handcrafted Andhra homemade sweets, nurtured by Lakshmipathi Raju with unwavering dedication to purity and authentic flavor.
        </p>
      </div>

      <TraditionalDivider />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5 text-sm sm:text-base leading-relaxed text-[#553322]/90">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#7B211F]">
            Handcrafted with Devotion in Andhra Pradesh
          </h2>
          <p>
            In Telugu households, <strong>Poornalu (Poornam Boorelu)</strong> are not just a festive sweet—they are the sacred symbol of celebration, prosperity, and divine joy. Prepared traditionally during Sankranti, Ugadi, Varalakshmi Vratham, and auspicious family gatherings, each Poornam Boore carries generations of warmth.
          </p>
          <p>
            At <strong>Traditional Indian Snacks</strong>, founder and master sweets craftsman <strong>Lakshmipathi Raju</strong> created this specialized kitchen with a single heartfelt mission: to preserve and deliver the authentic taste of homemade Andhra Poornalu, freshly made on order without commercial shortcuts or artificial additives.
          </p>
          <div className="p-4 rounded-2xl bg-[#F8E7CB]/80 border border-[#C69A45]/40">
            <h3 className="font-serif font-bold text-sm text-[#7B211F] mb-1">Our Core Belief:</h3>
            <p className="text-xs text-[#553322]/80 italic">
              "When you prepare sweets with genuine devotion, pure cow ghee, and unadulterated organic jaggery, you taste the true spirit of Indian home hospitality."
            </p>
            <p className="text-right text-xs font-serif font-bold text-[#7B211F] mt-1">— Lakshmipathi Raju</p>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center">
          <PoornaluVisual variant="brass-plate" size="lg" className="w-full max-w-md aspect-square" />
        </div>
      </div>

      {/* Why Our Andhra Poornalu Stand Apart */}
      <div className="bg-[#7B211F] text-[#FFF3DD] rounded-3xl p-8 sm:p-12 border-2 border-[#C69A45] shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">
            The Three Pillars of Our Tradition
          </h3>
          <p className="text-xs sm:text-sm text-[#F8E7CB]/80 mt-1">
            Why our homemade sweets bring back nostalgic memories of grandma's kitchen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#5A1715] p-6 rounded-2xl border border-[#C69A45]/30 space-y-3">
            <Award className="w-8 h-8 text-[#FFE082]" />
            <h4 className="font-serif font-bold text-lg text-[#FFF3DD]">Heirloom Technique</h4>
            <p className="text-xs text-[#F8E7CB]/80 leading-relaxed">
              We soak organic urad dal and aged rice, grinding them to silk consistency and allowing gentle natural fermentation for the signature crispy exterior.
            </p>
          </div>

          <div className="bg-[#5A1715] p-6 rounded-2xl border border-[#C69A45]/30 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#FFE082]" />
            <h4 className="font-serif font-bold text-lg text-[#FFF3DD]">Organic Bellam & Pure Ghee</h4>
            <p className="text-xs text-[#F8E7CB]/80 leading-relaxed">
              Our sweet poornam is prepared using authentic Andhra dark organic jaggery (bellam) that contains zero chemical bleach, melted with tender coconut and cow ghee.
            </p>
          </div>

          <div className="bg-[#5A1715] p-6 rounded-2xl border border-[#C69A45]/30 space-y-3">
            <Sparkles className="w-8 h-8 text-[#FFE082]" />
            <h4 className="font-serif font-bold text-lg text-[#FFF3DD]">Zero Compromise</h4>
            <p className="text-xs text-[#F8E7CB]/80 leading-relaxed">
              Zero palm oil, zero synthetic flavors, zero preservatives. Fried fresh per order and packed warm to maintain the crisp crackle.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onOpenOrderModal}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FFE082] via-[#C69A45] to-[#B88728] text-[#553322] font-serif font-bold text-sm tracking-wider uppercase shadow-xl hover:scale-105 transition-all"
          >
            Order Your Fresh Batch Today
          </button>
        </div>
      </div>
    </div>
  );
};
