import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../lib/constants';
import { TraditionalDivider } from '../components/common/TraditionalDivider';
import { DecorativeLotus } from '../components/common/DecorativeLotus';
import { PoornaluVisual } from '../components/common/PoornaluArtwork';
import { PoornaluHeroPoster } from '../components/common/PoornaluHeroPoster';
import { openDirectWhatsApp } from '../lib/whatsapp';
import {
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  Award,
  Clock,
  HeartHandshake,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface HomePageProps {
  onOpenOrderModal: () => void;
  onOpenAuthModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenOrderModal, onOpenAuthModal }) => {
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

            {/* Hero CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOpenOrderModal}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7B211F] via-[#9B302A] to-[#7B211F] text-[#FFF3DD] font-serif font-bold text-sm tracking-wider uppercase shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#C69A45]/50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFE082]" />
                <span>Order Now</span>
              </button>

              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-full bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] font-serif font-bold text-sm tracking-wider transition-all border border-[#C69A45]/60 flex items-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#C69A45]" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Authentic Poornam Boorelu Poster & Traditional Visual Identity */}
          <div className="mt-8">
            <PoornaluHeroPoster onOrderClick={onOpenOrderModal} />
          </div>
        </div>
      </section>

      {/* 2. OUR SPECIAL PRODUCT: ANDHRA POORNALU (POORNAM BOORELU) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TraditionalDivider
          title="Our Special Product"
          subtitle="Exclusive dedication to the sacred, golden sweet delicacy of Andhra Pradesh"
        />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F8E7CB]/70 rounded-3xl p-6 sm:p-10 border-2 border-[#C69A45]/50 shadow-xl">
          {/* Left: Cut-Open & Crispy Visual Showcases (Poornalu Only) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PoornaluVisual variant="brass-plate" size="sm" className="w-full h-auto aspect-square" />
            <PoornaluVisual variant="cut-open" size="sm" className="w-full h-auto aspect-square" />
          </div>

          {/* Right: Detailed Product Highlights & Honest Pricing */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B211F]/10 border border-[#C69A45]/40 text-xs text-[#7B211F] font-semibold">
              <Award className="w-4 h-4 text-[#C69A45]" />
              <span>Signature Offering • Poornam Boorelu</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#7B211F]">
              Andhra Poornalu (Poornam Boorelu)
            </h2>

            <p className="text-sm sm:text-base text-[#553322]/85 font-sans leading-relaxed">
              Traditional Andhra sweet with a golden crispy outer layer and delicious sweet lentil filling. Prepared with slow-cooked Bengal gram (chana dal), melted organic jaggery, grated tender coconut, and hand-pounded green cardamom, dipped in aged urad dal-rice batter and deep fried in pure ghee.
            </p>

            {/* Pricing Box - Note: We do NOT invent prices! */}
            <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-[#C69A45]/50 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-serif tracking-wider text-[#C69A45] font-bold block">
                  Product Price
                </span>
                <span className="text-lg sm:text-xl font-serif font-black text-[#7B211F]">
                  Contact us for price
                </span>
                <p className="text-[11px] text-[#553322]/70 mt-0.5">
                  Freshly made to order in customizable batch sizes.
                </p>
              </div>

              <button
                onClick={onOpenOrderModal}
                className="px-5 py-2.5 rounded-full bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] font-serif font-bold text-xs uppercase tracking-wider shadow-md transition"
              >
                Book Order
              </button>
            </div>

            {/* Authentic Ingredients List */}
            <div className="pt-2">
              <h4 className="text-xs font-serif font-bold text-[#7B211F] uppercase tracking-wider mb-2">
                Pure Traditional Ingredients:
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Organic Jaggery (Bellam)', 'Bengal Gram (Chana Dal)', 'Fresh Grated Coconut', 'Pure Cow Ghee', 'Fragrant Cardamom', 'Fermented Urad-Rice Shell'].map((item) => (
                  <span key={item} className="px-3 py-1 rounded-full bg-white/80 border border-[#C69A45]/40 text-[#553322] font-medium">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US & TRADITIONAL PREPARATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TraditionalDivider
          title="About Traditional Indian Snacks"
          subtitle="Heirloom recipes passed down with uncompromising care and devotion"
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFF3DD] p-6 rounded-3xl border border-[#C69A45]/40 shadow-md text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7B211F]/10 border border-[#C69A45]/50 flex items-center justify-center text-[#7B211F]">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#7B211F]">Devoted Home Cooking</h3>
            <p className="text-xs sm:text-sm text-[#553322]/80 leading-relaxed">
              Every single batch of Poornalu is prepared right in our kitchen with the same reverence and affection prepared for auspicious temple festivals and family poojas.
            </p>
          </div>

          <div className="bg-[#FFF3DD] p-6 rounded-3xl border border-[#C69A45]/40 shadow-md text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7B211F]/10 border border-[#C69A45]/50 flex items-center justify-center text-[#7B211F]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#7B211F]">Pure & Wholesome</h3>
            <p className="text-xs sm:text-sm text-[#553322]/80 leading-relaxed">
              We never use artificial colors, chemical preservatives, or refined sugars. Only dark mineral-rich jaggery, unadulterated cow ghee, and farm-fresh lentils.
            </p>
          </div>

          <div className="bg-[#FFF3DD] p-6 rounded-3xl border border-[#C69A45]/40 shadow-md text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7B211F]/10 border border-[#C69A45]/50 flex items-center justify-center text-[#7B211F]">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#7B211F]">Freshly Fried To Order</h3>
            <p className="text-xs sm:text-sm text-[#553322]/80 leading-relaxed">
              We do not mass produce or store pre-fried sweets on shelves. Your order is fried golden-brown specifically for your scheduled pickup or doorstep delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CONTACT & DIRECT ORDERING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TraditionalDivider
          title="Contact Lakshmipathi Raju"
          subtitle="Direct phone and WhatsApp assistance for your festive and family orders"
        />

        <div className="mt-8 bg-gradient-to-br from-[#7B211F] via-[#681C1A] to-[#5A1715] text-[#FFF3DD] rounded-3xl p-8 sm:p-12 border-2 border-[#C69A45] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <DecorativeLotus size={36} color="#FFE082" />
            
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-wide">
              Have Questions or Planning a Family Event?
            </h2>

            <p className="text-sm sm:text-base text-[#F8E7CB]/90 font-sans max-w-xl mx-auto leading-relaxed">
              Lakshmipathi Raju personally attends to every order inquiry to guarantee fresh preparation and timely delivery across Andhra Pradesh.
            </p>

            {/* Contacts Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="px-6 py-3 rounded-full bg-[#FFF3DD] hover:bg-[#F8E7CB] text-[#7B211F] font-serif font-bold text-sm shadow-md transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#7B211F]" />
                <span>Call {BUSINESS_CONFIG.phone}</span>
              </a>

              <a
                href={openDirectWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-serif font-bold text-sm shadow-md transition flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Lakshmipathi Raju</span>
              </a>
            </div>

            <p className="text-xs text-[#F8E7CB]/70 pt-2">
              Kitchen Operating Hours: <strong>{BUSINESS_CONFIG.operatingHours}</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

