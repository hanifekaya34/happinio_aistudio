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

  // 1. Try server API first with a strict 4-second network timeout
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;

    const response = await fetch('/api/ai-gift-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText, targetBudget }),
      signal: controller ? controller.signal : undefined,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.boxTitle && Array.isArray(data.matchedItems) && data.matchedItems.length > 0) {
        return data as AIRecommendationResult;
      }
    }
  } catch (err) {
    console.warn('Server API call failed or timed out, using instant client-side AI matching algorithm:', err);
  }

  // 2. Client-side Smart AI Matching Algorithm (Instant Fallback for Vercel / Mobile / Offline)
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

  // Child / Nephew / Toddler / Age detection
  const isChildOrNephew =
    lowerPrompt.includes('yeğen') ||
    lowerPrompt.includes('yegen') ||
    lowerPrompt.includes('çocuk') ||
    lowerPrompt.includes('cocuk') ||
    lowerPrompt.includes('ufaklık') ||
    lowerPrompt.includes('torun') ||
    /\b([1-9]|1[0-2])\s*yaş/.test(lowerPrompt);

  const ageMatch = lowerPrompt.match(/\b([1-9]|1[0-2])\s*yaş/);
  const ageStr = ageMatch ? ageMatch[1] + ' Yaşındaki' : '';

  // Roles & Professions dictionary
  const roleKeywords: Record<string, string[]> = {
    oyuncu: ['oyuncu', 'gamer', 'gaming', 'oyun', 'playstation', 'xbox', 'steam', 'twitch', 'oyun oynamayı', 'oyunculara', 'oyuncu eşime', 'oyuncu arkadaşıma'],
    yazılımcı: ['yazılımcı', 'kod', 'yazılım', 'mühendis', 'developer', 'coder', 'bilgisayar', 'programcı'],
    mimar: ['mimar', 'iç mimar', 'çizim', 'tasarım', 'sanatçı', 'ressam', 'estetik', 'eskiz', 'dizayn'],
    öğretmen: ['öğretmen', 'hocam', 'eğitmen', 'akademisyen', 'okul', 'ders'],
    doktor: ['doktor', 'hemşire', 'sağlık', 'tıp', 'hastane'],
    avukat: ['avukat', 'hukuk', 'savcı', 'hakim'],
    yeni_anne: ['yeni anne', 'lohusa', 'gebe', 'hamile', 'bebek', 'bebeği', 'yeni bebek', 'doğum yapan', 'anneye bebek', 'bebek hediyesi'],
    kız_kardeş: ['kız kardeş', 'kızkardeş', 'kardeş', 'kardeşime', 'kardeşim', 'abla', 'ablam', 'ablama', 'bacım', 'kardeşcan', 'kardeş için'],
    erkek_kardeş: ['erkek kardeş', 'abi', 'abim', 'abime', 'birader', 'erkek kardeşime'],
    anne: ['anne', 'annem', 'anneme', 'valide'],
    baba: ['baba', 'babam', 'babama', 'peder'],
    sevgili: ['sevgili', 'sevgilim', 'aşk', 'romantik', 'eşim', 'eşime', 'kocam', 'karım', 'yarim', 'sevgililer', 'hayat arkadaşım', 'partner'],
    arkadaş: ['arkadaş', 'dost', 'kanka', 'kuzen', 'ortak', 'kankama', 'arkadaşıma'],
  };

  // Interests & Themes dictionary
  const themeKeywords: Record<string, string[]> = {
    kahve: ['kahve', 'espresso', 'filtre', 'arabica', 'latte', 'kupa', 'mug', 'bardak'],
    kedi: ['kedi', 'kedicik', 'pati', 'mırıl', 'cat'],
    mizah: ['şaka', 'saka', 'troll', 'truva', 'komik', 'esprili', 'motto', 'replik', 'meme', 'mizah'],
    eskişehir: ['eskişehir', 'odunpazarı', 'sanat', 'yerel'],
    kitap: ['kitap', 'okuma', 'klasik', 'defter', 'ajanda', 'planlayıcı', 'yazı'],
    cikolata: ['çikolata', 'tatlı', 'trüf', 'lokum', 'fındık', 'atıştırmalık', 'gurme', 'lezzet'],
    dinlenme: ['mum', 'soya', 'lavanta', 'spa', 'sakin', 'huzur', 'relax', 'bitki çayı', 'dinlenme'],
    fantastik: ['fantastik', 'harry potter', 'sinema', 'dizi', 'film', 'star wars'],
    kurumsal: ['terfi', 'ofis', 'kariyer', 'onboarding', 'yeni iş', 'termos', 'kalem'],
    dogum_gunu: ['doğum günü', 'dogum gunu', 'doğumgünü', 'yaş günü', 'yeni yaş', 'doğum gününü', 'doğum günü hediyesi'],
  };

  // Detect matching roles and themes from prompt
  const detectedRoles = Object.keys(roleKeywords).filter((role) =>
    roleKeywords[role].some((kw) => lowerPrompt.includes(kw))
  );

  const detectedThemes = Object.keys(themeKeywords).filter((theme) =>
    themeKeywords[theme].some((kw) => lowerPrompt.includes(kw))
  );

  // Generic words to ignore in token boost
  const genericTokens = ['hediye', 'hediyesi', 'doğum', 'günü', 'dogum', 'gunu', 'için', 'icinc', 'almak', 'istiyorum', 'tane', 'kutu', 'kutusu', 'özel', 'ozel', 'biri'];

  // Score each product in catalog
  const scoredProducts = PRODUCTS.map((product) => {
    let score = 0;
    const nameLower = product.name.toLowerCase();
    const descLower = product.description.toLowerCase();
    const catLower = product.category.toLowerCase();

    // Direct token matching (ignoring generic tokens)
    const promptWords = lowerPrompt
      .split(/\s+/)
      .map((w) => w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''))
      .filter((w) => w.length > 2 && !genericTokens.includes(w));

    promptWords.forEach((word) => {
      if (product.tags.some((t) => t.toLowerCase().includes(word))) score += 15;
      if (nameLower.includes(word)) score += 12;
      if (catLower.includes(word)) score += 10;
      if (descLower.includes(word)) score += 6;
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
      if (role === 'oyuncu' && (product.boxTypes.includes('fantasy') || product.boxTypes.includes('meme') || product.boxTypes.includes('truva') || product.tags.includes('fantastik') || product.tags.includes('kupa') || product.tags.includes('kahve') || product.tags.includes('komik') || product.tags.includes('çikolata'))) score += 35;
      if (role === 'yazılımcı' && (product.tags.includes('kahve') || product.tags.includes('komik') || product.tags.includes('motto') || product.tags.includes('defter') || product.tags.includes('sticker'))) score += 25;
      if (role === 'mimar' && (product.tags.includes('seramik') || product.tags.includes('defter') || product.tags.includes('mum') || product.tags.includes('eskişehir'))) score += 25;
      if (role === 'öğretmen' && (product.tags.includes('defter') || product.tags.includes('kalem') || product.tags.includes('kupa') || product.tags.includes('çay'))) score += 25;
      if (role === 'yeni_anne' && (product.boxTypes.includes('baby_mom') || product.tags.includes('bebek') || product.tags.includes('yeni anne'))) score += 50;
      if (role === 'sevgili' && (product.tags.includes('çikolata') || product.tags.includes('mum') || product.tags.includes('romantik') || product.tags.includes('kupa'))) score += 25;
    });

    // CHILD / NEPHEW RECIPIENT SPECIAL RULES
    if (isChildOrNephew) {
      // Heavily boost kid-friendly & cute items
      const isKidFriendly =
        product.tags.includes('pelus') ||
        product.tags.includes('bebek') ||
        product.tags.includes('çikolata') ||
        product.tags.includes('tatlı') ||
        product.tags.includes('lokum') ||
        product.tags.includes('müzik kutusu') ||
        product.tags.includes('sticker') ||
        nameLower.includes('tavşan') ||
        nameLower.includes('kedicik') ||
        nameLower.includes('trüf');

      if (isKidFriendly) {
        score += 150;
      }

      // Heavily penalize adult-only items (coffee, thermos, adult socks, roll-on, corporate, leather planners)
      const isAdultOnly =
        product.tags.includes('kahve') ||
        product.tags.includes('termos') ||
        product.tags.includes('baba') ||
        product.tags.includes('roll-on') ||
        product.tags.includes('kurumsal') ||
        product.tags.includes('onboarding') ||
        nameLower.includes('kral baba') ||
        nameLower.includes('filtre kahve') ||
        nameLower.includes('yarın erken') ||
        nameLower.includes('motivasyon defteri');

      if (isAdultOnly) {
        score -= 500;
      }
    } else {
      // Penalize baby/mom products if NOT requested in prompt
      const isBabyProduct = product.boxTypes.includes('baby_mom') || product.tags.includes('bebek') || product.tags.includes('yeni anne') || nameLower.includes('bebek');
      const userRequestedBaby = detectedRoles.includes('yeni_anne') || lowerPrompt.includes('bebek') || lowerPrompt.includes('anne');
      if (isBabyProduct && !userRequestedBaby) {
        score -= 300; // Heavily penalize baby items if user didn't ask for baby
      }
    }

    return { product, score };
  });

  // Sort descending by relevance score
  scoredProducts.sort((a, b) => b.score - a.score);

  // Take top scored products (excluding heavily penalized items)
  let candidatePool = scoredProducts.filter((sp) => sp.score > -100).map((sp) => sp.product);
  if (candidatePool.length < 3) {
    candidatePool = PRODUCTS.filter((p) => !p.boxTypes.includes('baby_mom') && !p.tags.includes('bebek'));
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

  const uniqueProductsMap = new Map<string, Product>();
  bestSubset.forEach((p) => uniqueProductsMap.set(p.id, p));
  const finalProducts = Array.from(uniqueProductsMap.values());
  const totalPrice = finalProducts.reduce((sum, p) => sum + p.price, 0);

  // HYPER-PERSONALIZED DYNAMIC BOX TITLE
  const hasGamer = detectedRoles.includes('oyuncu');
  const hasDev = detectedRoles.includes('yazılımcı');
  const hasArchitect = detectedRoles.includes('mimar');
  const hasTeacher = detectedRoles.includes('öğretmen');
  const hasBabyMom = detectedRoles.includes('yeni_anne');
  const hasSister = detectedRoles.includes('kız_kardeş');
  const hasBrother = detectedRoles.includes('erkek_kardeş');
  const hasMom = detectedRoles.includes('anne');
  const hasDad = detectedRoles.includes('baba');
  const hasSpouse = detectedRoles.includes('sevgili');
  const hasFriend = detectedRoles.includes('arkadaş');
  const hasCat = detectedThemes.includes('kedi');
  const hasBirthday = detectedThemes.includes('dogum_gunu');
  const hasEskisehir = detectedThemes.includes('eskişehir');
  const hasHumor = detectedThemes.includes('mizah');

  let boxTitle = '';
  if (isChildOrNephew) {
    if (ageStr) {
      boxTitle = `${ageStr} Minik Yeğenime Özel Sevimli Doğum Günü Kutusu 🧸🎈🎂`;
    } else {
      boxTitle = 'Minik Yeğenime Özel Sevimli Doğum Günü Kutusu 🧸🎈✨';
    }
  } else if (hasSister) {
    if (hasBirthday) {
      boxTitle = 'Canım Kız Kardeşime Özel Doğum Günü Kutusu 🌸🎂✨';
    } else {
      boxTitle = 'Canım Kız Kardeşime Özel Sürpriz Kutusu 🌸💖✨';
    }
  } else if (hasBrother) {
    if (hasBirthday) {
      boxTitle = 'Canım Kardeşime Özel Doğum Günü Kutusu 🚀🎂✨';
    } else {
      boxTitle = 'Canım Kardeşime Özel Sürpriz Kutusu 🚀✨';
    }
  } else if (hasMom) {
    if (hasBirthday) {
      boxTitle = 'Canım Anneme Özel Doğum Günü Kutusu 🌺🎂✨';
    } else {
      boxTitle = 'Canım Anneme Özel Sürpriz Kutusu 🌺✨';
    }
  } else if (hasDad) {
    if (hasBirthday) {
      boxTitle = 'Canım Babama Özel Doğum Günü Kutusu 👔🎂✨';
    } else {
      boxTitle = 'Canım Babama Özel Sürpriz Kutusu 👔✨';
    }
  } else if (hasGamer && hasSpouse && hasBirthday) {
    boxTitle = 'Oyuncu Eşime Özel Doğum Günü Kutusu 🎮💖🎂';
  } else if (hasGamer && hasSpouse) {
    boxTitle = 'Oyuncu Eşime Özel Aşk & Oyun Keyfi Kutusu 🎮💖';
  } else if (hasGamer && hasBirthday) {
    boxTitle = 'Oyuncu Dostuma Özel Doğum Günü Kutusu 🎮🎂';
  } else if (hasGamer) {
    boxTitle = 'Oyuncu & Gaming Tutkunu Özel Sürpriz Kutusu 🎮☕';
  } else if (hasDev && hasSpouse && hasBirthday) {
    boxTitle = 'Yazılımcı Eşime Özel Doğum Günü & Kahve Kutusu 💻💖🎂';
  } else if (hasDev && hasSpouse) {
    boxTitle = 'Yazılımcı Eşime Özel Kod & Kahve Kutusu 💻💖';
  } else if (hasDev && hasBirthday) {
    boxTitle = 'Yazılımcıya Özel Doğum Günü & Kahve Kutusu 💻🎂';
  } else if (hasDev) {
    boxTitle = 'Kod & Kahve Tutkunu Yazılımcı Özel Kutusu 💻☕';
  } else if (hasArchitect && hasSpouse) {
    boxTitle = 'Mimar Eşime Özel Estetik Sürpriz Kutusu 📐💖';
  } else if (hasArchitect) {
    boxTitle = 'Estetik & Çizim Aşığı Mimar Özel Sürpriz Kutusu 📐✨';
  } else if (hasTeacher) {
    boxTitle = 'İlham Veren Öğretmen Özel Teşekkür Kutusu 📚☕';
  } else if (hasBabyMom) {
    boxTitle = 'Yeni Anne & Minik Mucize Huzur Kutusu 👶🌸';
  } else if (hasCat && hasSpouse) {
    boxTitle = 'Kedisever Eşime Özel Sıcacık Sürpriz Kutusu 🐱💖';
  } else if (hasCat) {
    boxTitle = 'Mırıldayan Patiler & Neşeli Kahve Kutusu 🐱☕';
  } else if (hasEskisehir) {
    boxTitle = "Eskişehir'in Sanatçı Ruhu & El Emeği Zanaat Kutusu 🎨";
  } else if (hasHumor) {
    boxTitle = 'Kahkaha Garantili Mizah & Truva Sürpriz Kutusu 🎭🎁';
  } else if (hasSpouse && hasBirthday) {
    boxTitle = 'Biricik Eşime Özel Doğum Günü & Aşk Kutusu 🎂💖';
  } else if (hasSpouse) {
    boxTitle = 'Kalpten Gelen Sıcacık Aşk & Lezzet Kutusu 💖🍫';
  } else if (hasBirthday) {
    boxTitle = 'İyi Ki Doğdun! Renk Renk Doğum Günü Kutusu 🎂✨';
  } else {
    // Generate dynamically from extracted prompt keywords
    const stopWords = ['için', 'içinde', 'olan', 'gibi', 'veya', 'böyle', 'biri', 'hediye', 'kutusu', 'istiyorum', 'almak', 'yapmak', 'bir', 'çok', 'arkadaşıma', 'sevgilime', 'eşime'];
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
  if (hasSister) {
    if (hasBirthday) {
      personalizedGiftNote = 'Canım kız kardeşim! Yeni yaşın sana sağlık, mutluluk, neşe ve tüm güzellikleri getirsin. Yüzündeki gülücük hiç eksik olmasın. İyi ki doğdun, iyi ki benim kardeşimsin! 🌸🎂💖';
    } else {
      personalizedGiftNote = 'Canım kız kardeşim! Hayatımda olduğun için çok şanslıyım. Yüzündeki gülücükler ve neşe hiç eksik olmasın. Seni çok seviyorum! 🌸💖✨';
    }
  } else if (hasBrother) {
    if (hasBirthday) {
      personalizedGiftNote = 'Canım kardeşim! Yeni yaşın sana sağlık, mutluluk ve sonsuz başarılar getirsin. İyi ki doğdun, iyi ki varsın! 🚀🎂✨';
    } else {
      personalizedGiftNote = 'Canım kardeşim! Her zaman yanında ve destekçinim. Yüzündeki neşe ve keyif hiç eksik olmasın! 🚀✨';
    }
  } else if (hasMom) {
    if (hasBirthday) {
      personalizedGiftNote = 'Canım annem! Varlığın hayatımın en büyük şansı. Yeni yaşın sağlık, huzur ve gülücüklerle dolsun. İyi ki doğdun, seni çok seviyorum! 🌺🎂💖';
    } else {
      personalizedGiftNote = 'Canım annem! Karşılıksız sevgin ve emeğin için çok teşekkür ederim. Hayatımın en değerli hazinesi sensin. Seni çok seviyorum! 🌺💖';
    }
  } else if (hasDad) {
    if (hasBirthday) {
      personalizedGiftNote = 'Canım babam! Her zaman arkamdaki en güçlü dağ olduğun için teşekkür ederim. Yeni yaşın sağlık ve huzurla geçsin. Doğum günün kutlu olsun! 👔🎂✨';
    } else {
      personalizedGiftNote = 'Canım babam! Varlığın bana her zaman güven ve güç veriyor. İyi ki varsın, seni çok seviyorum! 👔✨';
    }
  } else if (hasHumor) {
    if (hasBirthday) {
      personalizedGiftNote = '⚠️ DİKKAT: Bu kutu yüksek dozda kahkaha ve sürpriz içerir! 🎭 Yeni yaşın en az bu şaka kutusu kadar neşeli, sürprizlerle dolu ve bol kahkahalı geçsin. İyi ki doğdun! 🎉🎂';
    } else {
      personalizedGiftNote = '⚠️ DİKKAT: Bu kutu yüksek dozda kahkaha, tatlı bir şaşkınlık ve eğlence içerir! 🎭 Kutuyu açarken yüzündeki o şaşkın tebessümü görmek için sabırsızlanıyorum. Hayat senin esprilerinle çok daha güzel! 🎉';
    }
  } else if (isChildOrNephew) {
    if (hasBirthday) {
      personalizedGiftNote = `Canım minik yeğenim! Yeni yaşın sağlık, neşe, oyunlar ve rengarenk kahkahalarla dolsun! Seni çooook seven ailen... İyi ki doğdun minik mucize! 🎈🧸✨`;
    } else {
      personalizedGiftNote = `Canım minik yeğenim! Yüzündeki o sevimli gülücükler ve neşe hiç eksik olmasın. Seni çooook seven ailen... Sevgi ve kucak dolusu sarılmalarla! 🎈🧸✨`;
    }
  } else if (hasGamer && hasSpouse) {
    if (hasBirthday) {
      personalizedGiftNote = 'Hayatıma renk katan en tatlı oyun arkadaşım, biricik eşim... Doğum günün kutlu olsun! Yeni yaşında ve tüm oyun bölümlerinde el ele en yüksek skorları yapacağımız harika bir yıl dilerim! 🎮💖🎂';
    } else {
      personalizedGiftNote = 'Hayatıma neşe katan en tatlı oyun arkadaşım... İyi ki varsın! Birlikte en keyifli skorları imzalayacağımız harika günlerimiz olsun. 🎮💖';
    }
  } else if (hasGamer) {
    if (hasBirthday) {
      personalizedGiftNote = 'Yeni yaşın kutlu olsun! Tüm oyunlarda en yüksek skorlar, kesintisiz ping ve bol galibiyetler seninle olsun! 🎮🎂';
    } else {
      personalizedGiftNote = 'Oyun keyfin hiç bitmesin, kahven hep sıcak kalsın! Keyifli ve neşeli oyun saatleri dilerim. 🎮☕';
    }
  } else if (hasDev) {
    if (hasBirthday) {
      personalizedGiftNote = 'Kodların hatasız derlensin, kahven hiç soğumasın! Yeni yaşında tüm projelerin ve hayallerin tıkır tıkır işlesin! İyi ki doğdun! 🚀☕🎂';
    } else {
      personalizedGiftNote = 'Kodların hatasız derlensin, kahven hiç soğumasın! Tüm projelerinde sonsuz başarılar dilerim! 🚀☕';
    }
  } else if (hasArchitect) {
    personalizedGiftNote = 'Hayatıma ve çevrene kattığın o muazzam estetik için sonsuz teşekkürler. Tasarladığın tüm güzel yarınlar seninle olsun! 📐✨';
  } else if (hasTeacher) {
    personalizedGiftNote = 'Geleceğe kattığınız ışık ve verdiğiniz emekler için sonsuz teşekkürler. Gününüz kutlu, kahveniz hep taze olsun! 📚✨';
  } else if (hasBabyMom) {
    personalizedGiftNote = 'Bebeğinle birlikte huzur, sağlık ve kahkahalarla dolu muazzam bir ömür dilerim. İyi ki varsın! 👶💖';
  } else if (hasCat) {
    personalizedGiftNote = 'En tatlı pati dostun ve sıcacık kahven eşliğinde huzur dolu anlar seninle olsun! Paticiklerle dolu harika bir gün dilerim. 🐾☕';
  } else if (hasSpouse) {
    if (hasBirthday) {
      personalizedGiftNote = 'Gülüşüyle dünyamı aydınlatan biricik eşim... Doğum günün kutlu olsun! Seninle geçen her an benim için en büyük hediye. Seni çok seviyorum! 💖🎂';
    } else {
      personalizedGiftNote = 'Gülüşünle dünyamı güzelleştiren insan... İyi ki varsın, seninle geçecek her an en büyük hediye. Seni çok seviyorum! 💖✨';
    }
  } else if (hasBirthday) {
    personalizedGiftNote = 'Senin gibi harika bir insanın varlığı en büyük armağan! Yeni yaşın sağlık, neşe ve bu kutudaki gibi tatlı sürprizlerle dolsun. İyi ki doğdun! 🎉🎂';
  } else {
    personalizedGiftNote = 'Senin için özenle hazırlanan bu kutudaki her bir parçanın yüzünde kocaman bir tebessüm oluşturması dileğiyle! Birlikte biriktireceğimiz nice mutlu anlara. ✨';
  }

  // HYPER-PERSONALIZED DYNAMIC AI EXPLANATION
  const promptSnippet = prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt;
  const topItem1 = finalProducts[0]?.name || 'özel parçalar';
  const topItem2 = finalProducts[1]?.name || 'sürpriz hediyeler';

  let aiExplanation = '';
  if (hasSister) {
    aiExplanation = `Kız kardeşinin şıklığına, tarzına ve ona verdiğin değere özel olarak seçtiğimiz zarif ve lezzetli sürpriz parçaları ${totalPrice} TL bütçene tam oturacak şekilde hazırladık! 🌸💖`;
  } else if (hasBrother) {
    aiExplanation = `Kardeşinin ilgi alanlarına ve zevkine özel olarak seçtiğimiz kullanışlı ve neşeli parçaları ${totalPrice} TL bütçene tam oturacak şekilde seçtik! 🚀✨`;
  } else if (hasMom) {
    aiExplanation = `Canım annenin huzuruna, zevkine ve şıklığına yakışır en özel ve zarif hediyeleri ${totalPrice} TL bütçene mükemmel uyum sağlayacak şekilde bir araya getirdik! 🌺💖`;
  } else if (hasDad) {
    aiExplanation = `Babanın gününe keyif katacak kaliteli ve özenli parçaları ${totalPrice} TL bütçene tam oturacak şekilde seçtik! 👔✨`;
  } else if (hasHumor) {
    aiExplanation = `Truva / şaka konseptinin neşeli ruhuna tam uyan esprili sürpriz parçaları ve lezzetli ikramları ${totalPrice} TL bütçene mükemmel oturacak şekilde kahkaha garantili olarak seçtik! 🎭🎁`;
  } else if (isChildOrNephew) {
    aiExplanation = `Minik yeğeninin neşeli dünyası için ona mutluluk katacak sevimli ve lezzetli sürpriz parçaları ${totalPrice} TL bütçene tam oturacak şekilde seçtik! 🧸🎈`;
  } else if (hasGamer && hasSpouse) {
    aiExplanation = `Eşinin oyun tutkusunu ve verdiğin değeri göz önüne alarak; oyun saatlerinde keyifle eşlik edecek ${topItem1} ve ${topItem2} gibi neşeli parçaları ${totalPrice} TL bütçene mükemmel oturacak şekilde seçtik!`;
  } else {
    aiExplanation = `Yazdığın "${promptSnippet}" detaylarını Joy Genie olarak büyük bir heyecanla analiz ettik! Belirttiğin ilgi alanlarına tam uyan ${topItem1} ve ${topItem2} parçalarını ${totalPrice} TL bütçene mükemmel oturacak şekilde seçtik.`;
  }

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
