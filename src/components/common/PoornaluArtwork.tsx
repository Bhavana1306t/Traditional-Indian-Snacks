import React from 'react';

interface PoornaluVisualProps {
  variant?: 'brass-plate' | 'cut-open' | 'close-up' | 'serving';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const PoornaluVisual: React.FC<PoornaluVisualProps> = ({
  variant = 'brass-plate',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    hero: 'w-full max-w-lg aspect-square',
  }[size];

  if (variant === 'cut-open') {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#7B211F] via-[#5A1715] to-[#3D0D0B] p-4 border-2 border-[#C69A45]/60 flex flex-col items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none">
          <defs>
            {/* Brass Plate Gradient */}
            <radialGradient id="brassGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F9D77E" />
              <stop offset="50%" stopColor="#C69A45" />
              <stop offset="85%" stopColor="#8A621C" />
              <stop offset="100%" stopColor="#553322" />
            </radialGradient>
            {/* Banana leaf gradient */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3E7B27" />
              <stop offset="100%" stopColor="#255214" />
            </linearGradient>
            {/* Poornalu Outer Shell Gradient (Golden Fried) */}
            <radialGradient id="crispyShell" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#F8DF88" />
              <stop offset="35%" stopColor="#D49A32" />
              <stop offset="75%" stopColor="#A86315" />
              <stop offset="100%" stopColor="#6C3908" />
            </radialGradient>
            {/* Cut-Open Lentil & Jaggery Filling (Poornam) */}
            <radialGradient id="poornamFilling" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#8A4513" />
              <stop offset="40%" stopColor="#5C2607" />
              <stop offset="80%" stopColor="#3A1503" />
              <stop offset="100%" stopColor="#240A00" />
            </radialGradient>
            {/* Ghee Glisten */}
            <radialGradient id="gheeGlisten" cx="30%" cy="25%" r="40%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#FFF2A8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#C69A45" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Fresh Banana Leaf Serving Base */}
          <path d="M40 310 C80 270 320 270 360 310 C320 370 80 370 40 310 Z" fill="url(#leafGrad)" opacity="0.9" />
          <path d="M50 310 Q200 320 350 310" stroke="#79A844" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />

          {/* Left Intact Crisp Poornam Boore */}
          <circle cx="130" cy="240" r="75" fill="url(#crispyShell)" />
          <ellipse cx="115" cy="210" rx="35" ry="25" fill="url(#gheeGlisten)" />
          <circle cx="150" cy="250" r="3" fill="#FFE8A3" opacity="0.7" />
          <circle cx="110" cy="260" r="2.5" fill="#FFE8A3" opacity="0.5" />

          {/* Right Cut-Open Poornam Boore (Revealing sweet lentil jaggery interior) */}
          {/* Outer Shell Base */}
          <circle cx="270" cy="220" r="80" fill="url(#crispyShell)" />
          {/* Halved/Cut Opening */}
          <ellipse cx="260" cy="215" rx="66" ry="60" fill="url(#poornamFilling)" />
          {/* Golden crispy crust border rim */}
          <ellipse cx="260" cy="215" rx="66" ry="60" fill="none" stroke="#D49A32" strokeWidth="7" />
          
          {/* Specks of grated coconut & cardamom in filling */}
          <circle cx="240" cy="190" r="4" fill="#FFF8DC" opacity="0.95" />
          <circle cx="280" cy="200" r="3" fill="#FFF8DC" opacity="0.9" />
          <circle cx="260" cy="240" r="3.5" fill="#FFF8DC" opacity="0.9" />
          <circle cx="230" cy="230" r="2.5" fill="#E8D3A2" opacity="0.8" />
          <circle cx="290" cy="235" r="3" fill="#E8D3A2" opacity="0.85" />
          {/* Rich caramel jaggery glisten */}
          <ellipse cx="250" cy="195" rx="20" ry="12" fill="#FFA500" opacity="0.25" />
          <ellipse cx="270" cy="230" rx="25" ry="14" fill="#FFA500" opacity="0.2" />

          {/* Steam Wisp 1 */}
          <path d="M250 140 Q240 100 255 70 T245 40" stroke="#FFF3DD" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
          {/* Steam Wisp 2 */}
          <path d="M280 135 Q295 95 285 65 T290 35" stroke="#FFF3DD" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </svg>

        {/* Caption */}
        <div className="text-center mt-2 z-10 bg-[#5A1715]/90 px-3 py-1 rounded-full border border-[#C69A45]/40">
          <span className="text-[#F8E7CB] text-xs font-serif font-medium">
            Cut-Open View: Sweet Bengal Gram & Organic Jaggery Poornam
          </span>
        </div>
      </div>
    );
  }

