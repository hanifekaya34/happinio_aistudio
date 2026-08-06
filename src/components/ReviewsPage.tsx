import React, { useState } from 'react';
import { Review, BoxCategory } from '../types';
import { Star, ThumbsUp, CheckCircle2, MessageSquarePlus, Image, Search, X } from 'lucide-react';

interface ReviewsPageProps {
  reviews: Review[];
  onAddReview: (newReview: Omit<Review, 'id' | 'date' | 'likes'>) => void;
  initialSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export default function ReviewsPage({
  reviews,
  onAddReview,
  initialSearchQuery = '',
  onSearchQueryChange,
}: ReviewsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<BoxCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [likeCounts, setLikeCounts] = useState<{ [id: string]: number }>(
    reviews.reduce((acc, r) => ({ ...acc, [r.id]: r.likes }), {})
  );

  // New review form
  const [userName, setUserName] = useState('');
  const [boxName, setBoxName] = useState('Kedisever Kahve & Kitap Keyfi Kutusu');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showModerationNotice, setShowModerationNotice] = useState(false);

  const boxOptions = [
    'Kedisever Kahve & Kitap Keyfi Kutusu',
    'Meme & Dizi Repliği Kutusu',
    'Eskişehir Şehir Temalı Kutusu',
    'Truva Şaka & Sürpriz Kutusu',
    'Fantastik Evren Koleksiyonu',
    'Yeni Anne & Bebek Kutusu',
    'Joy-Genie Özel AI Tasarım Kutusu',
  ];

  const handleLike = (id: string) => {
    setLikeCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      alert('Lütfen adınızı ve değerlendirme yorumunuzu doldurun.');
      return;
    }

