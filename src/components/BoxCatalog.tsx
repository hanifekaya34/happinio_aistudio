import React, { useState } from 'react';
import { GiftBox, BoxCategory } from '../types';
import { Heart, Star, Sparkles, Search, SlidersHorizontal, Eye, ShoppingBag } from 'lucide-react';
import { getProducerBadge } from '../utils/producerHelpers';

interface BoxCatalogProps {
  boxes: GiftBox[];
  favorites: string[];
  onToggleFavorite: (boxId: string) => void;
  onSelectBox: (box: GiftBox) => void;
  onQuickAddToCart: (box: GiftBox) => void;
  initialCategory?: BoxCategory;
  onNavigateToJoyGenie?: () => void;
  producerFilter?: string | null;
  onClearProducerFilter?: () => void;
}

export default function BoxCatalog({
  boxes,
  favorites,
  onToggleFavorite,
  onSelectBox,
  onQuickAddToCart,
  initialCategory = 'all',
  onNavigateToJoyGenie,
  producerFilter = null,
  onClearProducerFilter,
}: BoxCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<BoxCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high'>('popular');

  const categories: { id: BoxCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Tüm Kutular', icon: '✨' },
    { id: 'city', label: 'Şehir & Ülke', icon: '🏙️' },
    { id: 'special_day', label: 'Özel Günler', icon: '🎂' },
    { id: 'fantasy', label: 'Fantastik & Sinema', icon: '🧙‍♂️' },
    { id: 'music', label: 'Müzik & Şarkı Sözleri', icon: '🎵' },
    { id: 'coffee_book', label: 'Kahve & Kitap', icon: '☕' },
    { id: 'truva', label: 'Sürpriz & Mizah', icon: '🎭' },
    { id: 'baby_mom', label: 'Yeni Anne & Bebek', icon: '👶' },
    { id: 'fathers', label: 'Babalar Günü', icon: '👔' },
    { id: 'corporate', label: 'Kurumsal B2B', icon: '💼' },
    { id: 'meme', label: 'Meme & Replik', icon: '😂' },
  ];

  // Filtering
  const filteredBoxes = (boxes || []).filter((box) => {
    if (!box) return false;
    const matchesCategory = selectedCategory === 'all' || box.category === selectedCategory;
    const nameMatch = (box.name || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    const descMatch = (box.description || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    const tagMatch = (box.tags || []).some((t) => (t || '').toLowerCase().includes((searchQuery || '').toLowerCase()));
    
    // If producerFilter is active, filter only boxes matching this producer badge
    const matchesProducer = !producerFilter || getProducerBadge(box) === producerFilter;
    
    return matchesCategory && (nameMatch || descMatch || tagMatch) && matchesProducer;
  });

  // Sorting
  const sortedBoxes = [...filteredBoxes].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    return b.reviewCount - a.reviewCount; // Popular
  });

  return (
    <section id="box-catalog" className="pt-6 pb-14 bg-white border-t border-purple-50 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif mt-0 leading-tight tracking-tight">
            Özenle Tasarlanmış <br />
            <span className="text-purple-800 italic">Tematik Hediye Kutuları</span> 🎁
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
            Şehir temalı kutulardan esprili Truva şaka paketlerine, fantastik evren koleksiyonlarından yeni anne tebriklerine kadar her an için tematik hediye kutularını keşfedin.
          </p>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-4 py-2.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-800 border border-purple-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kutu veya şehir ara..."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 placeholder-purple-300 italic"
              />
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium py-2.5 px-3 rounded-2xl bg-white border border-purple-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="popular">Popülerlik</option>
              <option value="price_low">Fiyat: Düşükten Yükseğe</option>
              <option value="price_high">Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>

        </div>

        {/* Producer Filter Active Banner */}
        {producerFilter && (
          <div className="bg-gradient-to-r from-purple-100/70 to-pink-50 p-5 rounded-[24px] border-2 border-purple-200 mb-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto animate-fadeIn text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">🌾</span>
              <div>
                <h4 className="text-sm font-extrabold text-purple-950 font-serif">
                  Filtre Aktif: {producerFilter}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 font-normal">
                  Sadece bu yerel üreticimizin el emeği ürünlerini içeren tematik kutular listeleniyor.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClearProducerFilter}
              className="bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl transition-all cursor-pointer border border-purple-800 shrink-0 shadow-2xs"
            >
              Filtreyi Temizle (Tümünü Göster)
            </button>
          </div>
        )}

        {/* Custom City Boxes Banner when 'city' category is selected */}
        {selectedCategory === 'city' && (
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 p-6 sm:p-8 rounded-[32px] border border-purple-100/90 mb-8 shadow-xs text-center max-w-4xl mx-auto animate-fadeIn">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3.5 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1.5 mb-2.5">
              🏙️ Şehir &amp; Ülke Kutuları
            </span>
            <h3 className="text-2xl sm:text-3xl font-normal text-slate-900 font-serif mb-3">
              Memleketimden &amp; Şehirlerden <span className="text-purple-800 italic">Sürpriz Kutular</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
              Turistik gezilerde veya seyahatlerde sevdiklerinize hediye seçmek ve bulmak zor olabilir. Şehir &amp; Ülke temalı kutularımız; o bölgenin &quot;almadan dönme&quot; denilen ikonik anı eşyalarını, &quot;bir tatsan çok seversin&quot; denilen yerel ürünlerini, oradaymışsın gibi hissettirecek ve en yakın zamanda orayı ziyaret etme isteği uyandıracak özel seçkileri ayağınıza getiriyor!
            </p>
          </div>
        )}

        {/* Box Grid */}
        {sortedBoxes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[40px] border border-purple-100">
            <p className="text-sm font-bold text-slate-700">Aramanıza uygun hazır hediye kutusu bulunamadı.</p>
            <p className="text-xs text-slate-500 mt-1">Dilerseniz sayfanın üstündeki Yapay Zeka Prompt alanından özel kutunuzu oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBoxes.map((box) => {
              const isFavorite = favorites.includes(box.id);
              const producerBadge = getProducerBadge(box) || (box.items && box.items.map(getProducerBadge).find(Boolean));

              return (
                <div
                  key={box.id}
                  className="bg-white rounded-[32px] border border-purple-100/80 p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div>
                    <div 
                      onClick={() => onSelectBox(box)}
                      className="relative h-48 rounded-[24px] overflow-hidden bg-purple-50/50 mb-4 cursor-pointer"
                    >
                      <img
                        src={box.image}
                        alt={box.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Origin Producer Badge Overlay */}
                      {producerBadge && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-purple-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs border border-purple-100 z-10 flex items-center gap-1">
                          <span>{producerBadge}</span>
                        </div>
                      )}

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(box.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
                          isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-600 hover:text-rose-500 hover:bg-white'
                        }`}
                        title="Favorilerime Ekle"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                      </button>

                      {/* Rating pill */}
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs z-10">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{box.rating}</span>
                        <span className="text-slate-400">({box.reviewCount})</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div>
                      {/* Single Clean Badge Tag */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {box.badge ? (
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-purple-200/60">
                            {box.badge}
                          </span>
                        ) : box.popularFor ? (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200/60">
                            🎯 {box.popularFor}
                          </span>
                        ) : null}
                      </div>

                      <h3
                        onClick={() => onSelectBox(box)}
                        className="text-base font-bold text-slate-900 font-serif leading-snug group-hover:text-purple-700 transition-colors cursor-pointer hover:underline"
                      >
                        {box.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                        {box.description}
                      </p>

                      {/* Items Pill */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {(box.items || []).filter(Boolean).slice(0, 2).map((item, idx) => (
                          <span key={idx} className="text-[10px] bg-purple-50/80 text-purple-900 border border-purple-100 px-2 py-0.5 rounded-full font-medium truncate max-w-[140px]">
                            {item.name}
                          </span>
                        ))}
                        {(box.items || []).filter(Boolean).length > 2 && (
                          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                            +{(box.items || []).filter(Boolean).length - 2} ürün
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-5 pt-4 border-t border-purple-50 flex items-center justify-between gap-2">
                    <div>
                      {box.discountPrice ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-purple-800 font-serif whitespace-nowrap">{box.discountPrice} TL</span>
                          <span className="text-xs text-slate-300 line-through whitespace-nowrap">{box.price} TL</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-purple-800 font-serif whitespace-nowrap">{box.price} TL</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectBox(box)}
                        className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-xl transition-colors text-[11px] flex items-center gap-1 border border-purple-100"
                        title="Detaylı İncele"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detay</span>
                      </button>
                      <button
                        onClick={() => onQuickAddToCart(box)}
                        className="bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Ekle</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Joy Genie AI Card at the end of the list */}
            {onNavigateToJoyGenie && (
              <div
                onClick={onNavigateToJoyGenie}
                className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 rounded-3xl border border-dashed border-purple-300 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer hover:border-purple-400 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 opacity-10 pointer-events-none">
                  <Sparkles className="w-24 h-24 text-purple-900" />
                </div>
                
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1 bg-purple-100/80 text-purple-900 text-[10px] font-bold px-2.5 py-1 rounded-full border border-purple-200">
                    <Sparkles className="w-3 h-3 animate-pulse text-purple-700" />
                    <span>JOY-GENIE AI</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-900 font-serif group-hover:text-purple-900 transition-colors">
                    Hayalindeki Kutuyu Kendin Tasarla! ✨
                  </h3>
                  
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Aradığın konsepti tam bulamadın mı? Joy-Genie Yapay Zekası sevdiklerinin hobilerine ve ilgi alanlarına özel benzersiz parçaları saniyeler içinde seçsin.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-100/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-900 group-hover:underline">
                    Yapay Zeka ile Üret →
                  </span>
                  <span className="text-[10px] bg-purple-900 text-white font-bold px-2.5 py-1 rounded-xl shadow-xs group-hover:bg-purple-950 transition-colors">
                    Hemen Üret 🪄
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
