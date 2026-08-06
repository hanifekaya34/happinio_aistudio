import React, { useState, useEffect } from 'react';
import { UserProfile, GiftBox, Order, SavedAddress } from '../types';
import { MONTHLY_DOWNLOADABLE_ARTS } from '../data/mockData';
import {
  TURKISH_PROVINCES,
  DISTRICTS_DATA,
  NEIGHBORHOODS_DATA,
} from './CheckoutModal';
import {
  X,
  User,
  Package,
  Heart,
  Award,
  Settings,
  MessageSquare,
  CheckCircle2,
  LogOut,
  Sparkles,
  Lock,
  Mail,
  UserPlus,
  Key,
  ShieldCheck,
  Gift,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Download,
  Eye,
  HelpCircle,
  ArrowRight,
  Trash2,
  Phone,
  Plus,
  BookmarkCheck,
  Home,
  Building2,
  Check,
  Edit3,
  Ticket,
} from 'lucide-react';
import HapyMascot from './HapyMascot';
import { HappinioLogo } from './HappinioLogo';
import MembershipAgreementModal from './MembershipAgreementModal';
import PrivacyTermsModal from './PrivacyTermsModal';

import { Language, translations } from '../i18n/translations';

interface UserProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  favoriteBoxes: GiftBox[];
  onClose: () => void;
  onSelectBox: (box: GiftBox) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenOrderTracking?: () => void;
  initialTab?: 'orders' | 'favorites' | 'reviews' | 'points' | 'downloads' | 'settings';
  savedAiRecommendations?: any[];
  onViewAiResult?: (rec: any) => void;
  onRemoveAiRecommendation?: (rec: any) => void;
  lang?: Language;
}

export const getLevelInfo = (pts: number) => {
  if (pts <= 150) return { name: 'Minik Çırak Happinio', stage: '1. Aşama', min: 0, max: 150 };
  if (pts <= 300) return { name: 'Sürpriz Mimarı Happinio', stage: '2. Aşama', min: 151, max: 300 };
  if (pts <= 600) return { name: 'Mutluluk Elçisi Happinio', stage: '3. Aşama', min: 301, max: 600 };
  return { name: 'Efsanevi Hediye Gurusu', stage: '4. Aşama', min: 601, max: 1000 };
};

