import React, { useState } from 'react';
import HapyMascot from './HapyMascot';
import { ShieldCheck, Lock, Send, Sparkles } from 'lucide-react';
import { translations, Language } from '../i18n/translations';
import { HappinioLogo } from './HappinioLogo';

interface FooterProps {
  lang?: Language;
  onOpenAboutUs: () => void;
  onOpenFAQ: () => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onOpenSalesAgreement?: () => void;
  onOpenReturnPolicy?: () => void;
  onNavigateView: (view: string) => void;
}

export default function Footer({
  lang = 'tr',
  onOpenAboutUs,
  onOpenFAQ,
  onOpenContact,
  onOpenPrivacy,
  onOpenSalesAgreement,
  onOpenReturnPolicy,
  onNavigateView,
}: FooterProps) {
  const tFooter = translations[lang].footer;

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-10 border-t border-slate-800 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left pb-12 border-b border-slate-800">
          
          {/* Logo & Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <HappinioLogo className="h-12 w-auto" variant="light" idPrefix="footer_logo_" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              Samimi ve özenle hazırlanan kişiye özel hediye kutuları. Şehir zanaatkâr ürünleri, esprili sürprizler, samimi dilek kartları ve güvenli ödeme ile sevdiklerinize gülümseme hediye edin.
            </p>

            {/* Security Seals */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-normal">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Güvenli Ödeme Altyapısı
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Lock className="w-4 h-4 text-slate-400" /> 256-Bit SSL Şifreleme
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-serif">Sayfalar</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
              <li><button onClick={() => onNavigateView('home')} className="hover:text-slate-200">Ana Sayfa</button></li>
              <li><button onClick={() => onNavigateView('story')} className="hover:text-slate-200">Hikâyemiz</button></li>
              <li><button onClick={() => onNavigateView('producers')} className="hover:text-slate-200">Yerel Üreticiler</button></li>
              <li><button onClick={() => onNavigateView('boxes')} className="hover:text-slate-200">Tematik Kutular</button></li>
              <li><button onClick={() => onNavigateView('suggest-product')} className="hover:text-slate-200">Ürün Önermek İster Misin?</button></li>
              <li><button onClick={() => onNavigateView('calendar')} className="hover:text-slate-200">Özel Gün Takvimi</button></li>
              <li><button onClick={() => onNavigateView('community')} className="hover:text-slate-200">Kutu Oylaması</button></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-serif">Destek</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
              <li><button onClick={onOpenFAQ} className="hover:text-slate-200">Sıkça Sorulan Sorular</button></li>
              <li><button onClick={() => onNavigateView('reviews')} className="hover:text-slate-200">Kullanıcı Yorumları</button></li>
              <li><button onClick={onOpenContact} className="hover:text-slate-200">İletişim</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-serif">Yasal Haklar</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
              <li><button onClick={onOpenPrivacy} className="hover:text-slate-200">KVKK ve Gizlilik Sözleşmesi</button></li>
              <li><button onClick={onOpenSalesAgreement || onOpenPrivacy} className="hover:text-slate-200">Mesafeli Satış Sözleşmesi</button></li>
              <li><button onClick={onOpenReturnPolicy || onOpenPrivacy} className="hover:text-slate-200">İade Süreci</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{tFooter.copyright}</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Happinio powered by</span>
            <span className="font-bold text-slate-400">Gemini AI &amp; Love</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
