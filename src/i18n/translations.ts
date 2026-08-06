export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    brandName: 'Happinio',
    tagline: 'Samimi & Özenle Hazırlanmış Hediye Dünyası',
    bannerText: 'İlk siparişinize özel %10 indirim fırsatını kaçırmayın! 🎁',
    bannerCode: 'KOD: HAPPINIO10',
    
    // Navigation
    nav: {
      home: 'Ana Sayfa',
      boxes: 'Tematik Kutular',
      cityBoxes: 'Memleketimden Seçki Kutular',
      story: 'Hikâyemiz',
      producers: 'Yerel Üreticiler',
      community: 'Kutu Oylaması',
      calendar: 'Özel Gün Takvimi',
      subscription: 'Abonelik Kulübü',
      reviews: 'Kullanıcı Yorumları',
      art: 'Aylık Görseller',
      contact: 'İletişim',
      suggestProduct: 'Ürün Öner (+100P)',
      cart: 'Sepet',
      profile: 'Profilim',
      orderTracking: 'Sipariş Takibi',
    },

    // Hero / AI Genie Prompt
    hero: {
      badge: 'JOY-GENIE • SEVGİ İLE TASARLANDI',
      titleStart: 'Unutulmaz Bir Gülümseme',
      titleHighlight: 'Tasarlayın',
      titleEnd: '✨',
      subtitle: 'Sadece sevdiklerinizin neleri sevdiğini, hobilerini ya da kutlama nedeninizi yazın. Joy-Genie sizin için samimi ve özenle paketlenmiş en tatlı sürpriz kutusunu hazırlasın.',
      textareaPlaceholder: 'Örn: Çocukluk arkadaşım Melis\'in 30. yaş günü! Türk kahvesi, seramik kupalar ve sukulent bitkilere bayılır. Sıcak ve anlamlı bir hediye olsun...',
      budgetLabel: 'Bütçe Hedefi:',
      buttonNormal: 'Sürpriz Kutumu Hazırla',
      buttonLoading: 'Joy-Genie Hazırlıyor...',
      quickPromptsTitle: 'İlham Veren Fikirler:',
      tags: ['#CATLOVER', '#DORMGIFT', '#LOCALCRAFT', '#NEWBORN'],
    },

    // Story Page (Hikâyemiz)
    story: {
      badge: 'HİKÂYEMİZ & KALPTEN DOKUNUŞ',
      title: 'Hediye Vermekten Mutlu Olanlar İçin <br /><span class="text-pink-500 italic">Kişiselleştirilmiş Sevgi Kutuları</span> 🌸',
      intro: '"Keşke şöyle bir şey olsa" demek yerine, o hayali gerçeğe dönüştürmeyi seçtik.',
      founderRole: 'Happinio Kurucuları',
      founderName: 'Hanife & Emir Sinan Gürlek',
      founderNoteTitle: 'Happinio Nasıl Doğdu?',
      paragraphs: [
        'Biz hediye almayı da, sevdiklerimizin yüzündeki o ilk tebessümü görmeyi de çok seven bir çiftiz. Ancak özel günlerde sevdiklerimiz için "tam ona göre" bir hediye ararken, internet sitelerinde saatlerce kaybolmaktan ve aradığımız o eşsiz dokunuşu bulamamaktan çok yoruluyorduk.',
        'Sevdiğimiz dizi, film ve oyunların renkli detaylarını, içten bir repliği ya da aramızdaki esprili bir anıyı hediyelerin içinde görmeyi hep çok istedik. Hayal ettiğimiz kadar samimi, özgün ve pratik bir hediye dünyası oluşturmak için "Neden yapay zeka ile herkesin kendi hayalindeki kutuyu kolayca tasarlayabileceği bir platform olmasın ki?" diyerek yola koyulduk.',
        'Markamızın ismini, Pokémon dünyasının etrafına neşe saçan sevimli karakteri Happiny’den aldık. Cebindeki mutluluğu herkesle paylaşan bu sevimli karakterden esinlenerek kurduğumuz Happinio’da, bu neşeli ruhu akıllı yapay zeka asistanımız Joy-Genie ile birleştirdik. İstedik ki hediye alacağınız kişiyi sadece birkaç cümleyle tarif edin; Joy-Genie sizin için en anlamlı kutu kombinasyonunu saniyeler içinde hazırlasın.',
        'Bu heyecanlı maceramıza öncelikle Eskişehir’deki yerel üreticilerle, el emeği ürünler hazırlayan kadın kooperatiflerinin ve lokal atölyelerin dokunuşlarıyla başladık. Hedefimiz, Türkiye\'nin dört bir yanındaki bu değerli el emeklerini sevdiklerinizle buluşturmak.',
        'Biz bu yola, kendimizin de sevdiklerimize heyecanla hediye etmek isteyeceği kalitede ve samimiyette kutular hazırlamak için çıktık. En güzel anlarınıza ortak olmak dileğiyle!'
      ],
      valuesTitle: 'Happinio Değerlerimiz',
      val1Title: 'Yerel Üreticiler',
      val1Desc: 'Şehirlerimizden özenle seçilen özgün ürünler ve lezzetlerle zenginleştirilmiş dengeli kutular.',
      val2Title: 'Kişiye Özel Hediye Kutuları',
      val2Desc: 'Yapay zeka asistanımız Joy-Genie ile saniyeler içinde doğru hediye kombinasyonunu bulun.',
      val3Title: 'Samimi Duygu Paylaşımı',
      val3Desc: 'Her kutuya yapay zeka asistanımız Joy-Genie ile oluşturabileceğiniz samimi bir mesaj kartı eşlik eder.',
      val4Title: 'Şık ve Özenli Sunum',
      val4Desc: 'Özenle paketlenmiş, estetik ve hediye edilmeye hazır kutu tasarımları.',
      ctaTitle: 'Siz de Sevdiklerinize Sevgi Dolu Bir Mutluluk Kutusu Gönderin',
      ctaBtn: 'Tematik Kutuları Keşfet →',
    },

    // Downloadable Art Section
    art: {
      badge: 'HAPPINIO ÜYE AYRICALIĞI',
      title: 'Aylık Ücretsiz İndirilebilir Tasarımlarım 🎨',
      description: 'Happinio üyelerimize özel her ay özenle çizilen 4K duvar kâğıtları, masaüstü takvimleri ve printable hediye etiketlerini ücretsiz indirebilirsiniz.',
      badge1: '🖥️ 4K Wallpaper',
      badge2: '🗓️ Aylık Takvimler',
      badge3: '🏷️ Hediye Etiketleri',
      btnText: 'Tüm Tasarımları İncele & İndir',
    },

    // Contact Page & Modal
    contact: {
      badge: 'BİZE ULAŞIN',
      title: 'İletişim & Canlı Destek',
      subtitle: 'Sorularınız, kurumsal hediye talepleriniz veya iş birliği önerileriniz için buradayız.',
      whatsappTitle: 'WhatsApp Destek Hattı',
      whatsappHours: 'Hafta içi 09:00 - 19:00',
      emailTitle: 'E-Posta Adresi',
      emailDesc: 'Genel & Kurumsal Talepler',
      addressTitle: 'Eskişehir Atölye & Ofis',
      addressText: 'Akarbaşı Mah. Atatürk Cad. No:14/A, Odunpazarı / Eskişehir',
      formTitle: 'Bize Mesaj Gönderin',
      nameLabel: 'Adınız Soyadınız',
      emailLabel: 'E-Posta Adresiniz',
      phoneLabel: 'Telefon Numaranız',
      subjectLabel: 'Konu Başlığı',
      messageLabel: 'Mesajınız',
      sendBtn: 'Mesajı Gönder',
      successMsg: 'Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.',
    },

    // Catalog & Boxes
    catalog: {
      badge: 'ÖZENLE SEÇİLMİŞ KUTULAR',
      title: 'Her An İçin <span class="text-pink-500 italic">Hazır Sürprizler</span>',
      subtitle: 'Özel temalarla paketlenmiş hazır kutularımızı inceleyin veya tek tıkla sepetinize ekleyin.',
      searchPlaceholder: 'Kutu veya hediye ara...',
      allCategories: 'Tüm Kategoriler',
      addToCart: 'Sepete Ekle',
      viewDetails: 'Detaylı İncele',
      discount: 'İndirim',
      rating: 'Puan',
      reviewsCount: 'değerlendirme',
    },

    // Local Producers
    producers: {
      badge: 'YEREL ÜRETİCİ DOKUNUŞU',
      title: 'Anadolu\'nun Zanaatkârları & Kadın Kooperatifleri',
      subtitle: 'Hediyelerimize ruh katan el emeği üreticilerimiz ve atölyelerimiz ile tanışın.',
    },

    // Footer
    footer: {
      about: 'Hakkımızda & Hikâyemiz',
      faq: 'Sıkça Sorulan Sorular',
      contact: 'İletişim & Destek',
      privacy: 'Gizlilik ve Güvenlik',
      copyright: '© 2026 Happinio - Kişiselleştirilmiş Hediye & Sürpriz Dünyası. Tüm hakları saklıdır.',
      securePayment: '256-Bit SSL & PCI DSS Güvenli Ödeme',
    },

    // Language Toggle
    langToggle: 'Language',
  },

  en: {
    brandName: 'Happinio',
    tagline: 'Warm & Handcrafted Gift & Joy Studio',
    bannerText: 'Get 10% off on your first order with code HAPPINIO10! 🎁',
    bannerCode: 'CODE: HAPPINIO10',

    // Navigation
    nav: {
      home: 'Home',
      boxes: 'Gift Boxes',
      cityBoxes: 'City & Artisans',
      story: 'Our Story',
      producers: 'Local Artisans',
      community: 'Box Contest',
      calendar: 'Occasion Calendar',
      subscription: 'Subscription Club',
      reviews: 'Joy Reviews',
      art: 'Monthly Art',
      contact: 'Contact',
      suggestProduct: 'Suggest Item (+100P)',
      cart: 'Cart',
      profile: 'My Profile',
      orderTracking: 'Order Tracking',
    },

    // Hero / AI Genie Prompt
    hero: {
      badge: 'JOY-GENIE • CRAFTED WITH LOVE',
      titleStart: 'Design an Unforgettable',
      titleHighlight: 'Smile Today',
      titleEnd: '✨',
      subtitle: 'Simply write what your loved one enjoys, their hobbies, or celebration reason. Joy-Genie curates a warm, handcrafted surprise box delivered with love.',
      textareaPlaceholder: 'e.g., Birthday surprise for my best friend! She loves dark roast coffee, handmade ceramics, and succulent plants. Keep it warm and personal...',
      budgetLabel: 'Target Budget:',
      buttonNormal: 'Prepare My Surprise Box',
      buttonLoading: 'Joy-Genie is Curating...',
      quickPromptsTitle: 'Inspiring Prompts:',
      tags: ['#CATLOVER', '#DORMGIFT', '#LOCALCRAFT', '#NEWBORN'],
    },

    // Story Page
    story: {
      badge: 'OUR STORY',
      title: 'Not Mass Produced, <br /><span class="text-pink-500 italic">Crafted From The Heart</span>',
      intro: 'Instead of saying "I wish something like this existed", we chose to turn that dream into reality.',
      founderRole: 'Happinio Founders',
      founderName: 'Hanife & Emir Sinan Gürlek',
      founderNoteTitle: 'How Happinio Was Born',
      paragraphs: [
        'We are a couple who loves gifting and seeing the immediate smiles on our loved ones\' faces. However, searching for that "perfect" gift on special occasions used to leave us exhausted, scrolling endlessly through websites without finding that uniquely personal touch.',
        'We always wanted to see our favorite quotes, colorful details from our favorite shows, movies, and games, or shared inside jokes reflected inside the gifts. Finding no place as heartwarming, creative, and practical as we imagined, we decided: "Why not build an AI-powered platform where everyone can easily design their dream gift box?" and embarked on our journey.',
        'We named our dream Happinio, inspired by Happiny—the cheerful Pokémon character who spreads joy and happiness wherever she goes. At Happinio, we blended this joyful spirit with our smart AI assistant, Joy-Genie. Simply describe your recipient in a few sentences, and Joy-Genie will curate the ideal gift combination in seconds!',
        'We started this adventure primarily with local artisans in Eskişehir, bringing together handmade treasures from women\'s cooperatives and local workshops. Our goal is to connect these precious handcrafts with your loved ones.',
        'We began this journey to craft boxes we would be absolutely thrilled to pack and gift ourselves. We can\'t wait to be part of your happiest memories!'
      ],
      valuesTitle: 'Our Core Values',
      val1Title: 'Handcrafted & Local Support',
      val1Desc: 'We partner with local female artisans and craftspeople across Anatolia to feature authentic items in our boxes.',
      val2Title: 'Personalized Gift Boxes',
      val2Desc: 'Find the perfect combination of products for your recipient with our AI assistant Joy-Genie.',
      val3Title: 'Heartfelt Emotion Sharing',
      val3Desc: 'Every box includes a custom message card that you can generate using our AI assistant Joy-Genie.',
      val4Title: 'Eco-Friendly Packaging',
      val4Desc: 'We use recyclable craft boxes, organic cotton ribbons, and plastic-free protective fillers.',
      ctaTitle: 'Send a Heartfelt Box of Joy Today',
      ctaBtn: 'Explore Gift Boxes →',
    },

    // Downloadable Art Section
    art: {
      badge: 'HAPPINIO MEMBER EXCLUSIVE',
      title: 'Free Monthly Creative Downloads 🎨',
      description: 'Exclusive to Happinio members! Download high-resolution 4K wallpapers, desktop calendars, and printable gift tags crafted specially each month.',
      badge1: '🖥️ 4K Desktop & Mobile Wallpaper',
      badge2: '🗓️ Funny Monthly Calendars',
      badge3: '🏷️ Printable Gift Tags & Labels',
      btnText: 'Explore & Download Free Art',
    },

    // Contact Page & Modal
    contact: {
      badge: 'GET IN TOUCH',
      title: 'Contact & Live Support',
      subtitle: 'We are here for your questions, corporate gifting requests, and partnership proposals.',
      whatsappTitle: 'WhatsApp Support Line',
      whatsappHours: 'Weekdays 09:00 - 19:00',
      emailTitle: 'Email Address',
      emailDesc: 'General & Corporate Inquiries',
      addressTitle: 'Eskişehir Workshop & Office',
      addressText: 'Akarbaşı Mah. Atatürk Cad. No:14/A, Odunpazarı / Eskişehir',
      formTitle: 'Send Us a Message',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      phoneLabel: 'Phone Number',
      subjectLabel: 'Subject',
      messageLabel: 'Your Message',
      sendBtn: 'Send Message',
      successMsg: 'Your message has been sent successfully! We will get back to you shortly.',
    },

    // Catalog & Boxes
    catalog: {
      badge: 'HANDPICKED BOXES',
      title: 'Ready Surprises <span class="text-pink-500 italic">For Every Occasion</span>',
      subtitle: 'Browse our curated theme boxes or add to cart with a single click.',
      searchPlaceholder: 'Search box or gift items...',
      allCategories: 'All Categories',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      discount: 'Discount',
      rating: 'Rating',
      reviewsCount: 'reviews',
    },

    // Local Producers
    producers: {
      badge: 'LOCAL ARTISAN TOUCH',
      title: 'Artisans & Women Cooperatives of Anatolia',
      subtitle: 'Meet the talented craftspeople and workshops that bring heart and soul to our gift boxes.',
    },

    // Footer
    footer: {
      about: 'About Us & Our Story',
      faq: 'Frequently Asked Questions',
      contact: 'Contact & Support',
      privacy: 'Privacy & Security',
      copyright: '© 2026 Happinio - Handcrafted Gift & Joy Studio. All rights reserved.',
      securePayment: '256-Bit SSL & PCI DSS Secure Checkout',
    },

    // Language Toggle
    langToggle: 'Dil / Language',
  },
};

