import React, { useState } from 'react';
import { Calendar as CalendarIcon, Gift, Bell, Plus, Sparkles, Check, ChevronRight, Clock, Heart, Star, ShoppingBag, Info, X, Trash2, Lock, Globe } from 'lucide-react';
import { GiftBox, UserProfile } from '../types';
import { GIFT_BOXES } from '../data/mockData';

interface OccasionEvent {
  id: string;
  title: string;
  personName: string;
  relation: string;
  date: string; // YYYY-MM-DD or MM-DD
  month: number; // 0-11
  day: number;
  category: string;
  suggestedBoxId: string;
  reminderDays: number;
  isCustom?: boolean;
  ownerEmail?: string;
}

import { Language } from '../i18n/translations';

interface OccasionCalendarSectionProps {
  boxes?: GiftBox[];
  user?: UserProfile;
  lang?: Language;
  onOpenProfile?: () => void;
  onSelectBox?: (box: GiftBox) => void;
  onQuickAddToCart?: (box: GiftBox) => void;
}

export const PUBLIC_OCCASIONS: OccasionEvent[] = [
  // OCAK (Month 0)
  {
    id: 'pub-jan-1',
    title: 'Yeni Yıl 🎆',
    personName: 'Toplum & Genel',
    relation: 'Herkese Açık Takvim',
    date: '2026-01-01',
    month: 0,
    day: 1,
    category: 'Resmi Bayram & Kutlama',
    suggestedBoxId: 'BOX-033',
    reminderDays: 7,
  },
  {
    id: 'pub-jan-24',
    title: 'Uluslararası Eğitim Günü & Dünya Karşılıksız İyilik Günü 📖✨',
    personName: 'Toplum & Eğitim',
    relation: 'Herkese Açık Takvim',
    date: '2026-01-24',
    month: 0,
    day: 24,
    category: 'Eğitim & İyilik',
    suggestedBoxId: 'BOX-027',
    reminderDays: 5,
  },

  // ŞUBAT (Month 1)
  {
    id: 'pub-feb-11',
    title: 'Bilimde Kadın ve Kız Çocukları Günü 🔬',
    personName: 'Bilim & Kadın',
    relation: 'Herkese Açık Takvim',
    date: '2026-02-11',
    month: 1,
    day: 11,
    category: 'Bilim & Farkındalık',
    suggestedBoxId: 'BOX-025',
    reminderDays: 5,
  },

  // MART (Month 2)
  {
    id: 'pub-mar-8',
    title: 'Dünya Kadınlar Günü 💐',
    personName: 'Tüm Kadınlar',
    relation: 'Herkese Açık Takvim',
    date: '2026-03-08',
    month: 2,
    day: 8,
    category: 'Özel Gün & Kutlama',
    suggestedBoxId: 'BOX-025',
    reminderDays: 7,
  },
  {
    id: 'pub-mar-18',
    title: 'Çanakkale Zaferi 🇹🇷',
    personName: 'Tüm Türkiye',
    relation: 'Herkese Açık Takvim',
    date: '2026-03-18',
    month: 2,
    day: 18,
    category: 'Milli Anma & Zafer',
    suggestedBoxId: 'BOX-021',
    reminderDays: 5,
  },
  {
    id: 'pub-mar-21',
    title: 'Dünya Down Sendromu Günü & İlkbahar Ekinoksu 🌸',
    personName: 'Farkındalık & Doğa',
    relation: 'Herkese Açık Takvim',
    date: '2026-03-21',
    month: 2,
    day: 21,
    category: 'Farkındalık & Bahar',
    suggestedBoxId: 'BOX-022',
    reminderDays: 5,
  },

  // NİSAN (Month 3)
  {
    id: 'pub-apr-2',
    title: 'Otizm Farkındalık Günü 🧩',
    personName: 'Toplumsal Farkındalık',
    relation: 'Herkese Açık Takvim',
    date: '2026-04-02',
    month: 3,
    day: 2,
    category: 'Farkındalık',
    suggestedBoxId: 'BOX-023',
    reminderDays: 5,
  },
  {
    id: 'pub-apr-21',
    title: 'Dünya Yaratıcı Düşünme ve İnovasyon Günü 💡',
    personName: 'Sanat & İnovasyon',
    relation: 'Herkese Açık Takvim',
    date: '2026-04-21',
    month: 3,
    day: 21,
    category: 'İnovasyon & Tasarım',
    suggestedBoxId: 'BOX-029',
    reminderDays: 5,
  },
  {
    id: 'pub-apr-22',
    title: 'Dünya Günü 🌍',
    personName: 'Çevre & Doğa',
    relation: 'Herkese Açık Takvim',
    date: '2026-04-22',
    month: 3,
    day: 22,
    category: 'Çevre & Doğa',
    suggestedBoxId: 'BOX-026',
    reminderDays: 5,
  },
  {
    id: 'pub-apr-23',
    title: 'Ulusal Egemenlik ve Çocuk Bayramı 🎈',
    personName: 'Tüm Çocuklar & Türkiye',
    relation: 'Herkese Açık Takvim',
    date: '2026-04-23',
    month: 3,
    day: 23,
    category: 'Milli Bayram',
    suggestedBoxId: 'BOX-023',
    reminderDays: 7,
  },

  // MAYIS (Month 4)
  {
    id: 'pub-may-1',
    title: 'Emek ve Dayanışma Günü 🛠️',
    personName: 'Tüm Çalışanlar',
    relation: 'Herkese Açık Takvim',
    date: '2026-05-01',
    month: 4,
    day: 1,
    category: 'Resmi Bayram',
    suggestedBoxId: 'BOX-029',
    reminderDays: 5,
  },
  {
    id: 'pub-may-10',
    title: 'Anneler Günü 💖',
    personName: 'Tüm Anneler',
    relation: 'Herkese Açık Takvim',
    date: '2026-05-10',
    month: 4,
    day: 10,
    category: 'Özel Kutlama',
    suggestedBoxId: 'BOX-018',
    reminderDays: 7,
  },
  {
    id: 'pub-may-19',
    title: '19 Mayıs Gençlik ve Spor Bayramı / Gençlik Haftası 🏃',
    personName: 'Gençlik & Türkiye',
    relation: 'Herkese Açık Takvim',
    date: '2026-05-19',
    month: 4,
    day: 19,
    category: 'Milli Bayram',
    suggestedBoxId: 'BOX-028',
    reminderDays: 7,
  },
  {
    id: 'pub-may-27',
    title: 'Kurban Bayramı 🌙',
    personName: 'Tüm Aile & Sevdiklerimiz',
    relation: 'Herkese Açık Takvim',
    date: '2026-05-27',
    month: 4,
    day: 27,
    category: 'Dini Bayram',
    suggestedBoxId: 'BOX-024',
    reminderDays: 7,
  },
  {
    id: 'pub-may-28',
    title: 'Dünya Regl ve Hijyen Günü 🌸',
    personName: 'Sağlık & Hijyen Farkındalığı',
    relation: 'Herkese Açık Takvim',
    date: '2026-05-28',
    month: 4,
    day: 28,
    category: 'Sağlık & Farkındalık',
    suggestedBoxId: 'BOX-025',
    reminderDays: 5,
  },

  // HAZİRAN (Month 5)
  {
    id: 'pub-jun-5',
    title: 'Dünya Çevre Günü 🌿',
    personName: 'Doğa & Ekoloji',
    relation: 'Herkese Açık Takvim',
    date: '2026-06-05',
    month: 5,
    day: 5,
    category: 'Çevre & Sürdürülebilirlik',
    suggestedBoxId: 'BOX-026',
    reminderDays: 5,
  },
  {
    id: 'pub-jun-13',
    title: 'Global Wellness Günü 🧘‍♀️',
    personName: 'Sağlıklı Yaşam & İyi Hissetme',
    relation: 'Herkese Açık Takvim',
    date: '2026-06-13',
    month: 5,
    day: 13,
    category: 'Wellness & Sağlık',
    suggestedBoxId: 'BOX-005',
    reminderDays: 5,
  },
  {
    id: 'pub-jun-21',
    title: 'Babalar Günü 👔',
    personName: 'Tüm Babalar',
    relation: 'Herkese Açık Takvim',
    date: '2026-06-21',
    month: 5,
    day: 21,
    category: 'Özel Kutlama',
    suggestedBoxId: 'BOX-011',
    reminderDays: 7,
  },

  // TEMMUZ (Month 6)
  {
    id: 'pub-jul-10',
    title: 'Dünya Hukuk Günü ⚖️',
    personName: 'Hukukçular & Toplum',
    relation: 'Herkese Açık Takvim',
    date: '2026-07-10',
    month: 6,
    day: 10,
    category: 'Mesleki & Haklar',
    suggestedBoxId: 'BOX-004',
    reminderDays: 5,
  },
  {
    id: 'pub-jul-15',
    title: 'Dünya Gençlik Becerileri Günü 🛠️',
    personName: 'Gençler & Gelecek',
    relation: 'Herkese Açık Takvim',
    date: '2026-07-15',
    month: 6,
    day: 15,
    category: 'Gençlik & Beceriler',
    suggestedBoxId: 'BOX-003',
    reminderDays: 5,
  },
  {
    id: 'pub-jul-17',
    title: 'Dünya Emoji Günü 😀',
    personName: 'Mizah & İletişim',
    relation: 'Herkese Açık Takvim',
    date: '2026-07-17',
    month: 6,
    day: 17,
    category: 'Eğlence & Pop Kültür',
    suggestedBoxId: 'BOX-008',
    reminderDays: 3,
  },
  {
    id: 'pub-jul-30',
    title: 'Uluslararası Dostluk Günü 🤝',
    personName: 'Tüm Dostlar & Arkadaşlar',
    relation: 'Herkese Açık Takvim',
    date: '2026-07-30',
    month: 6,
    day: 30,
    category: 'Dostluk & Sosyal',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },

  // AĞUSTOS (Month 7)
  {
    id: 'pub-aug-12',
    title: 'Uluslararası Gençlik Günü 🌟',
    personName: 'Tüm Gençler',
    relation: 'Herkese Açık Takvim',
    date: '2026-08-12',
    month: 7,
    day: 12,
    category: 'Gençlik & Gelecek',
    suggestedBoxId: 'BOX-003',
    reminderDays: 5,
  },
  {
    id: 'pub-aug-30',
    title: 'Zafer Bayramı 🇹🇷',
    personName: 'Tüm Türkiye',
    relation: 'Herkese Açık Takvim',
    date: '2026-08-30',
    month: 7,
    day: 30,
    category: 'Milli Bayram',
    suggestedBoxId: 'BOX-021',
    reminderDays: 7,
  },

  // EYLÜL (Month 8)
  {
    id: 'pub-sep-8',
    title: 'Dünya Okuma Yazma Günü 📚',
    personName: 'Eğitim & Okuryazarlık',
    relation: 'Herkese Açık Takvim',
    date: '2026-09-08',
    month: 8,
    day: 8,
    category: 'Eğitim & Kültür',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },
  {
    id: 'pub-sep-21',
    title: 'Uluslararası Barış Günü 🕊️',
    personName: 'İnsanlık & Barış',
    relation: 'Herkese Açık Takvim',
    date: '2026-09-21',
    month: 8,
    day: 21,
    category: 'Evrensel Değerler',
    suggestedBoxId: 'BOX-010',
    reminderDays: 5,
  },
  {
    id: 'pub-sep-22',
    title: 'İşitme Engelliler Haftası 🤟',
    personName: 'Toplumsal Farkındalık',
    relation: 'Herkese Açık Takvim',
    date: '2026-09-22',
    month: 8,
    day: 22,
    category: 'Farkındalık & Erişim',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },
  {
    id: 'pub-sep-28',
    title: 'Uluslararası Bilgiye Evrensel Erişim Günü 🌐',
    personName: 'Bilgi & Özgürlük',
    relation: 'Herkese Açık Takvim',
    date: '2026-09-28',
    month: 8,
    day: 28,
    category: 'Erişim & Bilgi',
    suggestedBoxId: 'BOX-004',
    reminderDays: 5,
  },

  // EKİM (Month 9)
  {
    id: 'pub-oct-1',
    title: 'Meme Kanseri - DEHB - Küresel Çeşitlilik Farkındalık Ayı 🎀',
    personName: 'Sağlık & Farkındalık',
    relation: 'Herkese Açık Takvim',
    date: '2026-10-01',
    month: 9,
    day: 1,
    category: 'Farkındalık Ayı',
    suggestedBoxId: 'BOX-020',
    reminderDays: 5,
  },
  {
    id: 'pub-oct-7',
    title: 'Dünya İnsana Yakışır İş Günü 💼',
    personName: 'Çalışan Hakları',
    relation: 'Herkese Açık Takvim',
    date: '2026-10-07',
    month: 9,
    day: 7,
    category: 'Çalışan Hakları',
    suggestedBoxId: 'BOX-004',
    reminderDays: 5,
  },
  {
    id: 'pub-oct-10',
    title: 'Dünya Kapsayıcılık Günü 🤝',
    personName: 'Eşitlik & Kapsayıcılık',
    relation: 'Herkese Açık Takvim',
    date: '2026-10-10',
    month: 9,
    day: 10,
    category: 'Toplumsal Kapsayıcılık',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },
  {
    id: 'pub-oct-18',
    title: 'Görünmeyen Engeller Haftası 🎗️',
    personName: 'Toplumsal Destek',
    relation: 'Herkese Açık Takvim',
    date: '2026-10-18',
    month: 9,
    day: 18,
    category: 'Farkındalık & Destek',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },
  {
    id: 'pub-oct-29',
    title: 'Cumhuriyet Bayramı 🇹🇷',
    personName: 'Tüm Türkiye',
    relation: 'Herkese Açık Takvim',
    date: '2026-10-29',
    month: 9,
    day: 29,
    category: 'Milli Bayram',
    suggestedBoxId: 'BOX-021',
    reminderDays: 7,
  },

  // KASIM (Month 10)
  {
    id: 'pub-nov-10',
    title: 'Atatürk’ü Anma Günü & Barış ve Kalkınma İçin Dünya Bilim Günü 🕊️🔬',
    personName: 'Milli Anma & Bilim',
    relation: 'Herkese Açık Takvim',
    date: '2026-11-10',
    month: 10,
    day: 10,
    category: 'Milli Anma & Bilim',
    suggestedBoxId: 'BOX-021',
    reminderDays: 7,
  },
  {
    id: 'pub-nov-13',
    title: 'Dünya Nezaket / İyilik Günü ✨',
    personName: 'Nezaket & Sevgi',
    relation: 'Herkese Açık Takvim',
    date: '2026-11-13',
    month: 10,
    day: 13,
    category: 'İyilik & Nezaket',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },
  {
    id: 'pub-nov-19',
    title: 'Dünya Kadın Girişimciler Günü 👩‍💼',
    personName: 'Girişimci Kadınlar',
    relation: 'Herkese Açık Takvim',
    date: '2026-11-19',
    month: 10,
    day: 19,
    category: 'Girişimcilik & İlham',
    suggestedBoxId: 'BOX-020',
    reminderDays: 5,
  },
  {
    id: 'pub-nov-20',
    title: 'Dünya Çocuk Hakları Günü 🧸',
    personName: 'Çocuklar & Gelecek',
    relation: 'Herkese Açık Takvim',
    date: '2026-11-20',
    month: 10,
    day: 20,
    category: 'Çocuk Hakları',
    suggestedBoxId: 'BOX-023',
    reminderDays: 5,
  },
  {
    id: 'pub-nov-24',
    title: 'Öğretmenler Günü 🍎',
    personName: 'Tüm Öğretmenler',
    relation: 'Herkese Açık Takvim',
    date: '2026-11-24',
    month: 10,
    day: 24,
    category: 'Özel Gün & Eğitim',
    suggestedBoxId: 'BOX-019',
    reminderDays: 7,
  },

  // ARALIK (Month 11)
  {
    id: 'pub-dec-3',
    title: 'Dünya Engelliler Günü ♿',
    personName: 'Erişilebilirlik & Farkındalık',
    relation: 'Herkese Açık Takvim',
    date: '2026-12-03',
    month: 11,
    day: 3,
    category: 'Farkındalık & Dayanışma',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },
  {
    id: 'pub-dec-5',
    title: 'Dünya Gönüllüler Günü 🤲',
    personName: 'Gönüllüler & Sivil Toplum',
    relation: 'Herkese Açık Takvim',
    date: '2026-12-05',
    month: 11,
    day: 5,
    category: 'Gönüllülük',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },
  {
    id: 'pub-dec-10',
    title: 'İnsan Hakları Günü 📜',
    personName: 'Evrensel Haklar',
    relation: 'Herkese Açık Takvim',
    date: '2026-12-10',
    month: 11,
    day: 10,
    category: 'İnsan Hakları',
    suggestedBoxId: 'BOX-001',
    reminderDays: 5,
  },
  {
    id: 'pub-dec-31',
    title: 'Yıl Sonu / Karar Verme Günü 🎯',
    personName: 'Yeni Başlangıçlar',
    relation: 'Herkese Açık Takvim',
    date: '2026-12-31',
    month: 11,
    day: 31,
    category: 'Yılbaşı & Hedefler',
    suggestedBoxId: 'BOX-017',
    reminderDays: 7,
  },
];

