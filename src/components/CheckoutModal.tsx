import React, { useState, useEffect } from 'react';
import { CartItem, Order, UserProfile, SavedAddress } from '../types';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  X,
  Package,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Check,
  MapPin,
  Plus,
  BookmarkCheck,
  Home,
  Building2,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  totalAmount: number;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
  isPage?: boolean;
  user?: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
}

// Data structures for Turkish Provinces, Districts and Neighborhoods
export const DISTRICTS_DATA: Record<string, string[]> = {
  'İstanbul': [
    'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 
    'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 
    'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 
    'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 
    'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 
    'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'
  ],
  'Ankara': [
    'Akyurt', 'Altındağ', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk', 
    'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kahramankazan', 
    'Kalecik', 'Keçiören', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı', 'Pursaklar', 
    'Sincan', 'Şereflikoçhisar', 'Yenimahalle'
  ],
  'İzmir': [
    'Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca', 
    'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 
    'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 
    'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'
  ],
  'Eskişehir': [
    'Alpu', 'Beylikova', 'Çifteler', 'Günyüzü', 'Han', 'İnönü', 'Mahmudiye', 'Mihalgazi', 
    'Mihalıççık', 'Odunpazarı', 'Sarıcakaya', 'Seyitgazi', 'Sivrihisar', 'Tepebaşı'
  ],
  'Bursa': [
    'Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik', 'Karacabey', 
    'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhaneli', 'Orhangazi', 
    'Osmangazi', 'Yenişehir', 'Yıldırım'
  ],
  'Antalya': [
    'Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 
    'Gündoğmuş', 'İbradı', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı', 'Korkuteli', 'Manavgat', 
    'Muratpaşa', 'Serik', 'Kumluca'
  ],
  'Adana': [
    'Aladağ', 'Ceyhan', 'Çukurova', 'Feke', 'İmamoğlu', 'Karaisalı', 'Karataş', 'Kozan', 
    'Pozantı', 'Saimbeyli', 'Sarıçam', 'Seyhan', 'Tufanbeyli', 'Yumurtalık', 'Yüreğir'
  ]
};

