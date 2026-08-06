import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, HelpCircle, Building2, Sparkles, AlertTriangle } from 'lucide-react';
import { HappinioLogo } from './HappinioLogo';
import { Language, translations } from '../i18n/translations';

interface ContactPageProps {
  onOpenFAQ?: () => void;
  lang?: Language;
}

export default function ContactPage({ onOpenFAQ, lang = 'tr' }: ContactPageProps) {
  const tContact = translations[lang].contact;
  const isEn = lang === 'en';
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Sipariş Durumu & Destek',
    message: '',
  });

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    if (phoneNumberLength < 9) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    const errorsMap: Record<string, string> = {};

    if (!formData.name.trim()) {
      errorsMap.name = 'Adınız Soyadınız zorunludur.';
    }

    if (!formData.email.trim()) {
      errorsMap.email = 'E-Posta Adresiniz zorunludur.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errorsMap.email = 'Geçerli bir e-posta adresi giriniz (ör. isim@ornek.com).';
      }
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^\(5\d{2}\)\s\d{3}\s\d{2}\s\d{2}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errorsMap.phone = 'Geçerli bir telefon numarası giriniz: (5xx) xxx xx xx';
      }
    }

    if (!formData.message.trim()) {
      errorsMap.message = 'Mesaj alanı zorunludur.';
    }

    setErrors(errorsMap);

    if (Object.keys(errorsMap).length > 0) {
      const element = document.getElementById('contact-error-summary');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  const renderErrorSummary = () => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return null;

    return (
      <div
        id="contact-error-summary"
        className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl space-y-2 animate-shake text-left"
      >
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>Lütfen aşağıdaki alanları kontrol ediniz:</span>
        </div>
        <ul className="list-disc pl-5 text-xs text-rose-700 space-y-1">
          {errorKeys.map((key) => (
            <li key={key} className="font-medium">
              {errors[key]}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="pt-6 pb-14 bg-gradient-to-b from-pink-50/40 via-white to-slate-50 relative min-h-[70vh] sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif leading-tight tracking-tight">
            Size Nasıl <br />
            <span className="text-pink-500 italic">Yardımcı Olabiliriz?</span> 💌
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Sipariş takibi, kurumsal hediye teklifleri, ürün önerileri, yerel üretici dahiliyetleri, özel tasarım kutular veya her türlü sorunuz için Happinio ekibi olarak yanınızdayız.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          <a
            href="https://wa.me/905466313382?text=Merhaba%2C%20Happinio%20destek%20hatt%C4%B1na%20ula%C5%9Fmak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-2 group cursor-pointer block"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">WhatsApp Destek Hattı</h3>
            <p className="text-sm font-black text-emerald-600 group-hover:underline">0546 631 33 82</p>
            <p className="text-xs text-slate-500 font-medium">Hafta içi 09:00 - 19:00</p>
          </a>

          <a
            href="mailto:iletisim@happinio.com?subject=Happinio%20Bilgi%20ve%20Destek%20Talebi"
            className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs hover:shadow-md hover:border-purple-300 transition-all text-center space-y-2 group cursor-pointer block"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">E-Posta Adresi</h3>
            <p className="text-sm font-black text-purple-600 group-hover:underline">iletisim@happinio.com</p>
            <p className="text-xs text-slate-500 font-medium">Genel & Kurumsal Talepler</p>
          </a>
        </div>

        {/* Main Grid: Form + Side Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[36px] border border-pink-100 shadow-xl relative">
            <div className="mb-6">
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                Hızlı Mesaj Formu
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-serif mt-2">Bize İletinizi Gönderin ✨</h2>
              <p className="text-xs text-slate-500 mt-1">
                Aşağıdaki formu doldurduğunuzda ekibimiz en kısa sürede sizinle iletişime geçecektir.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Mesajınız Başarıyla Ulaştı!</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  İletiniz Happinio Kullanıcı İlişkileri ekibine aktarıldı. En kısa sürede sizinle iletişime geçilecektir.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'Sipariş Durumu & Destek', message: '' });
                    setErrors({});
                  }}
                  className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {renderErrorSummary()}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors(prev => { const n = {...prev}; delete n.name; return n; });
                      }}
                      placeholder="Örn: Merve Kaya"
                      className={`w-full text-xs p-3 rounded-2xl bg-slate-50 border transition-all focus:outline-none focus:ring-2 ${
                        errors.name 
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                          : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresiniz *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors(prev => { const n = {...prev}; delete n.email; return n; });
                      }}
                      placeholder="Örn: merve@example.com"
                      className={`w-full text-xs p-3 rounded-2xl bg-slate-50 border transition-all focus:outline-none focus:ring-2 ${
                        errors.email 
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                          : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numaranız</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="(5xx) xxx xx xx"
                      className={`w-full text-xs p-3 rounded-2xl bg-slate-50 border transition-all focus:outline-none focus:ring-2 ${
                        errors.phone 
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                          : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Konu Başlığı</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                      <option value="Sipariş Durumu & Destek">Sipariş Durumu & Destek</option>
                      <option value="Kurumsal Toplu Sipariş">Kurumsal Toplu Sipariş</option>
                      <option value="Ürün Önerisi">Ürün Önerisi</option>
                      <option value="Yerel Üretici Dahiliyet Talebi">Yerel Üretici Dahiliyet Talebi</option>
                      <option value="İade & Değişim Talebi">İade & Değişim Talebi</option>
                      <option value="Diğer Soru ve Öneriler">Diğer Soru ve Öneriler</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mesajınız *</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors(prev => { const n = {...prev}; delete n.message; return n; });
                    }}
                    placeholder="Bize iletmek istediğiniz mesajınızı detaylıca yazabilirsiniz..."
                    className={`w-full text-xs p-3 rounded-2xl bg-slate-50 border transition-all focus:outline-none focus:ring-2 ${
                      errors.message 
                        ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                        : 'border-slate-200 focus:ring-pink-400'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Mesajı Gönder</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Cards Side: FAQ Promo */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Help & FAQ Promo */}
            <div className="bg-gradient-to-br from-[#FAF7F2] via-[#FAF7F2]/90 to-purple-100/50 rounded-3xl border border-purple-200/80 p-6 sm:p-8 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                <span>Aklınıza Takılan Sorular mı Var?</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">Sıkça Sorulan Sorular</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Aynı gün kargo, kargo takip süreci, özel mesaj kartı basımı ve iade koşulları hakkındaki tüm detaylara S.S.S. bölümümüzden anında ulaşabilirsiniz.
              </p>
              {onOpenFAQ && (
                <button
                  onClick={onOpenFAQ}
                  className="bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2 hover:scale-105"
                >
                  <HelpCircle className="w-4 h-4 text-purple-200" />
                  <span>S.S.S. Sayfasını İncele</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