  // Default: Traditional Brass Plate with Stacked Golden Crispy Poornalu
  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#7B211F] via-[#5A1715] to-[#3D0D0B] p-4 border-2 border-[#C69A45]/60 flex flex-col items-center justify-center ${sizeClasses} ${className}`}>
      {/* Kolam / Rangoli subtle overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C69A45_1px,transparent_1px)] [background-size:16px_16px]" />

      <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl" fill="none">
        <defs>
          {/* Royal Brass Plate Gradient */}
          <radialGradient id="heroBrass" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="35%" stopColor="#D4A038" />
            <stop offset="70%" stopColor="#A6741F" />
            <stop offset="92%" stopColor="#6C480E" />
            <stop offset="100%" stopColor="#3D2605" />
          </radialGradient>

          {/* Crispy Golden Fried Poornam Boorelu Shell */}
          <radialGradient id="goldenCrispBall1" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FDE397" />
            <stop offset="30%" stopColor="#E09F32" />
            <stop offset="70%" stopColor="#AA5E11" />
            <stop offset="100%" stopColor="#6B3406" />
          </radialGradient>

          <radialGradient id="goldenCrispBall2" cx="30%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFEBB0" />
            <stop offset="35%" stopColor="#E6A63B" />
            <stop offset="75%" stopColor="#B26514" />
            <stop offset="100%" stopColor="#703606" />
          </radialGradient>

