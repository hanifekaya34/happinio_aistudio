import React, { useState } from 'react';
import {
  Product,
  GiftBox,
  CartItem,
  Order,
  UserProfile,
  CitySuggestion,
  Review,
  AIRecommendationResponse,
  SubscriptionPlan,
} from './types';
import {
  INITIAL_USER_PROFILE,
  GIFT_BOXES,
  CITY_SUGGESTIONS,
  CUSTOMER_REVIEWS,
} from './data/mockData';
import { Language, translations } from './i18n/translations';
import { generateAIGiftBox } from './utils/aiGenerator';

// Components
import SEOHead from './components/SEOHead';
import Navbar from './components/Navbar';
import HeroPromptSection from './components/HeroPromptSection';
import BoxCatalog from './components/BoxCatalog';
import CityContributionSection from './components/CityContributionSection';
import SubscriptionSection from './components/SubscriptionSection';
import DownloadableArtSection from './components/DownloadableArtSection';
import ReviewsPage from './components/ReviewsPage';
import StoryPage from './components/StoryPage';
import ContactPage from './components/ContactPage';
import CommunityCustomBoxShowcase from './components/CommunityCustomBoxShowcase';
import SuggestProductPage from './components/SuggestProductPage';
import OccasionCalendarSection from './components/OccasionCalendarSection';
import ProducersPage from './components/ProducersPage';
import ProducersBannerSection from './components/ProducersBannerSection';
import Footer from './components/Footer';

// Modals & Drawers
import AILoadingModal from './components/AILoadingModal';
import AIRecommendationResultModal from './components/AIRecommendationResultModal';
import BoxDetailModal from './components/BoxDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import UserProfileModal from './components/UserProfileModal';
import AboutUsModal from './components/AboutUsModal';
import FAQModal from './components/FAQModal';
import ContactModal from './components/ContactModal';
import PrivacyTermsModal from './components/PrivacyTermsModal';
import SalesAgreementModal from './components/SalesAgreementModal';
import ReturnPolicyModal from './components/ReturnPolicyModal';

// Icons for Home view highlights
import { Sparkles, Heart, ArrowRight, Gift, ShieldCheck, Star, ArrowUp, MessageCircle } from 'lucide-react';

