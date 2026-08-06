import React from 'react';

interface HappinioLogoProps {
  className?: string;
  variant?: 'default' | 'light'; // 'light' for dark background like Footer
  idPrefix?: string;
  onlyIcon?: boolean;
}

export const HappinioLogo: React.FC<HappinioLogoProps> = ({
  className = 'h-10 sm:h-12 w-auto',
  variant = 'default',
  idPrefix = 'happinio_logo_',
  onlyIcon = false,
}) => {
  const lilacGradId = `${idPrefix}lilacGrad`;
  const earInnerGradId = `${idPrefix}earInnerGrad`;
  const boxGradId = `${idPrefix}boxGrad`;
  const sparkleGradId = `${idPrefix}sparkleGrad`;
  const softShadowId = `${idPrefix}softShadow`;

  const textColor = variant === 'light' ? '#FFFFFF' : '#3B0764';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={onlyIcon ? "0 0 125 125" : "0 0 460 130"}
      className={className}
      style={{ background: 'transparent' }}
    >
      <defs>
        {/* Renk Gradyanları */}
        <linearGradient id={lilacGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D6BCFA" />
          <stop offset="100%" stopColor="#9F7AEA" />
        </linearGradient>

        <linearGradient id={earInnerGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FED7E2" />
          <stop offset="100%" stopColor="#FBB6CE" />
        </linearGradient>

        <linearGradient id={boxGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBB6CE" />
          <stop offset="100%" stopColor="#ED64A6" />
        </linearGradient>

        <linearGradient id={sparkleGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F6AD55" />
          <stop offset="100%" stopColor="#F6E05E" />
        </linearGradient>

        {/* Yumuşak Gölge Efekti */}
        <filter id={softShadowId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#718096" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* ICON GRUBU (Joy-Genie Tavşan Maskot & Sihirli Kutu) */}
      <g transform="translate(10, 5)" filter={`url(#${softShadowId})`}>
        {/* Tavşan Kulakları (Sol & Sağ) */}
        {/* Sol Kulak (Dış & İç) */}
        <path d="M 38 32 C 18 -8, 48 -18, 54 22 C 48 27, 42 29, 38 32 Z" fill={`url(#${lilacGradId})`} />
        <path d="M 40 28 C 24 -2, 46 -10, 51 20 Z" fill={`url(#${earInnerGradId})`} opacity="0.85" />

        {/* Sağ Kulak (Dış & İç) */}
        <path d="M 82 32 C 102 -8, 72 -18, 66 22 C 72 27, 78 29, 82 32 Z" fill={`url(#${lilacGradId})`} />
        <path d="M 80 28 C 96 -2, 74 -10, 69 20 Z" fill={`url(#${earInnerGradId})`} opacity="0.85" />

        {/* Sol Kulakta Mini Yıldız Tokası */}
        <path d="M 48 8 Q 48 12 52 12 Q 48 12 48 16 Q 48 12 44 12 Q 48 12 48 8 Z" fill="#F6E05E" />

        {/* Happiny Esintili Gövde (Pastel Lila Daire) */}
        <circle cx="60" cy="62" r="48" fill={`url(#${lilacGradId})`} />

        {/* Yanaklar (Tatlı Pembe Allık) */}
        <ellipse cx="41" cy="58" rx="6" ry="4" fill="#FEB2B2" opacity="0.8" />
        <ellipse cx="79" cy="58" rx="6" ry="4" fill="#FEB2B2" opacity="0.8" />

        {/* Gözler (Mutlu/Gülümseyen Yaylar) */}
        <path d="M 36 48 Q 42 40 48 48" fill="none" stroke="#4A5568" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 72 48 Q 78 40 84 48" fill="none" stroke="#4A5568" strokeWidth="3.5" strokeLinecap="round" />

        {/* Gülümseyen Ağız */}
        <path d="M 55 60 Q 60 67 65 60" fill="none" stroke="#4A5568" strokeWidth="3" strokeLinecap="round" />

        {/* Sihirli Hediye Kutusu (Kucakta Tutulan) */}
        <g transform="translate(33, 64)">
          {/* Kutu Gövdesi */}
          <rect x="0" y="10" width="54" height="36" rx="6" fill={`url(#${boxGradId})`} />
          {/* Kutu Kapağı */}
          <rect x="-3" y="4" width="60" height="10" rx="3" fill="#FBB6CE" />
          {/* Kurdele (Dikey & Yatay) */}
          <rect x="23" y="10" width="8" height="36" fill="#FFF5F7" />
          <rect x="-3" y="7" width="60" height="4" fill="#FFF5F7" opacity="0.6" />
          {/* Fiyonk */}
          <circle cx="27" cy="4" r="5" fill="#ED64A6" />
        </g>

        {/* AI Parıltıları / Sihirli Yıldızlar (Magic Dust) */}
        {/* Yıldız 1 (Büyük Gold) */}
        <path d="M 102 18 Q 102 25 109 25 Q 102 25 102 32 Q 102 25 95 25 Q 102 25 102 18 Z" fill={`url(#${sparkleGradId})`} />
        {/* Yıldız 2 (Küçük Lila) */}
        <path d="M 22 15 Q 22 20 27 20 Q 22 20 22 25 Q 22 20 17 20 Q 22 20 22 15 Z" fill="#BEE3F8" />
        {/* Yıldız 3 (Mini Pembe) */}
        <path d="M 98 68 Q 98 71 101 71 Q 98 71 98 74 Q 98 71 95 71 Q 98 71 98 68 Z" fill="#FBB6CE" />
      </g>

      {/* METİN GRUBU (Cute Korean Aesthetic Tipografi - Tam Orantılanmış ve Dikey Ortalı) */}
      {!onlyIcon && (
        <g transform="translate(132, 88)">
          {/* Ana Marka İsmi */}
          <text
            x="0"
            y="0"
            fontFamily="'Fredoka', 'Gaegu', 'Quicksand', 'Nunito', sans-serif"
            fontSize="68"
            fontWeight="600"
            fill={textColor}
            letterSpacing="0.5"
          >
            Happinio
          </text>

          {/* 'i' Harfinin Üzerine AI Yıldızı Dokunuşu */}
          <path d="M 232 -52 Q 232 -46 238 -46 Q 232 -46 232 -40 Q 232 -46 226 -46 Q 232 -46 232 -52 Z" fill={`url(#${sparkleGradId})`} />
        </g>
      )}
    </svg>
  );
};
