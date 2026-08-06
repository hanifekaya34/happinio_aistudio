import React from 'react';
import { SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { CheckCircle2, Sparkles, Gift, ShieldCheck, Heart, Calendar, Package, RefreshCw, Star } from 'lucide-react';
import { Language } from '../i18n/translations';

interface SubscriptionSectionProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  lang?: Language;
}

export default function SubscriptionSection({ onSelectPlan, lang = 'tr' }: SubscriptionSectionProps) {
  const isEn = lang === 'en';

  const steps = [
    {
      num: '01',
      title: isEn ? 'Select Your Favorite Theme & Interests' : 'İlgi Alanlarınızı veya Temayı Belirleyin',
      desc: isEn ? 'Choose Coffee & Books, Local Artisans, Seasonal Self-care, or Gourmet Treats.' : 'Kahve & Kitap, Mizahi Truva Kutusu, Yerel Şehir Sanatçıları veya Mevsimsel Öz Bakım temalarından dilediğinizi seçin.',
      icon: '🎨',
    },
    {
      num: '02',
      title: isEn ? 'Delivered To Your Door On The 15th' : 'Her Ayın 15\'inde Kapınızda Sürpriz Kutu',
      desc: isEn ? 'Beautifully packed, includes newly launched artisan items and a personalized message card.' : 'Özenle paketlenmiş, lansmana özel ürünler ve isminize özel hediye kartı ile kutunuz kapınıza teslim edilir.',
      icon: '📦',
    },
    {
      num: '03',
      title: isEn ? 'No Commitment, Cancel or Pause Anytime' : 'Taahhütsüz, Esnek Yönetim',
      desc: isEn ? 'Pause your subscription, change delivery address, or cancel with a single click anytime.' : 'İstediğiniz ay aboneliğinizi dondurabilir, adresinizi değiştirebilir veya tek tıkla iptal edebilirsiniz.',
      icon: '⚡',
    },
  ];

  const sampleBoxes = [
    {
      title: 'Ocak Ayı Kutusu: Kahve & Kitap Keyfi',
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
      badge: 'Geçen Ay Gönderildi',
    },
    {
      title: 'Şubat Ayı Kutusu: Gurme Çikolata & Nostalji',
      img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80',
      badge: 'Gelecek Ay Teması',
    },
    {
      title: 'Mart Ayı Kutusu: Bahar Öz Bakım & Aroma',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
      badge: 'Sürpriz Hazırlanıyor',
    },
  ];

  return (
    <section id="subscription-section" className="pt-6 pb-16 bg-[#FFF8FA] text-slate-800 relative overflow-hidden sm:pt-8">
      
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl font-normal font-serif text-slate-800 mt-0 tracking-tight leading-tight">
            Aylık Happinio <br />
            <span className="text-pink-500 italic">Kulübü Aboneliği</span> 🎁
          </h1>
          <p className="text-xs sm:text-base text-slate-500 mt-3 font-normal leading-relaxed">
            Her ay kapınıza kadar gelen tematik sürpriz hediye kutularına abone olun. Kendinizi şımartın veya sevdiklerinize düzenli sürpriz hediye mutluluğu yaşatın!
          </p>
        </div>

        {/* How it Works 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 text-left">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs relative">
              <span className="text-2xl mb-3 block">{step.icon}</span>
              <span className="text-[10px] font-black text-pink-500 bg-pink-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                Aşama {step.num}
              </span>
              <h3 className="text-sm font-bold text-slate-800 font-serif">{step.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Sample Unboxing Boxes Feature Banner */}
        <div className="mb-16 bg-white p-6 sm:p-8 rounded-[40px] border border-pink-100 shadow-xs max-w-5xl mx-auto text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">Abonelik Kutularından Örnekler</span>
              <h3 className="text-xl font-bold text-slate-800 font-serif mt-1">Her Ay Değişen Büyülü Temalar</h3>
            </div>
            <span className="text-xs text-slate-400">Piyasa değerinin %35 altında ayrıcalıklı paketler</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sampleBoxes.map((box, bIdx) => (
              <div key={bIdx} className="rounded-2xl overflow-hidden border border-pink-100 bg-pink-50/30 group">
                <div className="h-40 overflow-hidden relative">
                  <img src={box.img} alt={box.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
                    {box.badge}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold text-slate-800">{box.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white text-slate-800 rounded-[40px] p-8 shadow-xs border flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                plan.billingPeriod === '12_months'
                  ? 'border-pink-300 ring-2 ring-pink-200 shadow-md'
                  : 'border-pink-100'
              }`}
            >
              {plan.discountBadge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-sm uppercase tracking-wider">
                  {plan.discountBadge}
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold font-serif text-slate-800">{plan.name}</h3>
                
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-serif text-pink-500">{plan.priceMonthly} TL</span>
                  <span className="text-xs text-slate-400 font-normal">/ Ay</span>
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3 text-xs text-slate-500 font-normal">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full mt-8 font-bold text-xs py-3.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 ${
                  plan.billingPeriod === '12_months'
                    ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200/60 shadow-lg'
                    : 'bg-pink-50 hover:bg-pink-100 text-pink-700'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Planı Seç & Abone Ol</span>
              </button>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-normal">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-pink-500" /> %100 Güvenli PCI DSS Ödeme Altyapısı
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-pink-500" /> İstediğin An Taahhütsüz İptal veya Dondurma
          </span>
        </div>

      </div>
    </section>
  );
}