export default function App() {
  // Navigation & Language State
  const [currentView, setCurrentView] = useState<string>('home');
  const [lang, setLang] = useState<Language>('tr');

  // Global Data State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [boxes, setBoxes] = useState<GiftBox[]>(GIFT_BOXES);
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>(CITY_SUGGESTIONS);
  const [reviews, setReviews] = useState<Review[]>(CUSTOMER_REVIEWS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Persistent Saved AI Recommendations
  const [savedAiRecommendations, setSavedAiRecommendations] = useState<AIRecommendationResponse[]>([]);

  // Determine dynamic storage key
  const storageKey = user.isLoggedIn && user.email 
    ? `saved_ai_recommendations_${user.email.toLowerCase()}` 
    : 'saved_ai_recommendations_guest';

  // Load from dynamic key whenever user logs in / logs out
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setSavedAiRecommendations(saved ? JSON.parse(saved) : []);
    } catch (err) {
      console.error('Failed to load user-specific AI recommendations:', err);
    }
  }, [storageKey]);

  // Save to dynamic key whenever savedAiRecommendations or storageKey changes
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedAiRecommendations));
    } catch (err) {
      console.error('Failed to save AI recommendations:', err);
    }
  }, [savedAiRecommendations, storageKey]);

  // Merge guest recommendations on login/register
  React.useEffect(() => {
    if (user.isLoggedIn && user.email) {
      const userKey = `saved_ai_recommendations_${user.email.toLowerCase()}`;
      try {
        const guestSavedRaw = localStorage.getItem('saved_ai_recommendations_guest');
        const guestSaved: AIRecommendationResponse[] = guestSavedRaw ? JSON.parse(guestSavedRaw) : [];
        if (guestSaved.length > 0) {
          const userSavedRaw = localStorage.getItem(userKey);
          const userSaved: AIRecommendationResponse[] = userSavedRaw ? JSON.parse(userSavedRaw) : [];
          
          // Merge unique recommendations by boxTitle
          const merged = [...userSaved];
          guestSaved.forEach((guestRec) => {
            if (!merged.some((m) => m.boxTitle === guestRec.boxTitle)) {
              merged.push(guestRec);
            }
          });
          
          localStorage.setItem(userKey, JSON.stringify(merged));
          setSavedAiRecommendations(merged);
          
          // Clear guest recommendations so they don't leak to other logged out / logged in users!
          localStorage.removeItem('saved_ai_recommendations_guest');
        }
      } catch (err) {
        console.error('Error merging guest saved designs on login:', err);
      }
    }
  }, [user.isLoggedIn, user.email]);

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIRecommendationResponse | null>(null);

  // Modals Visibility States
  const [isAiResultModalOpen, setIsAiResultModalOpen] = useState(false);
  const [selectedBoxForDetail, setSelectedBoxForDetail] = useState<GiftBox | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'orders' | 'favorites' | 'reviews' | 'points' | 'downloads' | 'settings'>('orders');

  const handleOpenProfileWithTab = (tab: 'orders' | 'favorites' | 'reviews' | 'points' | 'downloads' | 'settings' = 'orders') => {
    setProfileInitialTab(tab);
    setIsProfileOpen(true);
  };
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSalesAgreementOpen, setIsSalesAgreementOpen] = useState(false);
  const [isReturnPolicyOpen, setIsReturnPolicyOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [producerFilter, setProducerFilter] = useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check URL search parameters on initial load (e.g., ?box=box-1 for new tab view)
  const [reviewsSearchQuery, setReviewsSearchQuery] = useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const boxParam = params.get('box');
    if (boxParam) {
      const foundBox = boxes.find((b) => b.id === boxParam);
      if (foundBox) {
        setSelectedBoxForDetail(foundBox);
        setCurrentView('box-detail');
      }
    }
    const viewParam = params.get('view');
    const boxNameParam = params.get('boxName');
    if (viewParam === 'reviews') {
      setCurrentView('reviews');
      if (boxNameParam) {
        setReviewsSearchQuery(boxNameParam);
      }
    }
  }, [boxes]);

  // Navigate to page view
  const handleNavigateView = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Box for Detail View
  const handleSelectBoxForDetail = (box: GiftBox) => {
    setSelectedBoxForDetail(box);
    setCurrentView('box-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Language
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  // AI Recommendation Trigger
  const handleGenerateAIBox = async (promptText: string, budget?: number) => {
    setIsAiLoading(true);

    try {
      const data = await generateAIGiftBox(promptText, budget);
      setIsAiLoading(false);

      if (data && data.boxTitle && data.matchedItems) {
        setAiResult(data);
        setCurrentView('ai-result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(
          lang === 'tr'
            ? 'Yapay zeka önerisi oluşturulurken bir aksaklık oldu. Lütfen tekrar deneyin.'
            : 'An issue occurred while curating AI recommendations. Please try again.'
        );
      }
    } catch (error) {
      console.error('AI Recommendation failed:', error);
      setIsAiLoading(false);
      alert(
        lang === 'tr'
          ? 'Yapay zeka önerisi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
          : 'Could not create AI recommendation. Please try again.'
      );
    }
  };

  // Toggle Favorite Box
  const handleToggleFavorite = (boxId: string) => {
    if (!user || !user.isLoggedIn) {
      alert(
        lang === 'tr'
          ? 'Favorileme işlemi yapabilmek için lütfen giriş yapın veya üye olun.'
          : 'Please log in or register to add items to your favorites.'
      );
      setIsProfileOpen(true);
      return;
    }

    setFavorites((prev) =>
      prev.includes(boxId) ? prev.filter((id) => id !== boxId) : [...prev, boxId]
    );
  };

  // Toggle Save Recommendation
  const handleToggleSaveRecommendation = (rec: AIRecommendationResponse) => {
    setSavedAiRecommendations((prev) => {
      const exists = prev.some((item) => item.boxTitle === rec.boxTitle);
      if (exists) {
        return prev.filter((item) => item.boxTitle !== rec.boxTitle);
      } else {
        return [...prev, rec];
      }
    });
  };

  // View AI Recommendation Result
  const handleViewAiResult = (result: AIRecommendationResponse) => {
    setAiResult(result);
    handleNavigateView('ai-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const handleAddToCart = (
    boxTitle: string,
    items: Product[],
    price: number,
    giftNote?: string,
    recipientName?: string,
    senderName?: string,
    isAiGenerated: boolean = false,
    rawAiResult?: AIRecommendationResponse,
    boxId?: string
  ) => {
    const matchedBox = boxes.find(
      (b) =>
        (boxId && b.id === boxId) ||
        b.name === boxTitle ||
        b.name.toLowerCase() === boxTitle.toLowerCase() ||
        boxTitle.toLowerCase().includes(b.name.toLowerCase()) ||
        b.name.toLowerCase().includes(boxTitle.toLowerCase())
    );

    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random()}`,
      boxId: boxId || matchedBox?.id,
      title: boxTitle,
      price,
      quantity: 1,
      image: matchedBox?.image || items[0]?.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80',
      items,
      giftNote,
      recipientName,
      senderName,
      isAiGenerated,
      rawAiResult: isAiGenerated
        ? (rawAiResult || (aiResult && aiResult.boxTitle === boxTitle ? aiResult : undefined))
        : undefined,
    };

    setCart((prev) => [...prev, newItem]);
    handleNavigateView('cart');
  };

  const handleQuickAddToCart = (box: GiftBox) => {
    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random()}`,
      boxId: box.id,
      title: box.name,
      price: box.discountPrice || box.price,
      quantity: 1,
      image: box.image,
      items: box.items,
      isAiGenerated: false,
    };

    setCart((prev) => [...prev, newItem]);
    handleNavigateView('cart');
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));
  };

  const handleUpdateCartGiftNote = (id: string, note: string) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, giftNote: note } : i)));
  };

  const handleViewCartItemDetail = (item: CartItem) => {
    setIsCartOpen(false);
    if (item.isAiGenerated && item.rawAiResult) {
      handleViewAiResult(item.rawAiResult);
    } else {
      let foundBox = boxes.find(
        (b) =>
          (item.boxId && b.id === item.boxId) ||
          b.name === item.title ||
          b.name.toLowerCase() === item.title.toLowerCase() ||
          item.title.toLowerCase().includes(b.name.toLowerCase()) ||
          b.name.toLowerCase().includes(item.title.toLowerCase())
      );

      if (!foundBox) {
        foundBox = {
          id: item.boxId || item.id,
          name: item.title,
          category: 'custom',
          price: item.price,
          image: item.image,
          description: 'Happinio özel hediye kutusu koleksiyonu parçası.',
          items: item.items || [],
          tags: ['Özel Kutular'],
          rating: 5.0,
          reviewCount: 12,
        };
      }
      handleSelectBoxForDetail(foundBox);
    }
  };

  // City Suggestion Submission
  const handleSubmitCitySuggestion = (
    cityName: string,
    countryName: string,
    productName: string,
    category: string,
    description: string
  ) => {
    const newSug: CitySuggestion = {
      id: `sug_${Date.now()}`,
      cityName,
      countryName,
      productName,
      category,
      description,
      suggestedBy: user.name,
      pointsAwarded: 100,
      status: 'approved',
      date: 'Bugün',
    };

    setCitySuggestions((prev) => [newSug, ...prev]);

    setUser((prev) => ({
      ...prev,
      points: prev.points + 100,
      monthlySuggestionsCount: prev.monthlySuggestionsCount + 1,
    }));
  };

  // Helper for awarding points across modules
  const handleAwardPoints = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      points: prev.points + amount,
    }));
  };

  // Add Review
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const fullReview: Review = {
      ...newReviewData,
      id: `rev_${Date.now()}`,
      date: 'Bugün',
      likes: 1,
    };
    setReviews((prev) => [fullReview, ...prev]);
    // Award +10 Happinio points for review
    handleAwardPoints(10);
  };

  // Subscription Plan Select
  const handleSelectSubscriptionPlan = (plan: SubscriptionPlan) => {
    handleAddToCart(
      `Happinio Kulübü Aboneliği (${plan.name})`,
      [],
      plan.priceMonthly,
      'Aylık Sürpriz Tematik Hediye Aboneliği',
      user.name,
      'Happinio Club'
    );
  };

  // Order Completed
  const handleOrderCompleted = (order: Order) => {
    setUser((prev) => ({
      ...prev,
      orders: [order, ...prev.orders],
      points: prev.points + Math.floor(order.totalAmount / 10),
    }));
    setCart([]);
  };

  const cartTotalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Newsletter Subscription Handler
  const handleSubscribeNewsletter = (email: string) => {
    setUser((prev) => ({
      ...prev,
      email: prev.email || email,
      isSubscribedToNewsletter: true,
    }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-pink-100 selection:text-pink-900">
      
      {/* SEO Head */}
      <SEOHead
        title="Happinio | Kişiselleştirilmiş Hediye & Sürpriz Dünyası"
        description="Samimi ve özenle paketlenmiş hediye kutuları. Akıllı Joy-Genie önerileri, yerel zanaatkâr ürünleri ve aylık sürpriz kulübü."
      />

      {/* Header & Navigation */}
      <Navbar
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        cartTotal={cartTotalAmount}
        favoritesCount={favorites.length}
        lang={lang}
        currentView={currentView}
        onNavigateView={handleNavigateView}
        onToggleLang={handleToggleLang}
        onOpenCart={() => handleNavigateView('cart')}
        onOpenFavorites={() => setIsProfileOpen(true)}
        onOpenOrderTracking={() => setIsTrackingOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCitySuggestion={() => handleNavigateView('city-boxes')}
      />

      {/* Main Multi-Page View Switcher */}
      <main>
        {currentView === 'home' && (
          <div className="animate-fadeIn">
            {/* Uncluttered Hero Prompt Section */}
            <HeroPromptSection
              onGenerateAIBox={handleGenerateAIBox}
              isLoading={isAiLoading}
              lang={lang}
            />

            {/* Saved AI Recommendations List */}
            {savedAiRecommendations.length > 0 && (
              <section className="py-12 bg-gradient-to-r from-purple-50/50 via-pink-50/25 to-purple-50/50 border-t border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
                  <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-purple-200/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-700 animate-pulse shrink-0" />
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-purple-950">
                        {lang === 'tr' ? 'Joy-Genie Özel Tasarımların' : 'Your Joy-Genie Custom Designs'} ({savedAiRecommendations.length})
                      </h3>
                    </div>
                    <span className="text-[10px] font-extrabold text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 uppercase tracking-wider">
                      {lang === 'tr' ? 'Yapay Zeka Sihriyle Kaydedildi' : 'Saved with AI Magic'} ✨
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedAiRecommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-[32px] border border-purple-100/80 hover:border-purple-300 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group relative overflow-hidden text-left"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/30 rounded-full blur-xl pointer-events-none"></div>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[9px] font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 inline-flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
                              <span>{rec.tagline}</span>
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSaveRecommendation(rec);
                              }}
                              className="p-1.5 rounded-full hover:bg-rose-50 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                              title={lang === 'tr' ? 'Tasarımı Sil' : 'Remove Design'}
                            >
                              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                            </button>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-slate-800 font-serif leading-snug line-clamp-1">
                              {rec.boxTitle}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {rec.aiExplanation}
                            </p>
                          </div>

                          <div className="flex gap-2 overflow-x-auto py-1.5 no-scrollbar border-t border-b border-purple-50">
                            {rec.matchedItems.slice(0, 4).map((item) => (
                              <img
                                key={item.id}
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-xl object-cover border border-purple-100 shrink-0"
                              />
                            ))}
                            {rec.matchedItems.length > 4 && (
                              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 border border-purple-100 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                                +{rec.matchedItems.length - 4}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-purple-50 flex items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{lang === 'tr' ? 'Kutu Fiyatı' : 'Box Price'}</span>
                            <span className="text-lg font-black text-purple-900 font-serif">{rec.totalPrice} TL</span>
                          </div>
                          <button
                            onClick={() => {
                              setAiResult(rec);
                              handleNavigateView('ai-result');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>{lang === 'tr' ? 'Tasarımı Aç' : 'Open Design'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Handpicked Featured Boxes Preview (Featured 4) */}
            <section className="py-14 bg-white border-t border-purple-100/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-100 pb-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-normal text-slate-800 font-serif">
                      {lang === 'tr' ? 'Tematik Kutular' : 'Thematic Boxes'}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleNavigateView('boxes')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:text-purple-950 bg-purple-100/80 hover:bg-purple-200/80 px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto border border-purple-200"
                  >
                    <span>{lang === 'tr' ? 'Tüm Kutuları Gör' : 'View All Boxes'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 Cards Preview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {boxes.slice(0, 4).map((box) => (
                    <div
                      key={box.id}
                      className="bg-[#FAF7F2] rounded-[32px] border border-purple-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer hover:border-purple-300"
                      onClick={() => handleSelectBoxForDetail(box)}
                    >
                      <div>
                        <div className="aspect-4/3 rounded-2xl overflow-hidden relative bg-purple-50 mb-3">
                          <img
                            src={box.image}
                            alt={box.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {box.badge && !box.badge.includes('_') && (
                            <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-purple-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-purple-100">
                              {box.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-800 font-serif group-hover:text-purple-900 transition-colors">
                          {box.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-normal">
                          {box.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
                        <span className="text-base font-bold font-serif text-purple-900">
                          {box.discountPrice || box.price} TL
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAddToCart(box);
                          }}
                          className="bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors border border-purple-200"
                        >
                          + Ekle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Warm Story Teaser Section */}
            <section className="py-14 bg-[#FAF7F2] border-t border-purple-100/80">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-purple-700 fill-purple-700" />
                  <span>{lang === 'tr' ? 'Biz Kimiz?' : 'Who We Are'}</span>
                </span>

                <h2 className="text-2xl sm:text-4xl font-normal font-serif text-slate-800">
                  {lang === 'tr' ? (
                    <>
                      Kişiselleştirilmiş Hediyeleşme, <span className="text-purple-900 italic">Sevgiyle Paketlenen Anılar</span> 🌸
                    </>
                  ) : (
                    <>
                      Personalized Gifting, <span className="text-purple-900 italic">Crafted With Heart</span> 🌸
                    </>
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
                  {lang === 'tr'
                    ? 'Happinio, sevdiklerinizin yüzünde o gerçek gülümsemeyi görmek isteyen tatlı bir aile girişimi. Neden kurulduğumuzu ve değerlerimizi okuyun.'
                    : 'Happinio is a warm family initiative born from a passion to bring true smiles to your loved ones. Read our journey and values.'}
                </p>

                <div>
                  <button
                    onClick={() => handleNavigateView('story')}
                    className="inline-flex items-center gap-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all"
                  >
                    <span>{lang === 'tr' ? 'Hikâyemizi Okuyun →' : 'Read Our Story →'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Local Producers & Artisans Showcase Banner */}
            <ProducersBannerSection
              lang={lang}
              onOpenProducersView={() => handleNavigateView('producers')}
            />

            {/* Special Occasion Calendar & Joy-Genie Matcher */}
            <OccasionCalendarSection
              boxes={boxes}
              user={user}
              lang={lang}
              onOpenProfile={() => setIsProfileOpen(true)}
              onSelectBox={handleSelectBoxForDetail}
              onQuickAddToCart={handleQuickAddToCart}
            />

            {/* Monthly Community Custom Box Contest & Showcase */}
            <CommunityCustomBoxShowcase
              user={user}
              onOpenProfile={() => setIsProfileOpen(true)}
              onAwardPoints={handleAwardPoints}
            />
          </div>
        )}

        {currentView === 'calendar' && (
          <div className="animate-fadeIn">
            <OccasionCalendarSection
              boxes={boxes}
              user={user}
              lang={lang}
              onOpenProfile={() => setIsProfileOpen(true)}
              onSelectBox={handleSelectBoxForDetail}
              onQuickAddToCart={handleQuickAddToCart}
            />
          </div>
        )}

        {currentView === 'community' && (
          <div className="animate-fadeIn">
            <CommunityCustomBoxShowcase
              user={user}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          </div>
        )}

        {(currentView === 'boxes' || currentView === 'city-boxes') && (
          <div className="animate-fadeIn space-y-8">
            <BoxCatalog
              boxes={boxes}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectBox={handleSelectBoxForDetail}
              onQuickAddToCart={handleQuickAddToCart}
              initialCategory={currentView === 'city-boxes' ? 'city' : 'all'}
              producerFilter={producerFilter}
              onClearProducerFilter={() => setProducerFilter(null)}
              onNavigateToJoyGenie={() => {
                setCurrentView('home');
                setTimeout(() => {
                  const el = document.getElementById('ai-prompt-hero');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 150);
              }}
            />
            <CityContributionSection
              cityBoxes={[]}
              onSelectBox={handleSelectBoxForDetail}
              onQuickAddToCart={handleQuickAddToCart}
              suggestions={citySuggestions}
              user={user}
              onSubmitSuggestion={handleSubmitCitySuggestion}
            />
          </div>
        )}

        {currentView === 'producers' && (
          <div className="animate-fadeIn">
            <ProducersPage
              boxes={boxes}
              onSelectBox={handleSelectBoxForDetail}
              onNavigateToCategory={(cat, producerBadge) => {
                setProducerFilter(producerBadge || null);
                handleNavigateView('boxes');
              }}
              onOpenContact={() => setIsContactOpen(true)}
            />
          </div>
        )}

        {currentView === 'story' && (
          <div className="animate-fadeIn">
            <StoryPage
              lang={lang}
              onExploreBoxes={() => handleNavigateView('boxes')}
              onOpenPrompt={() => handleNavigateView('home')}
              onOpenContact={() => setIsContactOpen(true)}
            />
          </div>
        )}

        {currentView === 'subscription' && (
          <div className="animate-fadeIn">
            <SubscriptionSection lang={lang} onSelectPlan={handleSelectSubscriptionPlan} />
          </div>
        )}

        {currentView === 'reviews' && (
          <div className="animate-fadeIn">
            <ReviewsPage
              reviews={reviews}
              onAddReview={handleAddReview}
              initialSearchQuery={reviewsSearchQuery}
              onSearchQueryChange={setReviewsSearchQuery}
            />
          </div>
        )}

        {currentView === 'art' && (
          <div className="animate-fadeIn">
            <DownloadableArtSection
              user={user}
              lang={lang}
              onSubscribeNewsletter={handleSubscribeNewsletter}
              onOpenProfile={(tab) => handleOpenProfileWithTab((tab as any) || 'downloads')}
            />
          </div>
        )}

        {currentView === 'suggest-product' && (
          <div className="animate-fadeIn">
            <SuggestProductPage lang={lang} />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="animate-fadeIn">
            <ContactPage lang={lang} onOpenFAQ={() => handleNavigateView('faq')} />
          </div>
        )}

        {currentView === 'faq' && (
          <div className="animate-fadeIn">
            <FAQModal isOpen={true} isPage={true} onClose={() => handleNavigateView('home')} />
          </div>
        )}

        {currentView === 'box-detail' && selectedBoxForDetail && (
          <div className="animate-fadeIn">
            <BoxDetailModal
              box={selectedBoxForDetail}
              isOpen={true}
              isPage={true}
              isFavorite={favorites.includes(selectedBoxForDetail.id)}
              allBoxes={boxes}
              onClose={() => {
                setSelectedBoxForDetail(null);
                handleNavigateView('boxes');
              }}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
              onSelectBox={handleSelectBoxForDetail}
              onDirectBuy={(boxTitle, items, price, note, rec, send) => {
                handleAddToCart(boxTitle, items, price, note, rec, send);
                setSelectedBoxForDetail(null);
                handleNavigateView('checkout');
              }}
              onViewReviews={(boxName) => {
                setSelectedBoxForDetail(null);
                setReviewsSearchQuery(boxName);
                setCurrentView('reviews');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToJoyGenie={() => {
                setCurrentView('home');
                setTimeout(() => {
                  const el = document.getElementById('ai-prompt-hero');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 150);
              }}
            />
          </div>
        )}

        {currentView === 'cart' && (
          <div className="animate-fadeIn">
            <CartDrawer
              isOpen={true}
              isPage={true}
              cartItems={cart}
              onClose={() => handleNavigateView('home')}
              onRemoveItem={handleRemoveCartItem}
              onUpdateQuantity={handleUpdateCartQuantity}
              onUpdateGiftNote={handleUpdateCartGiftNote}
              onProceedToCheckout={() => handleNavigateView('checkout')}
              onViewAiResult={handleViewAiResult}
              onViewItemDetail={handleViewCartItemDetail}
            />
          </div>
        )}

        {currentView === 'checkout' && (
          <div className="animate-fadeIn">
            <CheckoutModal
              isOpen={true}
              isPage={true}
              cartItems={cart}
              totalAmount={cartTotalAmount}
              user={user}
              onUpdateProfile={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
              onClose={() => handleNavigateView('cart')}
              onOrderCompleted={(order) => {
                handleOrderCompleted(order);
                handleOpenProfileWithTab('orders');
              }}
            />
          </div>
        )}

        {currentView === 'ai-result' && aiResult && (
          <div className="animate-fadeIn">
            <AIRecommendationResultModal
              result={aiResult}
              isOpen={true}
              isPage={true}
              onClose={() => {
                setAiResult(null);
                handleNavigateView('home');
              }}
              onAddToCart={handleAddToCart}
              onQuickBuy={(boxTitle, items, price, note, rec, send) => {
                handleAddToCart(boxTitle, items, price, note, rec, send);
                setAiResult(null);
                handleNavigateView('checkout');
              }}
              onToggleSave={() => handleToggleSaveRecommendation(aiResult)}
              isSaved={savedAiRecommendations.some((item) => item.boxTitle === aiResult.boxTitle)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenAboutUs={() => handleNavigateView('story')}
        onOpenFAQ={() => handleNavigateView('faq')}
        onOpenContact={() => handleNavigateView('contact')}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSalesAgreement={() => setIsSalesAgreementOpen(true)}
        onOpenReturnPolicy={() => setIsReturnPolicyOpen(true)}
        onNavigateView={handleNavigateView}
      />

      {/* Modals & Drawers */}
      <AILoadingModal isOpen={isAiLoading} />

      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cart}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateCartQuantity}
        onUpdateGiftNote={handleUpdateCartGiftNote}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onViewAiResult={handleViewAiResult}
        onViewItemDetail={handleViewCartItemDetail}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cartItems={cart}
        totalAmount={cartTotalAmount}
        user={user}
        onUpdateProfile={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        userOrders={user.orders}
        onClose={() => setIsTrackingOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        user={user}
        lang={lang}
        favoriteBoxes={boxes.filter((b) => favorites.includes(b.id))}
        onClose={() => setIsProfileOpen(false)}
        onSelectBox={(box) => {
          setIsProfileOpen(false);
          handleSelectBoxForDetail(box);
        }}
        onUpdateProfile={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        onOpenOrderTracking={() => setIsTrackingOpen(true)}
        initialTab={profileInitialTab}
        savedAiRecommendations={savedAiRecommendations}
        onViewAiResult={handleViewAiResult}
        onRemoveAiRecommendation={(recToRemove) => 
          setSavedAiRecommendations((prev) => prev.filter((r) => r.boxTitle !== recToRemove.boxTitle))
        }
      />

      <AboutUsModal isOpen={isAboutUsOpen} onClose={() => setIsAboutUsOpen(false)} />
      <FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <PrivacyTermsModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <SalesAgreementModal isOpen={isSalesAgreementOpen} onClose={() => setIsSalesAgreementOpen(false)} />
      <ReturnPolicyModal isOpen={isReturnPolicyOpen} onClose={() => setIsReturnPolicyOpen(false)} />

      {/* Floating Action Buttons: WhatsApp Support & Scroll to Top */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/905466313382"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative cursor-pointer"
          title="WhatsApp Destek Hattı"
          id="whatsapp-floating-button"
        >
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
          <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
            Destek Hattı 💬
          </span>
        </a>

        {/* Scroll to Top Button */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`bg-purple-950 text-white p-3 rounded-full shadow-lg hover:bg-purple-900 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer ${
            showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-0 pointer-events-none'
          }`}
          title="Yukarı Çık"
          id="scroll-to-top-button"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
}
