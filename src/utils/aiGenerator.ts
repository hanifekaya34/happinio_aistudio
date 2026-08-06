import { PRODUCTS } from '../data/mockData';
import { Product } from '../types';

export interface AIRecommendationResult {
  boxTitle: string;
  tagline: string;
  matchedItems: Product[];
  totalPrice: number;
  matchScore: number;
  personalizedGiftNote: string;
  suggestedBoxCategory: string;
  aiExplanation: string;
}

export async function generateAIGiftBox(promptText: string, budget?: number): Promise<AIRecommendationResult> {
  const targetBudget = budget && budget > 0 ? budget : 1000;

  // 1. Try server API first
  try {
    const response = await fetch('/api/ai-gift-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText, targetBudget }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.boxTitle && Array.isArray(data.matchedItems) && data.matchedItems.length > 0) {
        return data as AIRecommendationResult;
      }
    }
  } catch (err) {
    console.warn('Server API call failed or unavailable, using client-side AI matching algorithm:', err);
  }

  // 2. Client-side Smart AI Matching Algorithm (Fallback for Vercel / Static Hosting)
  return generateClientFallbackRecommendation(promptText, targetBudget);
}

export function generateClientFallbackRecommendation(prompt: string, requestedBudget: number): AIRecommendationResult {
  const lowerPrompt = prompt.toLowerCase();

  // Extract budget if mentioned in prompt text (e.g. "500 tl", "1200 lira")
  let targetBudget = requestedBudget;
  const promptBudgetMatch = prompt.match(/(\d{3,4})\s*(tl|lira|₺)?/i);
  if (promptBudgetMatch && (!requestedBudget || requestedBudget === 1000)) {
    const parsedVal = parseInt(promptBudgetMatch[1], 10);
    if (parsedVal >= 200 && parsedVal <= 5000) targetBudget = parsedVal;
  }

  // Roles & Professions dictionary
  const roleKeywords: Record<string, string[]> = {
    yazılımcı: ['yazılımcı', 'kod', 'yazılım', 'mühendis', 'developer', 'coder', 'bilgisayar', 'programcı'],
    mimar: ['mimar', 'iç mimar', 'çizim', 'tasarım', 'sanatçı', 'ressam', 'estetik', 'eskiz', 'dizayn'],
    öğretmen: ['öğretmen', 'hocam', 'eğitmen', 'akademisyen', 'okul', 'ders'],
    doktor: ['doktor', 'hemşire', 'sağlık', 'tıp', 'hastane'],
    avukat: ['avukat', 'hukuk', 'savcı', 'hakim'],
    yeni_anne: ['bebek', 'anne', 'yeni anne', 'doğum', 'lohusa', 'bebeği'],
    sevgili: ['sevgili', 'sevgilim', 'aşk', 'romantik', 'eşim', 'kocam', 'karım', 'yarim', 'sevgililer'],
    arkadaş: ['arkadaş', 'dost', 'kanka', 'kuzen', 'ortak', 'kardeş'],
  };

  // Interests & Themes dictionary
  const themeKeywords: Record<string, string[]> = {
    kahve: ['kahve', 'espresso', 'filtre', 'arabica', 'latte', 'kupa', 'mug', 'bardak'],
    kedi: ['kedi', 'kedicik', 'pati', 'mırıl', 'cat'],
    mizah: ['şaka', 'saka', 'troll', 'truva', 'komik', 'esprili', 'motto', 'replik', 'meme'],
    eskişehir: ['eskişehir', 'odunpazarı', 'sanat', 'yerel'],
    kitap: ['kitap', 'okuma', 'klasik', 'defter', 'ajanda', 'planlayıcı', 'yazı'],
    cikolata: ['çikolata', 'tatlı', 'trüf', 'lokum', 'fındık', 'atıştırmalık', 'gurme', 'lezzet'],
    dinlenme: ['mum', 'soya', 'lavanta', 'spa', 'sakin', 'huzur', 'relax', 'bitki çayı', 'dinlenme'],
    fantastik: ['fantastik', 'harry potter', 'sinema', 'dizi', 'film', 'star wars', 'oyun'],
    kurumsal: ['iş', 'terfi', 'ofis', 'kariyer', 'onboarding', 'yeni iş', 'termos', 'kalem'],
    dogum_gunu: ['doğum günü', 'dogum gunu', 'yaş', 'yaş günü', 'kutlama', 'pasta', 'hediye'],
  };

  // Detect matching roles and themes from prompt
  const detectedRoles = Object.keys(roleKeywords).filter((role) =>
    roleKeywords[role].some((kw) => lowerPrompt.includes(kw))
  );

  const detectedThemes = Object.keys(themeKeywords).filter((theme) =>
    themeKeywords[theme].some((kw) => lowerPrompt.includes(kw))
  );

  // Score each product in catalog
  const scoredProducts = PRODUCTS.map((product) => {
    let score = 0;
    const nameLower = product.name.toLowerCase();
    const descLower = product.description.toLowerCase();
    const catLower = product.category.toLowerCase();

    // Direct token matching
    const promptWords = lowerPrompt.split(/\s+/).filter((w) => w.length > 2);
    promptWords.forEach((word) => {
      if (product.tags.some((t) => t.toLowerCase().includes(word))) score += 12;
      if (nameLower.includes(word)) score += 10;
      if (catLower.includes(word)) score += 8;
      if (descLower.includes(word)) score += 5;
    });

    // Theme scores
    detectedThemes.forEach((theme) => {
      if (theme === 'kahve' && (catLower.includes('kahve') || product.tags.includes('kahve') || product.tags.includes('kupa'))) score += 20;
      if (theme === 'kedi' && (product.tags.includes('kedi') || nameLower.includes('kedi'))) score += 25;
      if (theme === 'mizah' && (product.boxTypes.includes('truva') || product.boxTypes.includes('meme') || product.tags.includes('komik'))) score += 25;
      if (theme === 'eskişehir' && (product.originCity === 'Eskişehir' || product.tags.includes('eskişehir'))) score += 30;
      if (theme === 'kitap' && (catLower.includes('kitap') || product.tags.includes('defter') || product.tags.includes('planlayıcı'))) score += 20;
      if (theme === 'cikolata' && (product.tags.includes('çikolata') || product.tags.includes('tatlı') || product.tags.includes('lokum'))) score += 20;
      if (theme === 'dinlenme' && (product.tags.includes('mum') || product.tags.includes('çay') || product.tags.includes('lavanta'))) score += 20;
      if (theme === 'fantastik' && (product.boxTypes.includes('fantasy') || product.tags.includes('fantastik'))) score += 25;
      if (theme === 'kurumsal' && (product.boxTypes.includes('corporate') || product.tags.includes('kurumsal') || product.tags.includes('termos'))) score += 25;
      if (theme === 'dogum_gunu' && (product.tags.includes('doğum günü') || product.tags.includes('çikolata') || product.tags.includes('mum'))) score += 15;
    });

    // Role scores
    detectedRoles.forEach((role) => {
      if (role === 'yazılımcı' && (product.tags.includes('kahve') || product.tags.includes('komik') || product.tags.includes('motto') || product.tags.includes('defter') || product.tags.includes('sticker'))) score += 18;
      if (role === 'mimar' && (product.tags.includes('seramik') || product.tags.includes('defter') || product.tags.includes('mum') || product.tags.includes('eskişehir'))) score += 18;
      if (role === 'öğretmen' && (product.tags.includes('defter') || product.tags.includes('kalem') || product.tags.includes('kupa') || product.tags.includes('çay'))) score += 18;
      if (role === 'yeni_anne' && (product.boxTypes.includes('baby_mom') || product.tags.includes('bebek') || product.tags.includes('yeni anne'))) score += 30;
      if (role === 'sevgili' && (product.tags.includes('çikolata') || product.tags.includes('mum') || product.tags.includes('romantik') || product.tags.includes('kupa'))) score += 18;
    });

    return { product, score };
  });

  // Sort descending by relevance score
  scoredProducts.sort((a, b) => b.score - a.score);

  // Take top scored products
  let candidatePool = scoredProducts.filter((sp) => sp.score > 0).map((sp) => sp.product);
  if (candidatePool.length < 3) {
    candidatePool = PRODUCTS.slice(0, 8);
  }

  // Optimize subset of 3 or 4 products closest to budget
  let bestSubset: Product[] = candidatePool.slice(0, 4);
  let minDiff = Math.abs(bestSubset.reduce((sum, p) => sum + p.price, 0) - targetBudget);

  for (let i = 0; i < candidatePool.length; i++) {
    for (let j = i + 1; j < candidatePool.length; j++) {
      for (let k = j + 1; k < candidatePool.length; k++) {
        const combo3 = [candidatePool[i], candidatePool[j], candidatePool[k]];
        const diff3 = Math.abs(combo3.reduce((s, x) => s + x.price, 0) - targetBudget);
        if (diff3 < minDiff) {
          minDiff = diff3;
          bestSubset = combo3;
        }
        for (let l = k + 1; l < candidatePool.length; l++) {
          const combo4 = [candidatePool[i], candidatePool[j], candidatePool[k], candidatePool[l]];
          const diff4 = Math.abs(combo4.reduce((s, x) => s + x.price, 0) - targetBudget);
          if (diff4 < minDiff) {
            minDiff = diff4;
            bestSubset = combo4;
          }
        }
      }
    }
  }

  const finalProducts = bestSubset;
  const totalPrice = finalProducts.reduce((sum, p) => sum + p.price, 0);

  // HYPER-PERSONALIZED DYNAMIC BOX TITLE
  let boxTitle = '';
  if (detectedRoles.includes('yazılımcı')) {
    boxTitle = 'Kod & Kahve Tutkunu Yazılımcı Özel Kutusu 💻☕';
  } else if (detectedRoles.includes('mimar')) {
    boxTitle = 'Estetik & Çizim Aşığı Mimar Özel Sürpriz Kutusu 📐✨';
  } else if (detectedRoles.includes('öğretmen')) {
    boxTitle = 'İlham Veren Öğretmen Özel Teşekkür Kutusu 📚☕';
  } else if (detectedRoles.includes('yeni_anne')) {
    boxTitle = 'Yeni Anne & Minik Mucize Huzur Kutusu 👶🌸';
  } else if (detectedThemes.includes('kedi')) {
    boxTitle = 'Mırıldayan Patiler & Neşeli Kahve Kutusu 🐱☕';
  } else if (detectedThemes.includes('eskişehir')) {
    boxTitle = "Eskişehir'in Sanatçı Ruhu & El Emeği Zanaat Kutusu 🎨";
  } else if (detectedThemes.includes('mizah')) {
    boxTitle = 'Kahkaha Garantili Mizah & Truva Sürpriz Kutusu 🎭🎁';
  } else if (detectedRoles.includes('sevgili')) {
    boxTitle = 'Kalpten Gelen Sıcacık Aşk & Lezzet Kutusu 💖🍫';
  } else if (detectedThemes.includes('kurumsal')) {
    boxTitle = 'Kariyer Yolculuğu & Yeni İş Tebrik Kutusu 💼🚀';
  } else if (detectedThemes.includes('dogum_gunu')) {
    boxTitle = 'İyi Ki Doğdun! Renk Renk Doğum Günü Kutusu 🎂✨';
  } else if (detectedThemes.includes('fantastik')) {
    boxTitle = 'Büyülü Evrenler & Fantastik Sinema Kutusu 🪄🌌';
  } else {
    // Generate dynamically from extracted prompt keywords
    const stopWords = ['için', 'içinde', 'olan', 'gibi', 'veya', 'böyle', 'biri', 'hediye', 'kutusu', 'istiyorum', 'almak', 'yapmak', 'bir', 'çok', 'arkadaşıma', 'sevgilime'];
    const keyWords = prompt
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.includes(w.toLowerCase()));

    if (keyWords.length > 0) {
      const formattedKw = keyWords.slice(0, 2).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' & ');
      boxTitle = `${formattedKw} Konseptli Kişiye Özel Sürpriz Kutusu ✨`;
    } else {
      const pNameShort = finalProducts[0]?.name.split(' ')[0] || 'Özel';
      boxTitle = `${pNameShort} & Sevgi Dolu Sürpriz Kutusu ✨`;
    }
  }

  // HYPER-PERSONALIZED DYNAMIC GIFT NOTE
  let personalizedGiftNote = '';
  if (detectedRoles.includes('yazılımcı')) {
    personalizedGiftNote = 'Kodların hatasız derlensin, kahven hiç soğumasın! Yeni yaşında tüm projelerin ve hayallerin tıkır tıkır işlesin! 🚀☕';
  } else if (detectedRoles.includes('mimar')) {
    personalizedGiftNote = 'Hayatıma ve çevrene kattığın o muazzam estetik için sonsuz teşekkürler. Tasarladığın tüm güzel yarınlar seninle olsun! 📐✨';
  } else if (detectedRoles.includes('öğretmen')) {
    personalizedGiftNote = 'Geleceğe kattığınız ışık ve verdiğiniz emekler için sonsuz teşekkürler. Gününüz kutlu, kahveniz hep taze olsun! 📚✨';
  } else if (detectedRoles.includes('yeni_anne')) {
    personalizedGiftNote = 'Bebeğinle birlikte huzur, sağlık ve kahkahalarla dolu muazzam bir ömür dilerim. İyi ki varsın! 👶💖';
  } else if (detectedThemes.includes('kedi')) {
    personalizedGiftNote = 'En tatlı pati dostun ve sıcacık kahven eşliğinde huzur dolu anlar seninle olsun! Paticiklerle dolu harika bir gün dilerim. 🐾☕';
  } else if (detectedRoles.includes('sevgili')) {
    personalizedGiftNote = 'Gülüşünle dünyamı güzelleştiren insan... İyi ki varsın, seninle geçecek her an en büyük hediye. Seni çok seviyorum! 💖✨';
  } else if (detectedThemes.includes('dogum_gunu')) {
    personalizedGiftNote = 'Senin gibi harika bir insanın varlığı en büyük armağan! Yeni yaşın sağlık, neşe ve bu kutudaki gibi tatlı sürprizlerle dolsun. İyi ki doğdun! 🎉🎂';
  } else {
    personalizedGiftNote = 'Senin için özenle hazırlanan bu kutudaki her bir parçanın yüzünde kocaman bir tebessüm oluşturması dileğiyle! Birlikte biriktireceğimiz nice mutlu anlara. ✨';
  }

  // HYPER-PERSONALIZED DYNAMIC AI EXPLANATION
  const promptSnippet = prompt.length > 45 ? prompt.substring(0, 45) + '...' : prompt;
  const topItem1 = finalProducts[0]?.name || 'özel parçalar';
  const topItem2 = finalProducts[1]?.name || 'sürpriz hediyeler';

  const aiExplanation = `Yazdığın "${promptSnippet}" detaylarını Joy Genie olarak büyük bir heyecanla analiz ettik! Belirttiğin ilgi alanlarına tam uyan ${topItem1} ve ${topItem2} parçalarını ${totalPrice} TL bütçene mükemmel oturacak şekilde seçtik.`;

  return {
    boxTitle,
    tagline: 'Joy Genie Akıllı Hediye Eşleştirmesi',
    matchedItems: finalProducts,
    totalPrice,
    matchScore: 97,
    personalizedGiftNote,
    suggestedBoxCategory: 'custom',
    aiExplanation,
  };
}
