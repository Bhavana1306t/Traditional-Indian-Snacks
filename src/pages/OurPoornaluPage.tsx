
import React from 'react';
import { TraditionalDivider } from '../components/common/TraditionalDivider';
import { DecorativeLotus } from '../components/common/DecorativeLotus';
import { PoornaluVisual } from '../components/common/PoornaluArtwork';
import { Sparkles, Heart, Award, ShieldCheck } from 'lucide-react';


export const OurPoornaluPage: React.FC<{
  onOpenOrderModal: () => void;
}> = ({ onOpenOrderModal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14 bg-[#FFF3DD] text-[#553322]">

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8E7CB] border border-[#C69A45]/40 text-xs font-serif font-bold text-[#7B211F]">
          <DecorativeLotus size={16} color="#7B211F" />
          <span>Exclusive Special Product</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-heading font-black text-[#7B211F]">
          Andhra Poornalu (Poornam Boorelu)
        </h1>

        <p className="text-sm sm:text-base text-[#553322]/80 leading-relaxed font-sans">
          The crown jewel of traditional Andhra cuisine. A crispy golden shell
          embracing an aromatic heart of sweet lentils, organic jaggery and
          fresh coconut.
        </p>
      </div>

      <TraditionalDivider />

      {/* Visual Anatomy Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Angle 1 */}
        <div className="space-y-4">
          <PoornaluVisual
            variant="brass-plate"
            size="lg"
            className="w-full h-auto aspect-square"
          />

          <div className="text-center">
            <h3 className="font-serif font-bold text-lg text-[#7B211F]">
              Golden Crisp Outer Crust
            </h3>

            <p className="text-xs text-[#553322]/80 mt-1 max-w-md mx-auto">
              Naturally fermented batter made from carefully balanced aged
              rice and whole urad dal, creating a delicate, golden crispy
              shell when dipped and fried.
            </p>
          </div>
        </div>

        {/* Angle 2 */}
        <div className="space-y-4">
          <PoornaluVisual
            variant="cut-open"
            size="lg"
            className="w-full h-auto aspect-square"
          />

          <div className="text-center">
            <h3 className="font-serif font-bold text-lg text-[#7B211F]">
              Rich Sweet Lentil & Jaggery Filling (Poornam)
            </h3>

            <p className="text-xs text-[#553322]/80 mt-1 max-w-md mx-auto">
              Bengal gram (chana dal) pressure-cooked to melt-in-mouth
              softness, simmered with pure country jaggery, fresh grated
              coconut, and freshly ground green cardamom.
            </p>
          </div>
        </div>
      </div>



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

        
      </div>





      {/* Preparation Breakdown */}
      <div className="bg-[#F8E7CB]/80 rounded-3xl p-8 sm:p-12 border-2 border-[#C69A45]/40 shadow-xl space-y-8">

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#7B211F]">
            The Authentic 4-Stage Preparation
          </h2>

          <p className="text-xs sm:text-sm text-[#553322]/80 mt-1">
            How Lakshmipathi Raju crafts each batch to perfection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">

          {/* Step 1 */}
          <div className="bg-[#FFF3DD] p-5 rounded-2xl border border-[#C69A45]/30 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#7B211F] text-[#FFF3DD] font-serif font-bold flex items-center justify-center text-sm">
              1
            </span>

            <h4 className="font-serif font-bold text-sm text-[#7B211F]">
              Slow-Cooking Dal
            </h4>

            <p className="text-[#553322]/80 leading-relaxed">
              Prime quality chana dal is soaked and cooked until soft yet
              intact, retaining its wholesome nutty aroma.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#FFF3DD] p-5 rounded-2xl border border-[#C69A45]/30 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#7B211F] text-[#FFF3DD] font-serif font-bold flex items-center justify-center text-sm">
              2
            </span>

            <h4 className="font-serif font-bold text-sm text-[#7B211F]">
              Organic Jaggery Simmer
            </h4>

            <p className="text-[#553322]/80 leading-relaxed">
              Caramelized unbleached country jaggery is blended with fresh
              grated coconut and fragrant green cardamom until a glossy
              poornam dough forms.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#FFF3DD] p-5 rounded-2xl border border-[#C69A45]/30 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#7B211F] text-[#FFF3DD] font-serif font-bold flex items-center justify-center text-sm">
              3
            </span>

            <h4 className="font-serif font-bold text-sm text-[#7B211F]">
              Silken Batter Dip
            </h4>

            <p className="text-[#553322]/80 leading-relaxed">
              The sweet poornam spheres are gently rolled and dipped into our
              traditionally fermented urad dal and rice batter.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-[#FFF3DD] p-5 rounded-2xl border border-[#C69A45]/30 space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#7B211F] text-[#FFF3DD] font-serif font-bold flex items-center justify-center text-sm">
              4
            </span>

            <h4 className="font-serif font-bold text-sm text-[#7B211F]">
              Pure Ghee Frying
            </h4>

            <p className="text-[#553322]/80 leading-relaxed">
              Deep-fried in a traditional heavy brass kadai with pure cow
              ghee until an even golden-amber hue and crisp exterior are
              achieved.
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};