export const NEIGHBORHOODS_DATA: Record<string, string[]> = {
  // Eskişehir Tepebaşı & Odunpazarı
  'Tepebaşı': [
    'Boyacıoğlu Mah.', 'Şirintepe Mah.', 'Yenibağlar Mah.', 'Eskibağlar Mah.', 
    'Bahçelievler Mah.', 'Uluönder Mah.', 'Batıkent Mah.', 'Çamlıca Mah.', 
    'Sütlüce Mah.', 'Yeşiltepe Mah.', 'Zafer Mah.', 'Fatih Mah.', 
    'Sakintepe Mah.', 'Hoşnudiye Mah.', 'Ömerağa Mah.', 'Şeker Mah.', 
    'Zincirlikuyu Mah.', 'Cumhuriyet Mah.', 'Ertuğrulgazi Mah.', 'Sazova Mah.', 
    'Güllük Mah.', 'Şara Höyük Mah.', 'Mamuca Mah.'
  ],
  'Odunpazarı': [
    'Akarbaşı Mah.', 'Vişnelik Mah.', 'Kırmızıtoprak Mah.', 'Yenikent Mah.', 
    'Gökmeydan Mah.', 'Erenköy Mah.', 'Büyükdere Mah.', 'Yıldıztepe Mah.', 
    'Gündoğdu Mah.', '71 Evler Mah.', 'Emek Mah.', 'Vadişehir Mah.', 
    'Çankaya Mah.', 'Osmangazi Mah.', 'Arifiye Mah.', 'İstiklal Mah.', 
    'Deliklitaş Mah.', 'Kurtuluş Mah.'
  ],

  // İstanbul Kadıköy, Beşiktaş, Şişli, Üsküdar, Fatih, Sarıyer, Kartal, Maltepe, Bakırköy, Pendik, Ataşehir, Beylikdüzü
  'Kadıköy': ['Caferağa Mah.', 'Moda', 'Caddebostan Mah.', 'Fenerbahçe Mah.', 'Suadiye Mah.', 'Acıbadem Mah.', 'Bostancı Mah.', 'Göztepe Mah.', 'Erenköy Mah.', 'Kozyatağı Mah.', 'Merdivenköy Mah.', 'Fikirtepe Mah.', 'Hasanpaşa Mah.'],
  'Beşiktaş': ['Bebek Mah.', 'Arnavutköy Mah.', 'Ortaköy Mah.', 'Levent Mah.', 'Ulus Mah.', 'Gayrettepe Mah.', 'Etiler Mah.', 'Abbasağa Mah.', 'Cihannüma Mah.', 'Dikilitaş Mah.', 'Mecidiye Mah.', 'Muradiye Mah.', 'Türkali Mah.'],
  'Şişli': ['Nişantaşı', 'Teşvikiye Mah.', 'Mecidiyeköy Mah.', 'Feriköy Mah.', 'Halaskargazi Mah.', 'Esentepe Mah.', 'Fulya Mah.', 'Gülbahar Mah.', 'Kuştepe Mah.', 'Pangaltı', 'İzzetpaşa Mah.'],
  'Üsküdar': ['Kuzguncuk Mah.', 'Beylerbeyi Mah.', 'Çengelköy Mah.', 'Altunizade Mah.', 'Kısıklı Mah.', 'Ünalan Mah.', 'Acıbadem Mah.', 'Muratereis Mah.', 'Salacak Mah.', 'Sultantepe Mah.', 'Yavuztürk Mah.'],
  'Fatih': ['Sultanahmet Mah.', 'Balat Mah.', 'Eminönü', 'Karagümrük Mah.', 'Aksaray Mah.', 'Koca Mustafa Paşa Mah.', 'Cerrahpaşa Mah.', 'Haseki Sultan Mah.', 'Mevlanakapı Mah.', 'Yedikule Mah.', 'Tahtakale Mah.'],
  'Sarıyer': ['Tarabya Mah.', 'İstinye Mah.', 'Yeniköy Mah.', 'Zekeriyaköy Mah.', 'Maslak Mah.', 'Baltalimanı Mah.', 'Ayazağa Mah.', 'Emirgan Mah.', 'Kireçburnu Mah.', 'Pınar Mah.', 'Rumelihisarı Mah.'],
  'Kartal': ['Kordonboyu Mah.', 'Atalar Mah.', 'Orhantepe Mah.', 'Soğanlık Mah.', 'Karlıtepe Mah.', 'Petrol İş Mah.', 'Yali Mah.', 'Yukarı Mah.'],
  'Maltepe': ['Küçükyalı Mah.', 'Altıntepe Mah.', 'İdealtepe Mah.', 'Zümrütevler Mah.', 'Başıbüyük Mah.', 'Cevizli Mah.', 'Feyzullah Mah.', 'Yalı Mah.'],
  'Bakırköy': ['Yeşilköy Mah.', 'Ataköy 1. Kısım', 'Ataköy 2-5-6. Kısım', 'Ataköy 7-8-9-10. Kısım', 'Florya Mah.', 'Kartaltepe Mah.', 'Zuhuratbaba Mah.', 'Şenlikköy Mah.', 'Yeşilyurt Mah.'],
  'Pendik': ['Batı Mah.', 'Yeni Mahalle', 'Bahçelievler Mah.', 'Kurtköy Mah.', 'Çamlık Mah.', 'Doğu Mah.', 'Esenyalı Mah.', 'Güzelyalı Mah.', 'Kavakpınar Mah.'],
  'Ataşehir': ['Barbaros Mah.', 'Atatürk Mah.', 'Küçükbakkalköy Mah.', 'İçerenköy Mah.', 'Kayışdağı Mah.', 'Örnek Mah.', 'Esatpaşa Mah.'],
  'Beylikdüzü': ['Adnan Kahveci Mah.', 'Barış Mah.', 'Cumhuriyet Mah.', 'Kavaklı Mah.', 'Marmara Mah.', 'Yakuplu Mah.', 'Gürpınar Mah.'],

  // Ankara Çankaya, Keçiören, Yenimahalle, Mamak, Etimesgut
  'Çankaya': ['Kızılay', 'Tunalı Hilmi', 'Bahçelievler Mah.', 'Öveçler Mah.', 'Karakusunlar Mah.', 'Yıldız Mah.', 'Anıttepe Mah.', 'Çayyolu Mah.', 'Alacaatlı Mah.', 'Kavaklıdere Mah.', 'Ayrancı Mah.', 'Dikmen Mah.', 'Bilkent'],
  'Keçiören': ['Etlik Mah.', 'Ayvalı Mah.', 'Bağlum Mah.', 'Ufuktepe Mah.', 'Şenlik Mah.', 'Ovacık Mah.', 'Sancaktepe Mah.', 'Yükseltepe Mah.', '19 Mayıs Mah.'],
  'Yenimahalle': ['Batıkent', 'Demetevler Mah.', 'Ostim', 'İvedik Mah.', 'Macunköy Mah.', 'Kardelen Mah.', 'İlkyerleşim Mah.', 'Ergazi Mah.', 'Turgut Özal Mah.'],
  'Mamak': ['Akdere Mah.', 'Tuzluçayır Mah.', 'Abidinpaşa Mah.', 'Ege Mah.', 'Şahintepe Mah.', 'Boğaziçi Mah.', 'Yeşilbayır Mah.'],
  'Etimesgut': ['Eryaman Mah.', 'Elvankent', 'Bağlıca Mah.', 'Piyade Mah.', 'Alsancak Mah.', 'Şeker Mah.', 'Göksu Mah.'],

  // İzmir Konak, Karşıyaka, Bornova, Buca, Çeşme, Karabağlar, Aliağa
  'Konak': ['Alsancak', 'Göztepe Mah.', 'Karataş', 'Güzelyalı Mah.', 'Kahramanlar Mah.', 'Kültür Mah.', 'Mimar Sinan Mah.', 'Gültepe Mah.', 'Basmane'],
  'Karşıyaka': ['Bostanlı Mah.', 'Mavişehir Mah.', 'Alaybey Mah.', 'Nergiz Mah.', 'Aksoy Mah.', 'Bahçelievler Mah.', 'Şemikler Mah.', 'Atakent Mah.'],
  'Bornova': ['Kazımdirik Mah.', 'Özkanlar', 'Evka-3 Mah.', 'Bornova Merkez', 'Atatürk Mah.', 'Erzene Mah.', 'Mevlana Mah.', 'Yeşilova Mah.'],
  'Buca': ['Şirinyer', 'Buca Koop.', 'Adatepe Mah.', 'Kuruçeşme Mah.', 'Yıldız Mah.', 'Efeler Mah.', 'Vali Rahmi Bey Mah.'],
  'Çeşme': ['Alaçatı', 'Ilıca Mah.', 'Dalyan Mah.', 'Boyalık Mah.', 'Çiftlik Mah.', 'Musalla Mah.', 'Reisdere Mah.'],

  // Bursa Nilüfer, Osmangazi, Yıldırım, Mudanya, İnegöl
  'Nilüfer': ['Fethiye Mah.', 'İhsaniye Mah.', 'Özlüce', 'Görükle', 'Ataevler Mah.', 'Beşevler Mah.', 'Karaman Mah.', 'Altınşehir Mah.', 'Üçevler Mah.', '23 Nisan Mah.'],
  'Osmangazi': ['Çekirge Mah.', 'Altıparmak', 'Dikkaldırım Mah.', 'Kükürtlü Mah.', 'Doğanbey Mah.', 'Reyhan Mah.', 'Hamitler Mah.', 'Hürriyet Mah.', 'Bağlarbaşı Mah.'],
  'Yıldırım': ['Yavuzselim Mah.', 'Şükraniye Mah.', 'Esenenevler Mah.', 'Millet Mah.', 'Mimar Sinan Mah.', 'Arabayatağı Mah.', 'Erikli Mah.'],
  'Mudanya': ['Halitpaşa Mah.', 'Güzelyalı Mah.', 'Ömerbey Mah.', 'Şükrüçavuş Mah.', 'Hasanbey Mah.'],
  'İnegöl': ['Kemalpaşa Mah.', 'Hamidiye Mah.', 'Yenice Mah.', 'Süleymaniye Mah.', 'Mahmudiye Mah.', 'Turgutalp Mah.'],

  // Antalya Muratpaşa, Konyaaltı, Kepez
  'Muratpaşa': ['Fener Mah.', 'Lara', 'Şirinyalı Mah.', 'Meltem Mah.', 'Çağlayan Mah.', 'Meydankavağı Mah.', 'Güzeloba Mah.', 'Kılınçarslan Mah. (Kaleiçi)'],
  'Konyaaltı': ['Liman Mah.', 'Hurma Mah.', 'Gürsu Mah.', 'Arapsuyu Mah.', 'Sarısu Mah.', 'Toros Mah.', 'Altınkum Mah.', 'Uncalı Mah.'],
  'Kepez': ['Dokuma', 'Varsak', 'Ahatlı Mah.', 'Kültür Mah.', 'Gülveren Mah.', 'Sütçüler Mah.', 'Güneş Mah.'],

  // Adana Seyhan, Çukurova
  'Seyhan': ['Reşatbey Mah.', 'Gazipaşa Mah.', 'Cemalpaşa Mah.', 'Ziyapaşa Mah.', 'Fatih Mah.', 'Yeşilyurt Mah.', 'Gürselpaşa Mah.', 'Kuruköprü Mah.'],
  'Çukurova': ['Turgut Özal', 'Kenan Evren', 'Huzurevleri Mah.', 'Güzelyalı Mah.', 'Belediye Evleri Mah.', 'Yurt Mah.', 'Toros Mah.', 'Karslılar Mah.']
};

