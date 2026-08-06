import React, { useState } from 'react';
import { CitySuggestion, UserProfile, GiftBox } from '../types';
import { Award, MapPin, PlusCircle, CheckCircle2, ShieldAlert, Sparkles, Send, Eye, ShoppingBag, Star } from 'lucide-react';

interface CityContributionSectionProps {
  cityBoxes?: GiftBox[];
  onSelectBox?: (box: GiftBox) => void;
  onQuickAddToCart?: (box: GiftBox) => void;
  suggestions: CitySuggestion[];
  user: UserProfile;
  onSubmitSuggestion: (cityName: string, countryName: string, productName: string, category: string, description: string) => void;
}

export default function CityContributionSection({
  cityBoxes = [],
  onSelectBox,
  onQuickAddToCart,
  suggestions,
  user,
  onSubmitSuggestion,
}: CityContributionSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cityName, setCityName] = useState('');
  const [productName, setProductName] = useState('');
  const [producerName, setProducerName] = useState('');
  const [producerContact, setProducerContact] = useState('');
  const [category, setCategory] = useState('El Sanatları & Mimarisi');
  const [description, setDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim() || !productName.trim() || !description.trim()) {
      alert('Lütfen şehir adı, ürün adı ve açıklama alanlarını doldurun.');
      return;
    }

    let fullDesc = description.trim();
    if (producerName.trim()) {
      fullDesc += ` [Önerilen Üretici/Marka: ${producerName.trim()}]`;
    }
    if (producerContact.trim()) {
      fullDesc += ` [İletişim: ${producerContact.trim()}]`;
    }

    onSubmitSuggestion(cityName.trim(), '', productName.trim(), category, fullDesc);

    setFormSuccess('Harika! Öneriniz kaydedildi. Ürün koleksiyona eklendiğinde hesabınıza +100 Happinio Puanı tanımlanacaktır. 🎉');
    
    setName('');
    setEmail('');
    setCityName('');
    setProductName('');
    setProducerName('');
    setProducerContact('');
    setDescription('');
    setTimeout(() => setFormSuccess(''), 5000);
  };

  return (
    <section id="city-boxes" className="py-14 bg-gradient-to-b from-purple-50/40 via-pink-50/30 to-white border-y border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Display City Boxes if passed */}
        {cityBoxes.length > 0 && (
          <div className="mb-12">
            <h3 className="text-base font-bold text-slate-800 font-serif mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-600" />
              <span>Memleketimden Seçki Şehir & Ülke Kutuları</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cityBoxes.map((box) => (
                <div
                  key={box.id}
                  className="bg-white rounded-3xl p-4 border border-pink-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={box.image}
                      alt={box.name}
                      onClick={() => onSelectBox && onSelectBox(box)}
                      className="w-full h-40 object-cover rounded-2xl mb-3 cursor-pointer hover:opacity-90 transition-all duration-300"
                    />
                    <span className="text-[10px] font-bold text-pink-600 uppercase bg-pink-50 px-2 py-0.5 rounded-full">
                      {box.badge || 'Şehir Özel'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 font-serif mt-1">{box.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{box.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between">
                    <span className="text-base font-bold text-pink-600">{box.price} TL</span>
                    <div className="flex items-center gap-1.5">
                      {onSelectBox && (
                        <button
                          type="button"
                          onClick={() => onSelectBox(box)}
                          className="px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold rounded-xl transition-all"
                        >
                          Detay
                        </button>
                      )}
                      {onQuickAddToCart && (
                        <button
                          type="button"
                          onClick={() => onQuickAddToCart(box)}
                          className="px-3.5 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                        >
                          Ekle
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* City Suggestion Callout Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-6">
            <MapPin className="w-4 h-4" />
            Yerel Ürün & Şehir Kutusu Öneri Kulübü 📍
          </div>
          <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif mt-0 leading-tight tracking-tight mb-6">
            Şehrinden Ürün Öner & <br />
            <span className="text-purple-800 italic">
              Hediye Puanı Kazan 🎁
            </span>
          </h1>
          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">1. Ürününü Öner</h3>
              <p className="text-sm text-slate-500">Şehrindeki eşsiz ürünü detaylarıyla bize anlat.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">2. Kapılarını Çalalım</h3>
              <p className="text-sm text-slate-500">Önerdiğin üreticilerle iletişime geçmeye çalışalım. Şartlar her iki taraf için de sevgi dolu bir iş birliğine uygunsa, ürünlerini sistemimize ekleyelim.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">3. 100 Hediye Puanı Kazan</h3>
              <p className="text-sm text-slate-500">Ürün koleksiyona eklenirse tam 100 hediye puanı senin olsun.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Submission Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[40px] border border-pink-100 shadow-sm relative overflow-hidden">
            
            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Merve Kaya"
                    className="w-full text-xs p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">E-posta Adresiniz *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Örn: merve@example.com"
                    className="w-full text-xs p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Şehir Adı *</label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="Örn: İzmir, İstanbul, Antalya"
                    className="w-full text-xs p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent text-slate-700"
                  >
                    <option value="El Sanatları & Mimarisi">El Sanatları & Mimarisi</option>
                    <option value="Yerel Lezzet (Gıda)">Yerel Lezzet (Gıda)</option>
                    <option value="Tekstil / Giyim">Tekstil / Giyim</option>
                    <option value="Kozmetik / Doğal Bakım">Kozmetik / Doğal Bakım</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Özel Ürün / Hediye Adı *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Örn: İzmir Boyozu, Antalya Reçeli, İstanbul Lokumu"
                  className="w-full text-xs p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Önerebileceğin Yerel Üretici / Marka</span>
                  </label>
                  <input
                    type="text"
                    value={producerName}
                    onChange={(e) => setProducerName(e.target.value)}
                    placeholder="Örn: Tarihi Ali Usta Helvacısı vb."
                    className="w-full text-xs p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Yerel Üretici İletişim Bilgileri</label>
                  <input
                    type="text"
                    value={producerContact}
                    onChange={(e) => setProducerContact(e.target.value)}
                    placeholder="Örn: Telefon, Websitesi, Instagram vb."
                    className="w-full text-xs p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">Açıklama & Neden Bu Ürün? *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Ürünün hikâyesini, neyinin meşhur olduğunu ve neden bu kutuda olmalı kısaca yazın..."
                  className="w-full text-xs p-2.5 sm:p-3 rounded-xl transition-all focus:outline-none focus:ring-2 bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-700 hover:via-pink-700 hover:to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-5 h-5" />
                <span>Önerimi Gönder</span>
              </button>
            </form>
          </div>

          {/* Crowdsourced Suggestions Feed */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-600" />
              <span>Kullanıcıların Eklediği Onaylı Şehir Ürünleri</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((sug) => (
                <div key={sug.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {sug.cityName}{sug.countryName ? `, ${sug.countryName}` : ''}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      +{sug.pointsAwarded} Puan
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800">{sug.productName}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{sug.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Öneren: {sug.suggestedBy}</span>
                    <span>{sug.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
