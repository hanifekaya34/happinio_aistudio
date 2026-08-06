import React, { useState } from 'react';
import { X, ChevronDown, HelpCircle, Sparkles, ArrowLeft } from 'lucide-react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPage?: boolean;
}

export default function FAQModal({ isOpen, onClose, isPage = false }: FAQModalProps) {
  if (!isOpen && !isPage) return null;

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Yapay Zeka Joy-Genie İle Kişiselleştirilmiş Hediye Kutusu Nasıl Tasarlanır?',
      a: 'Ana sayfamızdaki Joy-Genie prompt alanına veya Sihirli Anket moduna hediye alacağınız kişinin ilgi alanlarını, sevdiklerini ya da kutlama nedeninizi (Örn: "Eskişehir hastası, kahve tutkunu mimar arkadaşım için doğum günü") yazmanız yeterlidir. Gelişmiş Joy-Genie yapay zekamız bütçenize tam uyan ürün kombinasyonunu ve kişiye özel hediye notunu anında oluşturur.',
    },
    {
      q: 'Happinio Puan Sistemi Nedir, Nasıl Puan Kazanılır ve İndirimler Nasıl Çalışır?',
      a: 'Happinio Puan sistemi, sevdiklerinizle paylaştığınız mutluluğu ödüllendiren özel bir sadakat programıdır. Sisteme ücretsiz üye olduğunuzda anında <strong>100 Hoş Geldin Happinio Puanı</strong> kazanırsınız. Şehrinize özel ürün önerdiğinizde <strong>+100 Happinio Puanı</strong> (100 TL değerinde), kendi kutunuzu tasarlayıp paylaştığınızda kutunuz yarışmayı kazanırsa <strong>+100 Happinio Puanı</strong> (100 TL değerinde), topluluktaki kutuları oyladığınızda <strong>+10 Happinio Puanı</strong>, onaylı ürün yorumu yaptığınızda <strong>+10 Happinio Puanı</strong> ve her 1000 TL\'lik hediye kutusu alışverişinizde <strong>+100 Happinio Puanı</strong> kazanırsınız. <br/><br/><strong>1 Happinio Puanı = 1 TL:</strong> 1 Happinio Puanı tam 1 TL değerindedir! Biriktirdiğiniz puanları sepet adımında anında hediye kuponu olarak indirime dönüştürebilirsiniz. Ayrıca puanlarınız arttıkça <strong>Happinio maskotunuz</strong> evrimleşerek üyelik seviyenizi (Minik Çırak Happinio, Sürpriz Mimarı Happinio, Mutluluk Elçisi Happinio, Efsanevi Hediye Gurusu Happinio) yükseltir ve üyelere özel ekstra hediye ve sürprizlerin kapısını aralar.',
    },
    {
      q: 'Hediye Kutularında Ürün Özelleştirmesi ve Değişikliği Yapılabilir mi?',
      a: 'Evet! Joy-Genie önerdiği kutudaki herhangi bir ürünü tek tıkla "Ürünü Değiştir" seçeneğiyle farklı bir yerel veya gurme parçayla değiştirebilir, kutunuzu kendi zevkinize göre tamamen kişiselleştirebilirsiniz.',
    },
    {
      q: 'Kargo Süreleri ve Teslimat Koşulları Nelerdir?',
      a: 'Siparişleriniz Eskişehir atölyemizden 1-3 gün içinde özenle kargolanır. Kargo kuryeye teslim edildikten sonra 1-2 iş günü içerisinde adrese ulaşır. Ayrıca sipariş esnasında ileri tarihli kargo teslimat günü de seçebilirsiniz.',
    },
    {
      q: 'İlk Sipariş İndirimi ve Kampanyalar Nasıl Kullanılır?',
      a: 'İlk siparişinize özel %10 indirim kazanmak için ödeme ve sepet adımında <strong>HAPPINIO10</strong> kupon kodunu yazmanız yeterlidir.',
    },
    {
      q: 'Hediye Notu Yazımı ve Gönderen Gizliliği (Anonim Gönderim) Mümkün mü?',
      a: 'Evet! Kutu içerisine eklenen özel kartvizit boyutundaki hediye notları en fazla 250 karakter olacak şekilde kaligrafi ve zarif fontlarla basılır. İsterseniz gönderen kısmını boş bırakarak tamamen gizli (anonim) hediye gönderebilirsiniz.',
    },
    {
      q: 'Özel Gün Hatırlatıcısı Nasıl Çalışır?',
      a: 'Özel Gün Takvimi alanımızdan sevdiklerinizin doğum günlerini, yıldönümlerini veya özel tarihlerini ekleyebilirsiniz. Happinio otomatik e-posta hatırlatma sistemi, hediye gününden 7 gün önce size bildirim ve özel kutu önerisi gönderir.',
    },
    {
      q: 'Truva Kutusu (Mizahi Şaka Kutusu) Konsepti Nasıl Çalışır?',
      a: 'Truva Kutusu sevdiklerinizi tatlı bir şokla güldürmek için tasarlanmıştır. Sıradan ve ciddi görünen bir kutunun içinden komik çoraplar, esprili sözleri olan kupalar ve alıcının tarzına zıt, şaşırtıcı ve ironik sürprizler çıkarak kutlama anına unutulmaz bir mizah katar.',
    },
    {
      q: 'Hasarlı Ürün veya İade Süreçleri Nasıl İşler?',
      a: '%100 koşulsuz değişim ve kullanıcı memnuniyeti garantisi sunuyoruz. Taşıma esnasında oluşabilecek her türlü hasarda fotoğrafı <a href="https://wa.me/905466313382" target="_blank" rel="noopener noreferrer" class="text-purple-700 underline font-extrabold hover:text-purple-900 transition-colors">WhatsApp destek hattımıza</a> iletmeniz durumunda yenisi 1-3 gün içinde özenle kargolanır.',
    },
    {
      q: 'Kurumsal Toplu Hediye Kutusu (B2B) Ve Özel Logo Baskısı Yapılıyor mu?',
      a: 'Evet! Şirket içi tebrikler, onboarding çalışan karşılama setleri ve yılbaşı hediyeleri için kurumsal ambalaj, özel şirket logosu baskısı ve toplu gönderim hizmeti sağlıyoruz. Detaylar için <a href="mailto:iletisim@happinio.com" target="_blank" rel="noopener noreferrer" class="text-purple-700 underline font-extrabold hover:text-purple-900 transition-colors">iletisim@happinio.com</a> adresinden iletişime geçebilirsiniz.',
    },
  ];

  if (isPage) {
    return (
      <div className="pt-6 pb-14 bg-gradient-to-b from-pink-50/40 via-white to-slate-50 relative min-h-[70vh] sm:pt-8 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <HelpCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest block">Destek & Yardım Merkezi</span>
            <h1 className="text-3xl sm:text-5xl font-normal text-slate-800 font-serif leading-tight tracking-tight mt-1">
              Sıkça Sorulan <span className="text-pink-500 italic">Sorular</span> 💬
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Joy-Genie yapay zeka asistanımız, Happinio Puan sistemi, kargo, iade ve merak ettiğiniz diğer tüm detaylar.
            </p>
          </div>

          {/* FAQ list */}
          <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-purple-100 shadow-xl space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left p-4.5 font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-3 hover:bg-purple-50/40 transition-colors"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-purple-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div 
                      className="p-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white/90"
                      dangerouslySetInnerHTML={{ __html: faq.a }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-purple-100 overflow-hidden relative">
        
        {/* Header with Close button */}
        <div className="p-5 sm:p-6 border-b border-purple-100 flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl shrink-0">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-widest block">Sıkça Sorulan Sorular</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif leading-tight">Aklınıza Takılan Sorular</h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full shrink-0 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable FAQ Accordion List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-slate-50/80 rounded-2xl border border-slate-200/80 overflow-hidden transition-all">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-4 font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-3 hover:bg-purple-50/50 transition-colors"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-purple-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div 
                    className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white"
                    dangerouslySetInnerHTML={{ __html: faq.a }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
