import React, { useState } from 'react';
import { ShoppingBag, Heart, PackageCheck, User, Sparkles, Menu, X } from 'lucide-react';
import HapyMascot from './HapyMascot';
import { UserProfile } from '../types';
import { translations, Language } from '../i18n/translations';
import { HappinioLogo } from './HappinioLogo';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  favoritesCount: number;
  user: UserProfile;
  lang: Language;
  currentView: string;
  onNavigateView: (view: string) => void;
  onToggleLang: () => void;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenOrderTracking: () => void;
  onOpenProfile: () => void;
  onOpenCitySuggestion: () => void;
  onOpenContact?: () => void;
}

export default function Navbar({
  cartCount,
  cartTotal,
  favoritesCount,
  user,
  lang,
  currentView,
  onNavigateView,
  onToggleLang,
  onOpenCart,
  onOpenFavorites,
  onOpenOrderTracking,
  onOpenProfile,
  onOpenCitySuggestion,
  onOpenContact,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tNav = translations[lang].nav;
  const tBanner = translations[lang].bannerText;
  const tCode = translations[lang].bannerCode;

  const navLinks: Array<{ label: string; view: string; badge?: string }> = [
    { label: tNav.home, view: 'home' },
    { label: tNav.story, view: 'story' },
    { label: lang === 'tr' ? 'Yerel Üreticiler' : 'Local Artisans', view: 'producers' },
    { label: tNav.boxes, view: 'boxes' },
    { label: lang === 'tr' ? 'Kutu Oylaması' : 'Contest', view: 'community' },
    { label: lang === 'tr' ? 'Özel Gün Takvimi' : 'Occasion Calendar', view: 'calendar' },
    { label: tNav.contact, view: 'contact' },
  ];

  const handleLinkClick = (view: string) => {
    if (view === 'contact' && onOpenContact) {
      onOpenContact();
    } else {
      onNavigateView(view);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-3">
          
          {/* Logo with Happinio branding */}
          <div
            className="flex items-center cursor-pointer group shrink-0 hover:opacity-95 transition-opacity"
            onClick={() => handleLinkClick('home')}
          >
            <HappinioLogo className="h-9 sm:h-11 xl:h-12 w-auto" idPrefix="nav_logo_" />
          </div>

          {/* Desktop Multi-Page View Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 font-medium min-w-0">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`text-[11px] xl:text-xs transition-all whitespace-nowrap px-1.5 xl:px-2.5 py-1.5 rounded-xl flex items-center justify-center font-medium border ${
                    isActive
                      ? 'text-purple-900 font-bold bg-purple-50/90 border-purple-200/80 shadow-2xs'
                      : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50/50 border-transparent'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] leading-none ml-1">{link.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1 xl:gap-2 shrink-0">
            
            {/* Profile / Auth Button */}
            <button
              onClick={onOpenProfile}
              className={`flex items-center gap-1.5 p-1.5 xl:px-2.5 xl:py-1.5 rounded-xl border transition-all shrink-0 ${
                user.isLoggedIn === false
                  ? 'bg-pink-50 hover:bg-pink-100 border-pink-300 text-pink-700 shadow-2xs'
                  : 'text-slate-700 hover:bg-pink-50 border-slate-200 bg-white'
              }`}
              title={user.isLoggedIn === false ? 'Giriş Yap veya Üye Ol' : tNav.profile}
            >
              <User className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <div className="hidden xl:block text-left text-[11px]">
                {user.isLoggedIn === false ? (
                  <span className="block font-bold leading-tight text-pink-600 whitespace-nowrap">Giriş / Üye Ol</span>
                ) : (
                  <>
                    <span className="block font-bold leading-tight whitespace-nowrap">{user.name.split(' ')[0]} (Hesabım)</span>
                    <span className="text-[9px] text-pink-600 font-semibold block">{user.points} Puan</span>
                  </>
                )}
              </div>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-2.5 xl:px-3 py-1.5 sm:py-2 rounded-xl shadow-md shadow-pink-200/60 transition-all text-xs font-bold shrink-0 whitespace-nowrap"
            >
              <div className="relative shrink-0">
                <ShoppingBag className="w-3.5 h-3.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-300 text-purple-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs whitespace-nowrap">{cartTotal > 0 ? `${cartTotal} TL` : tNav.cart}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-purple-50 rounded-xl border border-slate-200/80 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-purple-700" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-purple-100 px-4 py-4 space-y-2 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleLinkClick(link.view)}
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  currentView === link.view
                    ? 'bg-purple-100/80 text-purple-900 font-bold border border-purple-200/80 shadow-2xs'
                    : 'text-slate-700 bg-slate-50/80 hover:bg-purple-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && <span className="text-sm">{link.badge}</span>}
              </button>
            ))}
          </div>
          
          <div className="pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 text-white text-xs font-bold shadow-xs"
            >
              <User className="w-4 h-4" />
              <span>{user.isLoggedIn === false ? 'Giriş Yap / Üye Ol' : 'Hesabım & Profilim'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
