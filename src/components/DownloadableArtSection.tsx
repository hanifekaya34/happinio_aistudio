import React from 'react';
import { Sparkles, ArrowRight, Download, Palette } from 'lucide-react';
import { UserProfile } from '../types';
import { translations, Language } from '../i18n/translations';

interface DownloadableArtSectionProps {
  user?: UserProfile;
  lang?: Language;
  onSubscribeNewsletter?: (email: string) => void;
  onOpenProfile?: (tab?: string) => void;
}

export default function DownloadableArtSection({ user, lang = 'tr', onOpenProfile }: DownloadableArtSectionProps) {
  const tArt = translations[lang].art;

  const handleGoToDownloads = () => {
    if (onOpenProfile) {
      onOpenProfile('downloads');
    }
  };

  return (
    <section id="download-art-section" className="py-6 bg-[#FAF6F0] border-t border-purple-100/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-5 sm:p-6 border border-purple-800/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-left relative overflow-hidden">
          {/* Subtle Decorative Backdrop Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left Icon & Text Content */}
          <div className="flex items-center gap-4 min-w-0 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center shrink-0 border border-amber-300 shadow-xs font-bold">
              <Palette className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{tArt.badge}</span>
                </span>
                <span className="text-[11px] text-purple-200 hidden md:inline font-medium">
                  {tArt.badge1} • {tArt.badge2} • {tArt.badge3}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold font-serif text-white tracking-tight truncate">
                {tArt.title}
              </h4>

              <p className="text-xs text-purple-100/90 font-normal leading-relaxed line-clamp-2 sm:line-clamp-1 max-w-xl">
                {tArt.description}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleGoToDownloads}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs px-5 py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer whitespace-nowrap active:scale-95 relative z-10"
          >
            <Download className="w-4 h-4 text-purple-950 stroke-[2.5]" />
            <span>{tArt.btnText}</span>
            <ArrowRight className="w-4 h-4 text-purple-950" />
          </button>
        </div>
      </div>
    </section>
  );
}

