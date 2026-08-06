import React, { useState } from 'react';
import { GiftBox, Product } from '../types';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Sparkles,
  Eye,
  ArrowLeft,
  ExternalLink,
  Gift,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Share2,
  ZoomIn,
} from 'lucide-react';
import { getProducerBadge } from '../utils/producerHelpers';

interface BoxDetailModalProps {
  box: GiftBox | null;
  isOpen: boolean;
  isFavorite: boolean;
  allBoxes?: GiftBox[];
  onClose: () => void;
  onToggleFavorite: (boxId: string) => void;
  onAddToCart: (
    boxTitle: string,
    items: any[],
    price: number,
    giftNote?: string,
    recipientName?: string,
    senderName?: string,
    isAiGenerated?: boolean,
    rawAiResult?: any,
    boxId?: string
  ) => void;
  onSelectBox?: (box: GiftBox) => void;
  onDirectBuy?: (
    boxTitle: string,
    items: any[],
    price: number,
    giftNote?: string,
    recipientName?: string,
    senderName?: string,
    isAiGenerated?: boolean,
    rawAiResult?: any,
    boxId?: string
  ) => void;
  onNavigateToJoyGenie?: () => void;
  onViewReviews?: (boxName: string) => void;
  isPage?: boolean;
}

export default function BoxDetailModal({
  box,
  isOpen,
  isFavorite,
  allBoxes = [],
  onClose,
  onToggleFavorite,
  onAddToCart,
  onSelectBox,
  onDirectBuy,
  onNavigateToJoyGenie,
  onViewReviews,
  isPage = false,
}: BoxDetailModalProps) {
  if (!isOpen || !box) return null;

  const modalContainerRef = React.useRef<HTMLDivElement>(null);

  const boxTitleClean = box.name
    .replace(/\s+kutusu\b/gi, '')
    .replace(/\s+paketi\b/gi, '')
    .replace(/\s+kiti\b/gi, '')
    .replace(/\s+seti\b/gi, '')
    .replace(/\s*-\s*$/, '')
    .trim();

  const [recipientName, setRecipientName] = useState('Sevgili Dostum');
  const [senderName, setSenderName] = useState('');
  const [giftNote, setGiftNote] = useState(
    `Senin için özel olarak hazırlanan bu ${boxTitleClean} kutusu umarım yüzünde tatlı bir tebessüm oluşturur! Sevgiyle...`
  );
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset image index and gift note details when box changes
  React.useEffect(() => {
    setActiveImageIndex(0);
    setRecipientName('Sevgili Dostum');
    setSenderName('');
    setSelectedItemForDetail(null);
    const titleClean = box.name
      .replace(/\s+kutusu\b/gi, '')
      .replace(/\s+paketi\b/gi, '')
      .replace(/\s+kiti\b/gi, '')
      .replace(/\s+seti\b/gi, '')
      .replace(/\s*-\s*$/, '')
      .trim();
    setGiftNote(`Senin için özel olarak hazırlanan bu ${titleClean} kutusu umarım yüzünde tatlı bir tebessüm oluşturur! Sevgiyle...`);
    
    // Force immediate scroll to top of the modal
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTop = 0;
      modalContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    // Microtask timeout fallback to guarantee scrolling after DOM updates
    const timer = setTimeout(() => {
      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTop = 0;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [box.id, box.name]);

  const finalPrice = box.discountPrice || box.price;
  const hasDiscount = !!box.discountPrice && box.discountPrice < box.price;
  const discountAmount = hasDiscount ? box.price - (box.discountPrice || 0) : 0;
  const discountPercent = hasDiscount ? Math.round((discountAmount / box.price) * 100) : 0;

  // Build gallery items array: [Cover Image, ...Product Items]
  const galleryItems = [
    {
      id: 'cover',
      image: box.image,
      name: 'Kutu Genel Görünümü',
      type: 'cover' as const,
      description: box.badge || 'Özel Tasarım Hediye Kutusu',
    },
    ...(box.items || []).filter(Boolean).map((item, idx) => ({
      id: item.id || `item-${idx}`,
      image: item.image,
      name: item.name,
      type: 'item' as const,
      description: item.description,
      rawItem: item,
    })),
  ];

  const currentGalleryItem = galleryItems[activeImageIndex] || galleryItems[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  const handleAdd = () => {
    onAddToCart(
      box.name,
      box.items,
      finalPrice,
      giftNote,
      recipientName,
      senderName || 'Gizli Seven Biri',
      false,
      undefined,
      box.id
    );
    if (!isPage) {
      onClose();
    }
  };

  const handleBuyNow = () => {
    if (onDirectBuy) {
      onDirectBuy(
        box.name,
        box.items,
        finalPrice,
        giftNote,
        recipientName,
        senderName || 'Gizli Seven Biri',
        false,
        undefined,
        box.id
      );
    } else {
      handleAdd();
    }
  };

  const handleOpenInNewTab = () => {
    const url = `${window.location.origin}${window.location.pathname}?box=${box.id}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?box=${box.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter related boxes
  const relatedBoxes = allBoxes
    .filter((b) => b.id !== box.id)
    .slice(0, 3);

  return (
    <div
      ref={modalContainerRef}
      className={
        isPage
          ? 'bg-[#FAF7F2] py-6 sm:py-10 animate-fadeIn'
          : 'fixed inset-0 z-50 bg-[#FAF7F2] overflow-y-auto flex flex-col min-h-screen w-screen animate-fadeIn'
      }
    >
      {/* Top Navigation Bar - ONLY shown in modal mode since page mode has its own Navbar */}
      {!isPage && (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-900 bg-purple-100/80 hover:bg-purple-200 px-3.5 py-2 rounded-xl border border-purple-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ana Sayfaya Dön</span>
            </button>

            <span className="hidden md:inline-block h-5 w-px bg-slate-200" />

            {/* Logo / Title */}
            <div className="hidden sm:flex items-center gap-2 cursor-pointer" onClick={onClose}>
              <span className="font-serif font-black text-lg text-purple-900 tracking-tight">Happinio</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                Detay Görünümü
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleOpenInNewTab}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-900 bg-white hover:bg-purple-50 px-3 py-2 rounded-xl border border-purple-200 transition-all shadow-2xs"
              title="Bu hediye kutusunu yeni sekmede açın"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden sm:inline">Yeni Sekmede Aç ↗</span>
              <span className="sm:hidden">Sekme ↗</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-900 bg-white hover:bg-purple-50 px-3 py-2 rounded-xl border border-purple-200 transition-all shadow-2xs"
              title="Bağlantıyı Kopyala"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden sm:inline">{copiedLink ? 'Kopyalandı! ✓' : 'Paylaş'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(box.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                  : 'bg-white text-slate-600 border-purple-200 hover:bg-purple-50'
              }`}
              title="Favorilere Ekle"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-purple-100 transition-colors"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      {/* Main Container - Grand Full Page Layout */}
      <main className={`flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full space-y-6 sm:space-y-8`}>
        
        {/* Breadcrumb Path & Standalone Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-purple-100/50 pb-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-100/80 hover:bg-purple-200 px-3.5 py-1.5 rounded-xl border border-purple-200 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-800" />
              <span>Geri Dön</span>
            </button>
            <span className="h-4 w-px bg-purple-200 shrink-0" />
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium whitespace-nowrap">
              <span className="hover:text-purple-800 cursor-pointer" onClick={onClose}>
                Ana Sayfa
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="hover:text-purple-800 cursor-pointer" onClick={onClose}>
                Hediye Kutuları
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-purple-900 font-bold truncate max-w-xs">{box.name}</span>
            </div>
          </div>

          {/* Social / Page Actions only visible in Page Mode */}
          {isPage && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-900 bg-white hover:bg-purple-50 px-3 py-2 rounded-xl border border-purple-200 transition-all shadow-2xs cursor-pointer"
                title="Bağlantıyı Kopyala"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-700" />
                <span>{copiedLink ? 'Kopyalandı! ✓' : 'Paylaş'}</span>
              </button>

              <button
                onClick={() => onToggleFavorite(box.id)}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                    : 'bg-white text-slate-600 border-purple-200 hover:bg-purple-50'
                }`}
                title="Favorilere Ekle"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
                <span>{isFavorite ? 'Favorilerimde' : 'Favorilere Ekle'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Hero Section: Two Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white p-6 sm:p-10 rounded-[36px] border border-purple-200/80 shadow-md">
          
          {/* Left Column: Interactive Product Gallery */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Image Stage */}
            <div className="relative h-80 sm:h-96 md:h-[460px] rounded-3xl overflow-hidden bg-purple-50 shadow-inner border border-purple-200/80 group">
              <img
                key={currentGalleryItem.id}
                src={currentGalleryItem.image}
                alt={currentGalleryItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500 animate-fadeIn"
              />

              {/* Overlay Top Tag: Box Cover vs Item Name */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 max-w-[70%]">
                <span className="bg-white/95 backdrop-blur-md text-purple-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs border border-purple-100 flex items-center gap-1.5 self-start">
                  {currentGalleryItem.type === 'cover' ? (
                    <>
                      <Gift className="w-3.5 h-3.5 text-purple-700" />
                      <span>Kutu Genel Görünümü</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-purple-700" />
                      <span>Kutu İçi Parça</span>
                    </>
                  )}
                </span>
                
                {currentGalleryItem.type !== 'cover' && (
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-xl truncate shadow-xs">
                    {currentGalleryItem.name}
                  </span>
                )}
              </div>

              {/* Action Buttons Top Right: Favorite & Zoom */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                {currentGalleryItem.type === 'item' && currentGalleryItem.rawItem && (
                  <button
                    onClick={() => setSelectedItemForDetail(currentGalleryItem.rawItem)}
                    className="p-2.5 rounded-full shadow-lg bg-white/90 text-purple-900 hover:bg-white backdrop-blur-md transition-all cursor-pointer"
                    title="Ürünü Yakından İncele"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onToggleFavorite(box.id)}
                  className={`p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all cursor-pointer ${
                    isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-white'
                  }`}
                  title="Favorilere Ekle"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Gallery Slider Prev/Next Navigation Arrows */}
              {galleryItems.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/85 hover:bg-white text-purple-950 shadow-md backdrop-blur-xs transition-all hover:scale-110 cursor-pointer z-10 opacity-90 hover:opacity-100"
                    title="Önceki Görsel"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/85 hover:bg-white text-purple-950 shadow-md backdrop-blur-xs transition-all hover:scale-110 cursor-pointer z-10 opacity-90 hover:opacity-100"
                    title="Sonraki Görsel"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Gallery Counter Bottom Right */}
              <div className="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs z-10">
                {activeImageIndex + 1} / {galleryItems.length} Görsel
              </div>
            </div>

            {/* In-Product Gallery Thumbnails Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-800 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  <span>Ürün & Kutu Görsel Galerisi ({galleryItems.length})</span>
                </span>
                <span className="text-[10px] text-purple-700 font-medium">Görsele tıklayarak değiştirin</span>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
                {galleryItems.map((gItem, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={gItem.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group ${
                        isActive
                          ? 'border-purple-700 ring-2 ring-purple-600/30 shadow-md scale-105'
                          : 'border-purple-100 hover:border-purple-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={gItem.image}
                        alt={gItem.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] font-bold py-0.5 text-center truncate px-1">
                        {gItem.type === 'cover' ? 'Kutu Genel Görünümü' : `Parça ${idx}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-purple-100 flex items-center gap-2 text-xs font-medium text-slate-700">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Aynı Gün Ücretsiz Kargo</span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-purple-100 flex items-center gap-2 text-xs font-medium text-slate-700">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>256-Bit Güvenli Ödeme</span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-purple-100 flex items-center gap-2 text-xs font-medium text-slate-700 col-span-2 sm:col-span-1">
                <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Özel Hediye Paketi & Kart</span>
              </div>
            </div>

            {/* Interactive Gift Note Card */}
            <div className="bg-gradient-to-r from-purple-50/90 via-amber-50/40 to-purple-50/90 p-5 rounded-3xl border border-purple-200 shadow-2xs space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-purple-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span>Kutuya Eklenecek Özel Hediye Notunuz</span>
                </h3>
                <span className="text-[10px] text-purple-700 font-bold">{giftNote.length}/250</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Alıcı İsmi (Örn: Sevgili Zeynep)"
                  className="text-xs p-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-hidden focus:border-purple-600 font-medium"
                />
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Gönderen İsmi (Örn: Can & Aylin)"
                  className="text-xs p-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 focus:outline-hidden focus:border-purple-600 font-medium"
                />
              </div>

              <textarea
                value={giftNote}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    setGiftNote(e.target.value);
                  }
                }}
                maxLength={250}
                rows={3}
                placeholder="Kartvizit kalitesinde hediye zarfına yazılacak samimi notunuzu kaleme alın..."
                className="w-full text-xs p-3 rounded-xl bg-white border border-purple-200 text-slate-800 font-serif focus:outline-hidden focus:border-purple-600 leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Title, Rating, Price & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mb-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{box.rating}</span>
                </div>
                <span
                  onClick={() => {
                    if (onViewReviews && box) {
                      onViewReviews(box.name);
                    } else if (box) {
                      const url = `${window.location.origin}${window.location.pathname}?view=reviews&boxName=${encodeURIComponent(box.name)}`;
                      window.open(url, '_blank');
                    }
                  }}
                  className="text-slate-500 hover:text-purple-700 hover:underline cursor-pointer transition-colors"
                  title="Yorumları incelemek için tıkla"
                >
                  ({box.reviewCount} Kullanıcı Değerlendirmesi)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 leading-tight">
                {box.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-3">
                {box.description}
              </p>
            </div>

            {/* Price Row & Shipping Info */}
            <div className="p-5 bg-white rounded-3xl border border-purple-100/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-purple-950 font-serif">
                      {finalPrice} TL
                    </span>
                    {hasDiscount && (
                      <span className="text-base sm:text-lg text-slate-400 line-through font-serif">
                        {box.price} TL
                      </span>
                    )}
                  </div>
                  
                  {hasDiscount && (
                    <p className="text-xs text-emerald-700 font-bold mt-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span>
                        Bu kutuda <strong className="font-extrabold">{discountAmount} TL</strong> kazançlısınız!
                      </span>
                    </p>
                  )}
                </div>

                {hasDiscount ? (
                  <span className="self-start sm:self-auto text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    %{discountPercent} İNDİRİM
                  </span>
                ) : (
                  <span className="self-start sm:self-auto text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full shadow-2xs">
                    En İyi Fiyat Garantisi
                  </span>
                )}
              </div>

              {/* Shipping Details Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-3 bg-[#FAF7F2] border border-purple-100/50 px-3.5 py-2.5 rounded-2xl flex-1">
                  <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-xs">Hızlı & Ücretsiz Kargo</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Bugün kargoda, en geç 2 gün içinde teslimat!</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FAF7F2] border border-purple-100/50 px-3.5 py-2.5 rounded-2xl flex-1">
                  <div className="p-2 bg-purple-100 rounded-xl text-purple-700 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-xs">Güvenli Paketleme</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Özel darbe korumalı ve şık hediye kutusuyla gönderim.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated Box Contents Section */}
            <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-3xl border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-700" />
                  <span>Kutu İçeriği ({(box.items || []).filter(Boolean).length} Parça Özel Ürün)</span>
                </h3>
                <span className="text-[10px] text-purple-700 font-medium bg-purple-100 px-2.5 py-0.5 rounded-full">
                  İncelemek için tıklayın
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(box.items || []).filter(Boolean).map((item) => {
                  const itemBadge = getProducerBadge(item);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemForDetail(item)}
                      className="p-2.5 bg-white hover:bg-purple-50/80 rounded-xl border border-purple-100 hover:border-purple-300 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover border border-purple-100 group-hover:scale-105 transition-transform shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-900 transition-colors truncate">
                            {item.name}
                          </h4>
                          {itemBadge ? (
                            <span className="inline-block text-[9px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 mt-0.5">
                              {itemBadge}
                            </span>
                          ) : (
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-800 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Sepetime Ekle</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hemen Satın Al ⚡</span>
              </button>
            </div>

          </div>

        </div>

        {/* Related / Recommended Boxes Carousel Section */}
        {relatedBoxes.length > 0 && (
          <div className="bg-white p-6 sm:p-10 rounded-[36px] border border-purple-200/80 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                  Benzer Tasarımlar
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-2">
                  Bunları da Beğenebilirsiniz 🎁
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedBoxes.map((relBox) => (
                <div
                  key={relBox.id}
                  onClick={() => onSelectBox && onSelectBox(relBox)}
                  className="bg-[#FAF7F2] rounded-3xl border border-purple-100 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer hover:border-purple-300"
                >
                  <div>
                    <div className="aspect-4/3 rounded-2xl overflow-hidden relative bg-purple-50 mb-3">
                      <img
                        src={relBox.image}
                        alt={relBox.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {relBox.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-purple-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-purple-100">
                          {relBox.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 font-serif group-hover:text-purple-900 transition-colors line-clamp-1">
                      {relBox.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-normal">
                      {relBox.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
                    <span className="text-sm font-bold font-serif text-purple-900">
                      {relBox.discountPrice || relBox.price} TL
                    </span>
                    <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-xl">
                      İncele →
                    </span>
                  </div>
                </div>
              ))}

              {/* Joy Genie AI Call To Action Card */}
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
                    Hemen Başla 🪄
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Item Detail Inspector Modal */}
      {selectedItemForDetail && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 relative border border-purple-200 text-left shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedItemForDetail(null)}
              className="absolute top-4 right-4 p-1.5 bg-white text-slate-600 rounded-full hover:bg-slate-100 border border-purple-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider inline-block border border-purple-200">
              Ürün Detaylı İnceleme
            </span>

            <img
              src={selectedItemForDetail.image}
              alt={selectedItemForDetail.name}
              referrerPolicy="no-referrer"
              className="w-full h-52 object-cover rounded-2xl border border-purple-200 shadow-xs"
            />

            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">{selectedItemForDetail.name}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedItemForDetail.description}</p>
            </div>

            <div className="pt-3 border-t border-purple-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Kutu İçi Tahmini Değeri:</span>
              <span className="font-bold text-purple-900 font-serif text-sm">{selectedItemForDetail.price || 120} TL</span>
            </div>

            <button
              onClick={() => setSelectedItemForDetail(null)}
              className="w-full bg-purple-900 text-white font-bold text-xs py-3 rounded-xl hover:bg-purple-950 transition-colors"
            >
              Kutuya Geri Dön
            </button>
          </div>
        </div>
      )}

      {/* Standalone Full Page Footer - ONLY shown in modal mode, page mode has its own Footer */}
      {!isPage && (
        <footer className="bg-white border-t border-purple-100 py-6 text-center text-xs text-slate-500">
          <p>© 2026 Happinio - Kişiselleştirilmiş Hediye Platformu. Tüm Hakları Saklıdır.</p>
        </footer>
      )}

    </div>
  );
}

