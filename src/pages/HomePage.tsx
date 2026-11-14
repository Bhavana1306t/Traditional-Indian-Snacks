
import React from 'react';
import { TraditionalDivider } from '../components/common/TraditionalDivider';
import { DecorativeLotus } from '../components/common/DecorativeLotus';
import { PoornaluHeroPoster } from '../components/common/PoornaluHeroPoster';
import {
  ShieldCheck,
  Clock,
  HeartHandshake,
} from 'lucide-react';

interface HomePageProps {
  onOpenOrderModal: () => void;
  onOpenAuthModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenOrderModal,
  onOpenAuthModal,
}) => {
  return (
    <div className="space-y-16 md:space-y-24 pb-16 bg-[#FFF3DD] text-[#553322]">

      {/* 1. HERO SECTION */}
      <section className="relative pt-8 md:pt-14 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Subtle Kolam Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#7B211F_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">

          {/* Top Hero Pitch */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8E7CB] border border-[#C69A45]/50 shadow-sm text-xs text-[#7B211F] font-serif font-bold tracking-wide">
              <DecorativeLotus size={18} color="#7B211F" />
              <span>Homemade Andhra Festival Delicacy</span>
              <DecorativeLotus size={18} color="#7B211F" />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-[#7B211F] tracking-tight leading-tight">
              Authentic Traditional Andhra Poornalu
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-sans text-[#553322]/85 max-w-2xl mx-auto leading-relaxed">
              Experience the taste of tradition with our delicious homemade Poornalu. Prepared by Lakshmipathi Raju with heirloom culinary mastery.
            </p>

          </div>

          {/* Authentic Poornam Boorelu Poster */}
          <div className="mt-8">
            <PoornaluHeroPoster onOrderClick={onOpenOrderModal} />
          </div>

        </div>
      </section>

      {/* 2. ABOUT TRADITIONAL INDIAN SNACKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <TraditionalDivider
          title="About Traditional Indian Snacks"
          subtitle="Heirloom recipes passed down with uncompromising care and devotion"
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Devoted Home Cooking */}
          <div className="bg-[#FFF3DD] p-6 rounded-3xl border border-[#C69A45]/40 shadow-md text-center space-y-3">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7B211F]/10 border border-[#C69A45]/50 flex items-center justify-center text-[#7B211F]">
              <HeartHandshake className="w-7 h-7" />
            </div>

            <h3 className="font-serif font-bold text-lg text-[#7B211F]">
              Devoted Home Cooking
            </h3>

            <p className="text-xs sm:text-sm text-[#553322]/80 leading-relaxed">
              Every single batch of Poornalu is prepared right in our kitchen with the same reverence and affection prepared for auspicious temple festivals and family poojas.
            </p>

          </div>

          {/* Pure & Wholesome */}
          <div className="bg-[#FFF3DD] p-6 rounded-3xl border border-[#C69A45]/40 shadow-md text-center space-y-3">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7B211F]/10 border border-[#C69A45]/50 flex items-center justify-center text-[#7B211F]">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h3 className="font-serif font-bold text-lg text-[#7B211F]">
              Pure & Wholesome
            </h3>

            <p className="text-xs sm:text-sm text-[#553322]/80 leading-relaxed">
              We never use artificial colors, chemical preservatives, or refined sugars. Only dark mineral-rich jaggery, unadulterated cow ghee, and farm-fresh lentils.
            </p>

          </div>

          {/* Freshly Fried To Order */}
          <div className="bg-[#FFF3DD] p-6 rounded-3xl border border-[#C69A45]/40 shadow-md text-center space-y-3">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7B211F]/10 border border-[#C69A45]/50 flex items-center justify-center text-[#7B211F]">
              <Clock className="w-7 h-7" />
            </div>

            <h3 className="font-serif font-bold text-lg text-[#7B211F]">
              Freshly Fried To Order
            </h3>

            <p className="text-xs sm:text-sm text-[#553322]/80 leading-relaxed">
              We do not mass produce or store pre-fried sweets on shelves. Your order is fried golden-brown specifically for your scheduled pickup or doorstep delivery.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
};
