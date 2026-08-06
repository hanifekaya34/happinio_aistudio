import React from 'react';
import { PRODUCERS_DATA } from '../data/producersData';
import { Sparkles, MapPin, ArrowRight, Heart, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface ProducersBannerSectionProps {
  onOpenProducersView: () => void;
  lang?: Language;
}

export default function ProducersBannerSection({ onOpenProducersView, lang = 'tr' }: ProducersBannerSectionProps) {
  const isEn = lang === 'en';

  return (
    <section id="producers-banner-section" className="py-12 bg-white border-t border-purple-50 overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
              <span>{isEn ? 'Ethical & Sustainable Local Support' : 'Etik & Sürdürülebilir Yerel Destek'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
              {isEn ? (
                <>Our Precious Artisans <span className="text-purple-800 italic">Enriching Every Box</span> 🌾</>
              ) : (
                <>Kutularımızı Zenginleştiren <span className="text-purple-800 italic">Değerli Üreticilerimiz</span> 🌾</>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {isEn
                ? 'Happinio gifts are not mass-produced; they come from local craftspeople, ceramic studios in Odunpazarı, and women cooperatives across Anatolia.'
                : 'Happinio hediyeleri seri fabrikasyon değil; Odunpazarı seramikçilerinden Ege kadın kooperatiflerine kadar hikâyesi ve el emeği olan yerel sanatkârlardan gelir.'}
            </p>
          </div>

          <button
            onClick={onOpenProducersView}
            className="inline-flex items-center gap-2 bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xs transition-all whitespace-nowrap self-start md:self-end cursor-pointer"
          >
            <span>{isEn ? 'Explore All Artisans' : 'Tüm Üreticilerimizi İncele'}</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>

        {/* Ticker / Partner Logos & Badges Band */}
        <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-100/80 mb-8 overflow-hidden relative">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            {PRODUCERS_DATA.map((p) => (
              <div
                key={p.id}
                onClick={onOpenProducersView}
                className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-xl border border-purple-100/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap group shrink-0"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-purple-100 shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-purple-700 transition-colors">{p.name}</span>
                  <span className="text-[10px] text-purple-700 font-semibold">{p.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured 3 Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCERS_DATA.slice(0, 3).map((producer) => (
            <div
              key={producer.id}
              onClick={onOpenProducersView}
              className="bg-[#FAF7F2] rounded-3xl p-5 border border-purple-100 hover:border-purple-300 transition-all shadow-2xs hover:shadow-md cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative h-44 rounded-2xl overflow-hidden bg-purple-100">
                  <img src={producer.image} alt={producer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-purple-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-purple-200 shadow-2xs">
                    {producer.badge}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{producer.city}</span>
                  </div>
                  <h3 className="text-base font-bold font-serif text-slate-900 group-hover:text-purple-900 transition-colors">
                    {producer.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {producer.story}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100/80 flex items-center justify-between text-xs font-bold text-purple-900">
                <span>{isEn ? `${producer.productsCrafted?.length || 3} Handmade Items` : `${producer.productsCrafted?.length || 3} El Emeği Ürün`}</span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {isEn ? 'Story' : 'Hikâyesi'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