export default function UserProfileModal({
  isOpen,
  user,
  favoriteBoxes,
  onClose,
  onSelectBox,
  onUpdateProfile,
  onOpenOrderTracking,
  initialTab = 'orders',
  savedAiRecommendations = [],
  onViewAiResult,
  onRemoveAiRecommendation,
  lang = 'tr',
}: UserProfileModalProps) {
  if (!isOpen) return null;

  // Auth Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);

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

  // Legal Modals State
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false);

  // Order Details Modal state
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Preview Image Lightbox state for downloads
  const [activePreviewImage, setActivePreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [artFilter, setArtFilter] = useState<'all' | 'wallpaper' | 'calendar' | 'tags'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Profile Active Tab (when logged in)
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'addresses' | 'reviews' | 'points' | 'downloads' | 'settings'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userPhone, setUserPhone] = useState(user.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Address Management state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressNotice, setAddressNotice] = useState<string | null>(null);
  const [addrTitle, setAddrTitle] = useState('');
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrProvince, setAddrProvince] = useState('');
  const [addrDistrict, setAddrDistrict] = useState('');
  const [addrNeighborhood, setAddrNeighborhood] = useState('');
  const [addrPostal, setAddrPostal] = useState('');
  const [addrDetails, setAddrDetails] = useState('');
  const [addrCustomDistrict, setAddrCustomDistrict] = useState('');
  const [addrCustomNeighborhood, setAddrCustomNeighborhood] = useState('');

  const [addrDistrictsList, setAddrDistrictsList] = useState<string[]>([]);
  const [addrNeighborhoodsList, setAddrNeighborhoodsList] = useState<string[]>([]);

  useEffect(() => {
    if (addrProvince) {
      if (DISTRICTS_DATA[addrProvince]) {
        setAddrDistrictsList([...DISTRICTS_DATA[addrProvince], 'Diğer (Kendim Yazacağım)']);
      } else {
        setAddrDistrictsList([`${addrProvince} Merkez`, 'Atatürk', 'Cumhuriyet', 'Diğer (Kendim Yazacağım)']);
      }
      setAddrDistrict('');
      setAddrNeighborhood('');
    } else {
      setAddrDistrictsList([]);
    }
  }, [addrProvince]);

  useEffect(() => {
    if (addrDistrict && addrDistrict !== 'Diğer (Kendim Yazacağım)') {
      if (NEIGHBORHOODS_DATA[addrDistrict]) {
        setAddrNeighborhoodsList([...NEIGHBORHOODS_DATA[addrDistrict], 'Diğer (Kendim Yazacağım)']);
      } else {
        setAddrNeighborhoodsList(['Merkez Mah.', 'Atatürk Mah.', 'Cumhuriyet Mah.', 'Diğer (Kendim Yazacağım)']);
      }
      setAddrNeighborhood('');
    } else {
      setAddrNeighborhoodsList(['Diğer (Kendim Yazacağım)']);
    }
  }, [addrDistrict]);

  // Password Change state inside settings tab
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isLoggedIn = user.isLoggedIn !== false;

  const handleDemoLogin = () => {
    onUpdateProfile({
      name: 'Hanife Gürlek',
      email: 'hanifekaya34@gmail.com',
      isLoggedIn: true,
      points: 250,
    });
    setAuthNotice('Hanife Gürlek hesabınızla hızlı giriş yapıldı! Hoş geldiniz 🌸');
    setTimeout(() => setAuthNotice(null), 4000);
  };

  const handleGoogleLogin = () => {
    onUpdateProfile({
      name: 'Google Kullanıcısı',
      email: 'google.user@gmail.com',
      isLoggedIn: true,
      points: (user.points || 0) + 100,
    });
    setAuthNotice('Google hesabınızla başarıyla giriş yapıldı! +100 Hoş Geldin puanı tanımlandı. 🎉');
    setTimeout(() => setAuthNotice(null), 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      alert('Lütfen e-posta adresinizi girin.');
      return;
    }
    if (!loginPassword || loginPassword.length < 6) {
      alert('Hatalı şifre veya e-posta adresi. Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    const derivedName = loginEmail.split('@')[0].replace('.', ' ');
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    onUpdateProfile({
      name: formattedName || 'Happinio Üyesi',
      email: loginEmail,
      isLoggedIn: true,
    });
    setAuthNotice('Başarıyla giriş yaptınız! Keyifli alışverişler dileriz 🌸');
    setTimeout(() => setAuthNotice(null), 4000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regTermsAccepted) {
      alert('Lütfen devam etmek için Üyelik Sözleşmesini ve KVKK metnini onaylayın.');
      return;
    }
    if (!regName.trim()) {
      alert('Lütfen Adınız Soyadınız alanını doldurunuz.');
      return;
    }
    if (!regEmail.trim()) {
      alert('Lütfen E-Posta Adresiniz alanını doldurunuz.');
      return;
    }
    if (!regPhone.trim()) {
      alert('Lütfen Telefon Numaranız alanını doldurunuz.');
      return;
    }
    if (!regPassword) {
      alert('Lütfen Şifre alanını doldurunuz.');
      return;
    }
    if (!regPasswordConfirm) {
      alert('Lütfen Şifre Tekrar alanını doldurunuz.');
      return;
    }

    // Email validation (@ check)
    if (!regEmail.includes('@')) {
      alert('Lütfen geçerli bir e-posta adresi girin (E-posta adresi "@" sembolü içermelidir).');
      return;
    }

    // Phone format check: (5xx) xxx xx xx
    const phoneRegex = /^\(5\d{2}\)\s\d{3}\s\d{2}\s\d{2}$/;
    if (!phoneRegex.test(regPhone)) {
      alert('Telefon numaranız (5xx) xxx xx xx formatında olmalıdır. Örn: (555) 123 45 67');
      return;
    }

    if (regPassword.length < 6) {
      alert('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      alert('Şifreleriniz birbiriyle eşleşmiyor. Lütfen kontrol edin.');
      return;
    }

    // Prevent duplicate email registration
    const existingEmails = ['selin.yilmaz@happinio.com', 'admin@happinio.com', user.email];
    if (existingEmails.map(m => m.toLowerCase()).includes(regEmail.trim().toLowerCase())) {
      alert('Bu e-posta adresiyle kayıtlı bir hesap zaten bulunmaktadır. Lütfen farklı bir e-posta adresi ile kayıt olun veya Giriş Yapın.');
      return;
    }

    onUpdateProfile({
      name: regName,
      email: regEmail,
      isLoggedIn: true,
      points: (user.points || 0) + 100,
    });
    setAuthNotice(`Aramıza hoş geldiniz Sayın ${regName}! +100 Happinio Puanınız hesabınıza eklendi. 🎉`);
    setTimeout(() => setAuthNotice(null), 5000);
  };

  const handleLogout = () => {
    onUpdateProfile({ isLoggedIn: false });
    setAuthNotice('Başarıyla çıkış yaptınız.');
    setTimeout(() => setAuthNotice(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: userName, email: userEmail, phone: userPhone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleStartEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrTitle(addr.title);
    setAddrRecipient(addr.recipientName);
    setAddrPhone(addr.phone);
    setAddrProvince(addr.province);
    setAddrDistrict(addr.district);
    setAddrNeighborhood(addr.neighborhood);
    setAddrPostal(addr.postalCode);
    setAddrDetails(addr.addressDetails);
    setIsAddingAddress(true);
  };

  const handleSaveNewAddressInProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrTitle.trim() || !addrRecipient.trim() || !addrPhone.trim() || !addrProvince || !addrDistrict || !addrNeighborhood || !addrDetails.trim()) {
      alert('Lütfen tüm zorunlu adres alanlarını doldurun.');
      return;
    }

    const finalDistrict = addrDistrict === 'Diğer (Kendim Yazacağım)' ? addrCustomDistrict.trim() : addrDistrict;
    const finalNeighborhood = addrNeighborhood === 'Diğer (Kendim Yazacağım)' ? addrCustomNeighborhood.trim() : addrNeighborhood;

    const existingAddresses = user.addresses || [];

    if (editingAddressId) {
      // Update existing address
      const updatedList = existingAddresses.map((addr) => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            title: addrTitle.trim(),
            recipientName: addrRecipient.trim(),
            phone: addrPhone.trim(),
            province: addrProvince,
            district: finalDistrict,
            neighborhood: finalNeighborhood,
            postalCode: addrPostal.trim() || '34000',
            addressDetails: addrDetails.trim(),
          };
        }
        return addr;
      });
      onUpdateProfile({ ...user, addresses: updatedList });
      setAddressNotice('Adresiniz başarıyla güncellendi. ✏️');
    } else {
      // Create new address
      const newAddr: SavedAddress = {
        id: `ADDR-${Date.now()}`,
        title: addrTitle.trim(),
        recipientName: addrRecipient.trim(),
        phone: addrPhone.trim(),
        email: user.email,
        province: addrProvince,
        district: finalDistrict,
        neighborhood: finalNeighborhood,
        postalCode: addrPostal.trim() || '34000',
        addressDetails: addrDetails.trim(),
        isDefault: existingAddresses.length === 0,
      };
      onUpdateProfile({ ...user, addresses: [...existingAddresses, newAddr] });
      setAddressNotice('Yeni adresiniz başarıyla eklendi. 🏠');
    }

    setTimeout(() => setAddressNotice(null), 3500);

    setIsAddingAddress(false);
    setEditingAddressId(null);
    setAddrTitle('');
    setAddrRecipient('');
    setAddrPhone('');
    setAddrProvince('');
    setAddrDistrict('');
    setAddrNeighborhood('');
    setAddrPostal('');
    setAddrDetails('');
  };

  const handleDeleteAddress = (id: string) => {
    const existing = user.addresses || [];
    const updated = existing.filter((a) => a.id !== id);
    onUpdateProfile({ ...user, addresses: updated });
    setAddressNotice('Adresiniz hesabınızdan başarıyla silindi. 🗑️');
    setTimeout(() => setAddressNotice(null), 3500);
  };

  const handleSetDefaultAddress = (id: string) => {
    const existing = user.addresses || [];
    const updated = existing.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    onUpdateProfile({ ...user, addresses: updated });
    setAddressNotice('Varsayılan teslimat adresiniz güncellendi. ⭐');
    setTimeout(() => setAddressNotice(null), 3500);
  };

  const renderAddressSection = () => (
    <div className="bg-purple-50/50 p-5 rounded-3xl border border-purple-100 space-y-4">
      <div className="flex items-center justify-between border-b border-purple-200/60 pb-2.5">
        <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
          <span>Kayıtlı Teslimat Adreslerim ({user.addresses?.length || 0})</span>
        </h4>
        <button
          type="button"
          onClick={() => {
            if (isAddingAddress) {
              setIsAddingAddress(false);
              setEditingAddressId(null);
              setAddrTitle('');
              setAddrRecipient('');
              setAddrPhone('');
              setAddrProvince('');
              setAddrDistrict('');
              setAddrNeighborhood('');
              setAddrPostal('');
              setAddrDetails('');
            } else {
              setIsAddingAddress(true);
              setEditingAddressId(null);
              setAddrRecipient(user.name || '');
              setAddrPhone(user.phone || '');
            }
          }}
          className="text-xs font-bold text-pink-700 bg-white hover:bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-pink-600" />
          <span>{isAddingAddress ? 'Vazgeç' : '+ Yeni Adres Ekle'}</span>
        </button>
      </div>

      {addressNotice && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{addressNotice}</span>
        </div>
      )}

      {/* Address List */}
      {(!user.addresses || user.addresses.length === 0) && !isAddingAddress && (
        <div className="text-center py-6 bg-white/60 rounded-2xl border border-dashed border-purple-200 p-4">
          <MapPin className="w-8 h-8 mx-auto text-purple-300 mb-2" />
          <p className="text-xs font-bold text-slate-700">Henüz kayıtlı bir teslimat adresiniz bulunmuyor.</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Yukarıdaki "+ Yeni Adres Ekle" butonuna tıklayarak siparişleriniz için teslimat adresi kaydedebilirsiniz.</p>
        </div>
      )}

      {user.addresses && user.addresses.length > 0 && (
        <div className="space-y-3">
          {user.addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-2 relative"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
                  {addr.title.toLowerCase().includes('ev') ? (
                    <Home className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  )}
                  <span>{addr.title}</span>
                  {addr.isDefault && (
                    <span className="bg-pink-100 text-pink-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                      Varsayılan
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-[10px] font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
                    >
                      Varsayılan Yap
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleStartEditAddress(addr)}
                    className="text-purple-700 hover:text-purple-900 p-1 cursor-pointer flex items-center gap-1 text-[11px] font-bold bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg border border-purple-100 transition-colors"
                    title="Adresi Düzenle"
                  >
                    <Edit3 className="w-3 h-3 text-purple-700" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer flex items-center gap-1 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-100 transition-colors"
                    title="Adresi Hesabımdan Sil"
                  >
                    <Trash2 className="w-3 h-3 text-rose-600" />
                    <span>Sil</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-semibold">
                {addr.recipientName} • {addr.phone}
              </p>
              <p className="text-[11px] text-slate-500 leading-snug">
                {addr.neighborhood}, {addr.addressDetails}, PK: {addr.postalCode}, {addr.district}/{addr.province}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add or Edit Address Form */}
      {isAddingAddress && (
        <form onSubmit={handleSaveNewAddressInProfile} className="bg-white p-4 rounded-2xl border border-pink-200 space-y-3 animate-fadeIn shadow-xs">
          <h5 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4 text-pink-600" />
            <span>{editingAddressId ? 'Adresi Düzenle' : 'Yeni Teslimat Adresi Ekle'}</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Adres Başlığı *</label>
              <input
                type="text"
                placeholder="Örn: Evim, İş Yeri, Annemin Evi"
                value={addrTitle}
                onChange={(e) => setAddrTitle(e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Alıcı Adı Soyadı *</label>
              <input
                type="text"
                placeholder="Adı Soyadı"
                value={addrRecipient}
                onChange={(e) => setAddrRecipient(e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Alıcı Telefonu *</label>
            <input
              type="text"
              placeholder="(5xx) xxx xx xx"
              value={addrPhone}
              onChange={(e) => setAddrPhone(formatPhoneNumber(e.target.value))}
              className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">İl *</label>
              <select
                value={addrProvince}
                onChange={(e) => setAddrProvince(e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
              >
                <option value="">İl Seçin</option>
                {TURKISH_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">İlçe *</label>
              <select
                value={addrDistrict}
                onChange={(e) => setAddrDistrict(e.target.value)}
                disabled={!addrProvince}
                className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 outline-none disabled:bg-slate-100"
              >
                <option value="">İlçe Seçin</option>
                {addrDistrictsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Mahalle *</label>
              <select
                value={addrNeighborhood}
                onChange={(e) => setAddrNeighborhood(e.target.value)}
                disabled={!addrDistrict}
                className="w-full text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 outline-none disabled:bg-slate-100"
              >
                <option value="">Mahalle Seçin</option>
                {addrNeighborhoodsList.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {(addrDistrict === 'Diğer (Kendim Yazacağım)' || addrNeighborhood === 'Diğer (Kendim Yazacağım)') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-purple-50 p-3 rounded-xl">
              {addrDistrict === 'Diğer (Kendim Yazacağım)' && (
                <input
                  type="text"
                  placeholder="İlçe adı"
                  value={addrCustomDistrict}
                  onChange={(e) => setAddrCustomDistrict(e.target.value)}
                  className="text-xs p-2 rounded-lg border bg-white"
                />
              )}
              {addrNeighborhood === 'Diğer (Kendim Yazacağım)' && (
                <input
                  type="text"
                  placeholder="Mahalle adı"
                  value={addrCustomNeighborhood}
                  onChange={(e) => setAddrCustomNeighborhood(e.target.value)}
                  className="text-xs p-2 rounded-lg border bg-white"
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              maxLength={5}
              placeholder="Posta Kodu"
              value={addrPostal}
              onChange={(e) => setAddrPostal(e.target.value.replace(/[^\d]/g, ''))}
              className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
            />
            <input
              type="text"
              placeholder="Açık adres (Cadde, bina no, daire...)"
              value={addrDetails}
              onChange={(e) => setAddrDetails(e.target.value)}
              className="sm:col-span-3 text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingAddress(false);
                setEditingAddressId(null);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {editingAddressId ? 'Değişiklikleri Kaydet' : 'Adresi Kaydet'}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordNotice({ type: 'error', message: 'Lütfen mevcut şifrenizi giriniz.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordNotice({ type: 'error', message: 'Yeni şifreniz en az 6 karakter olmalıdır.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice({ type: 'error', message: 'Yeni şifreleriniz birbiriyle eşleşmiyor. Lütfen kontrol edip tekrar deneyin.' });
      return;
    }

    setPasswordNotice({ type: 'success', message: 'Şifreniz başarıyla güncellendi! 🔒 Yeni şifrenizle güvenle giriş yapabilirsiniz.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordNotice(null), 5000);
  };

  useEffect(() => {
    if (user) {
      setUserName(user.name || '');
      setUserEmail(user.email || '');
      setUserPhone(user.phone || '');
    }
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-pink-100 overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Profile / Header Bar */}
        <div className="bg-purple-900 border-b border-purple-800 p-6 text-white relative flex items-center justify-between">
          
          <div className="flex items-center gap-4 text-left">
            <HappinioLogo className="h-11 w-11 bg-white p-1.5 rounded-2xl shadow-md border border-purple-100 shrink-0" variant="default" onlyIcon={true} />
            <div>
              <h2 className="text-xl font-bold font-serif">
                {isLoggedIn ? user.name : 'Happinio Üyelik & Giriş'}
              </h2>
              <span className="text-xs text-purple-200 block">
                {isLoggedIn ? user.email : 'Sipariş takibi, özel günler ve sürpriz hediyeler dünyası'}
              </span>
              {isLoggedIn && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="relative group flex items-center">
                    <span className="bg-amber-300 text-purple-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 cursor-help shadow-xs">
                      <Award className="w-3 h-3 text-purple-900" /> {user.points} Happinio Puanı
                      <HelpCircle className="w-3.5 h-3.5 text-purple-900 shrink-0" />
                    </span>
                    {/* Tooltip */}
                    <div className="absolute left-0 top-full mt-2 w-72 p-4 bg-slate-950 text-white text-[11px] font-normal rounded-2xl shadow-2xl border border-slate-800 hidden group-hover:flex flex-col gap-2 z-50 normal-case leading-relaxed">
                      <p className="font-bold text-amber-300 flex items-center gap-1">Happinio Puanları & İndirimler 🎈</p>
                      <p>• <strong>1 Happinio Puanı = 1 TL İndirim!</strong></p>
                      <p>• Üye Ol: <strong className="text-pink-300">+100 Puan (100 TL)</strong></p>
                      <p>• Her 1000 TL Kutuda: <strong className="text-pink-300">+100 Puan (100 TL)</strong></p>
                      <p>• Şehrine Özel Ürün Öner: <strong className="text-pink-300">+100 Puan (100 TL)</strong></p>
                      <p>• Tasarladığın Kutu Kazandığında: <strong className="text-pink-300">+100 Puan (100 TL)</strong></p>
                      <p>• Kutu Oylamasına Katıl: <strong className="text-pink-300">+10 Puan (10 TL)</strong></p>
                      <p>• Ürün Yorumu Yap: <strong className="text-pink-300">+10 Puan (10 TL)</strong></p>
                    </div>
                  </div>

                  {/* Level Badge with Hover Card */}
                  <div className="relative group flex items-center">
                    <span className="text-[10px] bg-white/20 hover:bg-white/30 text-amber-200 px-2.5 py-0.5 rounded-full font-bold cursor-pointer transition-all flex items-center gap-1 border border-white/20">
                      👑 {getLevelInfo(user.points).name}
                      <HelpCircle className="w-3 h-3 text-amber-200 shrink-0" />
                    </span>

                    {/* Level Hover Info Card */}
                    <div className="absolute right-0 sm:left-0 top-full mt-2 w-80 p-4 bg-purple-950 text-white text-[11px] font-normal rounded-2xl shadow-2xl border border-purple-800 hidden group-hover:flex flex-col gap-2.5 z-50 normal-case leading-relaxed">
                      <div className="flex items-center gap-2.5 border-b border-purple-800/80 pb-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-amber-400 text-purple-950 font-black flex items-center justify-center text-sm shrink-0 shadow-md">
                          🐣
                        </div>
                        <div>
                          <h5 className="font-bold text-amber-300 text-xs">{getLevelInfo(user.points).name}</h5>
                          <span className="text-[10px] text-purple-200 block">{user.points} Happinio Puanı ({getLevelInfo(user.points).stage})</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="font-bold text-xs text-pink-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                          <span>Happinio Karakter Evrim Tablosu</span>
                        </p>
                        <div className="space-y-1 text-[10px]">
                          <div className={`p-2 rounded-xl border transition-all ${user.points <= 150 ? 'bg-purple-800/90 border-amber-300 text-amber-200 font-bold shadow-xs' : 'bg-purple-900/40 border-purple-800 text-purple-300 opacity-75'}`}>
                            <div className="flex items-center justify-between">
                              <span>1. Aşama: Minik Çırak Happinio</span>
                              <span className="text-[9px] opacity-80">(0-150 Puan)</span>
                            </div>
                            <p className="font-normal opacity-85 mt-0.5 text-[9.5px]">Aramıza katılan sevimli ve meraklı kıvılcım.</p>
                          </div>

                          <div className={`p-2 rounded-xl border transition-all ${user.points > 150 && user.points <= 300 ? 'bg-purple-800/90 border-amber-300 text-amber-200 font-bold shadow-xs' : 'bg-purple-900/40 border-purple-800 text-purple-300 opacity-75'}`}>
                            <div className="flex items-center justify-between">
                              <span>2. Aşama: Sürpriz Mimarı Happinio</span>
                              <span className="text-[9px] opacity-80">(151-300 Puan)</span>
                            </div>
                            <p className="font-normal opacity-85 mt-0.5 text-[9.5px]">Özenle sevdiklerine sürpriz kutular hazırlayan usta.</p>
                          </div>

                          <div className={`p-2 rounded-xl border transition-all ${user.points > 300 && user.points <= 600 ? 'bg-purple-800/90 border-amber-300 text-amber-200 font-bold shadow-xs' : 'bg-purple-900/40 border-purple-800 text-purple-300 opacity-75'}`}>
                            <div className="flex items-center justify-between">
                              <span>3. Aşama: Mutluluk Elçisi Happinio</span>
                              <span className="text-[9px] opacity-80">(301-600 Puan)</span>
                            </div>
                            <p className="font-normal opacity-85 mt-0.5 text-[9.5px]">Unutulmaz anılar ve sihirli kutular armağan eden elçi.</p>
                          </div>

                          <div className={`p-2 rounded-xl border transition-all ${user.points > 600 ? 'bg-purple-800/90 border-amber-300 text-amber-200 font-bold shadow-xs' : 'bg-purple-900/40 border-purple-800 text-purple-300 opacity-75'}`}>
                            <div className="flex items-center justify-between">
                              <span>4. Aşama: Efsanevi Hediye Gurusu</span>
                              <span className="text-[9px] opacity-80">(601+ Puan)</span>
                            </div>
                            <p className="font-normal opacity-85 mt-0.5 text-[9.5px]">Asasından mutluluk saçan efsane koruyucu.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all border border-white/20"
                title="Hesaptan Çıkış Yap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Çıkış Yap</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notice Banner */}
        {authNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-6 py-3 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{authNotice}</span>
          </div>
        )}

        {!isLoggedIn ? (
          /* LOGGED OUT: RICH REGISTRATION & LOGIN FORMS */
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            
            {/* Quick Sign In Buttons */}
            <div className="max-w-md mx-auto text-center space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-3.5 px-4 rounded-2xl border border-slate-300 shadow-2xs flex items-center justify-center gap-3 transition-all group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google ile Tek Tıkla Giriş Yap / Üye Ol</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[11px] text-slate-400 font-medium">veya e-posta adresiniz ile</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'register' ? 'bg-white text-purple-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-purple-700" />
                  <span>Üye Ol (+100 Puan)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'login' ? 'bg-white text-purple-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 text-purple-700" />
                  <span>Giriş Yap</span>
                </button>
              </div>

              {/* REGISTER FORM */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                  <div className="bg-purple-50 border border-purple-100 p-3 rounded-2xl text-xs text-purple-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>Şimdi kayıt olun, ilk siparişinizde kullanabileceğiniz <strong>100 Hediye Puanı</strong> kazanın!</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ayşe Yılmaz"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresiniz *</label>
                    <input
                      type="email"
                      required
                      placeholder="Örn: ayse@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numaranız *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: (555) 123 45 67"
                      value={regPhone}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        setRegPhone(formatted);
                      }}
                      className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Şifre *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Şifre Tekrar *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPasswordConfirm}
                        onChange={(e) => setRegPasswordConfirm(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={regTermsAccepted}
                      onChange={(e) => setRegTermsAccepted(e.target.checked)}
                      className="mt-0.5 accent-purple-700 rounded cursor-pointer shrink-0"
                    />
                    <span className="text-[11px] text-slate-600 leading-snug">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsMembershipModalOpen(true);
                        }}
                        className="underline font-bold text-purple-800 hover:text-purple-950 transition-colors cursor-pointer inline"
                      >
                        Happinio Üyelik Sözleşmesini
                      </button>{' '}
                      ve{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsKvkkModalOpen(true);
                        }}
                        className="underline font-bold text-purple-800 hover:text-purple-950 transition-colors cursor-pointer inline"
                      >
                        KVKK aydınlatma metnini
                      </button>{' '}
                      okudum, kabul ediyorum.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Ücretsiz Üye Ol & +100 Puan Kazan 🎉</span>
                  </button>
                </form>
              )}

              {/* LOGIN FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresiniz</label>
                    <input
                      type="email"
                      required
                      placeholder="Örn: ayse@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Şifreniz</label>
                      <button type="button" onClick={() => alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')} className="text-[11px] text-purple-700 font-semibold hover:underline">
                        Şifremi Unuttum
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Giriş Yap</span>
                  </button>
                </form>
              )}

              {/* Guest Saved Designs */}
              {savedAiRecommendations && savedAiRecommendations.length > 0 && (
                <div className="mt-8 pt-6 border-t border-purple-100">
                  <div className="flex items-center gap-1.5 text-purple-950 font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-purple-700 animate-pulse" />
                    <span>Bu Tarayıcıda Kayıtlı Sihirli Kutularınız ({savedAiRecommendations.length})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                    Giriş yapmadan tasarladığınız bu kutular tarayıcınızda (Local Storage) güvenle saklanmaktadır. Tasarımları açmak için aşağıdaki butonları kullanabilirsiniz:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {savedAiRecommendations.map((rec, index) => (
                      <div key={index} className="bg-purple-50/50 p-3.5 pr-10 rounded-2xl border border-purple-100/60 flex flex-col justify-between relative overflow-hidden text-left">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Bu tasarımı silmek istediğinize emin misiniz?')) {
                              onRemoveAiRecommendation && onRemoveAiRecommendation(rec);
                            }
                          }}
                          className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Tasarımı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded inline-block mb-1 border border-purple-200">
                            {rec.tagline}
                          </span>
                          <h5 className="text-xs font-bold text-slate-800 truncate leading-tight mb-0.5">{rec.boxTitle}</h5>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{rec.aiExplanation}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-purple-100/50">
                          <span className="text-xs font-black text-purple-950">{rec.totalPrice} TL</span>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onViewAiResult && onViewAiResult(rec);
                            }}
                            className="text-[10px] font-bold text-purple-700 hover:text-white bg-purple-100 hover:bg-purple-700 px-2.5 py-1 rounded-lg border border-purple-200 hover:border-purple-700 transition-all cursor-pointer flex items-center gap-0.5"
                          >
                            <span>Tasarımı Gör</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* LOGGED IN: USER PROFILE DASHBOARD */
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 border-b border-slate-200 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('orders')}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'orders' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Siparişlerim ({user.orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'favorites' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Favorilerim ({favoriteBoxes.length + savedAiRecommendations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'addresses' ? 'bg-white text-purple-800 shadow-xs ring-1 ring-purple-200' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <MapPin className="w-4 h-4 text-pink-600" />
                <span>Adreslerim ({user.addresses?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'reviews' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Yorumlarım</span>
              </button>

              <button
                onClick={() => setActiveTab('points')}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'points' ? 'bg-amber-400 text-purple-950 shadow-xs' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <Award className="w-4 h-4 text-purple-900" />
                <span>{lang === 'en' ? `Points & Coupons (${user.points} Pts)` : `Puanlarım & Kuponlarım (${user.points} Puan)`}</span>
              </button>

              <button
                onClick={() => setActiveTab('downloads')}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'downloads' ? 'bg-purple-800 text-white shadow-xs' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>İndirilebilir Tasarımlarım 🎨</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'settings' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Hesap Ayarları</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-left">
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Order Tracking Code Quick Action */}
                  {onOpenOrderTracking && (
                    <div className="bg-pink-50/80 border border-pink-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-pink-600" />
                        <span className="text-xs font-bold text-slate-800">Kargo Takip Kodu ile Sorgulama Yapmak İster misiniz?</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenOrderTracking();
                        }}
                        className="text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors shrink-0"
                      >
                        Kargo Sorgula
                      </button>
                    </div>
                  )}

                  {user.orders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Package className="w-12 h-12 mx-auto stroke-1 mb-2 text-pink-300" />
                      <p className="text-xs font-bold text-slate-700">Henüz verilmiş bir siparişiniz bulunmuyor.</p>
                    </div>
                  ) : (
                    user.orders.map((ord) => (
                      <div key={ord.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-pink-700 font-mono">{ord.trackingCode}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              Sipariş Alındı / Hazırlanıyor
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">Alıcı: {ord.recipientName} ({ord.deliveryDate})</p>
                          <p className="text-xs font-bold text-slate-900 mt-1">Tutar: {ord.totalAmount} TL</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrderForDetail(ord)}
                          className="text-xs font-bold text-pink-600 bg-pink-100 hover:bg-pink-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Sipariş Detayı</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* FAVORITES TAB */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  {/* Beğendiğim Koleksiyon Kutuları */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span>Beğendiğim Koleksiyon Kutuları</span>
                    </h4>
                    {favoriteBoxes.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">Favorilerinize henüz hediye kutusu eklemediniz.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {favoriteBoxes.map((box) => (
                          <div key={box.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
                            <img
                              src={box.image}
                              alt={box.name}
                              onClick={() => {
                                onClose();
                                onSelectBox(box);
                              }}
                              className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-all duration-300"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 truncate">{box.name}</h4>
                              <span className="text-xs font-black text-pink-600">{box.price} TL</span>
                              <button
                                onClick={() => {
                                  onClose();
                                  onSelectBox(box);
                                }}
                                className="block mt-1 text-[11px] font-bold text-pink-600 hover:underline cursor-pointer"
                              >
                                İncele & Özelleştir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Kaydettiğim Joy-Genie Tasarımları */}
                  {savedAiRecommendations && savedAiRecommendations.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-bold text-purple-950 border-b border-purple-100 pb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-700 animate-pulse" />
                        <span>Kaydettiğim Akıllı Tasarımlarım ({savedAiRecommendations.length})</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedAiRecommendations.map((rec, index) => (
                          <div key={index} className="bg-purple-50/50 p-3.5 pr-10 rounded-2xl border border-purple-100/60 flex flex-col justify-between relative overflow-hidden text-left">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Bu tasarımı favorilerinizden silmek istediğinize emin misiniz?')) {
                                  onRemoveAiRecommendation && onRemoveAiRecommendation(rec);
                                }
                              }}
                              className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Tasarımı Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-bold text-purple-800 bg-purple-100/85 px-2 py-0.5 rounded inline-block mb-1 border border-purple-200">
                                {rec.tagline}
                              </span>
                              <h5 className="text-xs font-bold text-slate-800 truncate leading-tight mb-1">{rec.boxTitle}</h5>
                              <p className="text-[10px] text-slate-500 line-clamp-1 leading-snug">{rec.aiExplanation}</p>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-purple-100/50">
                              <span className="text-xs font-black text-purple-950">{rec.totalPrice} TL</span>
                              <button
                                onClick={() => {
                                  onClose();
                                  onViewAiResult && onViewAiResult(rec);
                                }}
                                className="text-[10px] font-bold text-purple-700 hover:text-white bg-purple-100 hover:bg-purple-700 px-2.5 py-1 rounded-lg border border-purple-200 hover:border-purple-700 transition-all cursor-pointer flex items-center gap-0.5"
                              >
                                <span>Tasarımı Gör</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && renderAddressSection()}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                    <span className="text-xs font-bold text-slate-800 block">Kedisever Kahve & Kitap Keyfi Kutusu</span>
                    <p className="text-xs text-slate-600 italic mt-1">
                      "Kedi aşığı arkadaşımın doğum günü için sipariş verdim. Kutu tasarımı ve Happinio kart notu o kadar sevimliydi ki arkadaşım bayıldı!"
                    </p>
                    <span className="text-[10px] font-bold text-pink-600 mt-2 block">⭐⭐⭐⭐⭐ (Onaylı Alıcı)</span>
                  </div>
                </div>
              )}

              {/* POINTS TAB */}
              {activeTab === 'points' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-50 via-pink-50 to-purple-50 p-5 rounded-3xl border border-amber-200 flex items-center justify-between text-left shadow-xs">
                    <div>
                      <span className="text-xs text-purple-900 font-bold block">Mevcut Happinio Puan Bakiyeniz:</span>
                      <span className="text-3xl font-black text-pink-600 font-serif">{user.points} Happinio Puanı</span>
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">1 Happinio Puanı = 1 TL Değerinde Anında Sepet İndirimi!</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-md border border-white/60 shrink-0">
                      <Award className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Active Coupons & Promo Codes List */}
                  <div className="bg-white p-5 rounded-3xl border border-amber-200 space-y-3.5 text-left shadow-xs">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
                      <h4 className="text-xs font-black uppercase text-purple-950 tracking-wider flex items-center gap-1.5">
                        <Ticket className="w-4 h-4 text-amber-600" />
                        <span>{lang === 'en' ? 'My Active Coupons & Promo Codes 🎟️' : 'Aktif Kuponlarım & Tanımlı Kodlarım 🎟️'}</span>
                      </h4>
                      <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {lang === 'en' ? '2 Active Coupons' : '2 Kullanılabilir Kupon'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Coupon Item 1 */}
                      <div className="bg-gradient-to-br from-purple-900 to-purple-950 text-white p-4 rounded-2xl border border-purple-800 relative overflow-hidden flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold">
                            <span>HOŞ GELDİN İNDİRİMİ</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-white">Aktif</span>
                          </div>
                          <h5 className="text-base font-extrabold font-serif text-amber-200 mt-1">100 TL İndirim Kuponu</h5>
                          <p className="text-[11px] text-purple-200 mt-1 leading-tight">
                            Tüm hediye kutularında 100 TL anında sepet indirimi sağlar.
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-purple-800/80 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                            HOŞGELDİN100
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText('HOŞGELDİN100');
                              alert('Kupon kodu "HOŞGELDİN100" kopyalandı! Sepet ekranında kupon alanına yapıştırabilirsiniz. 🎁');
                            }}
                            className="text-[11px] font-bold text-purple-950 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-xl transition-colors cursor-pointer"
                          >
                            Kodu Kopyala
                          </button>
                        </div>
                      </div>

                      {/* Coupon Item 2 */}
                      <div className="bg-gradient-to-br from-pink-900 to-purple-900 text-white p-4 rounded-2xl border border-pink-700 relative overflow-hidden flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold">
                            <span>PUAN İNDİRİMİ</span>
                            <span className="bg-emerald-500/80 text-white px-2 py-0.5 rounded-full">Anında Kullan</span>
                          </div>
                          <h5 className="text-base font-extrabold font-serif text-amber-200 mt-1">{user.points} TL Bakiyeli Puan Kodu</h5>
                          <p className="text-[11px] text-pink-100 mt-1 leading-tight">
                            Biriken {user.points} puanınızı ödeme sayfasında anında indirime dönüştürebilirsiniz.
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-pink-800/80 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                            PUAN{user.points}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(`PUAN${user.points}`);
                              alert(`Puan kupon kodunuz "PUAN${user.points}" kopyalandı! 🌸`);
                            }}
                            className="text-[11px] font-bold text-purple-950 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-xl transition-colors cursor-pointer"
                          >
                            Kodu Kopyala
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-purple-100 space-y-3 text-left shadow-xs">
                    <h4 className="text-xs font-black uppercase text-purple-950 tracking-wider flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-pink-600" />
                      <span>Happinio Puan & TL İndirimi Kazanma Yolları:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        🎁 Üye Ol: <strong className="text-pink-600">+100 Happinio Puanı (100 TL)</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        🛍️ Her 1000 TL Hediye Kutusu: <strong className="text-pink-600">+100 Happinio Puanı (100 TL)</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        📍 Şehrine Özel Ürün Öner: <strong className="text-pink-600">+100 Happinio Puanı (100 TL)</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        🏆 Tasarladığın Kutu Kazandığında: <strong className="text-pink-600">+100 Happinio Puanı (100 TL)</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        🗳️ Topluluk Kutularını Oyla: <strong className="text-pink-600">+10 Happinio Puanı (10 TL)</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        💬 Onaylı Ürün Yorumu Yap: <strong className="text-pink-600">+10 Happinio Puanı (10 TL)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Happinio Evolution / Character Development Info Box */}
                  <div className="bg-purple-50/70 p-5 rounded-3xl border border-purple-100 space-y-3 text-left">
                    <div className="flex items-center gap-2 text-purple-950">
                      <Sparkles className="w-4 h-4 text-purple-700 animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        {lang === 'en' ? '🐾 Happinio Character Evolution & Levels' : '🐾 Happinio Karakter Evrimi & Seviye Tablosu'}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {lang === 'en'
                        ? 'As you send gifts, design custom boxes, and participate in the community, Happinio grows and evolves! Evolution levels are based on your Lifetime Earned Points.'
                        : 'Siz hediye gönderdikçe, kutu tasarladıkça ve topluluğa katıldıkça Happinio karakterimiz büyüyor ve evrimleşiyor! Evrim seviyeleri Toplam Kazanılan Birikimli Puanınız üzerinden belirlenir.'}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${user.points <= 150 ? 'bg-white border-amber-300 ring-2 ring-amber-200 shadow-sm' : 'bg-white/80 border-purple-100'}`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block">1. Aşama: Minik Çırak Happinio</span>
                            <span className="text-[10px] font-bold text-slate-400">0-150 Puan</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                            Happinio dünyasına ilk adımını atan heyecanlı, sevimli ve kıvılcım gibi parıldayan karakterimiz.
                          </p>
                        </div>
                        {user.points <= 150 && <span className="text-[10px] font-black text-pink-600 mt-2 block flex items-center gap-1">✨ Mevcut Seviyeniz</span>}
                      </div>

                      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${user.points > 150 && user.points <= 300 ? 'bg-white border-amber-300 ring-2 ring-amber-200 shadow-sm' : 'bg-white/80 border-purple-100'}`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block">2. Aşama: Sürpriz Mimarı Happinio</span>
                            <span className="text-[10px] font-bold text-slate-400">151-300 Puan</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                            Özenle seçtiği özel hediyelerle sevdiklerinin yüzünde kocaman tebessümler oluşturan neşeli mimar.
                          </p>
                        </div>
                        {user.points > 150 && user.points <= 300 && <span className="text-[10px] font-black text-pink-600 mt-2 block flex items-center gap-1">✨ Mevcut Seviyeniz</span>}
                      </div>

                      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${user.points > 300 && user.points <= 600 ? 'bg-white border-amber-300 ring-2 ring-amber-200 shadow-sm' : 'bg-white/80 border-purple-100'}`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block">3. Aşama: Mutluluk Elçisi Happinio</span>
                            <span className="text-[10px] font-bold text-slate-400">301-600 Puan</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                            Unutulmaz anılar ve sihirli kutular armağan eden, kalplere dokunan usta sevgi elçisi.
                          </p>
                        </div>
                        {user.points > 300 && user.points <= 600 && <span className="text-[10px] font-black text-pink-600 mt-2 block flex items-center gap-1">✨ Mevcut Seviyeniz</span>}
                      </div>

                      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${user.points > 600 ? 'bg-white border-amber-300 ring-2 ring-amber-200 shadow-sm' : 'bg-white/80 border-purple-100'}`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block">4. Aşama: Efsanevi Hediye Gurusu</span>
                            <span className="text-[10px] font-bold text-slate-400">601+ Puan</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                            Sıradan günleri bile şölene dönüştüren, sihirli asasından gülücükler saçan efsane koruyucu.
                          </p>
                        </div>
                        {user.points > 600 && <span className="text-[10px] font-black text-pink-600 mt-2 block flex items-center gap-1">✨ Mevcut Seviyeniz</span>}
                      </div>
                    </div>
                  </div>

                  {/* Coupon & Points Usage Reassurance Card */}
                  <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-purple-950 text-white p-5 rounded-3xl border border-emerald-700/50 shadow-md text-left space-y-3 relative overflow-hidden">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-400 text-purple-950 flex items-center justify-center font-bold shrink-0">
                        🛡️
                      </div>
                      <h4 className="text-sm font-bold font-serif text-white">
                        {lang === 'en'
                          ? 'Coupons & Mascot Evolution Protection Guarantee'
                          : 'Kupon Kullanımı & Evrim Sıfırlanmama Garantisi 🛡️'}
                      </h4>
                    </div>

                    <div className="space-y-2 text-xs text-emerald-100 leading-relaxed font-normal">
                      <p>
                        <strong>1. Kupon Bilgilerine Nereden Ulaşırım?</strong><br />
                        Kuponlarınız ve TL değerindeki puanlarınız <strong>Profilim &gt; Puanlarım &amp; Kuponlarım</strong> sayfasında saklanır. Alışveriş yaparken Sepetim (Cart) veya Ödeme ekranındaki <em>"Puan / Kupon Kullan"</em> kutucuğuna tıklayarak tek tıkla sepetinize uygulayabilirsiniz.
                      </p>
                      <p>
                        <strong>2. Kuponları Kullanınca Puanlarım Düşecek mi?</strong><br />
                        Evet, kupona çevirip alışverişinizde kullandığınız puan miktarı (örneğin 100 TL indirim için 100 Puan) harcanabilir puan bakiyenizden düşer.
                      </p>
                      <p className="bg-white/10 p-3 rounded-2xl border border-white/15 text-amber-200">
                        <strong>3. Happinio Evrimleşme Süreci Sıfırlanır mı?</strong><br />
                        <strong>KESİNLİKLE HAYIR! 💖</strong> Happinio evrim seviyeniz (Minik Çırak &rarr; Sürpriz Mimarı &rarr; Mutluluk Elçisi &rarr; Efsanevi Guru), harcadığınız bakiyeden bağımsız olarak bugüne kadar kazandığınız <strong>Toplam Birikimli Puan (Lifetime Points)</strong> üzerinden hesaplanır. Puanlarınızı indirim kuponu olarak gönül rahatlığıyla harcayın; Happinio karakterinizin seviyesi ve rozetleri asla gerilemez!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* DOWNLOADS TAB */}
              {activeTab === 'downloads' && (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-6 rounded-3xl border border-purple-800 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-2 z-10 max-w-xl text-left">
                      <div className="inline-flex items-center gap-1.5 bg-amber-400 text-purple-950 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-purple-950" />
                        <span>Happinio Üye Ayrıcalığı</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                        Aylık Ücretsiz İndirilebilir Tasarımlarım 🎨
                      </h3>
                      <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                        Happinio üyelerimize özel her ay özenle çizilen 4K duvar kâğıtları, masaüstü takvimleri ve printable hediye etiketlerini sınırsız ücretsiz indirebilirsiniz.
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-auto">
                      <span className="text-[10px] font-bold text-amber-300 uppercase block tracking-wider">Ağustos 2026 Koleksiyonu</span>
                      <span className="text-sm font-black text-white block mt-0.5">4 Yeni Yaratıcı & Komik Çizim</span>
                      <span className="text-[10px] text-purple-200 block mt-0.5">Sınırsız & Ücretsiz İndirin</span>
                    </div>
                  </div>

                  {/* Filter Badges */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setArtFilter('all')}
                      className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                        artFilter === 'all'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Tüm Tasarımlar ({MONTHLY_DOWNLOADABLE_ARTS.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtFilter('wallpaper')}
                      className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                        artFilter === 'wallpaper'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🖥️ 4K Duvar Kâğıtları
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtFilter('calendar')}
                      className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                        artFilter === 'calendar'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🗓️ Masaüstü Takvimleri
                    </button>
                    <button
                      type="button"
                      onClick={() => setArtFilter('tags')}
                      className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                        artFilter === 'tags'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      🏷️ Hediye Etiketleri (Printable)
                    </button>
                  </div>

                  {/* Grid of Downloadable Arts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {MONTHLY_DOWNLOADABLE_ARTS.filter(art => artFilter === 'all' || art.type === artFilter).map((art) => (
                      <div
                        key={art.id}
                        className="bg-white rounded-3xl border border-purple-100 p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all text-left relative overflow-hidden group"
                      >
                        {/* Top Badges */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-extrabold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                              {art.month} {art.year} • {art.tagline || 'Üyelere Özel'}
                            </span>
                            {art.downloadCount && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Download className="w-3 h-3 text-purple-600" />
                                {art.downloadCount} İndirme
                              </span>
                            )}
                          </div>

                          {/* Image Preview Container */}
                          <div className="relative h-44 rounded-2xl overflow-hidden bg-purple-950 border border-purple-200 group/img">
                            <img
                              src={art.previewUrl}
                              alt={art.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3">
                              <span className="text-white text-xs font-bold font-serif line-clamp-1">
                                {art.title}
                              </span>
                              <button
                                type="button"
                                onClick={() => setActivePreviewImage({ url: art.previewUrl, title: art.title })}
                                className="bg-white/20 hover:bg-white text-white hover:text-slate-900 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer shrink-0"
                                title="4K Önizlemeyi Büyüt"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 font-serif leading-snug">{art.title}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{art.description}</p>
                          </div>

                          {/* Funny Motto Banner */}
                          {art.funnyMotto && (
                            <div className="bg-amber-50/90 border border-amber-200 p-3 rounded-2xl text-xs text-amber-950 font-medium italic flex items-center gap-2">
                              <span className="text-base shrink-0">💬</span>
                              <span>{art.funnyMotto}</span>
                            </div>
                          )}

                          {/* Format Details */}
                          <div className="text-[11px] text-purple-900 bg-purple-50/80 p-3 rounded-2xl border border-purple-100/80 space-y-1">
                            <div className="flex justify-between font-bold">
                              <span>Format & Çözünürlük:</span>
                              <span className="text-purple-700">{art.format}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Çözünürlük Ölçüleri:</span>
                              <span>{art.dimensions || '4K Ultra HD (3840x2160)'}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Dosya Boyutu:</span>
                              <span>{art.fileSize}</span>
                            </div>
                          </div>
                        </div>

                        {/* Download Action Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setDownloadingId(art.id);
                            setTimeout(() => {
                              setDownloadingId(null);
                              // Trigger realistic image download via link creation
                              const link = document.createElement('a');
                              link.href = art.previewUrl;
                              link.download = `${art.id}-${art.title}.png`;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              alert(`🎉 "${art.title}" yüksek çözünürlükte indirilmeye başlandı! Keyifle kullanmanız dileğiyle ✨`);
                            }, 800);
                          }}
                          disabled={downloadingId === art.id}
                          className="w-full bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg active:scale-98"
                        >
                          <Download className={`w-4 h-4 text-amber-300 ${downloadingId === art.id ? 'animate-bounce' : ''}`} />
                          <span>{downloadingId === art.id ? 'İndirme Başlatılıyor...' : 'Sınırsız Ücretsiz İndir (4K ZIP)'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-8 max-w-lg">
                  {/* Profile Info Form */}
                  <form onSubmit={handleSaveSettings} className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5 border-b border-slate-200/80 pb-2.5">
                      <User className="w-4 h-4 text-purple-700" />
                      <span>Profil Bilgilerim</span>
                    </h4>

                    {savedSuccess && (
                      <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Profil bilgileriniz başarıyla güncellendi.</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-purple-400 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresiniz</label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-purple-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numarası</label>
                        <input
                          type="text"
                          placeholder="Örn: (555) 123 45 67"
                          value={userPhone}
                          onChange={(e) => setUserPhone(formatPhoneNumber(e.target.value))}
                          className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-purple-400 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition-colors"
                    >
                      Bilgileri Kaydet
                    </button>
                  </form>

                  {/* Saved Addresses Section */}
                  {renderAddressSection()}

                  {/* Password Change Form */}
                  <form onSubmit={handlePasswordChange} className="bg-purple-50/60 p-5 rounded-3xl border border-purple-100 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5 border-b border-purple-200/60 pb-2.5">
                      <Lock className="w-4 h-4 text-pink-600" />
                      <span>Şifre Değiştir</span>
                    </h4>

                    {passwordNotice && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        passwordNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {passwordNotice.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{passwordNotice.message}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mevcut Şifreniz</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Yeni Şifreniz</label>
                        <input
                          type="password"
                          placeholder="En az 6 karakter"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
                        <input
                          type="password"
                          placeholder="Şifreyi tekrar girin"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <Key className="w-3.5 h-3.5 text-pink-200" />
                      <span>Şifremi Güncelle</span>
                    </button>
                  </form>

                  {/* Sensitive Delete Account Section */}
                  <div className="bg-rose-50/80 p-5 rounded-3xl border border-rose-200 space-y-3 text-left">
                    <div className="flex items-center gap-2 text-rose-950">
                      <span className="text-base">💔</span>
                      <h5 className="text-xs font-black uppercase tracking-wider text-rose-950">Bizi Bırakıp Gidiyor musun?</h5>
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal block">
                      Aramızdan ayrılacağını duymak bizi gerçekten çok üzdü... 🥺 Hesabını sildiğinde biriktirdiğin tüm <strong>Happinio Puanların</strong>, evrimleşen sevimli maskot seviyen, kaydettiğin akıllı hediye tasarımların ve özel anıların kalıcı olarak silinecek. Seni Happinio ailesinde görmek bizim için büyük mutluluktu! Yine de gitmek istersen kapımız sana her zaman ardına kadar açık kalacak.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          'Bizi bırakıp gitmek istediğine gerçekten emin misin? 🥺\n\nHesabını sildiğinde kazanmış olduğun tüm Happinio puanların, üyelik seviyen ve kayıtlı hediye tasarımların kalıcı olarak silinecektir.'
                        );
                        if (confirmDelete) {
                          onUpdateProfile({
                            isLoggedIn: false,
                            name: '',
                            email: '',
                            points: 0,
                            level: 'Minik Çırak Happinio',
                          });
                          alert('Happinio ailesinden ayrıldığın için çok üzgünüz... Seni çok özleyeceğiz! 💔 Dilediğin zaman kapımız sana açık, tekrar görüşmek üzere 👋');
                          onClose();
                        }
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      <span>Hesabımı Kalıcı Olarak Sil</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* Selected Order Detail Modal Overlay */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 relative space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-pink-600" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Sipariş Detayı ({selectedOrderForDetail.trackingCode})
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-100 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Sipariş Durumu:</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                  Sipariş Alındı & Hazırlanıyor
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Takip Kodu:</span>
                <span className="font-mono font-black text-pink-700">{selectedOrderForDetail.trackingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Alıcı İsmi:</span>
                <span>{selectedOrderForDetail.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Teslimat Adresi:</span>
                <span className="text-right max-w-[200px] truncate">{selectedOrderForDetail.recipientAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Teslimat Tarihi:</span>
                <span>{selectedOrderForDetail.deliveryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Ödeme Yöntemi:</span>
                <span>{selectedOrderForDetail.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-pink-200 text-sm font-black text-slate-900">
                <span>Toplam Tutar:</span>
                <span className="text-pink-600">{selectedOrderForDetail.totalAmount} TL</span>
              </div>
            </div>

            {selectedOrderForDetail.giftNote && (
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-1">🎁 Özel Hediye Notu:</span>
                <p className="italic font-serif text-slate-800">"{selectedOrderForDetail.giftNote}"</p>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-pink-500" />
                <span>Hazırlık & Teslimat Süreci:</span>
              </h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>1. Sipariş Alındı & Ödeme Onaylandı</span>
                </div>
                <div className="flex items-center gap-2 text-pink-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>2. Happinio Atölyesinde Paket Hazırlanıyor</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                  <span>3. Özel Mesaj Kartınız Basılıyor & Paket Mühürleniyor</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                  <span>4. Kargo Firmasına Teslim / Yola Çıkış</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderForDetail(null)}
              className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-2xl shadow-md"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Membership Agreement Modal Popup */}
      <MembershipAgreementModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        onAccept={() => setRegTermsAccepted(true)}
      />

      {/* KVKK & Privacy Modal Popup */}
      <PrivacyTermsModal
        isOpen={isKvkkModalOpen}
        onClose={() => setIsKvkkModalOpen(false)}
      />

      {/* 4K Image Lightbox Preview Modal */}
      {activePreviewImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold truncate">{activePreviewImage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewImage(null)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image display */}
            <div className="relative bg-black max-h-[75vh] flex items-center justify-center p-2">
              <img
                src={activePreviewImage.url}
                alt={activePreviewImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
              <span className="text-xs text-slate-400 font-medium">4K Ultra HD Tam Ekran Önizleme (Happinio Üye Ayrıcalığı)</span>
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = activePreviewImage.url;
                  link.download = `${activePreviewImage.title}.png`;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  alert(`🎉 "${activePreviewImage.title}" 4K orijinal çözünürlükte indirilmeye başlandı!`);
                }}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Bu Görseli 4K İndir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
