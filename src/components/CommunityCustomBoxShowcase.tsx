import React, { useState } from 'react';
import { Sparkles, Trophy, Heart, Plus, Gift, Award, Share2, MessageCircle, CheckCircle2, User, Flame, Clock, Tag, X, ExternalLink } from 'lucide-react';

export interface CommunityBox {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  promptText: string;
  image: string;
  itemsCount: number;
  items: string[];
  votes: number;
  hasVoted?: boolean;
  isWinnerMonth?: string;
  createdAt: string;
  category: string;
}

const INITIAL_COMMUNITY_BOXES: CommunityBox[] = [
  {
    id: 'box-com-1',
    creatorName: 'Aylin K.',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    title: 'Ghibli & Catbus Sevdalıları Kutusu 🐱',
    promptText: 'Miyazaki filmlerini ve Totoro dünyasını seven arkadaşıma nostaljik, el yapımı seramik kupa ve lavantalı dinlenme çayı kutusu.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
    itemsCount: 5,
    items: ['Nostaljik Kedi Seramik Kupa', 'Ghibli Sticker Paketi', 'Lavantalı Rahatlama Çayı', 'Buldan Dokuma Şal', 'El Yapımı Çikolata'],
    votes: 248,
    isWinnerMonth: 'Ağustos Lideri',
    createdAt: '2 gün önce',
    category: 'Anime & Pop Kültür',
  },
  {
    id: 'box-com-2',
    creatorName: 'Emre B.',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    title: 'Eskişehir Özlemi & Mimar Sürprizi 🏛️',
    promptText: 'Yurt dışında yaşayan mimar arkadaşıma Odunpazarı nostaljisi yaşatacak seramik kupa, Met helvası ve ahşap cetvel seti.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    itemsCount: 4,
    items: ['Odunpazarı El Yapımı Kupa', 'Çibörek / Met Helvası Magneti', 'Özel Çekim Türk Kahvesi', 'Mimar Çizim Defteri'],
    votes: 189,
    createdAt: '4 gün önce',
    category: 'Şehir Dokusu',
  },
  {
    id: 'box-com-3',
    creatorName: 'Selin & Can',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
    title: 'Truva Şaka & Sürpriz Kutusu 🎭',
    promptText: 'Komik tasarımlı renkli çoraplar, esprili sözleri olan eğlenceli kupa ve arkadaşımın tarzına zıt, şaşırtıcı ve tatlı şakalar içeren efsane hediye kutusu!',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
    itemsCount: 3,
    items: ['Komik Çoraplar', 'Esprili Motto Kupası', 'İronik Motivasyon Defteri'],
    votes: 312,
    isWinnerMonth: 'Temmuz Kazananı 🏆',
    createdAt: 'Temmuz Şampiyonu',
    category: 'Mizah & Şaka',
  },
];

interface CommunityCustomBoxShowcaseProps {
  user?: {
    isLoggedIn?: boolean;
    name?: string;
  };
  onOpenProfile?: () => void;
  onAwardPoints?: (points: number) => void;
}

