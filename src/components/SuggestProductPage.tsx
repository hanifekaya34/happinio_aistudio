import React, { useState } from 'react';
import { Send, MapPin, Gift, Award, Star, AlertTriangle } from 'lucide-react';

interface SuggestProductPageProps {
  lang: 'tr' | 'en';
}

export default function SuggestProductPage({ lang }: SuggestProductPageProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    productName: '',
    producerInfo: '',
    producerContact: '',
    category: 'El Sanatları & Mimarisi',
    description: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = lang === 'tr' ? 'Lütfen adınızı ve soyadınızı giriniz.' : 'Please enter your full name.';
    }
    if (!formData.email.trim()) {
      newErrors.email = lang === 'tr' ? 'Lütfen geçerli bir e-posta adresi giriniz.' : 'Please enter a valid email address.';
    }
    if (!formData.city.trim()) {
      newErrors.city = lang === 'tr' ? 'Lütfen şehir adını giriniz.' : 'Please enter the city name.';
    }
    if (!formData.productName.trim()) {
      newErrors.productName = lang === 'tr' ? 'Lütfen ürün veya hediye adını giriniz.' : 'Please enter the product or gift name.';
    }
    if (!formData.description.trim()) {
      newErrors.description = lang === 'tr' ? 'Lütfen ürün hakkında açıklama giriniz.' : 'Please enter a description for the product.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to error summary
      const errorSummary = document.getElementById('suggest-error-summary');
      if (errorSummary) {
        errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setErrors({});
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        city: '',
        productName: '',
        producerInfo: '',
        producerContact: '',
        category: 'El Sanatları & Mimarisi',
        description: ''
      });
    }, 5000);
  };

  const renderErrorSummary = () => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return null;

    return (
      <div
        id="suggest-error-summary"
        className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl space-y-2 animate-shake text-left"
      >
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{lang === 'tr' ? 'Lütfen aşağıdaki alanları kontrol ediniz:' : 'Please check the following fields:'}</span>
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-6">
            <MapPin className="w-4 h-4" />
            {lang === 'tr' ? 'Yerel Ürün & Şehir Kutusu Öneri Kulübü 📍' : 'Local Product & City Box Suggestion Club 📍'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif mt-0 leading-tight tracking-tight mb-6">
            {lang === 'tr' ? 'Şehrinden Ürün Öner & ' : 'Suggest a Local Product & '}
            <br />
            <span className="text-purple-800 italic">
              {lang === 'tr' ? 'Hediye Puanı Kazan 🎁' : 'Earn Gift Points 🎁'}
            </span>
          </h1>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'tr' ? '1. Ürününü Öner' : '1. Suggest a Product'}</h3>
            <p className="text-sm text-slate-500">{lang === 'tr' ? 'Şehrindeki eşsiz ürünü detaylarıyla bize anlat.' : 'Tell us about the unique product in your city in detail.'}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'tr' ? '2. Kapılarını Çalalım' : '2. We Reach Out'}</h3>
            <p className="text-sm text-slate-500">{lang === 'tr' ? 'Önerdiğin üreticilerle iletişime geçmeye çalışalım. Şartlar her iki taraf için de sevgi dolu bir iş birliğine uygunsa, ürünlerini sistemimize ekleyelim.' : 'We will try to reach out to the producers. If conditions are suitable for a lovely collaboration, we will add their products to our system.'}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{lang === 'tr' ? '3. 100 Hediye Puanı Kazan' : '3. Earn 100 Gift Points'}</h3>
            <p className="text-sm text-slate-500">{lang === 'tr' ? 'Ürün koleksiyona eklenirse tam 100 hediye puanı senin olsun.' : 'Earn 100 gift points if the product is added to the collection.'}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-serif mb-4">
                  {lang === 'tr' ? 'Öneriniz Başarıyla Alındı!' : 'Your Suggestion is Received Successfully!'}
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {lang === 'tr' ? 'Şehrinizin güzelliklerini bizimle paylaştığınız için teşekkür ederiz. Ekibimiz önerinizi en kısa sürede inceleyecek.' : 'Thank you for sharing your city\'s beauties with us. Our team will review your suggestion as soon as possible.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {renderErrorSummary()}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{lang === 'tr' ? 'Adınız Soyadınız *' : 'Full Name *'}</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors(prev => { const n = {...prev}; delete n.name; return n; });
                      }}
                      className={`w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20 border'
                          : 'bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent'
                      }`}
                      placeholder={lang === 'tr' ? 'Örn: Merve Kaya' : 'e.g., Jane Doe'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{lang === 'tr' ? 'E-posta Adresiniz *' : 'Email Address *'}</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors(prev => { const n = {...prev}; delete n.email; return n; });
                      }}
                      className={`w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20 border'
                          : 'bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent'
                      }`}
                      placeholder={lang === 'tr' ? 'Örn: merve@example.com' : 'e.g., jane@example.com'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{lang === 'tr' ? 'Şehir Adı *' : 'City Name *'}</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors(prev => { const n = {...prev}; delete n.city; return n; });
                      }}
                      className={`w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                        errors.city
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20 border'
                          : 'bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent'
                      }`}
                      placeholder={lang === 'tr' ? 'Örn: İzmir, İstanbul, Antalya' : 'e.g., Izmir, Istanbul, Antalya'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{lang === 'tr' ? 'Kategori' : 'Category'}</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                    >
                      <option>{lang === 'tr' ? 'El Sanatları & Mimarisi' : 'Handicrafts & Architecture'}</option>
                      <option>{lang === 'tr' ? 'Yerel Lezzet (Gıda)' : 'Local Flavor (Food)'}</option>
                      <option>{lang === 'tr' ? 'Tekstil / Giyim' : 'Textile / Clothing'}</option>
                      <option>{lang === 'tr' ? 'Kozmetik / Doğal Bakım' : 'Cosmetics / Natural Care'}</option>
                      <option>{lang === 'tr' ? 'Diğer' : 'Other'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">{lang === 'tr' ? 'Özel Ürün / Hediye Adı *' : 'Special Product / Gift Name *'}</label>
                  <input 
                    type="text" 
                    value={formData.productName}
                    onChange={(e) => {
                      setFormData({ ...formData, productName: e.target.value });
                      if (errors.productName) setErrors(prev => { const n = {...prev}; delete n.productName; return n; });
                    }}
                    className={`w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                      errors.productName
                        ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20 border'
                        : 'bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent'
                    }`}
                    placeholder={lang === 'tr' ? 'Örn: İzmir Boyozu, Antalya Reçeli, İstanbul Lokumu' : 'e.g., Olive Magnet, Japanese Fan'}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{lang === 'tr' ? 'Önerebileceğin Yerel Üretici / Marka (İsteğe Bağlı)' : 'Local Producer / Brand (Optional)'}</label>
                    <input 
                      type="text" 
                      value={formData.producerInfo}
                      onChange={(e) => setFormData({ ...formData, producerInfo: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                      placeholder={lang === 'tr' ? 'Örn: Tarihi Ali Usta Helvacısı vb.' : 'e.g., Ali Usta Sweets etc.'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{lang === 'tr' ? 'Yerel Üretici İletişim Bilgileri (İsteğe Bağlı)' : 'Producer Contact Info (Optional)'}</label>
                    <input 
                      type="text" 
                      value={formData.producerContact}
                      onChange={(e) => setFormData({ ...formData, producerContact: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                      placeholder={lang === 'tr' ? 'Örn: Telefon, Websitesi, Instagram vb.' : 'e.g., Phone, Website, Instagram etc.'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    {lang === 'tr' ? 'Açıklama & Neden Bu Ürün? *' : 'Description & Why This Product? *'}
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors(prev => { const n = {...prev}; delete n.description; return n; });
                    }}
                    className={`w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 resize-none ${
                      errors.description
                        ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20 border'
                        : 'bg-slate-50 border border-slate-200 focus:ring-purple-600 focus:border-transparent'
                    }`}
                    placeholder={lang === 'tr' ? 'Bu ürün neden kutularımızda yer almalı? Hikayesi veya özelliği nedir?' : 'Why should this product be in our boxes? What is its story or special feature?'}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {lang === 'tr' ? 'Önerimi Gönder' : 'Send My Suggestion'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