          {/* Ghee Sheen Highlight */}
          <radialGradient id="gheeSheen" cx="35%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFEFA6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C69A45" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Brass Plate Shadow */}
        <ellipse cx="250" cy="275" rx="220" ry="180" fill="#200605" opacity="0.75" />

        {/* Traditional Polished Brass Plate (Kanchu Kancham) */}
        <ellipse cx="250" cy="270" rx="215" ry="175" fill="url(#heroBrass)" />
        {/* Brass rim inner engraving ring */}
        <ellipse cx="250" cy="270" rx="195" ry="155" fill="none" stroke="#FFE082" strokeWidth="3" opacity="0.8" />
        <ellipse cx="250" cy="270" rx="188" ry="148" fill="none" stroke="#6C480E" strokeWidth="1.5" />

        {/* Fresh tender banana leaf liner */}
        <path
          d="M95 270 C100 180 400 180 405 270 C400 360 100 360 95 270 Z"
          fill="#33691E"
          opacity="0.9"
        />
        <path
          d="M110 270 Q250 280 390 270"
          stroke="#558B2F"
          strokeWidth="2.5"
          strokeDasharray="8 6"
          opacity="0.7"
        />

        {/* Stacked Traditional Andhra Poornalu (Round Golden Balls) */}
        {/* Back Layer Poornalu */}
        <g id="back-layer">
          {/* Poornam 1 - Left Back */}
          <circle cx="180" cy="230" r="55" fill="url(#goldenCrispBall1)" />
          <ellipse cx="165" cy="210" rx="25" ry="18" fill="url(#gheeSheen)" />

          {/* Poornam 2 - Right Back */}
          <circle cx="320" cy="230" r="55" fill="url(#goldenCrispBall2)" />
          <ellipse cx="305" cy="210" rx="25" ry="18" fill="url(#gheeSheen)" />

          {/* Poornam 3 - Center Back */}
          <circle cx="250" cy="210" r="58" fill="url(#goldenCrispBall1)" />
          <ellipse cx="235" cy="190" rx="28" ry="20" fill="url(#gheeSheen)" />
        </g>

        {/* Front Layer Poornalu */}
        <g id="front-layer">
          {/* Poornam 4 - Left Front */}
          <circle cx="150" cy="290" r="62" fill="url(#goldenCrispBall2)" />
          <ellipse cx="132" cy="265" rx="30" ry="22" fill="url(#gheeSheen)" />
          {/* Crispy urad dal-rice coating blister textures */}
          <circle cx="160" cy="310" r="3" fill="#FFE599" opacity="0.8" />
          <circle cx="130" cy="295" r="2" fill="#FFE599" opacity="0.7" />

          {/* Poornam 5 - Right Front */}
          <circle cx="350" cy="290" r="62" fill="url(#goldenCrispBall1)" />
          <ellipse cx="332" cy="265" rx="30" ry="22" fill="url(#gheeSheen)" />
          <circle cx="360" cy="310" r="2.5" fill="#FFE599" opacity="0.8" />
          <circle cx="335" cy="300" r="2" fill="#FFE599" opacity="0.7" />

          {/* Poornam 6 - Center Prime (Hero Poornalu) */}
          <circle cx="250" cy="285" r="68" fill="url(#goldenCrispBall2)" />
          <ellipse cx="230" cy="255" rx="36" ry="26" fill="url(#gheeSheen)" />
          <circle cx="265" cy="305" r="3.5" fill="#FFE599" opacity="0.85" />
          <circle cx="225" cy="295" r="2.5" fill="#FFE599" opacity="0.75" />
        </g>

        {/* Top Crowning Poornam Boore (Top of the Stack) */}
        <circle cx="250" cy="160" r="50" fill="url(#goldenCrispBall1)" />
        <ellipse cx="236" cy="142" rx="24" ry="16" fill="url(#gheeSheen)" />
        <circle cx="260" cy="175" r="2.5" fill="#FFE599" opacity="0.8" />

        {/* Fragrant Hot Steam Wisps */}
        <path d="M220 100 Q205 60 220 30" stroke="#FFF3DD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M250 90 Q265 50 250 20" stroke="#FFF3DD" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M280 100 Q295 60 280 30" stroke="#FFF3DD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

        {/* Corner Golden Floral Flourishes */}
        <g stroke="#C69A45" strokeWidth="2" fill="none" opacity="0.6">
          <path d="M20 20 L50 20 M20 20 L20 50 M25 25 L45 25 M25 25 L25 45" />
          <path d="M480 20 L450 20 M480 20 L480 50 M475 25 L455 25 M475 25 L475 45" />
          <path d="M20 480 L50 480 M20 480 L20 450 M25 475 L45 475 M25 475 L25 455" />
          <path d="M480 480 L450 480 M480 480 L480 450 M475 475 L455 475 M475 475 L475 455" />
        </g>
      </svg>

      {/* Traditional Badge Overlay */}
      <div className="absolute bottom-3 flex items-center justify-between w-[92%] px-3 py-1.5 rounded-xl bg-[#3D0D0B]/90 border border-[#C69A45]/50 backdrop-blur-sm">
        <span className="text-[#C69A45] font-serif text-xs md:text-sm font-semibold tracking-wider flex items-center gap-1.5">
          <span>🪔</span> Andhra Poornam Boorelu
        </span>
        <span className="text-[#FFF3DD] text-[11px] md:text-xs font-sans bg-[#7B211F] px-2 py-0.5 rounded border border-[#C69A45]/40">
          Pure Cow Ghee & Bellam
        </span>
      </div>
    </div>
  );
};
