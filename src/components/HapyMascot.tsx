import React, { useId } from 'react';
import { Sparkles } from 'lucide-react';

interface HapyMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  level?: string;
  speechBubble?: string;
  onClick?: () => void;
  showEvolutionBadge?: boolean;
}

export default function HapyMascot({
  size = 'md',
  level = 'Minik Happinio',
  speechBubble,
  onClick,
  showEvolutionBadge = true,
}: HapyMascotProps) {
  const rawId = useId();
  const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, '');

  const bunnyBodyGrad = `bunnyBodyGrad_${cleanId}`;
  const bunnyEarInner = `bunnyEarInner_${cleanId}`;
  const giftBoxGrad = `giftBoxGrad_${cleanId}`;
  const wandGrad = `wandGrad_${cleanId}`;
  const glowFilter = `glowFilter_${cleanId}`;

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  const levelColors: Record<string, string> = {
    'Minik Çırak Happinio': 'from-pink-500 via-purple-500 to-indigo-500 text-white border-pink-200',
    'Sürpriz Mimarı Happinio': 'from-purple-500 via-pink-500 to-amber-400 text-white border-purple-200',
    'Mutluluk Elçisi Happinio': 'from-amber-400 via-pink-500 to-purple-600 text-purple-950 border-amber-300 font-extrabold',
    'Efsanevi Hediye Gurusu Happinio': 'from-yellow-300 via-pink-400 to-purple-700 text-purple-950 border-yellow-300 font-extrabold',
    'Minik Happinio': 'from-pink-500 via-purple-500 to-indigo-500 text-white border-pink-200',
    'Sevimli Happinio': 'from-purple-500 via-pink-500 to-amber-400 text-white border-purple-200',
    'Süper Happinio': 'from-amber-400 via-pink-500 to-purple-600 text-purple-950 border-amber-300 font-extrabold',
    'Efsane Happinio': 'from-yellow-300 via-pink-400 to-purple-700 text-purple-950 border-yellow-300 font-extrabold',
  };

  return (
    <div className="relative inline-flex flex-col items-center group cursor-pointer" onClick={onClick}>
      {/* Optional Speech Bubble */}
      {speechBubble && (
        <div className="mb-2 bg-white text-purple-950 text-xs font-semibold px-3.5 py-1.5 rounded-2xl shadow-md border border-purple-200 text-center max-w-xs z-20 flex items-center justify-center gap-1.5 relative">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
          <span>{speechBubble}</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-purple-200"></div>
        </div>
      )}

      {/* Joy-Genie (Tatlı AI Tavşan & Hediyeli Maskot) SVG */}
      <div className={`relative ${sizeClasses[size]} transition-transform duration-300 group-hover:scale-105 drop-shadow-md`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ background: 'transparent' }}
        >
          <defs>
            {/* Bunny Soft Lila Body Gradient */}
            <linearGradient id={bunnyBodyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF5FF" />
              <stop offset="40%" stopColor="#E9D8FD" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>

            {/* Inner Ear Soft Pink Gradient */}
            <linearGradient id={bunnyEarInner} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED7E2" />
              <stop offset="100%" stopColor="#FBB6CE" />
            </linearGradient>

            {/* Magical Gift Box Gradient (Magenta & Pink) */}
            <linearGradient id={giftBoxGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>

            {/* Star Wand Gold Gradient */}
            <linearGradient id={wandGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <filter id={glowFilter} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#9333EA" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* SİHİRLİ LİLA TAVŞAN - HEDİYE KUTUSUNDAN ÇIKAN MASKOT */}
          <g filter={`url(#${glowFilter})`}>
            {/* Arka Plan Sihirli Lila Aura Halesi */}
            <circle cx="100" cy="100" r="86" fill="#FAF5FF" opacity="0.85" stroke="#E9D5FF" strokeWidth="2.5" strokeDasharray="6 4" />

            {/* 1. SEVİMLİ LİLA UZUN TAVŞAN KULAKLARI */}
            {/* Sol Kulak (Dış Lila) */}
            <path d="M 62 65 C 38 8, 68 -8, 80 45 C 74 54, 68 59, 62 65 Z" fill={`url(#${bunnyBodyGrad})`} stroke="#D8B4FE" strokeWidth="2" />
            {/* Sol Kulak (İç Pembe) */}
            <path d="M 64 58 C 46 16, 66 6, 75 44 Z" fill={`url(#${bunnyEarInner})`} opacity="0.85" />

            {/* Sağ Kulak - Tatlı Bükülü (Dış Lila) */}
            <path d="M 138 65 C 162 8, 132 -8, 120 45 C 126 54, 132 59, 138 65 Z" fill={`url(#${bunnyBodyGrad})`} stroke="#D8B4FE" strokeWidth="2" />
            {/* Sağ Kulak (İç Pembe) */}
            <path d="M 136 58 C 154 16, 134 6, 125 44 Z" fill={`url(#${bunnyEarInner})`} opacity="0.85" />

            {/* Sol Kulak Üstünde Yıldız Toka */}
            <path d="M 70 38 Q 70 43 75 43 Q 70 43 70 48 Q 70 43 65 43 Q 70 43 70 38 Z" fill="#FBBF24" />

            {/* 2. LİLA TAVŞAN BAŞI & GÖVDESİ (Kutunun İçinden Fırlayan) */}
            {/* Torso / Gövde (Kutudan Yükselen) */}
            <ellipse cx="100" cy="118" rx="42" ry="32" fill={`url(#${bunnyBodyGrad})`} stroke="#D8B4FE" strokeWidth="2" />

            {/* Yuvarlak Tatlı Lila Baş */}
            <ellipse cx="100" cy="88" rx="50" ry="42" fill={`url(#${bunnyBodyGrad})`} stroke="#D8B4FE" strokeWidth="2" />

            {/* Yanaklar (Sevimli Pembe Allık) */}
            <ellipse cx="70" cy="95" rx="9" ry="6" fill="#F472B6" opacity="0.9" />
            <ellipse cx="130" cy="95" rx="9" ry="6" fill="#F472B6" opacity="0.9" />

            {/* Gözler (Mutlu Ceylan Ceylan Işıltılı Gözler) */}
            <ellipse cx="74" cy="83" rx="7" ry="8.5" fill="#3B0764" />
            <ellipse cx="126" cy="83" rx="7" ry="8.5" fill="#3B0764" />
            {/* Büyük Göz Işıltıları */}
            <circle cx="76" cy="80" r="3.2" fill="#FFFFFF" />
            <circle cx="128" cy="80" r="3.2" fill="#FFFFFF" />
            {/* Küçük Alt Işıltı */}
            <circle cx="72" cy="86" r="1.8" fill="#FFFFFF" />
            <circle cx="124" cy="86" r="1.8" fill="#FFFFFF" />
            {/* Mutlu Kirpikler */}
            <path d="M 67 76 Q 73 72 79 76" fill="none" stroke="#3B0764" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 121 76 Q 127 72 133 76" fill="none" stroke="#3B0764" strokeWidth="1.8" strokeLinecap="round" />

            {/* Minik Pembe Kalp Burun */}
            <polygon points="100,91 96,87 104,87" fill="#E11D48" />

            {/* ÇOK MUTLU GÜLÜMSEYEN NEŞELİ AĞIZ (Açık Pembe Dilli Gülüş) */}
            <path d="M 91 93 Q 100 108 109 93 Z" fill="#F472B6" stroke="#581C87" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 94 99 Q 100 107 106 99 Q 100 95 94 99 Z" fill="#E11D48" />

            {/* 3. AÇIK SİHİRLİ HEDİYE KUTUSU (Tavşanın Çıktığı Kutunun Gövdesi) */}
            {/* Kutu Derinlik İç Gölgesi */}
            <ellipse cx="100" cy="128" rx="46" ry="12" fill="#581C87" opacity="0.2" />

            {/* Hediye Kutusu Alt Gövde */}
            <g transform="translate(50, 126)">
              {/* Kutu Gövde Kutusu */}
              <rect x="0" y="0" width="100" height="52" rx="10" fill={`url(#${giftBoxGrad})`} />

              {/* Altın Kurdele Dikey */}
              <rect x="44" y="0" width="12" height="52" fill="#FBBF24" />

              {/* Kutu Ön Yüz Işıltıları */}
              <path d="M 15 18 Q 15 22 19 22 Q 15 22 15 26 Q 15 22 11 22 Q 15 22 15 18 Z" fill="#FFFFFF" opacity="0.8" />
              <path d="M 75 30 Q 75 33 78 33 Q 75 33 75 36 Q 75 33 72 33 Q 75 33 75 30 Z" fill="#FFFFFF" opacity="0.7" />
            </g>

            {/* 4. TAVŞANIN MİNİK PATİLERİ (Kutunun Kenarına Tutunan Patiler) */}
            {/* Sol Pati */}
            <ellipse cx="66" cy="124" rx="8" ry="10" fill={`url(#${bunnyBodyGrad})`} stroke="#D8B4FE" strokeWidth="1.5" />
            {/* Sağ Pati (Asayı Tutan Pati) */}
            <ellipse cx="150" cy="122" rx="8.5" ry="10.5" fill={`url(#${bunnyBodyGrad})`} stroke="#D8B4FE" strokeWidth="1.5" />

            {/* 5. BELİRGİN SİHİRLİ YILDIZ DEĞNEĞİ (Tavşanın Sağ Patisinde Parlayan Altın Asa) */}
            <g transform="translate(132, 52)">
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-5 20.5 70; 25 20.5 70; -5 20.5 70"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
                {/* Altın Asa Çubuğu */}
                <rect x="18" y="18" width="5" height="58" rx="2.5" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
                {/* Çubuk Üzeri Parlak Çizgi */}
                <rect x="20" y="20" width="1.5" height="54" rx="0.8" fill="#FEF08A" opacity="0.9" />

                {/* Asa Başındaki Büyük Parlak Sihir Yıldızı */}
                <g transform="translate(20.5, 12)">
                  {/* Dış Harezmli Altın Işıltı Aura */}
                  <circle cx="0" cy="0" r="18" fill="#FEF08A" opacity="0.4" />
                  {/* Yıldız Gövdesi */}
                  <path
                    d="M 0 -18 L 5 -5 L 18 -4 L 8 4 L 11 17 L 0 10 L -11 17 L -8 4 L -18 -4 L -5 -5 Z"
                    fill={`url(#${wandGrad})`}
                    stroke="#D97706"
                    strokeWidth="1.2"
                  />
                  {/* İç Yıldız Parlaklığı */}
                  <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />
                  <path d="M 0 -8 L 1 -2 L 7 -2 L 2 1 L 4 7 L 0 3 L -4 7 L -2 1 L -7 -2 L -1 -2 Z" fill="#FFFFFF" opacity="0.9" />
                </g>
              </g>
            </g>

            {/* 6. KUTUDAN FIŞKIRAN SİHİR VE IŞILTILAR (Magic Sparkles & Particles) */}
            {/* Fışkıran Sihirli Yıldızlar */}
            <path d="M 30 100 Q 30 107 37 107 Q 30 107 30 114 Q 30 107 23 107 Q 30 107 30 100 Z" fill="#FBBF24" />
            <path d="M 166 108 Q 166 114 172 114 Q 166 114 166 120 Q 166 114 160 114 Q 166 114 166 108 Z" fill="#C084FC" />
            {/* Üst Çapraz Yıldız */}
            <path d="M 35 30 Q 35 37 42 37 Q 35 37 35 44 Q 35 37 28 37 Q 35 37 35 30 Z" fill="#FBBF24" />
            <path d="M 165 25 Q 165 32 172 32 Q 165 32 165 39 Q 165 32 158 32 Q 165 32 165 25 Z" fill="#A855F7" />

            {/* Uçuşan Baloncuk / Parçacıklar */}
            <circle cx="42" cy="80" r="3" fill="#F472B6" />
            <circle cx="158" cy="85" r="2.5" fill="#FBBF24" />
            <circle cx="170" cy="55" r="2" fill="#38BDF8" />
          </g>
        </svg>
      </div>

      {/* Character Name Label / Evolution Badge */}
      {showEvolutionBadge ? (
        <div className={`mt-1.5 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r shadow-xs border ${levelColors[level]} flex items-center gap-1`}>
          <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-spin [animation-duration:4s]" />
          <span>Joy Genie</span>
        </div>
      ) : (
        <span className="mt-1 text-[10px] font-black text-purple-900 tracking-wider uppercase bg-purple-100/90 px-2 py-0.5 rounded-full border border-purple-200/80 shadow-2xs whitespace-nowrap">
          Joy Genie
        </span>
      )}
    </div>
  );
}

