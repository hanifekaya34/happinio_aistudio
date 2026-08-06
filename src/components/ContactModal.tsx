import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

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
    setPhone(formatted);
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

    const errorsMap: Record<string, string> = {};

    if (!name.trim()) {
      errorsMap.name = 'Adınız Soyadınız zorunludur.';
    }

    if (!email.trim()) {
      errorsMap.email = 'E-Posta Adresiniz zorunludur.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errorsMap.email = 'Geçerli bir e-posta adresi giriniz (ör. isim@ornek.com).';
      }
    }

    if (phone.trim()) {
      const phoneRegex = /^\(5\d{2}\)\s\d{3}\s\d{2}\s\d{2}$/;
      if (!phoneRegex.test(phone.trim())) {
        errorsMap.phone = 'Geçerli bir telefon numarası giriniz: (5xx) xxx xx xx';
      }
    }

    if (!message.trim()) {
      errorsMap.message = 'Mesaj alanı zorunludur.';
    }

    setErrors(errorsMap);

    if (Object.keys(errorsMap).length > 0) {
      const el = document.getElementById('contact-modal-error-summary');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      onClose();
    }, 3000);
  };

  const renderErrorSummary = () => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return null;

    return (
      <div
        id="contact-modal-error-summary"
        className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl space-y-1.5 animate-shake text-left"
      >
        <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Lütfen aşağıdaki alanları kontrol ediniz:</span>
        </div>
        <ul className="list-disc pl-5 text-[11px] text-rose-700 space-y-0.5">
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full my-8 shadow-2xl border border-pink-100 overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 text-left">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">İletişim & Destek</span>
            <h2 className="text-2xl font-black text-slate-900 font-serif mt-1">Bize Ulaşın 💌</h2>
            <p className="text-xs text-slate-500 mt-1">Sipariş takibi, kurumsal B2B hediye teklifleri, ürün önerileri, yerel üretici dahiliyetleri veya her türlü sorunuz için Happinio ekibi olarak yanınızdayız.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <a
              href="https://wa.me/905466313382?text=Merhaba%2C%20Happinio%20destek%20hatt%C4%B1na%20ula%C5%9Fmak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-emerald-50 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200/60 transition-all group block cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="block font-bold text-slate-800">WhatsApp Destek:</span>
              <span className="text-[11px] font-bold text-emerald-700 group-hover:underline">0546 631 33 82</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Hafta içi 09:00 - 19:00</span>
            </a>
            <a
              href="mailto:iletisim@happinio.com?subject=Happinio%20Bilgi%20ve%20Destek%20Talebi"
              className="p-3.5 bg-purple-50 hover:bg-purple-100/80 rounded-2xl border border-purple-200/60 transition-all group block cursor-pointer"
            >
              <Mail className="w-4 h-4 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="block font-bold text-slate-800">E-Posta:</span>
              <span className="text-[11px] font-bold text-purple-700 group-hover:underline">iletisim@happinio.com</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Genel & Kurumsal Talepler</span>
            </a>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Mesajınız başarıyla alındı! Ekibimiz en kısa sürede dönüş yapacaktır.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              {renderErrorSummary()}

              <div>
                <input
                  type="text"
                  placeholder="Adınız Soyadınız *"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => { const n = { ...prev }; delete n.name; return n; });
                  }}
                  className={`w-full text-xs p-2.5 rounded-xl bg-slate-50 border transition-all ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-2 focus:ring-pink-400'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="E-Posta Adresiniz *"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => { const n = { ...prev }; delete n.email; return n; });
                  }}
                  className={`w-full text-xs p-2.5 rounded-xl bg-slate-50 border transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-2 focus:ring-pink-400'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Telefon Numaranız: (5xx) xxx xx xx"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`w-full text-xs p-2.5 rounded-xl bg-slate-50 border transition-all ${
                    errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-2 focus:ring-pink-400'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.phone}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Mesajınız veya Kurumsal Talep Detayları... *"
                  rows={3}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => { const n = { ...prev }; delete n.message; return n; });
                  }}
                  className={`w-full text-xs p-2.5 rounded-xl bg-slate-50 border transition-all ${
                    errors.message ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-2 focus:ring-pink-400'
                  }`}
                />
                {errors.message && <p className="text-[11px] text-rose-500 font-medium mt-0.5">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Mesajı Gönder</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