const MONTH_NAMES_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export default function OccasionCalendarSection({
  boxes = GIFT_BOXES,
  user,
  onOpenProfile,
  onSelectBox,
  onQuickAddToCart,
}: OccasionCalendarSectionProps) {
  // Store user-created private custom occasions locally
  const [customOccasions, setCustomOccasions] = useState<OccasionEvent[]>(() => {
    try {
      const saved = localStorage.getItem('happinio_user_custom_occasions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Combine public occasions + ONLY current logged in user's custom private occasions
  const visibleCustomOccasions = user?.isLoggedIn
    ? customOccasions.filter((o) => !o.ownerEmail || o.ownerEmail === user.email)
    : [];

  const occasions = [...visibleCustomOccasions, ...PUBLIC_OCCASIONS];

  const [selectedOccasionId, setSelectedOccasionId] = useState<string>('pub-aug-12');
  const [activeMonthFilter, setActiveMonthFilter] = useState<number | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [reminderSavedNotice, setReminderSavedNotice] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    if (!user?.isLoggedIn) {
      if (onOpenProfile) {
        onOpenProfile();
      } else {
        alert('Kendi özel günlerinizi eklemek ve sadece hesabınızda saklamak için lütfen giriş yapın.');
      }
      return;
    }
    setShowAddModal(true);
  };

  // New Occasion Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPerson, setNewPerson] = useState('');
  const [newRelation, setNewRelation] = useState('Eş / Sevgili');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('Doğum Günü');
  const [selectedBoxForNew, setSelectedBoxForNew] = useState('BOX-001');
  const [reminderDaysForNew, setReminderDaysForNew] = useState(7);

  const selectedOccasion = occasions.find((o) => o.id === selectedOccasionId) || occasions[0];
  const matchedBox = boxes.find((b) => b.id === selectedOccasion?.suggestedBoxId) || boxes[0];

  const filteredOccasions = occasions.filter((o) => {
    if (activeMonthFilter === 'all') return true;
    return o.month === activeMonthFilter;
  });

  const handleAddOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPerson || !newDate) return;

    const parsedDate = new Date(newDate);
    const month = parsedDate.getMonth();
    const day = parsedDate.getDate();

    const newOccasion: OccasionEvent = {
      id: `occ-custom-${Date.now()}`,
      title: newTitle,
      personName: newPerson,
      relation: newRelation,
      date: newDate,
      month,
      day,
      category: newCategory,
      suggestedBoxId: selectedBoxForNew,
      reminderDays: reminderDaysForNew,
      isCustom: true,
      ownerEmail: user?.email,
    };

    const updatedCustoms = [newOccasion, ...customOccasions];
    setCustomOccasions(updatedCustoms);
    try {
      localStorage.setItem('happinio_user_custom_occasions', JSON.stringify(updatedCustoms));
    } catch (err) {
      console.error(err);
    }

    setSelectedOccasionId(newOccasion.id);
    setShowAddModal(false);

    // Reset Form
    setNewTitle('');
    setNewPerson('');
    setNewDate('');

    setReminderSavedNotice(`" ${newTitle} " özel gününüz kişisel hesabınıza başarıyla kaydedildi! Bu özel gün başkalarına gösterilmez. 🔒✨`);
    setTimeout(() => setReminderSavedNotice(null), 5000);
  };

  const handleDeleteCustomOccasion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bu özel günü hesabınızdan silmek istediğinize emin misiniz?')) return;

    const updatedCustoms = customOccasions.filter((o) => o.id !== id);
    setCustomOccasions(updatedCustoms);
    try {
      localStorage.setItem('happinio_user_custom_occasions', JSON.stringify(updatedCustoms));
    } catch (err) {
      console.error(err);
    }

    if (selectedOccasionId === id) {
      setSelectedOccasionId(PUBLIC_OCCASIONS[0].id);
    }

    setReminderSavedNotice('Özel gün hesabınızdan silindi.');
    setTimeout(() => setReminderSavedNotice(null), 3000);
  };

  const handleToggleReminder = (id: string) => {
    setReminderSavedNotice('E-Posta hatırlatması aktifleştirildi! Hediye gününden önce tarafınıza e-posta bildirimi gönderilecektir. 🔔');
    setTimeout(() => setReminderSavedNotice(null), 4000);
  };

  return (
    <section id="occasion-calendar" className="pt-6 pb-16 bg-purple-50/20 border-t border-b border-purple-100/60 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif leading-tight tracking-tight">
            Özel Gün Takvimi <br />
            <span className="text-purple-800 italic">Joy-Genie Eşleştirmesi</span> 🎁
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Sevdiklerinizin özel günlerini asla unutmamanız için tasarlandı. Tarihleri kaydedin, Happinio yapay zekası en anlamlı hediye kutusunu otomatik olarak eşleştirip gününden önce size hatırlatsın!
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <span className="text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-purple-100 shadow-2xs flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Otomatik E-Posta Hatırlatması</span>
            </span>
            <span className="text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-purple-100 shadow-2xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Kişiye Özel Kutu Önerisi</span>
            </span>
          </div>
        </div>

        {/* Global Success Banner Notice */}
        {reminderSavedNotice && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{reminderSavedNotice}</span>
            </div>
            <button onClick={() => setReminderSavedNotice(null)} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Month Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8 bg-white p-2.5 rounded-2xl border border-purple-100 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            <button
              onClick={() => setActiveMonthFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeMonthFilter === 'all'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              Tüm Yıl ({occasions.length})
            </button>
            {MONTH_NAMES_TR.map((mName, idx) => {
              const countInMonth = occasions.filter((o) => o.month === idx).length;
              if (countInMonth === 0) return null;
              return (
                <button
                  key={mName}
                  onClick={() => setActiveMonthFilter(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                    activeMonthFilter === idx
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <span>{mName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeMonthFilter === idx ? 'bg-white/30 text-white' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {countInMonth}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Kendi Özel Gününü Ekle</span>
          </button>
        </div>

        {/* Main Grid: Occasions List vs Smart Gift Matcher Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Events Timeline Card (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-[32px] border border-purple-100 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-50">
              <h3 className="text-sm font-bold text-slate-800 font-serif flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-purple-600" />
                <span>Yaklaşan Özel Günler</span>
              </h3>
              <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                {filteredOccasions.length} Kayıtlı Gün
              </span>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredOccasions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Bu filtre için gösterilecek özel gün bulunmuyor.
                </div>
              ) : (
                filteredOccasions.map((occ) => {
                  const isSelected = occ.id === selectedOccasionId;
                  const box = boxes.find((b) => b.id === occ.suggestedBoxId);

                  return (
                    <div
                      key={occ.id}
                      onClick={() => setSelectedOccasionId(occ.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-purple-50/90 border-purple-300 shadow-xs ring-2 ring-purple-300/40'
                          : 'bg-white hover:bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Date Badge */}
                        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-purple-700 text-white border-purple-700' : 'bg-purple-50 text-purple-800 border-purple-100'
                        }`}>
                          <span className="text-[10px] uppercase font-extrabold leading-none">
                            {MONTH_NAMES_TR[occ.month]?.slice(0, 3)}
                          </span>
                          <span className="text-base font-black leading-tight">
                            {occ.day}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{occ.title}</h4>
                            {occ.isCustom ? (
                              <span className="text-[9px] bg-amber-100/90 text-amber-900 px-1.5 py-0.2 rounded-md font-bold flex items-center gap-1 border border-amber-200">
                                <Lock className="w-2.5 h-2.5 text-amber-700" />
                                <span>Kişisel (Gizli)</span>
                              </span>
                            ) : (
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md font-medium flex items-center gap-0.5">
                                <Globe className="w-2.5 h-2.5 text-slate-400" />
                                <span>Genel</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{occ.personName} • <span className="text-purple-700 font-medium">{occ.relation}</span></p>
                          {box && (
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 flex items-center gap-1">
                              <Gift className="w-3 h-3 text-purple-500" />
                              <span>{box.name}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {occ.isCustom && (
                          <button
                            onClick={(e) => handleDeleteCustomOccasion(occ.id, e)}
                            title="Bu özel günü hesabımdan sil"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-purple-700 translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Joy-Genie Matched Gift Box Display (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] border border-purple-100 p-6 sm:p-8 shadow-md relative overflow-hidden">
            
            {/* Ambient Background Gradient Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative space-y-6">
              
              {/* Event Overview Banner */}
              <div className="bg-purple-900 text-white p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm border border-purple-800">
                <div>
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>JOY-GENIE AKILLI EŞLEŞTİRME SONUCU</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif mt-1">
                    {selectedOccasion.title}
                  </h3>
                  <p className="text-xs text-purple-200 mt-0.5">
                    {selectedOccasion.personName} ({selectedOccasion.relation}) • Tarih: <span className="font-bold text-white">{selectedOccasion.day} {MONTH_NAMES_TR[selectedOccasion.month]}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleToggleReminder(selectedOccasion.id)}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl backdrop-blur-md flex items-center gap-1.5 transition-all border border-white/20 shrink-0"
                >
                  <Bell className="w-4 h-4 text-amber-300" />
                  <span>{selectedOccasion.reminderDays} Gün Önce Hatırlat</span>
                </button>
              </div>

              {/* Matched Box Card */}
              {matchedBox && (
                <div className="bg-purple-50/50 rounded-3xl p-5 border border-purple-100 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  {/* Image */}
                  <div className="sm:col-span-5 relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-sm group bg-white">
                    <img
                      src={matchedBox.image}
                      alt={matchedBox.name}
                      referrerPolicy="no-referrer"
                      onClick={() => onSelectBox && onSelectBox(matchedBox)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer hover:opacity-95 transition-opacity duration-300"
                    />
                    {matchedBox.badge && (
                      <span className="absolute top-3 left-3 bg-purple-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-xs">
                        {matchedBox.badge}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="sm:col-span-7 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        🎯 Kişiye Özel Öneri
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{matchedBox.rating}</span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-serif leading-snug">
                      {matchedBox.name}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {matchedBox.description}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-purple-100">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Kutu Fiyatı:</span>
                        <span className="text-lg font-black text-purple-800">{matchedBox.price} TL</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {onSelectBox && (
                          <button
                            onClick={() => onSelectBox(matchedBox)}
                            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 rounded-xl border border-purple-200 transition-all shadow-2xs"
                          >
                            İçeriği Gör
                          </button>
                        )}

                        {onQuickAddToCart && (
                          <button
                            onClick={() => onQuickAddToCart(matchedBox)}
                            className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Sepete Ekle</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Joy-Genie Insight Note */}
              <div className="p-4 rounded-2xl bg-white border border-purple-100 flex items-start gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs font-serif">
                  ✨
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Joy-Genie İpucu:</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Sipariş verdiğinizde kutunun içine samimi dilek kartınız ücretsiz eklenecektir. Dilerseniz sipariş adımında kendi mesajınızı belirtebilirsiniz.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal: Add Custom Occasion */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-xl border border-purple-100 relative animate-fadeIn space-y-5">
              
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-700" />
                  <h3 className="text-base font-bold text-slate-800 font-serif">Kendi Özel Gününü Ekle</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Privacy Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-bold block text-amber-950">Gizlilik & Kişisel Takvim Güvencesi:</strong>
                  Eklediğiniz bu özel gün yalnızca siz (<span className="font-bold underline">{user?.email}</span>) hesabınıza giriş yaptığınızda size özel görünecektir. Başkaları veya genel ziyaretçiler bu tarihi göremez.
                </div>
              </div>

              <form onSubmit={handleAddOccasion} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kutlama Başlığı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Annemin Emeklilik Günü, Eşimin Doğum Günü..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kişi / İsim *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ayşe"
                      value={newPerson}
                      onChange={(e) => setNewPerson(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Yakınlık Derecesi</label>
                    <select
                      value={newRelation}
                      onChange={(e) => setNewRelation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 text-xs bg-white"
                    >
                      <option value="Eş / Sevgili">Eş / Sevgili</option>
                      <option value="En Yakın Arkadaş">En Yakın Arkadaş</option>
                      <option value="Anne / Baba">Anne / Baba</option>
                      <option value="Kardeş">Kardeş</option>
                      <option value="İş Arkadaşı">İş Arkadaşı</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kutlama Tarihi *</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 text-xs bg-white"
                    >
                      <option value="Doğum Günü">Doğum Günü</option>
                      <option value="Yıldönümü">Yıldönümü</option>
                      <option value="Yeni İş & Terfi">Yeni İş & Terfi</option>
                      <option value="Tebrik & Teşekkür">Tebrik & Teşekkür</option>
                      <option value="Memleket & Şehir">Memleket & Şehir</option>
                      <option value="Özel An">Özel An</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Joy-Genie Hediye Kutusunu Eşleştir</label>
                  <select
                    value={selectedBoxForNew}
                    onChange={(e) => setSelectedBoxForNew(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 text-xs bg-white"
                  >
                    {boxes.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.price} TL)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hatırlatma Süresi</label>
                  <select
                    value={reminderDaysForNew}
                    onChange={(e) => setReminderDaysForNew(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 text-xs bg-white"
                  >
                    <option value={3}>3 Gün Önce</option>
                    <option value={5}>5 Gün Önce</option>
                    <option value={7}>7 Gün Önce (Tavsiye Edilen)</option>
                    <option value={10}>10 Gün Önce</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-sm"
                  >
                    Özel Günü Kaydet ✨
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
