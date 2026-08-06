import React from 'react';
import { Heart, Sparkles, Award, ShieldCheck, Leaf, Feather, ArrowRight, Gift, Smile } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface StoryPageProps {
  lang: Language;
  onExploreBoxes: () => void;
  onOpenPrompt: () => void;
  onOpenContact?: () => void;
}

export default function StoryPage({ lang, onExploreBoxes, onOpenPrompt, onOpenContact }: StoryPageProps) {
  const t = translations[lang].story;

  return (
    <div className="pt-6 pb-12 sm:pt-8 sm:pb-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1
            className="text-3xl sm:text-5xl font-normal font-serif text-slate-800 leading-tight tracking-tight"
            dangerouslySetInnerHTML={{ __html: t.title }}
          />

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* Founder Letter & Photo Card */}
        <div className="bg-white rounded-[40px] border border-purple-200/70 p-6 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Photo Container - Hanife & Emir Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[32px] overflow-hidden shadow-xl border-4 border-purple-200/80 bg-slate-950 aspect-4/3 sm:aspect-4/3 lg:aspect-3/4 group">
              
              {/* Photo Background Image */}
              <img
                src="https://lh3.googleusercontent.com/d/18Jgpw3PYSow4h9RgWZFujUmzITC9wKxZ"
                alt="Hanife & Emir Sinan Gürlek - Happinio Kurucuları"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if drive permissions require login
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay Badge at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-purple-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold text-xs shrink-0 font-serif shadow-xs">
                    H&E
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.founderName}</h4>
                    <p className="text-[11px] text-purple-700 font-semibold italic">{t.founderRole}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Note Text */}
          <div className="lg:col-span-7 space-y-5 text-slate-700">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-900 bg-purple-100/80 px-3.5 py-1.5 rounded-full border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>{t.founderNoteTitle}</span>
            </div>

            {/* Render all 5 requested paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
              {(t.paragraphs || []).map((paragraph: string, idx: number) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>


          </div>

        </div>

        {/* 4 Core Values Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-slate-800 font-normal">
              {t.valuesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3 flex flex-col h-full justify-start">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 font-serif truncate whitespace-nowrap overflow-hidden text-ellipsis" title={t.val1Title}>{t.val1Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{t.val1Desc}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3 flex flex-col h-full justify-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 font-serif truncate whitespace-nowrap overflow-hidden text-ellipsis" title={t.val2Title}>{t.val2Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{t.val2Desc}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3 flex flex-col h-full justify-start">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 font-serif truncate whitespace-nowrap overflow-hidden text-ellipsis" title={t.val3Title}>{t.val3Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{t.val3Desc}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3 flex flex-col h-full justify-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 font-serif truncate whitespace-nowrap overflow-hidden text-ellipsis" title={t.val4Title}>{t.val4Title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{t.val4Desc}</p>
            </div>
          </div>
        </div>

        {/* Call to Action Banner: Deep Purple Luxury Gradient */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 rounded-[40px] p-8 sm:p-12 text-[#FAF7F2] shadow-xl border border-purple-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight text-purple-100">
              {t.ctaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl font-normal leading-relaxed">
              Yapay zeka asistanımız Joy-Genie veya sizin için seçtiğimiz tematik kutularımız ile saniyeler içinde sürpriz hediye sepetinizi hazırlayın.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
            <button
              onClick={onOpenPrompt}
              className="bg-[#FAF7F2] text-purple-950 hover:bg-white px-6 py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>Joy-Genie İle Tasarla</span>
            </button>
            <button
              onClick={onExploreBoxes}
              className="bg-purple-800/90 hover:bg-purple-800 text-[#FAF7F2] border border-purple-400/40 px-6 py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>{t.ctaBtn}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
