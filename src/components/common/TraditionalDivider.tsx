import React from 'react';

interface LotusProps {
  className?: string;
  size?: number;
  color?: string;
}

export const DecorativeLotus: React.FC<LotusProps> = ({
  className = '',
  size = 32,
  color = '#C69A45',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center Petal */}
      <path
        d="M50 15 C44 35 42 60 50 82 C58 60 56 35 50 15 Z"
        fill={color}
        fillOpacity="0.85"
      />
      {/* Mid Left Petal */}
      <path
        d="M50 40 C32 40 22 55 24 72 C34 74 44 68 50 62 Z"
        fill={color}
        fillOpacity="0.75"
      />
      {/* Mid Right Petal */}
      <path
        d="M50 40 C68 40 78 55 76 72 C66 74 56 68 50 62 Z"
        fill={color}
        fillOpacity="0.75"
      />
      {/* Outer Left Petal */}
      <path
        d="M48 65 C30 65 10 72 8 82 C22 84 38 80 48 74 Z"
        fill={color}
        fillOpacity="0.6"
      />
      {/* Outer Right Petal */}
      <path
        d="M52 65 C70 65 90 72 92 82 C78 84 62 80 52 74 Z"
        fill={color}
        fillOpacity="0.6"
      />
      {/* Base Lotus Platform / Stem */}
      <path
        d="M32 82 C42 86 58 86 68 82 C64 88 36 88 32 82 Z"
        fill={color}
      />
      <circle cx="50" cy="85" r="2.5" fill="#7B211F" />
    </svg>
  );
};

export const TraditionalDivider: React.FC<{ title?: string; subtitle?: string; inverted?: boolean }> = ({
  title,
  subtitle,
  inverted = false,
}) => {
  const primaryColor = inverted ? '#C69A45' : '#7B211F';
  const lineColor = inverted ? 'border-[#C69A45]/40' : 'border-[#C69A45]/50';

  return (
    <div className="flex flex-col items-center justify-center my-6 text-center select-none">
      {title && (
        <h3
          className={`font-serif text-2xl md:text-3xl font-bold tracking-wider mb-1 ${
            inverted ? 'text-[#FFF3DD]' : 'text-[#7B211F]'
          }`}
        >
          {title}
        </h3>
      )}
      {subtitle && (
        <p className={`text-sm md:text-base font-sans max-w-xl mb-3 ${inverted ? 'text-[#F8E7CB]/80' : 'text-[#553322]/80'}`}>
          {subtitle}
        </p>
      )}

      <div className="flex items-center justify-center w-full max-w-md gap-3">
        {/* Left gold decorative line */}
        <div className={`flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#C69A45] to-[#C69A45]`} />

        {/* Center Lotus with ornamental flourishes */}
        <div className="flex items-center gap-1.5 px-2">
          <span className="text-[#C69A45] text-xs">◆</span>
          <DecorativeLotus size={28} color="#C69A45" />
          <span className="text-[#C69A45] text-xs">◆</span>
        </div>

        {/* Right gold decorative line */}
        <div className={`flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#C69A45] to-[#C69A45]`} />
      </div>
    </div>
  );
};

