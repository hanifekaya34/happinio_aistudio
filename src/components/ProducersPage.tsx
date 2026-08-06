import React, { useState } from 'react';
import { PRODUCERS_DATA } from '../data/producersData';
import { Producer, GiftBox } from '../types';
import { MapPin, Sparkles, Heart, ArrowRight, Award, ShieldCheck, ShoppingBag, Eye, Users, ChevronRight } from 'lucide-react';
import HapyMascot from './HapyMascot';

interface ProducersPageProps {
  onSelectBox: (box: GiftBox) => void;
  onNavigateToCategory: (category: string, producerBadge?: string) => void;
  boxes: GiftBox[];
  onOpenContact?: () => void;
}

export default function ProducersPage({ onSelectBox, onNavigateToCategory, boxes, onOpenContact }: ProducersPageProps) {
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);
  const [filterCity, setFilterCity] = useState<string>('all');
  const [selectedCraftedProduct, setSelectedCraftedProduct] = useState<{
    name: string;
    producerName: string;
    image: string;
    description: string;
    artisanDetails: string;
    materials: string;
  } | null>(null);

  const selectedProducer = PRODUCERS_DATA.find((p) => p.id === selectedProducerId) || null;

  const filteredProducers = filterCity === 'all' 
    ? PRODUCERS_DATA 
    : PRODUCERS_DATA.filter(p => p.city.toLowerCase().includes(filterCity.toLowerCase()));

  const handleCardClick = (id: string) => {
    setSelectedProducerId(id);
    const element = document.getElementById(`producer-card-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleViewBoxesForProducer = (producer: Producer) => {
    if (producer.relatedBoxCategory) {
      onNavigateToCategory(producer.relatedBoxCategory, producer.badge);
    } else {
      onNavigateToCategory('all', producer.badge);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-6 pb-10 px-4 sm:px-6 lg:px-8 sm:pt-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif leading-tight tracking-tight">
            Kutularımızı Zenginleştiren <br />
            <span className="text-purple-800 italic">Yerel Üreticilerimiz & Atölyelerimiz</span> 🌾
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Happinio kutularında yer alan her bir parça; Odunpazarı'ndaki seramik ustalarından Ege kadın kooperatiflerine, Gaziantep bakırcılarından Buldan el dokuma tezgâhlarına kadar el emeğiyle sevgi üreten yerel sanatkârlarımızın eseridir.
          </p>

          {/* Value Badges Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-3.5 py-1.5 rounded-2xl border border-purple-100 shadow-2xs">
              🌸 Kadın Kooperatifleri Desteği
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-3.5 py-1.5 rounded-2xl border border-purple-100 shadow-2xs">
              🌿 %100 Doğal & Sürdürülebilir
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-3.5 py-1.5 rounded-2xl border border-purple-100 shadow-2xs">
              🤝 Doğrudan Ve Etik Ticaret
            </span>
          </div>
        </div>

        {/* Local Producer & Women Cooperative CTA Box */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-purple-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-900 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Üretici & Kooperatif Daveti 🌸</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-purple-950 leading-snug">
              Happinio Üretici Ailesine Katılın
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
              Sen de el emeği ürünler üreten bir atölye veya kadın kooperatifi misin? Happinio kutularında yer almak için bizimle iletişime geç! El emeğini binlerce mutlu hediyeleşme anıyla buluşturalım.
            </p>
          </div>

          <button
            onClick={() => onOpenContact && onOpenContact()}
            className="bg-amber-400 hover:bg-amber-300 text-purple-950 px-6 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2 border border-amber-300 relative z-10 hover:scale-105"
          >
            <span>Bizimle İletişime Geç</span>
            <ArrowRight className="w-4 h-4 text-purple-950" />
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="bg-white rounded-3xl border border-purple-100/90 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Şehir / Bölge Filtresi
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <button
              onClick={() => setFilterCity('all')}
              className={`text-xs font-bold px-4 py-2 rounded-2xl transition-all whitespace-nowrap ${
                filterCity === 'all'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-purple-50 text-slate-700 hover:bg-purple-100'
              }`}
            >
              Tüm Üreticiler ({PRODUCERS_DATA.length})
            </button>
            {['Eskişehir', 'Ayvalık', 'Gaziantep', 'Denizli', 'Çeşme'].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCity(c)}
                className={`text-xs font-bold px-4 py-2 rounded-2xl transition-all whitespace-nowrap ${
                  filterCity === c
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-purple-50 text-slate-700 hover:bg-purple-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCER CARDS GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              Üreticilerimizin Hikâyeleri ({filteredProducers.length})
            </h2>
            <span className="text-xs text-slate-500">Her biri %100 el işçiliği & sevgi doludur</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducers.map((producer) => {
              const isSelected = selectedProducerId === producer.id;

              return (
                <div
                  id={`producer-card-${producer.id}`}
                  key={producer.id}
                  className={`bg-white rounded-[32px] border p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between space-y-6 ${
                    isSelected
                      ? 'border-purple-600 ring-2 ring-purple-300 shadow-xl bg-purple-50/20'
                      : 'border-purple-100/90 shadow-sm hover:shadow-md hover:border-purple-300'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Top Info & Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-0.5 rounded-full border border-amber-200">
                          {producer.badge}
                        </span>
                        <h3 className="text-xl font-bold font-serif text-slate-900 mt-2">
                          {producer.name}
                        </h3>
                        <p className="text-xs font-semibold text-purple-700 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{producer.city} • {producer.artisanName}</span>
                        </p>
                      </div>

                      <span className="text-2xl">🌿</span>
                    </div>

                    {/* Image & Story */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                      <div className="sm:col-span-2 relative h-40 sm:h-44 rounded-2xl overflow-hidden bg-purple-100 shadow-inner">
                        <img
                          src={producer.image}
                          alt={producer.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                          {producer.category}
                        </div>
                      </div>

                      <div className="sm:col-span-3 space-y-2">
                        <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-normal bg-purple-50/80 p-4 rounded-2xl border border-purple-100/60">
                          "{producer.story}"
                        </p>
                      </div>
                    </div>

                    {/* Products Crafted List */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Kutularımızda Yer Alan Ürünleri (Detay için Tıklayın 👁️):
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {producer.productsCrafted.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const detail = CRAFTED_PRODUCTS_DETAILS[item] || {
                                image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
                                description: `${item} yerel üreticilerimiz tarafından büyük bir özenle üretilmektedir.`,
                                artisanDetails: `${producer.name} zanaatkârlarının el emeğidir.`,
                                materials: 'Doğal hammaddeler.'
                              };
                              setSelectedCraftedProduct({
                                name: item,
                                producerName: producer.name,
                                ...detail
                              });
                            }}
                            className="text-xs bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 hover:border-purple-300 px-3 py-1.5 rounded-xl font-medium shadow-2xs flex items-center gap-1 cursor-pointer transition-all hover:scale-102"
                          >
                            <span>✨</span>
                            <span>{item}</span>
                            <Eye className="w-3 h-3 text-purple-400 ml-1 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button: "Onların Ürünlerini Gör" */}
                  <div className="pt-4 border-t border-purple-100 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                      Gönül bağı kurduğumuz yerel partnerimiz
                    </span>

                    <button
                      type="button"
                      onClick={() => handleViewBoxesForProducer(producer)}
                      className="w-full sm:w-auto bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>Ürünlerini İçeren Kutuları Gör</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Crafted Product Detail Pop-up Modal */}
      {selectedCraftedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF7F2] rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-purple-200 relative space-y-5 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <h3 className="text-lg font-bold text-purple-950 font-serif leading-snug">
                  Yerel Üretici Ürün Detayı
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCraftedProduct(null)}
                className="p-1.5 text-purple-900 hover:bg-purple-100 rounded-full transition-colors cursor-pointer font-bold text-sm"
              >
                Kapat ×
              </button>
            </div>

            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-purple-100 border border-purple-100 shadow-inner">
              <img
                src={selectedCraftedProduct.image}
                alt={selectedCraftedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                📍 {selectedCraftedProduct.producerName}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase">ZANAATKÂR ESERİ</span>
                <h4 className="text-xl font-bold text-slate-900 font-serif leading-tight">
                  {selectedCraftedProduct.name}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {selectedCraftedProduct.description}
              </p>

              <div className="bg-white p-4 rounded-2xl border border-purple-100 space-y-2.5">
                <div className="text-xs">
                  <span className="font-extrabold text-purple-950 block">👋 Nasıl Üretildi?</span>
                  <span className="text-slate-600 font-normal leading-relaxed block mt-0.5">{selectedCraftedProduct.artisanDetails}</span>
                </div>
                <div className="text-xs border-t border-purple-50 pt-2.5">
                  <span className="font-extrabold text-purple-950 block">🌿 Malzemeler & İçerik:</span>
                  <span className="text-slate-600 font-normal leading-relaxed block mt-0.5">{selectedCraftedProduct.materials}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCraftedProduct(null)}
              className="w-full bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-colors cursor-pointer"
            >
              Anladım, Harika!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Global lookup data for crafted products to avoid visual slop and populate with real photos
const CRAFTED_PRODUCTS_DETAILS: Record<string, {
  image: string;
  description: string;
  artisanDetails: string;
  materials: string;
}> = {
  'El Yapımı Seramik Kupa': {
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
    description: 'Odunpazarı çamuruyla şekillendirilen, 1200 derecede çift fırınlanmış dayanıklı ve gıdaya uygun seramik kupa. Her bir kupanın sırlaması el yapımı olduğu için kendine has benzersiz desenler taşır.',
    artisanDetails: 'Ayşe Hanım ve Odunpazarı Seramik Atölyesi ustaları tarafından tamamen el çarkında üretilmiştir.',
    materials: 'Doğal kil çamuru, kurşunsuz gıda uyumlu yerel sırlar.'
  },
  'Eskişehir Temalı Seramik Magnet': {
    image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&q=80',
    description: 'Tarihi Eskişehir evleri motiflerinin seramik üzerine kabartma tekniğiyle işlendiği, el boyaması nostaljik buzdolabı magneti.',
    artisanDetails: 'Genç seramik mezunları ve Odunpazarı kadın kooperatifi üyelerince tek tek boyanmıştır.',
    materials: 'Kırmızı kil çamuru, akrilik el boyaması koruyucu mat cila.'
  },
  'Eskişehir Porselen Çay Fincanı': {
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&q=80',
    description: 'Yüksek kaliteli Eskişehir porselen kiliyle dökülen, kenarları gerçek altın yaldız kaplamalı şık çay fincanı ve tabağı.',
    artisanDetails: 'Porselen zanaatkârları tarafından fırın sonrası özel yaldız kalemiyle dekorlanmıştır.',
    materials: 'Sert porselen, %12 gerçek altın yaldız dekoru.'
  },
  '%100 Soğuk Sıkım Zeytinyağı Sabunu': {
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&q=80',
    description: 'Ayvalık’ın asırlık zeytin ağaçlarından toplanan sızma zeytinyağlarıyla geleneksel soğuk süreç (cold process) yöntemiyle elde kesilerek olgunlaştırılan doğal sabun. Cildi kurutmadan derinlemesine besler ve nemlendirir.',
    artisanDetails: 'Ayvalık & Cunda Kadın Kooperatifi üyesi kadınlar tarafından geleneksel kazanlarda soğuk mayalama tekniğiyle hazırlanmıştır.',
    materials: '%100 Ayvalık Sızma Zeytinyağı, NaOH, saf su, doğal lavanta yağı.'
  },
  'Ege Lavanta Kesesi': {
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&q=80',
    description: 'Ayvalık sırtlarında doğal olarak yetişen aromatik lavanta çiçeklerinin kurutularak el dikimi keten keselere doldurulmasıyla hazırlanan koku kesesi. Giysi dolaplarınızda veya baş ucunuzda rahatlatıcı bir koku yayar.',
    artisanDetails: 'Kooperatif bünyesindeki ev hanımları tarafından yerel keten kumaşlardan elde dikilmiştir.',
    materials: 'Kurutulmuş taze lavanta tomurcukları, el dokuması keten kılıf.'
  },
  'Zeytin Ağacı Masif Hediye Kutusu': {
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    description: 'Budama mevsiminde kesilen, ömrünü tamamlamış zeytin ağacı dallarından oyularak yapılan masif, doğal ahşap dokulu şık kutu. Ahşabın damarları her kutuda tamamen benzersizdir.',
    artisanDetails: 'Ege marangoz ustaları tarafından zımparalanıp doğal keten tohumu yağı ile cilalanmıştır.',
    materials: 'Sürdürülebilir zeytin ağacı masif ahşabı, doğal koruyucu yağlar.'
  },
  'El İşlemesi Bakır Cezve Seti': {
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
    description: 'Gaziantep’in asırlık Bakırcılar Çarşısı’nda, çekiç vurma tekniği ile kalın bakır plakalardan dövülerek üretilen geleneksel cezve. İçi gıda güvenliği için saf kalay ile kaplanmıştır.',
    artisanDetails: 'Mehmet Usta ve çırakları tarafından her biri binlerce çekiç darbesiyle şekillendirilmiştir.',
    materials: 'Dövme kızıl bakır, döküm pirinç sap, iç kısımda saf kalay kaplama.'
  },
  'Antep Fıstıklı Gurme Lokum Kutu': {
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&q=80',
    description: 'Coğrafi işaretli Gaziantep boz fıstığı ile nişasta ve pancar şekerinin geleneksel bakır kazanlarda ağır ateşte pişirilmesiyle yapılan, dışı kadayıf ve fıstık kaplı gurme çifte kavrulmuş lokum.',
    artisanDetails: 'Tarihi Antep şekerleme ustaları tarafından geleneksel asırlık reçeteyle taze üretilmiştir.',
    materials: 'Gaziantep boz fıstık (%40), pancar şekeri, mısır nişastası, çöven otu suyu.'
  },
  '%100 Pamuklu Buldan Peştemal': {
    image: 'https://images.unsplash.com/photo-1606744888344-493238951221?w=600&q=80',
    description: 'Denizli Buldan’ın meşhur ahşap kara tezgâhlarında, organik pamuk ipliklerinden dokunan yüksek emici güce sahip, hızlı kuruyan şık peştemal. Plajda, banyoda veya dekoratif şal olarak kullanılabilir.',
    artisanDetails: 'Buldanlı el dokuma ustaları tarafından geleneksel mekikli ahşap tezgâhlarda dokunmuştur.',
    materials: '%100 Organik Ege Pamuğu iplikleri, doğal bitkisel kök boyaları.'
  },
  'Buldan El Dokuma Masa Örtüsü': {
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&q=80',
    description: 'Pamuk ve keten karışımı ipliklerden, kenarları el düğümü püsküllü, otantik ve şık dökümlü Buldan dokuması masa örtüsü.',
    artisanDetails: 'Buldan Kadın İnisiyatifi üyesi zanaatkâr kadınlar tarafından saçakları tek tek elle örülmüştür.',
    materials: 'Yarı keten yarı pamuk doğal iplik harmanı.'
  },
  'Trabzon Fındıklı Gurme Çikolata': {
    image: 'https://images.unsplash.com/photo-1548907040-4d42b52145ca?w=600&q=80',
    description: 'Giresun ve Trabzon yamaçlarından toplanan taptaze yağlı fındıkların çikolata ustaları tarafından Belçika çikolatasıyla buluşturulmasıyla yapılan el yapımı lüks pralin ve trüf dolgulu çikolata serisi.',
    artisanDetails: 'Karadeniz butik çikolata atölyesinde, kadın ustaların titiz el yapımı temperatür tekniğiyle temperlenmiştir.',
    materials: '%54 kakao oranlı bitter/sütlü çikolata, kavrulmuş yerli fındık, tereyağı, vanilya.'
  },
  'Rize İki Filiz Tek Yaprak Gurme Çay': {
    image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&q=80',
    description: 'Doğu Karadeniz’in yüksek ve sisli yamaçlarından, Mayıs ayında ilk sürgün döneminde sadece "iki filiz bir yaprak" kuralına göre elle toplanan, koruyucu ve katkı maddesi içermeyen üstün dem kalitesine sahip dökme siyah çay.',
    artisanDetails: 'Rize’deki aile işletmeleri tarafından geleneksel soldurma ve fırınlama aşamalarıyla sınırlı miktarda üretilmiştir.',
    materials: '%100 Elle toplanmış taze Mayıs sürgünü siyah çay yaprakları.'
  },
  'Çeşme Lavanta Kolonyası': {
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
    description: 'Alaçatı’nın bereketli lavanta tarlalarından toplanan tomurcukların distilasyonu ile elde edilen saf lavanta yağı ile zenginleştirilmiş, ferahlatıcı ve yatıştırıcı 80 derece lüks kolonya.',
    artisanDetails: 'Alaçatı aromaterapi atölyesinde, Zeynep ve Canan Hanım’ın lavanta bahçelerinden elde edilen uçucu yağlarla formüle edilmiştir.',
    materials: 'Alaçatı taze lavanta uçucu yağı, etil alkol (80°), deiyonize saf su.'
  },
  'Doğal Soya Mumu (Ahşap Fitilli)': {
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
    description: 'GDO içermeyen %100 doğal soya fasulyesi yağından üretilen, yandığında zararlı kimyasallar salmayan çevre dostu aromaterapi mumu. Ahşap fitili sayesinde yanarken şömine çıtırtısı sesi çıkararak huzurlu bir ortam yaratır.',
    artisanDetails: 'Alaçatı atölyelerinde el yapımı beton/seramik kaplara tek tek elde dökülerek dinlendirilmiştir.',
    materials: '%100 Doğal Soya Waxı, doğal lavanta ve vanilya esansiyel yağları, çıtırdayan ahşap fitil.'
  }
};
