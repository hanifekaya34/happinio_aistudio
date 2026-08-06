import React, { useState } from 'react';
import { AIRecommendationResponse, Product } from '../types';
import { PRODUCTS } from '../data/mockData';
import {
  Sparkles,
  ShoppingBag,
  X,
  Check,
  Edit2,
  Heart,
  RefreshCw,
  Trash2,
  Eye,
  Lightbulb,
  ArrowLeft,
  Share2,
  Gift,
  ChevronRight,
  Truck,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import HapyMascot from './HapyMascot';
import { getProducerBadge } from '../utils/producerHelpers';

interface AIRecommendationResultModalProps {
  result: AIRecommendationResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    boxTitle: string,
    items: Product[],
    price: number,
    giftNote?: string,
    recipientName?: string,
    senderName?: string,
    isAiGenerated?: boolean,
    rawAiResult?: AIRecommendationResponse
  ) => void;
  onQuickBuy: (
    boxTitle: string,
    items: Product[],
    price: number,
    giftNote?: string,
    recipientName?: string,
    senderName?: string,
    isAiGenerated?: boolean,
    rawAiResult?: AIRecommendationResponse
  ) => void;
  isPage?: boolean;
  onToggleSave?: () => void;
  isSaved?: boolean;
}

export default function AIRecommendationResultModal({
  result,
  isOpen,
  onClose,
  onAddToCart,
  onQuickBuy,
  isPage = false,
  onToggleSave,
  isSaved = false,
}: AIRecommendationResultModalProps) {
  if (!isOpen || !result) return null;

  const [items, setItems] = useState<Product[]>(result.matchedItems);
  const [recipientName, setRecipientName] = useState('Sevgili Dostum');
  const [senderName, setSenderName] = useState('');
  const [giftNote, setGiftNote] = useState(result.personalizedGiftNote);

  // Sync state whenever result changes
  React.useEffect(() => {
    if (result) {
      setItems(result.matchedItems);
      setGiftNote(result.personalizedGiftNote);

      const titleLower = (result.boxTitle || '').toLowerCase();
      if (titleLower.includes('yeğen') || titleLower.includes('yegen') || titleLower.includes('minik')) {
        setRecipientName('Canım Yeğenim');
      } else if (titleLower.includes('eşim') || titleLower.includes('esim')) {
        setRecipientName('Biricik Eşim');
      } else if (titleLower.includes('anne')) {
        setRecipientName('Canım Annem');
      } else if (titleLower.includes('öğretmen')) {
        setRecipientName('Değerli Öğretmenim');
      } else if (titleLower.includes('dost') || titleLower.includes('arkadaş')) {
        setRecipientName('Sevgili Dostum');
      } else {
        setRecipientName('Sevgiliye / Özel Biri');
      }
    }
  }, [result]);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteCardFont, setNoteCardFont] = useState<'serif' | 'sans' | 'handwriting'>('handwriting');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [swapTargetItem, setSwapTargetItem] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeAlternativeId, setActiveAlternativeId] = useState<number | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Reset active alternative detail when swapTargetItem changes
  React.useEffect(() => {
    setActiveAlternativeId(null);
    setShowMobileDetail(false);
  }, [swapTargetItem]);

  // Sanitize aiExplanation to strip any percentage or mechanical budget phrases
  const sanitizedExplanation = React.useMemo(() => {
    if (!result.aiExplanation) {
      return 'İstediğin konsept ve ilgi alanlarına özel, hediye alacağın kişiyi mutlu edecek en özel parçaları bir araya getirdik!';
    }
    let text = result.aiExplanation
      .replace(/toplam\s+tutar.*bütçenize.*%\d+(\.\d+)?.*(tam\s+uyum|uyum).*/gi, '')
      .replace(/bütçenize\s+%\d+(\.\d+)?\s*(oranında|oranında\s+tam\s+uyum|uyum).*/gi, '')
      .replace(/%\d+(\.\d+)?\s*(oranında|oranında\s+tam\s+uyum|uyum\s+sağlamaktadır|uyum)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text || text.length < 10) {
      return 'İstediğin konsept ve ilgi alanlarına özel, hediye alacağın kişiyi mutlu edecek en özel parçaları bir araya getirdik!';
    }
    return text;
  }, [result.aiExplanation]);

  const sampleNotes = [
    'İyi ki doğdun, iyi ki hayatımdasın! Gülümsemen hiç eksik olmasın. 🎁',
    'Senin kadar tatlı ve düşünceli küçük bir sürpriz! Keyifle kullanman dileğiyle. 💖',
    'Başarılarının devamını dilerim, seninle her zaman gurur duyuyorum! 🌟',
    'Aramızdaki mesafeler ne olursa olsun kalbim hep seninle. Sevgiyle kal! 🌸',
  ];

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleRemoveItem = (id: string) => {
    if (items.length <= 2) {
      alert('Hediye kutusunda en az 2 ürün bulunmalıdır.');
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSwapItem = (targetItem: Product) => {
    const currentIds = items.map((i) => i.id);
    const candidateProducts = PRODUCTS.filter((p) => !currentIds.includes(p.id));

    if (candidateProducts.length === 0) return;

    const sameCat = candidateProducts.filter((p) => p.category === targetItem.category);
    const replacement =
      sameCat.length > 0
        ? sameCat[Math.floor(Math.random() * sameCat.length)]
        : candidateProducts[Math.floor(Math.random() * candidateProducts.length)];

    setItems((prev) => prev.map((item) => (item.id === targetItem.id ? replacement : item)));
  };

  const getItemReasoning = (item: Product) => {
    const nameLower = item.name.toLowerCase();
    const catLower = item.category.toLowerCase();
    const tags = item.tags || [];
    const titleLower = (result?.boxTitle || '').toLowerCase();
    const explanationLower = (result?.aiExplanation || '').toLowerCase();

    const isKidRecipient =
      titleLower.includes('yeğen') ||
      titleLower.includes('yegen') ||
      titleLower.includes('minik') ||
      titleLower.includes('bebek') ||
      titleLower.includes('çocuk') ||
      explanationLower.includes('yeğen') ||
      explanationLower.includes('çocuk');

    const isGamerRecipient = titleLower.includes('oyuncu') || titleLower.includes('gamer') || titleLower.includes('oyun');
    const isDevRecipient = titleLower.includes('yazılımcı') || titleLower.includes('kod');
    const isArchitectRecipient = titleLower.includes('mimar');

    if (item.originCity) {
      return `${item.originCity} zanaatkarlarının özgün el emeği ve yerel dokusu göz önüne alınarak bu konsepte özel seçildi.`;
    }

    if (isKidRecipient) {
      if (tags.includes('pelus') || tags.includes('bebek') || nameLower.includes('tavşan') || nameLower.includes('oyuncak') || nameLower.includes('kedicik')) {
        return 'Minik yeğeninizin odasına ve oyun saatlerine neşe katacak, sarılmalık yumuşacık sevimli bir oyun arkadaşı.';
      }
      if (tags.includes('müzik kutusu') || nameLower.includes('müzik kutusu')) {
        return 'Miniklerin uykudan önce veya oyun arasında severek dinleyeceği masalsı melodi ve sevimli tasarım.';
      }
      if (catLower.includes('tatlı') || tags.includes('çikolata') || tags.includes('trüf') || tags.includes('lokum') || nameLower.includes('çikolata')) {
        return 'Çocukların bayılacağı, kutlamaya lezzet ve rengarenk neşe katacak leziz sürpriz atıştırmalık.';
      }
      if (tags.includes('sticker') || tags.includes('defter') || tags.includes('kalem')) {
        return 'Minik ellerin resim yaparken ve hayal dünyasını renklendirirken keyifle kullanacağı sevimli kırtasiye parçası.';
      }
      return `${item.name}, minik yeğeninizin yaş grubuna ve neşeli doğum günü ruhuna uygun sevimli bir sürpriz olarak eklendi.`;
    }

    if (isGamerRecipient) {
      if (catLower.includes('kupa') || tags.includes('kupa') || nameLower.includes('kupa')) {
        return 'Gece oyun seanslarında kahve ve içecek keyfini sıcak tutacak, gamer ruhuna tam uyan özel tasarım.';
      }
      if (catLower.includes('şaka') || tags.includes('komik') || tags.includes('sticker')) {
        return 'Oyun masasına ve yayın ortamına mizahi bir dokunuş katacak eğlenceli gamer detayı.';
      }
    }

    if (isDevRecipient || isArchitectRecipient) {
      if (catLower.includes('kitap') || tags.includes('defter') || tags.includes('planlayıcı')) {
        return 'Yoğun kodlama ve tasarım süreçlerinde fikirleri, çizimleri ve notları kaydetmek için ideal kaliteli masaüstü arkadaşı.';
      }
      if (catLower.includes('kahve') || tags.includes('kahve')) {
        return 'Uzun odaklanma ve proje saatlerinde enerji ve motivasyonu taze tutacak taze gurme kahve aroması.';
      }
    }

    if (tags.includes('pelus') || tags.includes('bebek') || nameLower.includes('tavşan') || nameLower.includes('oyuncak') || nameLower.includes('kedicik')) {
      return 'Yumuşacık dokusu ve sevimli tasarımıyla iç ısıtan tatlı bir sürpriz parça.';
    }
    if (tags.includes('müzik kutusu') || nameLower.includes('müzik kutusu')) {
      return 'Nostaljik melodisi ve sevimli tasarımıyla dinleyenlerin ruhunu dinlendirecek masalsı bir dokunuş.';
    }
    if (catLower.includes('kitap') || tags.includes('defter') || tags.includes('planlayıcı') || tags.includes('kalem') || nameLower.includes('defter')) {
      return 'Günün fikirlerini, planlarını ve özel anılarını keyifle kaydetmesi için tasarlanmış şık bir yazı arkadaşı.';
    }
    if (catLower.includes('kupa') || tags.includes('kupa') || tags.includes('termos') || nameLower.includes('kupa') || nameLower.includes('mug')) {
      return 'Gün içi kahve ve çay molalarını renklendirecek, her yudumda tebessüm ettirecek özel tasarım kupa.';
    }
    if (tags.includes('mum') || tags.includes('lavanta') || tags.includes('bitki çayı') || nameLower.includes('mum')) {
      return 'Huzurlu ve sakin bir ortam yaratarak dinlenme saatlerine sıcacık bir koku ve atmosfer katması için seçildi.';
    }
    if (catLower.includes('tatlı') || catLower.includes('atıştırmalık') || tags.includes('çikolata') || tags.includes('lokum') || tags.includes('trüf') || nameLower.includes('çikolata')) {
      return 'Kutuya nefis bir tatlılık ve damak çatlatan gurme bir kutlama lezzeti katmak amacıyla eklendi.';
    }
    if (catLower.includes('şaka') || tags.includes('komik') || tags.includes('çorap') || tags.includes('sticker') || nameLower.includes('çorap')) {
      return 'Konsepte eğlenceli, esprili ve neşeli bir dokunuş katarak yüzlerde kocaman bir tebessüm oluşturması için eklendi.';
    }
    if (catLower.includes('kahve') || tags.includes('kahve') || nameLower.includes('kahve')) {
      return 'Taze çekilmiş gurme aromasıyla sohbetlere ve tazeleyici molalara lezzet katmak için seçildi.';
    }
    if (catLower.includes('seramik') || tags.includes('seramik')) {
      return 'El yapımı estetik seramik dokusu ve zarafetiyle ortama ve masaya şıklık katması için eklendi.';
    }
    return `${item.name}, hediye konseptinizin zarafetini ve özel duygusunu tamamlayan özenli bir parça olarak seçildi.`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddBoxToCart = () => {
    onAddToCart(result.boxTitle, items, totalPrice, giftNote, recipientName, senderName, true, result);
    if (!isPage) {
      onClose();
    }
  };

  const handleBuyNow = () => {
    onQuickBuy(result.boxTitle, items, totalPrice, giftNote, recipientName, senderName, true, result);
    if (!isPage) {
      onClose();
    }
  };

  const MainElement = isPage ? 'div' : 'main';

  return (
    <div className={isPage ? "w-full bg-[#FAF7F2] animate-fadeIn" : "fixed inset-0 z-50 bg-[#FAF7F2] overflow-y-auto flex flex-col min-h-screen w-screen animate-fadeIn"}>
      
      {/* Grand Full Page Sticky Navigation Header */}
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
              <span className="font-serif font-black text-lg text-purple-900 tracking-tight">Happinio AI</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                Sürpriz Atölyesi
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-900 bg-white hover:bg-purple-50 px-3 py-2 rounded-xl border border-purple-200 transition-all shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden sm:inline">{copiedLink ? 'Kopyalandı! ✓' : 'Paylaş'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      {/* Main Container - Grand Full Page Layout */}
      <MainElement className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        
        {/* Breadcrumb Path */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/40 p-4 rounded-3xl border border-purple-100/60 shadow-3xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto pb-1 no-scrollbar">
            <span className="hover:text-purple-800 cursor-pointer" onClick={onClose}>
              Ana Sayfa
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hover:text-purple-800 cursor-pointer" onClick={onClose}>
              Joy-Genie AI Atölyesi
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-purple-900 font-bold truncate max-w-xs">{result.boxTitle}</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onToggleSave && (
              <button
                onClick={onToggleSave}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer shadow-3xs ${
                  isSaved
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/60'
                    : 'bg-white text-slate-700 hover:text-purple-900 border-purple-200 hover:bg-purple-50'
                }`}
                title={isSaved ? 'Favorilerden Çıkar' : 'Öneriyi Favorilerine Kaydet'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
                <span>{isSaved ? 'Joy-Genie Tasarımı Kaydedildi! ✓' : 'Joy-Genie Tasarımını Kaydet'}</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-900 bg-white hover:bg-purple-50 px-3.5 py-2.5 rounded-xl border border-purple-200 transition-all shadow-3xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-700" />
              <span>{copiedLink ? 'Kopyalandı! ✓' : 'Paylaş'}</span>
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="bg-gradient-to-r from-purple-50/90 via-pink-50/40 to-purple-50/90 p-4 sm:p-5 rounded-3xl border border-purple-200/60 shadow-xs flex items-start gap-3.5 animate-fadeIn text-left">
            <Sparkles className="w-5 h-5 text-purple-700 fill-amber-300 animate-pulse shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-black text-purple-950 uppercase tracking-wider">Tasarımınız Bu Tarayıcıya Kaydedildi! ✨</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Giriş yapmamış olsanız dahi, bu sihirli kutuya her zaman <strong>Ana Sayfa'daki özel Joy-Genie bölümünden</strong> veya sağ üstteki <strong>Giriş / Üye Ol (Profil)</strong> ikonuna tıklayarak bu tarayıcıdan dilediğiniz zaman ulaşabilirsiniz. Kalıcı olarak tüm cihazlarınızda saklamak isterseniz profil kısmından saniyeler içinde ücretsiz üye olabilirsiniz.
              </p>
            </div>
          </div>
        )}

        {/* Hero Banner Box Header */}
        <div className="bg-purple-900 rounded-[36px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-start gap-4 sm:gap-5 relative z-10">
            <div className="p-1 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shrink-0">
              <HapyMascot size="md" level="Süper Happinio" showEvolutionBadge={false} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[11px] font-bold px-3 py-1 rounded-full mb-2.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>{result.tagline}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-white leading-tight">
                {result.boxTitle}
              </h1>
              <p className="text-xs sm:text-sm text-purple-200 mt-2 max-w-2xl font-normal leading-relaxed">
                {sanitizedExplanation}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 w-full md:w-72 md:min-w-64 shrink-0 text-center space-y-2 relative z-10 flex flex-col items-center justify-center">
            <span className="text-xs text-purple-200 block whitespace-nowrap">Sihirli Kutu Fiyatı</span>
            <div className="text-3xl sm:text-4xl font-black font-serif text-white whitespace-nowrap">{totalPrice} TL</div>
            <span className="text-[11px] text-emerald-300 font-bold bg-emerald-950/60 px-3 py-1 rounded-full inline-block border border-emerald-500/30 whitespace-nowrap">
              Ücretsiz Kargo Dahil
            </span>
          </div>
        </div>

        {/* Two Column Layout: Gift Note & Order Summary Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: AI Gift Note Card */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[36px] border border-purple-200/80 shadow-md space-y-5">
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&display=swap');
            `}</style>
            
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-700 fill-purple-700" />
                <h3 className="text-sm sm:text-base font-bold text-purple-950 uppercase tracking-wider font-serif">
                  Kutu İçin Özel Hazırlanan Hediye Not Kartı 🌸
                </h3>
              </div>
            </div>

            {/* Note Display View */}
            <div className="bg-gradient-to-r from-purple-50/60 via-amber-50/30 to-purple-50/60 p-5 rounded-3xl border border-purple-200/80 shadow-inner space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-700 border-b border-purple-200/60 pb-2.5">
                <span>Alıcı: <span className="text-purple-900 font-serif text-sm">{recipientName}</span></span>
                {senderName && <span>Gönderen: <span className="text-purple-900 font-serif text-sm">{senderName}</span></span>}
              </div>

              <p 
                className={`leading-relaxed text-slate-800 ${
                  noteCardFont === 'serif' ? 'font-serif text-base sm:text-lg' : noteCardFont === 'handwriting' ? 'text-lg sm:text-2xl text-purple-950 font-normal' : 'font-sans text-sm sm:text-base'
                }`}
                style={noteCardFont === 'handwriting' ? { fontFamily: "'Caveat', 'Dancing Script', 'Brush Script MT', cursive" } : undefined}
              >
                "{giftNote}"
              </p>

              {/* "Hediye Kartını Düzenle" Button at the bottom of the card */}
              <div className="flex justify-end pt-2 border-t border-purple-100/40">
                <button
                  type="button"
                  onClick={() => setIsEditingNote(!isEditingNote)}
                  className="text-xs font-bold text-purple-900 bg-white hover:bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-purple-700" />
                  <span>{isEditingNote ? 'Tamamla' : 'Hediye Kartını Düzenle'}</span>
                </button>
              </div>
            </div>

            {/* Editable Controls when open */}
            {isEditingNote && (
              <div className="pt-2 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Kart Yazı Tipi Stili:</span>
                  <div className="flex items-center gap-1 text-xs font-semibold bg-[#FAF7F2] p-1 rounded-xl border border-purple-200">
                    <button
                      type="button"
                      onClick={() => setNoteCardFont('handwriting')}
                      className={`px-3 py-1 rounded-lg transition-all ${noteCardFont === 'handwriting' ? 'bg-purple-900 text-white italic font-serif' : 'text-slate-600'}`}
                    >
                      El Yazısı
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteCardFont('serif')}
                      className={`px-3 py-1 rounded-lg transition-all ${noteCardFont === 'serif' ? 'bg-purple-900 text-white font-serif' : 'text-slate-600'}`}
                    >
                      Klasik
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kime (Alıcı İsmi):</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl bg-[#FAF7F2] border border-purple-200 text-slate-800 font-medium focus:outline-hidden focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kimden (Gönderen İsmi):</label>
                    <input
                      type="text"
                      placeholder="İsminiz"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl bg-[#FAF7F2] border border-purple-200 text-slate-800 font-medium focus:outline-hidden focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Joy-Genie Hazır Not Önerileri:</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {sampleNotes.map((sNote, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGiftNote(sNote)}
                        className="text-xs bg-[#FAF7F2] hover:bg-purple-100 text-slate-700 hover:text-purple-900 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors text-left truncate max-w-full cursor-pointer"
                      >
                        "{sNote.slice(0, 35)}..."
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={giftNote}
                    onChange={(e) => {
                      if (e.target.value.length <= 250) setGiftNote(e.target.value);
                    }}
                    rows={3}
                    maxLength={250}
                    className="w-full text-xs p-3.5 rounded-xl bg-[#FAF7F2] border border-purple-200 text-slate-800 font-serif leading-relaxed focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Action CTA Box */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[36px] border border-purple-200/80 shadow-md space-y-5 sticky top-24">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                Sipariş Özeti
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-purple-900 font-serif">{totalPrice} TL</span>
                <span className="text-xs text-slate-500 font-medium">({items.length} Parça Dahil)</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddBoxToCart}
                className="w-full bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Sepetime Ekle</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Hemen Ödemeye Geç ⚡</span>
              </button>
            </div>

            <div className="pt-4 border-t border-purple-100 space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Aynı Gün Özel Hediye Kargo Çıkışı</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>256-Bit SSL Korumalı Güvenli Ödeme</span>
              </div>
            </div>
          </div>

        </div>

        {/* Matched Products Detailed Cards */}
        <div className="bg-white p-6 sm:p-10 rounded-[36px] border border-purple-200/80 shadow-md space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-purple-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                Seçilen Ürün Eşleşmeleri
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-2">
                Kutudaki Parçalar ve Seçim Nedenleri ({items.length} Parça)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => {
              const itemProducerBadge = getProducerBadge(item);
              return (
                <div
                  key={item.id}
                  className="bg-[#FAF7F2] p-5 rounded-3xl border border-purple-100 flex flex-col justify-between group hover:border-purple-300 transition-all space-y-4 shadow-2xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-purple-200 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                          {item.category}
                        </span>
                        <span className="font-serif font-black text-purple-900 text-base">{item.price} TL</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 font-serif mt-1.5">{item.name}</h4>
                      {itemProducerBadge && (
                        <span className="inline-block text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 mt-1">
                          {itemProducerBadge}
                        </span>
                      )}
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                {/* "Neden Seçildi?" Reasoning Container - Uncut, Full Text View */}
                <div className="bg-[#F5EFFB] p-3.5 rounded-2xl border border-purple-200/80 text-xs text-purple-950 flex items-start gap-3 shadow-2xs leading-relaxed">
                  <Lightbulb className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-purple-900 block mb-0.5">Neden Seçildi?</span>
                    <p className="text-slate-700 text-xs leading-relaxed font-normal">
                      {getItemReasoning(item)}
                    </p>
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-purple-100/80">
                  <button
                    type="button"
                    onClick={() => setSwapTargetItem(item)}
                    className="text-xs font-bold text-slate-700 hover:text-purple-900 bg-white hover:bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    title="Bu parçayı farklı bir öneriyle değiştir"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-700" />
                    <span>Farklı Bir Ürünle Değiştir</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProductDetail(item)}
                      className="text-xs font-bold text-purple-900 hover:underline flex items-center gap-1 px-2.5 py-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Kutudan Çıkar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

      </MainElement>

      {/* Product Detail Sub-Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 relative border border-purple-200 shadow-2xl text-left space-y-4">
            <button
              type="button"
              onClick={() => setSelectedProductDetail(null)}
              className="absolute top-4 right-4 p-1.5 bg-white text-slate-600 rounded-full hover:bg-slate-100 border border-purple-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider inline-block border border-purple-200">
              {selectedProductDetail.category}
            </span>

            <img
              src={selectedProductDetail.image}
              alt={selectedProductDetail.name}
              referrerPolicy="no-referrer"
              className="w-full h-56 object-cover rounded-2xl border border-purple-200 shadow-xs"
            />

            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">{selectedProductDetail.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">{selectedProductDetail.description}</p>
            </div>

            <div className="pt-3 border-t border-purple-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Ürün Fiyatı:</span>
              <span className="font-bold text-purple-900 font-serif text-sm">{selectedProductDetail.price} TL</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProductDetail(null)}
              className="w-full bg-purple-900 text-white font-bold text-xs py-3 rounded-xl hover:bg-purple-950 transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Product Swap / Alternative Selector Modal */}
      {swapTargetItem && (() => {
        const currentIds = items.map((i) => i.id);
        
        // Same category alternatives
        const sameCategory = PRODUCTS.filter(
          (p) => p.category === swapTargetItem.category && !currentIds.includes(p.id) && p.inStock
        );
        
        // Theme-aligned alternatives
        const themeAligned = PRODUCTS.filter(
          (p) => 
            p.boxTypes.includes(result.suggestedBoxCategory) && 
            p.category !== swapTargetItem.category && 
            !currentIds.includes(p.id) && 
            p.inStock
        );
        
        // Others as fallback
        const others = PRODUCTS.filter(
          (p) => 
            p.category !== swapTargetItem.category && 
            !p.boxTypes.includes(result.suggestedBoxCategory) && 
            !currentIds.includes(p.id) && 
            p.inStock
        );

        const candidates = [
          ...sameCategory.map((p) => ({
            ...p,
            reason: 'Aynı Kategori Alternatifi',
            score: 98,
          })),
          ...themeAligned.map((p) => ({
            ...p,
            reason: 'Konseptle Uyumlu Seçenek',
            score: 92,
          })),
          ...others.map((p) => ({
            ...p,
            reason: 'Uyumlu Alternatif',
            score: 85,
          })),
        ].slice(0, 8);

        const activeCandidate = candidates.find((c) => c.id === activeAlternativeId) || candidates[0];

        return (
          <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#FAF7F2] rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-purple-200 shadow-2xl overflow-hidden text-left animate-scaleIn">
              {/* Header */}
              <div className="p-5 border-b border-purple-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-700 animate-pulse" />
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Alternatif Ürün Seçenekleri & Detayları
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSwapTargetItem(null)}
                  className="p-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Item Overview */}
              <div className="px-5 py-3 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={swapTargetItem.image}
                    alt={swapTargetItem.name}
                    className="w-10 h-10 object-cover rounded-lg border border-purple-200 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-purple-800 font-bold block">{swapTargetItem.category}</span>
                    <span className="font-bold text-slate-800 line-clamp-1">{swapTargetItem.name}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-500 block text-[10px]">Değişecek Ürün Fiyatı</span>
                  <span className="font-black text-purple-900">{swapTargetItem.price} TL</span>
                </div>
              </div>

              {/* Split Interactive Panel */}
              <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Left Column: Candidates list */}
                <div className={`flex-1 md:flex-none md:w-7/12 flex flex-col overflow-y-auto p-5 space-y-3.5 ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hediye konseptinizle en uyumlu alternatif ürünler aşağıda listelenmiştir. Detaylarını görmek için <strong>ürün kartlarına tıklayabilirsiniz:</strong>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                    {candidates.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-slate-400 text-xs font-medium">
                        Uyumlu başka alternatif ürün bulunamadı.
                      </div>
                    ) : (
                      candidates.map((candidate) => {
                        const isSelected = activeCandidate && activeCandidate.id === candidate.id;
                        const priceDiff = candidate.price - swapTargetItem.price;
                        const priceDiffText = priceDiff === 0 
                          ? 'Fiyat farkı yok' 
                          : priceDiff > 0 
                            ? `+${priceDiff} TL fark` 
                            : `${priceDiff} TL indirimli`;

                        return (
                          <div
                            key={candidate.id}
                            onClick={() => {
                              setActiveAlternativeId(candidate.id);
                              setShowMobileDetail(true);
                            }}
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 relative overflow-hidden group shadow-2xs cursor-pointer select-none ${
                              isSelected 
                                ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-300/20' 
                                : 'bg-white border-slate-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex gap-2.5">
                              <img
                                src={candidate.image}
                                alt={candidate.name}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                              />
                              <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="text-[8px] font-bold text-purple-800 bg-purple-100/60 px-1.5 py-0.5 rounded border border-purple-200/40">
                                    {candidate.reason}
                                  </span>
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded shrink-0">
                                    %{candidate.score} Uyum
                                  </span>
                                </div>
                                <h4 className="text-[11px] font-bold text-slate-800 truncate font-serif">{candidate.name}</h4>
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{candidate.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto text-xs" onClick={(e) => e.stopPropagation()}>
                              <div className="text-left">
                                <span className="font-black text-purple-950 block leading-none">{candidate.price} TL</span>
                                <span className="text-[9px] text-slate-500 font-medium">{priceDiffText}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setItems((prev) => prev.map((item) => (item.id === swapTargetItem.id ? candidate : item)));
                                  setSwapTargetItem(null);
                                }}
                                className="text-[10px] font-bold text-white bg-purple-900 hover:bg-purple-950 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Seç
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Detailed View */}
                <div className={`flex-1 md:w-5/12 bg-white border-l border-purple-100 p-6 flex flex-col justify-between overflow-y-auto ${showMobileDetail ? 'flex' : 'hidden md:flex'}`}>
                  {activeCandidate ? (
                    <div className="space-y-4 text-left flex-1 flex flex-col">
                      {/* Mobile Back Button */}
                      <button
                        type="button"
                        onClick={() => setShowMobileDetail(false)}
                        className="md:hidden flex items-center gap-1.5 text-xs text-purple-900 font-bold hover:underline mb-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Alternatif Listesine Geri Dön</span>
                      </button>

                      <div className="space-y-3.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full uppercase tracking-wider border border-purple-200">
                            {activeCandidate.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                            <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                            <span>%{activeCandidate.score} Uyum Oranı</span>
                          </span>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-purple-100 shadow-xs">
                          <img
                            src={activeCandidate.image}
                            alt={activeCandidate.name}
                            className="w-full h-40 object-cover"
                          />
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 font-serif leading-snug">
                            {activeCandidate.name}
                          </h4>
                          <div className="text-sm font-black text-purple-950">
                            {activeCandidate.price} TL
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-purple-50">
                          <span className="text-[10px] font-extrabold text-purple-900/80 uppercase tracking-wider block">Ürün Açıklaması</span>
                          <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-purple-100/50">
                            {activeCandidate.description}
                          </p>
                        </div>

                        {/* Price Change Calculation */}
                        {(() => {
                          const priceDiff = activeCandidate.price - swapTargetItem.price;
                          return (
                            <div className="p-3 rounded-xl text-xs bg-slate-50 border border-slate-200 space-y-1">
                              <span className="font-bold text-slate-800 block">Kutu Fiyat Değişimi:</span>
                              <p className="text-slate-600 leading-normal text-[11px]">
                                Mevcut ürün yerine bu alternatifi seçtiğinizde kutunuzun toplam fiyatı{' '}
                                <strong>
                                  {priceDiff === 0 
                                    ? 'aynı kalacaktır.' 
                                    : priceDiff > 0 
                                      ? `${priceDiff} TL artacaktır.` 
                                      : `${Math.abs(priceDiff)} TL azalacaktır.`}
                                </strong>
                              </p>
                            </div>
                          );
                        })()}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setItems((prev) => prev.map((item) => (item.id === swapTargetItem.id ? activeCandidate : item)));
                          setSwapTargetItem(null);
                        }}
                        className="w-full bg-purple-900 text-white font-bold text-xs py-3 rounded-xl hover:bg-purple-950 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 mt-4 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                        <span>Bu Ürünü Seç ve Kutuyu Güncelle</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-6 space-y-2">
                      <Lightbulb className="w-8 h-8 text-slate-300 animate-bounce" />
                      <p className="text-xs font-medium">Detaylarını görmek istediğiniz alternatif ürünü soldaki listeden seçebilirsiniz.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSwapTargetItem(null)}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Standalone Full Page Footer */}
      {!isPage && (
        <footer className="bg-white border-t border-purple-100 py-6 text-center text-xs text-slate-500">
          <p>© 2026 Happinio AI - Kişiselleştirilmiş Hediye Sürpriz Atölyesi. Tüm Hakları Saklıdır.</p>
        </footer>
      )}

    </div>
  );
}