    onAddReview({
      userName: userName.trim(),
      userAvatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=100&q=80`,
      rating,
      boxName,
      boxCategory: 'coffee_book',
      comment: comment.trim(),
      verifiedBuyer: true,
      photos: uploadedPhoto ? [uploadedPhoto] : ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80'],
    });

    setShowAddModal(false);
    setShowModerationNotice(true);
    setUserName('');
    setComment('');
    setUploadedPhoto(null);
  };

  const [searchQuery, setSearchQuery] = useState(() => {
    if (initialSearchQuery) return initialSearchQuery;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('boxName') || params.get('search') || '';
    }
    return '';
  });

  React.useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesCategory = selectedCategory === 'all' ? true : r.boxCategory === selectedCategory;
    const matchesSearch = searchQuery
      ? r.boxName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.userName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="reviews-section" className="pt-6 pb-14 bg-[#FFF8FA] border-t border-pink-100 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif mt-0 leading-tight tracking-tight">
            Gerçek Deneyimler <br />
            <span className="text-pink-500 italic">Kullanıcı Değerlendirmeleri</span> ⭐
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal leading-relaxed">
            Kutuyu açtıkları andaki samimi tebessümleri okuyun! %99.4 memnuniyet oranı ile binlerce kişiselleştirilmiş hediye kutusu sahibine ulaştı.
          </p>
        </div>

        {/* Rating Summary Card */}
        <div className="bg-white rounded-[40px] p-6 sm:p-8 shadow-xs border border-pink-100 mb-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-pink-50 pb-6 md:pb-0 md:pr-6">
            <div className="text-5xl font-normal text-slate-800 font-serif">4.95</div>
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-400 font-normal">1,240+ Doğrulanmış Kullanıcı Değerlendirmesi</p>
          </div>

          <div className="md:col-span-5 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>5 Yıldız</span>
              <div className="flex-1 bg-pink-50 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[94%]"></div>
              </div>
              <span className="font-bold">%94</span>
            </div>
            <div className="flex items-center gap-2">
              <span>4 Yıldız</span>
              <div className="flex-1 bg-pink-50 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[5%]"></div>
              </div>
              <span className="font-bold">%5</span>
            </div>
            <div className="flex items-center gap-2">
              <span>3 Yıldız</span>
              <div className="flex-1 bg-pink-50 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[1%]"></div>
              </div>
              <span className="font-bold">%1</span>
            </div>
          </div>

          <div className="md:col-span-3 text-center md:text-right">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Değerlendirme Yap</span>
            </button>
          </div>
        </div>

        {/* Search / Filter bar */}
        <div className="mb-8 max-w-md mx-auto relative animate-fadeIn">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Kutularda veya yorumlarda ara..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-pink-100 shadow-2xs focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-xs sm:text-sm text-slate-700 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="text-center mt-3 text-xs text-slate-500 font-medium animate-fadeIn">
              <span className="text-pink-600 font-bold">"{searchQuery}"</span> için sonuçlar listeleniyor ({filteredReviews.length} değerlendirme)
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-white p-6 sm:p-8 rounded-[40px] border border-pink-100 shadow-xs flex flex-col justify-between">
              <div>
                {/* User & Box Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                      alt={rev.userName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-pink-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{rev.userName}</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Alıcı
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100 inline-block mb-2">
                  📦 {rev.boxName}
                </span>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{rev.comment}</p>

                {/* Photos */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {rev.photos.map((photo, pIdx) => (
                      <img
                        key={pIdx}
                        src={photo}
                        alt="Unboxing photo"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-2xl object-cover border border-pink-100"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer like button */}
              <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between text-xs text-slate-400">
                <span>Faydalı Buldum</span>
                <button
                  onClick={() => handleLike(rev.id)}
                  className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1 rounded-xl transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>({likeCounts[rev.id] || 0})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 font-serif mb-1">Happinio Deneyiminizi Değerlendirin 💬</h3>
            <p className="text-xs text-slate-500 mb-4">Görüşleriniz topluluğumuz için çok kıymetli.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Selin Y."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hangi Kutuyu Satın Aldınız? *</label>
                <select
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  {boxOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Puanınız</label>
                <div className="flex gap-1 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Değerlendirme Yorumunuz *</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Hediye kutusu elinize ulaştığındaki hislerinizi ve ürün kalitesini paylaşın..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              {/* Photo Attachment Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kutu Görseli veya Fotoğraf Ekle (Opsiyonel)</label>
                {uploadedPhoto ? (
                  <div className="relative inline-block mt-1">
                    <img src={uploadedPhoto} alt="Önizleme" className="w-20 h-20 rounded-xl object-cover border border-pink-200" />
                    <button
                      type="button"
                      onClick={() => setUploadedPhoto(null)}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setUploadedPhoto('https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80')}
                    className="w-full border-2 border-dashed border-pink-200 hover:border-pink-400 bg-pink-50/50 p-3 rounded-xl text-center text-xs font-bold text-pink-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Image className="w-4 h-4 text-pink-500" />
                    <span>Örnek Kutu Açılım Fotoğrafı Yükle</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors"
              >
                Değerlendirmeyi Yayınla
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Moderation Confirmation Modal */}
      {showModerationNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-pink-100 text-center space-y-4">
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-pink-500" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-serif">Değerlendirmeniz Tarafımıza Ulaştı! 🌸</h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Yorumunuz ve görseliniz başarıyla kaydedildi. Küfür, reklam veya uygunsuz içeriklerin önüne geçilmesi amacıyla editör ön kontrolümüzün ardından sitemizde yayınlanacaktır.
            </p>

            <div className="bg-pink-50 p-3 rounded-2xl border border-pink-100 text-[11px] text-pink-800 font-medium">
              Ahlak ve küfür filtresi kapsamında yapılan bu ön inceleme için anlayışınız ve samimi değerlendirmeniz için teşekkür ederiz.
            </div>

            <button
              onClick={() => setShowModerationNotice(false)}
              className="w-full bg-pink-500 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-pink-600 transition-colors"
            >
              Anlaşıldı, Teşekkürler
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