export default function CommunityCustomBoxShowcase({ user, onOpenProfile, onAwardPoints }: CommunityCustomBoxShowcaseProps) {
  const [boxes, setBoxes] = useState<CommunityBox[]>(INITIAL_COMMUNITY_BOXES);
  const [activeTab, setActiveTab] = useState<'popular' | 'new' | 'winners'>('popular');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [votedBoxIds, setVotedBoxIds] = useState<string[]>([]);
  const [userSubmittedCount, setUserSubmittedCount] = useState<number>(0);

  // Form states
  const [formName, setFormName] = useState(user?.name || '');
  const [formTitle, setFormTitle] = useState('Mimarlar İçin Odunpazarı Sürpriz Kutusu 🏛️');
  const [formPrompt, setFormPrompt] = useState('Odunpazarı tarihi evleri seramik kupa, Nostaljik Porsuk magneti ve Met helvası içeren özel şehir hatırası.');
  const [formCategory, setFormCategory] = useState('Genel');

  const MAX_VOTES = 5;
  const MAX_SUBMISSIONS = 5;

  const handleVote = (id: string) => {
    if (!user?.isLoggedIn) {
      alert('Oy verebilmek için lütfen önce üye girişi yapın veya ücretsiz kayıt olun! 🌸');
      if (onOpenProfile) onOpenProfile();
      return;
    }

    if (votedBoxIds.includes(id)) {
      alert('Bu özel kutuya zaten oy verdiniz! İlginiz için teşekkür ederiz ❤️');
      return;
    }

    if (votedBoxIds.length >= MAX_VOTES) {
      alert(`Aylık oy verme limitiniz olan ${MAX_VOTES} oy hakkını tamamladınız! Harika oylarınız için teşekkür ederiz 🌟`);
      return;
    }

    setBoxes((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, votes: box.votes + 1, hasVoted: true } : box
      )
    );
    setVotedBoxIds((prev) => [...prev, id]);
    if (onAwardPoints) onAwardPoints(10);
    alert('🎉 Oyunuz başarıyla kaydedildi! Hesabınıza +10 Happinio Puanı (10 TL Değerinde) tanımlandı.');
  };

  const handleOpenShareModal = () => {
    if (!user?.isLoggedIn) {
      alert('Kutu oylamasına öneri ekleyebilmek için lütfen önce üye girişi yapın veya ücretsiz kayıt olun! 🎁');
      if (onOpenProfile) onOpenProfile();
      return;
    }
    if (userSubmittedCount >= MAX_SUBMISSIONS) {
      alert(`Bu ayki ${MAX_SUBMISSIONS} kutu önerisi limitinizi doldurdunuz. İlginiz için teşekkür ederiz! 🎁`);
      return;
    }
    setFormName(user.name || '');
    setIsShareModalOpen(true);
  };

  const handleSubmitNewBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.isLoggedIn) {
      alert('Kutu oylamasına öneri ekleyebilmek için lütfen önce üye girişi yapın!');
      if (onOpenProfile) onOpenProfile();
      return;
    }

    if (userSubmittedCount >= MAX_SUBMISSIONS) {
      alert(`Bu ayki ${MAX_SUBMISSIONS} kutu önerisi limitinizi doldurdunuz. İlginiz için teşekkür ederiz! 🎁`);
      setIsShareModalOpen(false);
      return;
    }

    if (!formName || !formTitle || !formPrompt) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    const newBox: CommunityBox = {
      id: `box-user-${Date.now()}`,
      creatorName: formName,
      creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      title: formTitle,
      promptText: formPrompt,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
      itemsCount: 4,
      items: ['Özel Seçim Ürün 1', 'Kişiselleştirilmiş Kupa', 'Lezzetli Atıştırmalık', 'El Yazısı Not'],
      votes: 1,
      createdAt: 'Az önce',
      category: formCategory,
    };

    setBoxes([newBox, ...boxes]);
    setUserSubmittedCount((prev) => prev + 1);
    setIsShareModalOpen(false);
    setFormName('');
    setFormTitle('');
    setFormPrompt('');
    if (onAwardPoints) onAwardPoints(100);
    alert(`🎉 Tebrikler! Özel kutunuz topluluk oylamasına eklendi ve hesabınıza +100 Happinio Puanı (100 TL Değerinde) tanımlandı! (Bu ay kalan öneri hakkınız: ${MAX_SUBMISSIONS - (userSubmittedCount + 1)}/5)`);
  };

  const handleBoxClick = (box: CommunityBox) => {
    // Map to the official GIFT_BOX ID
    let targetBoxId = 'BOX-001';
    if (box.id === 'box-com-1') targetBoxId = 'BOX-001';
    else if (box.id === 'box-com-2') targetBoxId = 'BOX-003';
    else if (box.id === 'box-com-3') targetBoxId = 'BOX-002';
    else {
      // For user submitted boxes, detect by title or category
      const title = box.title.toLowerCase();
      if (title.includes('eskişehir') || title.includes('odunpazarı') || title.includes('mimar')) targetBoxId = 'BOX-003';
      else if (title.includes('kedi') || title.includes('ghibli')) targetBoxId = 'BOX-001';
      else if (title.includes('truva') || title.includes('şaka') || title.includes('mizah')) targetBoxId = 'BOX-002';
      else if (title.includes('japonya') || title.includes('sakura')) targetBoxId = 'BOX-013';
      else if (title.includes('romantik') || title.includes('yıldönümü')) targetBoxId = 'BOX-007';
      else if (title.includes('öğretmen')) targetBoxId = 'BOX-019';
      else if (title.includes('anne')) targetBoxId = 'BOX-005';
      else if (title.includes('baba')) targetBoxId = 'BOX-011';
      else if (title.includes('yeni yıl') || title.includes('yılbaşı')) targetBoxId = 'BOX-017';
    }

    // Open in a new tab
    const url = `${window.location.origin}${window.location.pathname}?box=${targetBoxId}`;
    window.open(url, '_blank');
  };

  // Filter boxes
  const sortedBoxes = [...boxes].sort((a, b) => {
    if (activeTab === 'popular') return b.votes - a.votes;
    if (activeTab === 'winners') return (b.isWinnerMonth ? 1 : 0) - (a.isWinnerMonth ? 1 : 0);
    return 0; // default order
  });

  return (
    <section id="community-contest" className="pt-6 pb-16 bg-[#FAF7F2] border-t border-purple-100/70 relative overflow-hidden sm:pt-8">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif mt-0 leading-tight tracking-tight">
            Kendi Kutunu Tasarla, <br />
            <span className="text-purple-900 italic font-medium">Paylaş, Oyla, Kazan!</span> 🎁
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
            Happinio topluluğunun Joy-Genie ile tasarladığı ilham verici özel hediye kutularını keşfedin, beğendiklerinize oy verin ya da kendi tasarımınızı yarışmaya ekleyin!
          </p>
        </div>

        {/* Contest Banner Card - Soft Lila & Krem Elegance */}
        <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/95 to-purple-100/80 text-purple-950 rounded-[36px] p-6 sm:p-8 shadow-sm mb-12 relative overflow-hidden border border-purple-200/90">
          <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-2 bg-white/90 text-purple-900 border border-purple-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
                  <Award className="w-4 h-4 text-purple-700" />
                  <span>Ağustos Ayı Yarışması Aktif</span>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-pink-100/90 text-pink-900 border border-pink-200 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-2xs">
                  <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-600" />
                  <span>Aylık Oy Hakkınız: {MAX_VOTES - votedBoxIds.length}/{MAX_VOTES}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-purple-900 text-purple-100 border border-purple-800 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-2xs">
                  <Gift className="w-3.5 h-3.5 text-amber-300" />
                  <span>Aylık Öneri Hakkınız: {MAX_SUBMISSIONS - userSubmittedCount}/{MAX_SUBMISSIONS}</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-purple-950 leading-relaxed">
                Bu Ayın Ödülü: <span className="text-purple-900 bg-white/90 px-3 py-1 rounded-xl border border-purple-200 shadow-2xs inline-block mt-1 sm:mt-0 font-extrabold">100 Puan + Tematik Kutu Alanına Eklenme Hakkı</span> 🏆
              </h3>
              <p className="text-xs sm:text-sm text-purple-900/80 max-w-xl leading-relaxed">
                Her ayın son günü saat 23:59’da en çok oyu toplayan şampiyon hediye kutusunun sahibi anında <strong className="text-purple-950 font-bold">100 Puan kazanır</strong> ve tasarladığı kutu resmi koleksiyonumuza eklenerek tüm kullanıcıların siparişine açılır!
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 w-full lg:w-auto shrink-0">
              <button
                onClick={handleOpenShareModal}
                className="w-full sm:w-auto bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group border border-purple-800"
              >
                <Plus className="w-4 h-4 text-purple-200 group-hover:rotate-90 transition-transform" />
                <span>Kendi Kutunu Paylaş ({MAX_SUBMISSIONS - userSubmittedCount} Hak)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-purple-200/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('popular')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'popular'
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>En Çok Oy Alanlar</span>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Yeni Eklenenler</span>
            </button>
            <button
              onClick={() => setActiveTab('winners')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'winners'
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Şampiyon Kutular</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Toplam {boxes.length} Tasarım Yarışıyor
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedBoxes.map((box) => {
            const hasVoted = votedBoxIds.includes(box.id);

            return (
              <div
                key={box.id}
                onClick={() => handleBoxClick(box)}
                className="bg-white rounded-[32px] border border-purple-100 p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between relative group cursor-pointer"
              >
                <div>
                  {/* Creator Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={box.creatorAvatar}
                        alt={box.creatorName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{box.creatorName}</h4>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-purple-700 shrink-0" />
                          <span className="truncate">{box.category} • {box.createdAt}</span>
                        </span>
                      </div>
                    </div>

                    {box.isWinnerMonth && (
                      <div className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1 shrink-0">
                        <Trophy className="w-3 h-3 text-slate-900 shrink-0" />
                        <span className="whitespace-nowrap">{box.isWinnerMonth}</span>
                      </div>
                    )}
                  </div>

                  {/* Box Image */}
                  <div className="h-44 rounded-2xl overflow-hidden bg-purple-50 relative mb-4">
                    <img
                      src={box.image}
                      alt={box.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <span className="bg-white/95 backdrop-blur-xs text-purple-900 text-[11px] font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Kutuyu İncele</span>
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                      {box.itemsCount} Özel Parça
                    </div>
                  </div>

                  {/* Box Title & Story */}
                  <h3 className="text-sm font-bold text-slate-800 font-serif leading-snug mb-2 group-hover:text-purple-900 transition-colors">
                    {box.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed italic bg-[#F5EFFB] p-2.5 rounded-xl border border-purple-100">
                    "{box.promptText}"
                  </p>

                  {/* Included Items Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {box.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-[10px] bg-purple-50 text-purple-900 px-2.5 py-0.5 rounded-full font-medium border border-purple-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vote Action Footer */}
                <div className="pt-3 border-t border-purple-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                    <Heart className={`w-4 h-4 ${hasVoted ? 'fill-purple-700 text-purple-700' : 'text-slate-400'}`} />
                    <span>{box.votes} Oy</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(box.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                      hasVoted
                        ? 'bg-purple-100 text-purple-800 cursor-default border border-purple-200'
                        : 'bg-purple-800 hover:bg-purple-900 text-white shadow-purple-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-purple-800' : 'fill-white'}`} />
                    <span>{hasVoted ? 'Oy Verildi ❤️' : 'Oy Ver'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Share Box Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-purple-200 animate-fadeIn">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-700" />
              <h3 className="text-xl font-bold font-serif text-slate-800">
                Kendi Özel Kutunu Paylaş 🎁
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Sipariş verdiğin veya Joy-Genie ile oluşturduğun hediye kutunu seç, topluluk oylamasına sun ve 100 Puan kazan!
            </p>

            <form onSubmit={handleSubmitNewBox} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adınız / Rumuzunuz *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Merve T."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-purple-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-purple-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yarışmaya Katılacak Joy-Genie Kutunuz *</label>
                <select
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (e.target.value.includes('Eskişehir')) {
                      setFormPrompt('Odunpazarı tarihi evleri seramik kupa, Nostaljik Porsuk magneti ve Met helvası içeren özel şehir hatırası.');
                    } else if (e.target.value.includes('Kedisever')) {
                      setFormPrompt('Kedi desenli seramik kupa, filtre kahve ve edebiyat kitabı ile dolu sevimli doğum günü kutusu.');
                    } else if (e.target.value.includes('Truva')) {
                      setFormPrompt('Komik tasarımlı renkli çoraplar, esprili motto kupa ve ironik motivasyon defteri içeren neşeli şaka kutusu.');
                    } else {
                      setFormPrompt('Japon yelpazesi, Maneki-Neko kedi magneti ve Sakura kupa ile tasarlanmış Asya kültür kutusu.');
                    }
                  }}
                  className="w-full bg-white border border-purple-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-purple-600 text-slate-800 font-medium"
                >
                  <option value="Mimarlar İçin Odunpazarı Sürpriz Kutusu 🏛️">Eskişehir Odunpazarı & Porsuk Rüzgârı Kutusu (Sipariş #HP-8921)</option>
                  <option value="Kedisever Kahve & Kitap Keyfi Kutusu 🐱">Kedisever Kahve & Kitap Keyfi Kutusu (Joy-Genie Tasarımı #JG-104)</option>
                  <option value="Truva Efsane Mizahi Şaka Paketi 🎭">Truva Efsane Mizahi Şaka Paketi (Sipariş #HP-6640)</option>
                  <option value="Japonya Kawaii & Sakura Kültür Kutusu 🌸">Japonya Kawaii & Sakura Kültür Kutusu (Joy-Genie Tasarımı #JG-302)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-white border border-purple-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-purple-600 text-slate-800"
                >
                  <option value="Anime & Pop Kültür">Anime & Pop Kültür</option>
                  <option value="Mizah & Şaka">Mizah & Şaka</option>
                  <option value="Şehir & Memleket">Şehir & Memleket</option>
                  <option value="Romantik & Yıldönümü">Romantik & Yıldönümü</option>
                  <option value="Yeni İş & Terfi">Yeni İş & Terfi</option>
                  <option value="Doğum Günü">Doğum Günü</option>
                  <option value="Oyun & Geek">Oyun & Geek</option>
                  <option value="Yeni Anne & Bebek">Yeni Anne & Bebek</option>
                  <option value="Sanat & Hobi">Sanat & Hobi</option>
                  <option value="Özel Kutlama">Özel Kutlama</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seçilen Kutunun Joy-Genie Özeti</label>
                <textarea
                  readOnly
                  rows={3}
                  value={formPrompt || 'Odunpazarı tarihi evleri seramik kupa, Nostaljik Porsuk magneti ve Met helvası içeren özel şehir hatırası.'}
                  className="w-full bg-[#F5EFFB] border border-purple-200 rounded-xl p-3 text-xs text-slate-700 resize-none font-normal italic"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Kutuyu Yarışmaya Gönder ✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