export const TURKISH_PROVINCES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
  'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
  'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
  'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
].sort((a, b) => a.localeCompare(b, 'tr'));

export default function CheckoutModal({
  isOpen,
  cartItems,
  totalAmount,
  onClose,
  onOrderCompleted,
  isPage = false,
  user,
  onUpdateProfile,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<'address' | 'payment' | '3d_secure' | 'success'>('address');
  
  // Validation error states
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState(false);

  // Form fields
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  
  // Split Address Fields
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [customNeighborhood, setCustomNeighborhood] = useState('');

  // Saved address quick select state
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | 'new'>('');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState<boolean>(false);
  const [newAddressTitle, setNewAddressTitle] = useState<string>('');

  const fillAddressFromSaved = (addr: SavedAddress) => {
    setRecipientName(addr.recipientName || user?.name || '');
    setRecipientPhone(addr.phone || user?.phone || '');
    setProvince(addr.province || '');
    setDistrict(addr.district || '');
    setNeighborhood(addr.neighborhood || '');
    setPostalCode(addr.postalCode || '');
    setAddressDetails(addr.addressDetails || '');
  };

  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      if (defaultAddr && (!selectedSavedAddressId || selectedSavedAddressId === '')) {
        setSelectedSavedAddressId(defaultAddr.id);
        fillAddressFromSaved(defaultAddr);
      }
    } else if (user) {
      if (user.name && !recipientName) setRecipientName(user.name);
      if (user.phone && !recipientPhone) setRecipientPhone(user.phone);
    }
  }, [user, isOpen]);

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedSavedAddressId(addr.id);
    fillAddressFromSaved(addr);
    setSaveAddressToProfile(false);
  };

  const handleSelectNewAddress = () => {
    setSelectedSavedAddressId('new');
    setRecipientName(user?.name || '');
    setRecipientPhone(user?.phone || '');
    setProvince('');
    setDistrict('');
    setNeighborhood('');
    setPostalCode('');
    setAddressDetails('');
    setSaveAddressToProfile(true);
    setNewAddressTitle('');
  };

  const [deliveryType, setDeliveryType] = useState<'immediate' | 'future'>('immediate');
  const [customDeliveryDate, setCustomDeliveryDate] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const checkoutGiftNote = cartItems.map(item => item.giftNote).filter(Boolean).join(' | ') || '';

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // 3D Secure SMS Code
  const [smsCode, setSmsCode] = useState('123456');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [recipientAddress, setRecipientAddress] = useState('');

  // Dropdown lists
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [neighborhoodsList, setNeighborhoodsList] = useState<string[]>([]);

  // Update district list when province changes
  useEffect(() => {
    if (province) {
      let list: string[] = [];
      if (DISTRICTS_DATA[province]) {
        list = [...DISTRICTS_DATA[province]];
      } else {
        // Fallback for other provinces
        list = [
          `${province} Merkez`,
          'Atatürk',
          'Cumhuriyet',
          'Hürriyet'
        ];
      }
      list.push('Diğer (Kendim Yazacağım)');
      setDistrictsList(list);
      setDistrict('');
      setNeighborhood('');
      setCustomDistrict('');
      setCustomNeighborhood('');
    } else {
      setDistrictsList([]);
      setDistrict('');
      setNeighborhood('');
      setCustomDistrict('');
      setCustomNeighborhood('');
    }
  }, [province]);

  // Update neighborhood list when district changes
  useEffect(() => {
    if (district) {
      if (district === 'Diğer (Kendim Yazacağım)') {
        setNeighborhoodsList(['Diğer (Kendim Yazacağım)']);
        setNeighborhood('Diğer (Kendim Yazacağım)');
      } else {
        let list: string[] = [];
        if (NEIGHBORHOODS_DATA[district]) {
          list = [...NEIGHBORHOODS_DATA[district]];
        } else {
          // Fallback for other districts
          list = [
            'Atatürk Mah.',
            'Cumhuriyet Mah.',
            'Hürriyet Mah.',
            'Fatih Mah.',
            'Yeni Mahalle'
          ];
        }
        list.push('Diğer (Kendim Yazacağım)');
        setNeighborhoodsList(list);
        setNeighborhood('');
      }
      setCustomNeighborhood('');
    } else {
      setNeighborhoodsList([]);
      setNeighborhood('');
      setCustomNeighborhood('');
    }
  }, [district]);

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

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    const errorsMap: Record<string, string> = {};

    if (!recipientName.trim()) {
      errorsMap.recipientName = 'Alıcı Adı Soyadı zorunludur.';
    }
    if (!recipientPhone.trim()) {
      errorsMap.recipientPhone = 'Alıcı Telefon Numarası zorunludur.';
    } else {
      const phoneRegex = /^\(5\d{2}\)\s\d{3}\s\d{2}\s\d{2}$/;
      if (!phoneRegex.test(recipientPhone)) {
        errorsMap.recipientPhone = 'Geçerli bir telefon giriniz: (5xx) xxx xx xx';
      }
    }

    if (!province) {
      errorsMap.province = 'Lütfen listeden İl seçiniz.';
    }
    if (!district) {
      errorsMap.district = 'Lütfen listeden İlçe seçiniz.';
    } else if (district === 'Diğer (Kendim Yazacağım)' && !customDistrict.trim()) {
      errorsMap.customDistrict = 'Lütfen ilçe adını yazınız.';
    }

    if (!neighborhood) {
      errorsMap.neighborhood = 'Lütfen listeden Mahalle seçiniz.';
    } else if (neighborhood === 'Diğer (Kendim Yazacağım)' && !customNeighborhood.trim()) {
      errorsMap.customNeighborhood = 'Lütfen mahalle adını yazınız.';
    }

    if (!postalCode.trim()) {
      errorsMap.postalCode = 'Posta Kodu zorunludur.';
    } else if (postalCode.trim().length < 5) {
      errorsMap.postalCode = 'Posta kodu 5 haneli olmalıdır.';
    }
    if (!addressDetails.trim()) {
      errorsMap.addressDetails = 'Açık Adres detayı zorunludur.';
    }
    if (deliveryType === 'future') {
      if (!customDeliveryDate) {
        errorsMap.customDeliveryDate = 'İleri tarihli kargo için lütfen teslimat tarihi seçin.';
      } else {
        if (customDeliveryDate < todayStr) {
          errorsMap.customDeliveryDate = 'Teslimat tarihi bugünden öncesi seçilemez.';
        } else if (customDeliveryDate > maxDateStr) {
          errorsMap.customDeliveryDate = 'En geç 2 ay sonrası seçilebilir.';
        }
      }
    }

    setAddressErrors(errorsMap);

    if (Object.keys(errorsMap).length > 0) {
      // Scroll to error summary container
      const element = document.getElementById('checkout-error-summary');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Clear errors and proceed
    setAddressErrors({});
    setFormTouched(false);
    const finalDistrict = district === 'Diğer (Kendim Yazacağım)' ? customDistrict.trim() : district;
    const finalNeighborhood = neighborhood === 'Diğer (Kendim Yazacağım)' ? customNeighborhood.trim() : neighborhood;
    const combined = `${finalNeighborhood}, ${addressDetails}, PK: ${postalCode}, ${finalDistrict}/${province}`;
    setRecipientAddress(combined);

    if (saveAddressToProfile && onUpdateProfile && user) {
      const title = newAddressTitle.trim() || `${finalDistrict}/${province} Adresi`;
      const newAddr: SavedAddress = {
        id: `ADDR-${Date.now()}`,
        title,
        recipientName: recipientName.trim(),
        phone: recipientPhone.trim(),
        email: user.email,
        province,
        district: finalDistrict,
        neighborhood: finalNeighborhood,
        postalCode: postalCode.trim(),
        addressDetails: addressDetails.trim(),
        isDefault: !user.addresses || user.addresses.length === 0,
      };

      const existingAddresses = user.addresses || [];
      onUpdateProfile({
        ...user,
        addresses: [...existingAddresses, newAddr],
        phone: user.phone || recipientPhone.trim(),
      });
      setSaveAddressToProfile(false);
    }

    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    const errorsMap: Record<string, string> = {};
    const cleanCard = cardNumber.replace(/\s/g, '');

    if (!cardHolder.trim()) {
      errorsMap.cardHolder = 'Kart üzerindeki ad soyad zorunludur.';
    }
    if (!cardNumber.trim()) {
      errorsMap.cardNumber = 'Kart numarası zorunludur.';
    } else if (cleanCard.length < 16) {
      errorsMap.cardNumber = 'Kart numarası en az 16 haneli olmalıdır.';
    }
    if (!cardExpiry.trim()) {
      errorsMap.cardExpiry = 'Son kullanma tarihi zorunludur.';
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errorsMap.cardExpiry = 'Geçerli bir tarih girin (AA/YY).';
    }
    if (!cardCvv.trim()) {
      errorsMap.cardCvv = 'CVV kodu zorunludur.';
    } else if (cardCvv.length < 3) {
      errorsMap.cardCvv = 'CVV en az 3 haneli olmalıdır.';
    }

    setPaymentErrors(errorsMap);

    if (Object.keys(errorsMap).length > 0) {
      const element = document.getElementById('checkout-error-summary');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setPaymentErrors({});
    setFormTouched(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('3d_secure');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const handleVerify3DSecure = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            totalAmount,
            recipientName,
            recipientAddress,
            cardNumber,
          }),
        });

        const data = await response.json();
        setIsProcessing(false);

        if (data.success) {
          const newOrder: Order = {
            id: data.orderId,
            createdAt: 'Bugün',
            items: cartItems,
            totalAmount,
            status: 'received',
            trackingCode: data.trackingCode,
            recipientName,
            recipientAddress,
            deliveryDate: deliveryType === 'future' ? `İleri Tarihli: ${customDeliveryDate}` : 'Aynı Gün Kargo (1-2 İş Günü)',
            paymentMethod: 'iyzico / Stripe PCI-DSS Sanal POS',
            giftNote: checkoutGiftNote,
          };

          setCreatedOrder(newOrder);
          onOrderCompleted(newOrder);
          setStep('success');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          alert('Ödeme başarısız: ' + (data.error || 'Bilinmeyen hata'));
        }
      } catch (err) {
        setIsProcessing(false);
        alert('Ödeme sunucu hatası oluştu.');
      }
    }, 1500);
  };

  // Modern horizontal stepper indicator
  const renderStepper = () => {
    const stepsList = [
      { id: 'address', label: 'Adres & Alıcı' },
      { id: 'payment', label: 'Kart Bilgileri' },
      { id: '3d_secure', label: '3D Onayı' },
      { id: 'success', label: 'Sipariş Tamamlandı' }
    ];

    const getStepIndex = (s: typeof step) => {
      if (s === 'address') return 0;
      if (s === 'payment') return 1;
      if (s === '3d_secure') return 2;
      return 3;
    };

    const activeIndex = getStepIndex(step);

    return (
      <div className="mb-8 bg-slate-50 border border-slate-100 p-4 sm:p-5 rounded-2xl">
        <div className="flex items-center justify-between">
          {stepsList.map((s, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center flex-1 relative">
                  {/* Step bubble */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-purple-600 text-white shadow-sm'
                      : isActive
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white ring-4 ring-pink-100 font-extrabold shadow-sm scale-110'
                        : 'bg-white border border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : (idx + 1)}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-2 font-medium whitespace-nowrap ${
                    isActive ? 'text-pink-600 font-extrabold' : isCompleted ? 'text-purple-900 font-semibold' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 rounded transition-colors duration-300 ${
                    idx < activeIndex ? 'bg-purple-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic step info bar (What's Next & Current Step Info) */}
        <div className="mt-5 border-t border-slate-200/60 pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-left text-xs text-slate-600 gap-2">
          <div>
            <span className="font-bold text-pink-600">Şu anki Adım:</span>{' '}
            {step === 'address' && 'Teslimat Bilgileri'}
            {step === 'payment' && 'Ödeme Ekranı (256-Bit SSL şifrelemeli kart girişi)'}
            {step === '3d_secure' && '3D Secure Banka Doğrulaması (SMS güvenlik kodu girişi)'}
            {step === 'success' && 'Siparişiniz Alındı! Alışverişiniz başarıyla tamamlandı.'}
          </div>
          {step !== 'success' && (
            <div className="bg-purple-50 text-purple-950 px-3 py-1 rounded-lg border border-purple-100 font-semibold self-start sm:self-auto text-[11px]">
              <span className="font-bold text-purple-700">Sonraki Adım:</span>{' '}
              {step === 'address' && '💳 Kredi Kartı Ödemesi'}
              {step === 'payment' && '🔒 3D Secure SMS Kodu Onayı'}
              {step === '3d_secure' && '🎁 Siparişiniz Tamamlanacak'}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Validation Error List Display (Turkish)
  const renderErrorSummary = (errorsMap: Record<string, string>) => {
    const errorKeys = Object.keys(errorsMap);
    if (errorKeys.length === 0) return null;

    return (
      <div 
        id="checkout-error-summary" 
        className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl space-y-2 animate-shake text-left"
      >
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Lütfen aşağıdaki zorunlu alanları doldurun:</span>
        </div>
        <ul className="list-disc pl-5 text-xs text-rose-700 space-y-1">
          {errorKeys.map((key) => (
            <li key={key} className="font-medium">
              {errorsMap[key]}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (isPage) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn text-left">
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-yellow-300" />
              <span className="font-bold font-serif text-lg">Güvenli Sipariş Tamamlama (PCI-DSS)</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Vazgeç</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Horizontal Stepper Progress Indicator */}
            {renderStepper()}

            {/* Error summary displayed prominently */}
            {step === 'address' && renderErrorSummary(addressErrors)}
            {step === 'payment' && renderErrorSummary(paymentErrors)}

            {/* STEP 1: Address & Recipient */}
            {step === 'address' && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="border-b border-purple-100 pb-2">
                  <h3 className="text-lg font-bold text-slate-800 font-serif">1. Alıcı ve Teslimat Bilgileri</h3>
                  <p className="text-xs text-slate-500">Kutunun teslim edileceği şanslı kişinin bilgilerini girin veya kayıtlı adresinizden hızlıca seçin.</p>
                </div>

                {/* Saved Address Quick Selector */}
                {user?.addresses && user.addresses.length > 0 && (
                  <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200/80 space-y-3">
                    <div className="flex items-center justify-between border-b border-purple-200/60 pb-2">
                      <div className="flex items-center gap-1.5 text-purple-950 font-black text-xs uppercase tracking-wider">
                        <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
                        <span>Kayıtlı Adreslerinizden Hızlı Seçin</span>
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {user.addresses.length} Adres Kayıtlı
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {user.addresses.map((addr) => {
                        const isSelected = selectedSavedAddressId === addr.id;
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                              isSelected
                                ? 'bg-white border-pink-500 ring-2 ring-pink-200 shadow-xs'
                                : 'bg-white/80 border-purple-100 hover:border-purple-300 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                              <span className="flex items-center gap-1.5 text-purple-900 font-extrabold">
                                {addr.title.includes('Ev') ? <Home className="w-3.5 h-3.5 text-pink-600" /> : <Building2 className="w-3.5 h-3.5 text-purple-600" />}
                                <span>{addr.title}</span>
                                {addr.isDefault && (
                                  <span className="bg-pink-100 text-pink-700 text-[9px] px-1.5 py-0.2 rounded font-bold">Varsayılan</span>
                                )}
                              </span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />}
                            </div>
                            <p className="text-[11px] font-semibold text-slate-700 mt-1">{addr.recipientName} • {addr.phone}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{addr.neighborhood}, {addr.addressDetails}, {addr.district}/{addr.province}</p>
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={handleSelectNewAddress}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer ${
                          selectedSavedAddressId === 'new'
                            ? 'bg-white border-pink-500 text-pink-700 ring-2 ring-pink-200 shadow-xs'
                            : 'bg-white/60 border-dashed border-purple-200 text-purple-700 hover:bg-white'
                        }`}
                      >
                        <Plus className="w-4 h-4 text-pink-600" />
                        <span>+ Farklı / Yeni Adres Gir</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Alıcı Adı Soyadı *</label>
                    <input
                      type="text"
                      placeholder="Adı Soyadı"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                        addressErrors.recipientName 
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                          : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {addressErrors.recipientName && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{addressErrors.recipientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Alıcı Telefonu *</label>
                    <input
                      type="text"
                      placeholder="Örn: (555) 123 45 67"
                      value={recipientPhone}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        setRecipientPhone(formatted);
                      }}
                      className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                        addressErrors.recipientPhone 
                          ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                          : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {addressErrors.recipientPhone && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{addressErrors.recipientPhone}</p>
                    )}
                  </div>
                </div>

                {/* Dropdowns and details */}
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block border-b border-purple-100 pb-1">Teslimat Adres Detayları</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">İl Seçiniz *</label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                          addressErrors.province 
                            ? 'border-rose-400 focus:ring-rose-300' 
                            : 'border-slate-200 focus:ring-pink-400'
                        }`}
                      >
                        <option value="">-- İl Seçin --</option>
                        {TURKISH_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                      {addressErrors.province && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{addressErrors.province}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">İlçe Seçiniz *</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={!province}
                        className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                          addressErrors.district 
                            ? 'border-rose-400 focus:ring-rose-300' 
                            : 'border-slate-200 focus:ring-pink-400'
                        } disabled:bg-slate-100 disabled:cursor-not-allowed`}
                      >
                        <option value="">-- İlçe Seçin --</option>
                        {districtsList.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      {addressErrors.district && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{addressErrors.district}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Mahalle Seçiniz *</label>
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        disabled={!district}
                        className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                          addressErrors.neighborhood 
                            ? 'border-rose-400 focus:ring-rose-300' 
                            : 'border-slate-200 focus:ring-pink-400'
                        } disabled:bg-slate-100 disabled:cursor-not-allowed`}
                      >
                        <option value="">-- Mahalle Seçin --</option>
                        {neighborhoodsList.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      {addressErrors.neighborhood && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{addressErrors.neighborhood}</p>
                      )}
                    </div>
                  </div>

                  {/* Conditional custom fields for custom district/neighborhood writing */}
                  {(district === 'Diğer (Kendim Yazacağım)' || neighborhood === 'Diğer (Kendim Yazacağım)') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/40 p-4 rounded-xl border border-purple-100 animate-fadeIn">
                      {district === 'Diğer (Kendim Yazacağım)' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">İlçe Adını Giriniz *</label>
                          <input
                            type="text"
                            placeholder="Örn: Tepebaşı"
                            value={customDistrict}
                            onChange={(e) => setCustomDistrict(e.target.value)}
                            className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                              addressErrors.customDistrict 
                                ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                                : 'border-slate-200 focus:ring-pink-400'
                            }`}
                          />
                          {addressErrors.customDistrict && (
                            <p className="text-[10px] text-rose-500 font-medium mt-1">{addressErrors.customDistrict}</p>
                          )}
                        </div>
                      )}
                      {neighborhood === 'Diğer (Kendim Yazacağım)' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Mahalle Adını Giriniz *</label>
                          <input
                            type="text"
                            placeholder="Örn: Boyacıoğlu Mah."
                            value={customNeighborhood}
                            onChange={(e) => setCustomNeighborhood(e.target.value)}
                            className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                              addressErrors.customNeighborhood 
                                ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                                : 'border-slate-200 focus:ring-pink-400'
                            }`}
                          />
                          {addressErrors.customNeighborhood && (
                            <p className="text-[10px] text-rose-500 font-medium mt-1">{addressErrors.customNeighborhood}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Posta Kodu *</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="Örn: 34330"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value.replace(/[^\d]/g, ''))}
                        className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                          addressErrors.postalCode 
                            ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                            : 'border-slate-200 focus:ring-pink-400'
                        }`}
                      />
                      {addressErrors.postalCode && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{addressErrors.postalCode}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Açık Adres Detayı (Sokak, Bina, Kapı No, vb.) *</label>
                      <input
                        type="text"
                        placeholder="Örn: İnönü Cad. Palmiye Sitesi C Blok No:12 Daire:4"
                        value={addressDetails}
                        onChange={(e) => setAddressDetails(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                          addressErrors.addressDetails 
                            ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20' 
                            : 'border-slate-200 focus:ring-pink-400'
                        }`}
                      />
                      {addressErrors.addressDetails && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">{addressErrors.addressDetails}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Date selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Teslimat Zamanı & Planlama</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryType('immediate');
                        setCustomDeliveryDate('');
                      }}
                      className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all ${
                        deliveryType === 'immediate'
                          ? 'bg-pink-50 border-pink-400 text-pink-700 ring-2 ring-pink-100'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-sm">⚡ Standart Teslimat</span>
                      <span className="block text-[11px] font-normal text-slate-500 mt-1">1-3 gün içinde kargolanır (1-2 iş günü içinde kapıda)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('future')}
                      className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all ${
                        deliveryType === 'future'
                          ? 'bg-amber-50/80 border-amber-400 text-amber-900 ring-2 ring-amber-100'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-sm">📅 İleri Tarihli Planlı Gönderim</span>
                      <span className="block text-[11px] font-normal text-slate-500 mt-1">Gelecekteki özel bir günde ulaştırılmasını planlayın</span>
                    </button>
                  </div>

                  {deliveryType === 'future' && (
                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 animate-fadeIn space-y-2 max-w-md">
                      <label className="block text-[11px] font-bold text-amber-900">
                        İleri tarihli gönderim tarihi seçiniz:
                      </label>
                      <input
                        type="date"
                        value={customDeliveryDate}
                        onChange={(e) => setCustomDeliveryDate(e.target.value)}
                        min={todayStr}
                        max={maxDateStr}
                        className={`w-full text-xs p-2.5 rounded-xl bg-white border text-slate-800 font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                          addressErrors.customDeliveryDate ? 'border-rose-400' : 'border-amber-300'
                        }`}
                      />
                      {addressErrors.customDeliveryDate && (
                        <p className="text-[10px] text-rose-500 font-bold">{addressErrors.customDeliveryDate}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Save address to profile option */}
                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/80 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={saveAddressToProfile}
                      onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded border-slate-300 focus:ring-pink-400 cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5 text-purple-950 font-bold">
                      <BookmarkCheck className="w-4 h-4 text-pink-600 shrink-0" />
                      Bu adresi gelecek siparişlerim için hesabıma kaydet
                    </span>
                  </label>
                  {saveAddressToProfile && (
                    <div className="pt-2 animate-fadeIn space-y-1 max-w-md">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Adres Başlığı (Örn: Evim 🏠, Annemin Evi 🏡, Yazlık 🌊):
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Ev Adresim 🏠"
                        value={newAddressTitle}
                        onChange={(e) => setNewAddressTitle(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Sepet Toplam Tutarı:</span>
                    <span className="text-2xl font-black text-pink-600 font-serif">{totalAmount} TL</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-64 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Ödeme Bilgilerine İlerle</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Credit Card Entry */}
            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="border-b border-purple-100 pb-2">
                  <h3 className="text-lg font-bold text-slate-800 font-serif">2. Güvenli Kredi Kartı Ödemesi</h3>
                  <p className="text-xs text-slate-500">256-Bit SSL şifrelemeli iyzico ve Stripe güvencesiyle ödeme yapın.</p>
                </div>

                {/* Credit Card Mock graphic */}
                <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 p-6 rounded-2xl text-white shadow-xl space-y-4 relative overflow-hidden max-w-md mx-auto">
                  <div className="flex justify-between items-center text-xs opacity-70 font-mono">
                    <span className="font-bold tracking-widest text-purple-200">HAPPINIO SECURE POS</span>
                    <CreditCard className="w-7 h-7 text-purple-300 animate-pulse" />
                  </div>
                  <div className="text-xl font-mono tracking-widest my-4 text-center">
                    {cardNumber || '**** **** **** ****'}
                  </div>
                  <div className="flex justify-between text-xs font-mono pt-2">
                    <div>
                      <span className="block opacity-60 text-[9px]">KART SAHİBİ</span>
                      <span className="uppercase">{cardHolder || 'AD SOYAD'}</span>
                    </div>
                    <div>
                      <span className="block opacity-60 text-[9px]">SKT</span>
                      <span>{cardExpiry || 'AA/YY'}</span>
                    </div>
                    <div>
                      <span className="block opacity-60 text-[9px]">CVV</span>
                      <span>{cardCvv ? '***' : '***'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Kart Numarası *</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4355 **** **** ****"
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d]/g, '');
                        // Add spaces every 4 characters
                        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                        setCardNumber(formatted);
                      }}
                      className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                        paymentErrors.cardNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {paymentErrors.cardNumber && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{paymentErrors.cardNumber}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Kart Üzerindeki İsim *</label>
                    <input
                      type="text"
                      placeholder="Ad Soyad"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                        paymentErrors.cardHolder ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {paymentErrors.cardHolder && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{paymentErrors.cardHolder}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Son Kullanma (AA/YY) *</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="08/28"
                      value={cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^\d]/g, '');
                        if (val.length > 2) {
                          val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        }
                        setCardExpiry(val);
                      }}
                      className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                        paymentErrors.cardExpiry ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {paymentErrors.cardExpiry && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{paymentErrors.cardExpiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Güvenlik Kodu (CVV) *</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="***"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/[^\d]/g, ''))}
                      className={`w-full text-xs p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                        paymentErrors.cardCvv ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-pink-400'
                      }`}
                    />
                    {paymentErrors.cardCvv && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{paymentErrors.cardCvv}</p>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('address');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs text-slate-500 font-extrabold hover:underline"
                  >
                    ← Geri Dön
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Lock className="w-4 h-4 text-emerald-200" />
                    <span>{isProcessing ? 'Güvenli Bağlantı...' : '3D Secure Onayı Al'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: 3D Secure SMS OTP Verification */}
            {step === '3d_secure' && (
              <form onSubmit={handleVerify3DSecure} className="space-y-6 text-center max-w-md mx-auto py-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-inner animate-pulse">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 font-serif">3D Secure Doğrulama Kodu</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Güvenli ödemeyi tamamlamak için bankanız tarafından cep telefonunuza gönderilen 6 haneli doğrulama kodunu girin.
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    maxLength={6}
                    placeholder="123456"
                    className="w-48 text-center text-2xl font-mono tracking-widest p-4 rounded-2xl bg-slate-100 border border-slate-300 mx-auto block focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold">Doğrulama Kodu olarak varsayılan "123456" girilmiştir.</p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm py-4 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'Siparişiniz Onaylanıyor...' : '3D Secure ile Ödemeyi Tamamla'}</span>
                </button>
              </form>
            )}

            {/* STEP 4: Success Confirmation */}
            {step === 'success' && createdOrder && (
              <div className="text-center space-y-5 py-6 max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce shadow-md">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 font-serif">Siparişiniz Başarıyla Alındı! 🎁</h3>
                  <p className="text-xs text-slate-500">Happinio ailesine katıldığınız ve sevdiklerinizi mutlu ettiğiniz için teşekkür ederiz.</p>
                </div>

                <div className="bg-pink-50/70 p-5 rounded-2xl border border-pink-100/80 text-xs text-slate-700 space-y-2 text-left">
                  <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-2 font-bold text-pink-900">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      <span>Sipariş Özet Bilgileri</span>
                    </span>
                    <span className="bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200 text-[10px]">Alındı</span>
                  </div>
                  <p><strong>Sipariş Kodu / Takip Kodu:</strong> <span className="font-mono font-bold text-pink-700 bg-white px-2 py-0.5 rounded border border-pink-100">{createdOrder.trackingCode}</span></p>
                  <p><strong>Teslim Edilecek Alıcı:</strong> {createdOrder.recipientName}</p>
                  <p><strong>Açık Teslimat Adresi:</strong> {createdOrder.recipientAddress}</p>
                  <p><strong>Ödeme Tutarı:</strong> {createdOrder.totalAmount} TL (PCI-DSS Güvenli Tahsilat)</p>
                  <p><strong>Planlanan Teslimat Tarihi:</strong> {createdOrder.deliveryDate}</p>
                  {createdOrder.giftNote && (
                    <p className="italic text-[11px] text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-100/60 mt-2 font-serif">
                      <strong>Kart Notu:</strong> "{createdOrder.giftNote}"
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Siparişinizi Navbar üzerindeki "Profil" menüsünden ya da "Sipariş Takibi" bölümünden anlık olarak sorgulayabilirsiniz. Mutluluk kutunuz özenle hazırlanıp kuryemize teslim edilmek üzere sıraya alınmıştır!
                </p>

                <button
                  onClick={onClose}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-4 rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Anasayfaya Dön & Alışverişe Devam Et
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Original fallback modal renderer (kept robustly for backwards compatibility)
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn text-left">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-pink-100 overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-yellow-300" />
            <span>256-Bit SSL Güvenli Ödeme Altyapısı</span>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {renderStepper()}

          {step === 'address' && renderErrorSummary(addressErrors)}
          {step === 'payment' && renderErrorSummary(paymentErrors)}
          
          {/* STEP 1: Address & Recipient */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4 text-left">
              <h3 className="text-base font-bold text-slate-900 font-serif mb-1">1. Teslimat & Alıcı Bilgileri</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alıcı Adı Soyadı *</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                    addressErrors.recipientName ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alıcı Telefonu *</label>
                <input
                  type="text"
                  placeholder="Örn: (555) 123 45 67"
                  value={recipientPhone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setRecipientPhone(formatted);
                  }}
                  className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                    addressErrors.recipientPhone ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                  }`}
                />
              </div>

              {/* Split Address Section */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">Teslimat Adres Detayları</span>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">İl *</label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                          addressErrors.province ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                        }`}
                      >
                        <option value="">İl Seçin</option>
                        {TURKISH_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">İlçe *</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={!province}
                        className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                          addressErrors.district ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                        }`}
                      >
                        <option value="">İlçe Seçin</option>
                        {districtsList.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Mahalle *</label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      disabled={!district}
                      className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                        addressErrors.neighborhood ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                      }`}
                    >
                      <option value="">Mahalle Seçin</option>
                      {neighborhoodsList.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Posta Kodu *</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="26020"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/[^\d]/g, ''))}
                      className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                        addressErrors.postalCode ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Conditional custom fields for custom district/neighborhood writing */}
                {(district === 'Diğer (Kendim Yazacağım)' || neighborhood === 'Diğer (Kendim Yazacağım)') && (
                  <div className="grid grid-cols-1 gap-3 bg-purple-50/40 p-3 rounded-xl border border-purple-100 animate-fadeIn">
                    {district === 'Diğer (Kendim Yazacağım)' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">İlçe Adını Giriniz *</label>
                        <input
                          type="text"
                          placeholder="Örn: Tepebaşı"
                          value={customDistrict}
                          onChange={(e) => setCustomDistrict(e.target.value)}
                          className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                            addressErrors.customDistrict ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                          }`}
                        />
                        {addressErrors.customDistrict && (
                          <p className="text-[10px] text-rose-500 font-medium mt-0.5">{addressErrors.customDistrict}</p>
                        )}
                      </div>
                    )}
                    {neighborhood === 'Diğer (Kendim Yazacağım)' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Mahalle Adını Giriniz *</label>
                        <input
                          type="text"
                          placeholder="Örn: Boyacıoğlu Mah."
                          value={customNeighborhood}
                          onChange={(e) => setCustomNeighborhood(e.target.value)}
                          className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                            addressErrors.customNeighborhood ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                          }`}
                        />
                        {addressErrors.customNeighborhood && (
                          <p className="text-[10px] text-rose-500 font-medium mt-0.5">{addressErrors.customNeighborhood}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Adres Detayı (Sokak, Bina No, Daire No) *</label>
                  <textarea
                    rows={2}
                    placeholder="Örn: Atatürk Bulvarı, Sevinç Apt. No: 42, Daire: 5"
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl bg-white border focus:outline-none focus:ring-2 ${
                      addressErrors.addressDetails ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teslimat Zamanı & Tarih Seçimi</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryType('immediate');
                      setCustomDeliveryDate('');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      deliveryType === 'immediate'
                        ? 'bg-pink-50 border-pink-400 text-pink-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block">⚡ Standart Teslimat</span>
                    <span className="block text-[10px] font-normal text-slate-500">Aynı gün kargo (1-2 iş günü)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('future')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      deliveryType === 'future'
                        ? 'bg-amber-50 border-amber-400 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block">📅 İleri Tarihli Teslimat</span>
                    <span className="block text-[10px] font-normal text-slate-500">Belirli bir tarihte ulaştır</span>
                  </button>
                </div>

                {deliveryType === 'future' && (
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 animate-fadeIn">
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Kutunun Teslim Edilmesini İstediğiniz Özel Tarih:
                    </label>
                    <input
                      type="date"
                      value={customDeliveryDate}
                      onChange={(e) => setCustomDeliveryDate(e.target.value)}
                      min={todayStr}
                      max={maxDateStr}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-amber-300 text-slate-800 font-bold cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Tutar:</span>
                  <span className="text-xl font-black text-pink-600 font-serif">{totalAmount} TL</span>
                </div>
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer"
                >
                  Kart Ödemesine Geç
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Credit Card Entry */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-serif">2. Güvenli Kredi Kartı Ödemesi</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Lock className="w-3 h-3" /> iyzico / Stripe SSL
                </span>
              </div>

              {/* Credit Card Mock graphic */}
              <div className="bg-gradient-to-br from-slate-900 to-purple-950 p-4 rounded-2xl text-white shadow-xl space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center text-xs opacity-70 font-mono">
                  <span>HAPPINIO POS</span>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-base font-mono tracking-widest my-2">{cardNumber || '**** **** **** ****'}</div>
                <div className="flex justify-between text-[11px] font-mono">
                  <div>
                    <span className="block opacity-60 text-[9px]">KART SAHİBİ</span>
                    <span>{cardHolder || 'AD SOYAD'}</span>
                  </div>
                  <div>
                    <span className="block opacity-60 text-[9px]">SKT</span>
                    <span>{cardExpiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kart Numarası</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kart Üzerindeki İsim</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Son Kullanma (AA/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Güvenlik Kodu (CVV)</label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep('address');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-slate-500 font-bold hover:underline"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? 'Güvenli Bağlantı...' : `${totalAmount} TL Öde (3D Secure)`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: 3D Secure SMS OTP Verification */}
          {step === '3d_secure' && (
            <form onSubmit={handleVerify3DSecure} className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 font-serif">3D Secure Doğrulama Kodu</h3>
              <p className="text-xs text-slate-600">
                Bankanız tarafından cep telefonunuza gönderilen 6 haneli güvenlik kodunu girin.
              </p>

              <input
                type="text"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                maxLength={6}
                className="w-48 text-center text-xl font-mono tracking-widest p-3 rounded-2xl bg-slate-100 border border-slate-300 mx-auto block focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md cursor-pointer"
              >
                {isProcessing ? 'Sipariş Onaylanıyor...' : '3D Secure İle Ödemeyi Tamamla'}
              </button>
            </form>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 'success' && createdOrder && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 font-serif">Siparişiniz Başarıyla Alındı! 🎁</h3>

              <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 text-xs text-slate-700 space-y-1 text-left">
                <p><strong>Takip Kodunuz:</strong> <span className="font-mono font-bold text-pink-700">{createdOrder.trackingCode}</span></p>
                <p><strong>Alıcı:</strong> {createdOrder.recipientName}</p>
                <p><strong>Adres:</strong> {createdOrder.recipientAddress}</p>
                <p><strong>Tutar:</strong> {createdOrder.totalAmount} TL (PCI DSS Güvenli POS)</p>
              </div>

              <p className="text-xs text-slate-500">
                Siparişinizi "Sipariş Takibi" alanından veya profilinizden anlık olarak takip edebilirsiniz. Happinio ekibi hediyenizi özenle paketlemeye başladı!
              </p>

              <button
                onClick={onClose}
                className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-2xl shadow-md cursor-pointer"
              >
                Alışverişe Devam Et
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
