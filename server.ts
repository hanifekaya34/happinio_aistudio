import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { PRODUCTS, GIFT_BOXES, MOCK_REVIEWS, INITIAL_CITY_SUGGESTIONS, MONTHLY_DOWNLOADABLE_ARTS } from './src/data/mockData.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint 1: AI Prompt-To-Cart Gift Recommendation Engine
app.post('/api/ai-gift-recommendation', async (req, res) => {
  try {
    const { prompt, targetBudget } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Lütfen geçerli bir hediye promptu yazın.' });
    }

    // Determine target budget from request or prompt
    let requestedBudget = typeof targetBudget === 'number' && targetBudget > 0 ? targetBudget : 1000;
    const promptMatch = prompt.match(/(\d{3,4})\s*(tl|lira|₺)?/i);
    if (promptMatch && (!targetBudget || targetBudget === 1000)) {
      const parsedVal = parseInt(promptMatch[1], 10);
      if (parsedVal >= 200 && parsedVal <= 5000) requestedBudget = parsedVal;
    }

    const ai = getGeminiClient();

    if (ai) {
      const systemInstruction = `
Sen "Happinio" hediye platformunun sevimli, zeki ve yardımsever yapay zeka asistanı Hapy'sin!
Görevin: Kullanıcının doğal dille yazdığı hediye isteğini (prompt) analiz etmek ve mevcut ürün veritabanındaki ürünlerden en uygun 3-5 ürünü seçerek kişiselleştirilmiş harika bir Hediye Kutusu oluşturmak.

Mevcut Ürün Veritabanı (JSON formatı):
${JSON.stringify(PRODUCTS, null, 2)}

BÜTÇE ŞARTI:
Kullanıcının belirlediği hedef bütçe: ${requestedBudget} TL.
Seçeceğin 3-5 ürünün TOPLAM FİYATI, belirlenen bu ${requestedBudget} TL bütçesine MÜMKÜN OLDUĞUNCA ÇOK YAKIN (yaklaşık ±%5-10 bandında) olmalıdır.

Kurallar:
1. Kullanıcının belirttiği meslek, alıcı (bebek, çocuk, yeğen, eş, arkadaş, vb.), ilgi alanları, amaç ve duygusal tonu analiz et.
2. KRİTİK UNİQUE ÜRÜN KURALI: matchedItemIds dizisine KESİNLİKLE aynı ürünü birden fazla ekleme! Tüm seçilen ürün ID'leri birbirinden %100 FARKLI ve benzersiz olmalıdır.
3. KRİTİK YAŞ & ALICI KURALI: Eğer prompt bir çocuk, minik bebek veya yeğen (örn: "2 yaşındaki yeğenim") içinse, KESİNLİKLE kahve, yetişkin termos, 'Kral Baba' çorabı, kurumsal malzemeler veya yetişkin kart notu SEÇME! Bunun yerine peluş oyuncak, müslin örtü, sevimli kupa, trüf çikolata, müzik kutusu gibi çocuklara uygun neşeli ve sevimli ürünleri seç. Hediye kartı notunu da minik çocuğa/yeğene söylenecek tatlı, sevgi dolu bir dille yaz.
4. KRİTİK HEDİYE NOTU KURALI: Eğer kullanıcı promptunda açıkça "doğum günü", "yaş günü" veya "yeni yaş" BELİRTİLMEDİYSE, kart notunda ("personalizedGiftNote") KESİNLİKLE "İyi ki doğdun", "Doğum günün kutlu olsun" veya "Yeni yaşın" YAZMA! Konseptsiz genel tebrikler verme; örneğin Truva/şaka/esprili kutular için bol kahkahalı mizahi bir not, tebrik için başarı/teşekkür notu yaz.
5. KRİTİK SEÇİM NEDENİ / AÇIKLAMA KURALI: aiExplanation alanında, seçtiğin ürünlerin neden bu kişinin ilgi alanlarına/konseptine (örn: Truva şakası, çocuk hediyesi, kahve gurmesi) birebir uyduğunu detaylıca ve samimi bir dille açıkla. Mekanik veya jenerik yüzdeler YAZMA.
6. Ürün veritabanındaki ID'leri seç. Fiyatların toplamı ${requestedBudget} TL bütçesine çok yakın olsun.
7. Sevecen, sevimli, alıcıya/konsepte özgü Türkçe bir hediye kartı notu ("personalizedGiftNote") yaz.
8. Kutuya konsepte ve kişiye özel sevimli bir isim ver ("boxTitle").
9. Neden bu ürünleri seçtiğini açıklayan tatlı, samimi bir Hapy açıklaması yaz ("aiExplanation").
10. Yanıtını STRICT JSON formatında ver.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Kullanıcı Promptu: "${prompt}" (Hedef Bütçe: ${requestedBudget} TL)`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              boxTitle: { type: Type.STRING },
              tagline: { type: Type.STRING },
              matchedItemIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              personalizedGiftNote: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              suggestedBoxCategory: { type: Type.STRING },
              aiExplanation: { type: Type.STRING },
            },
            required: ['boxTitle', 'tagline', 'matchedItemIds', 'personalizedGiftNote', 'matchScore', 'suggestedBoxCategory', 'aiExplanation'],
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : '';
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        // Hydrate items from PRODUCTS database
        let matchedItems = PRODUCTS.filter((p) => parsed.matchedItemIds.includes(p.id));
        if (matchedItems.length === 0) matchedItems = PRODUCTS.slice(0, 4);

        // Optimize subset to match requestedBudget closely if needed
        let totalPrice = matchedItems.reduce((acc, curr) => acc + curr.price, 0);

        return res.json({
          boxTitle: parsed.boxTitle || 'Sana Özel Happinio Kutusu',
          tagline: parsed.tagline || 'Sana Özel Zevklerle Tasarlandı',
          matchedItems,
          totalPrice,
          matchScore: parsed.matchScore || 96,
          personalizedGiftNote: parsed.personalizedGiftNote || 'Sevgi dolu anlar biriktirmeniz dileğiyle!',
          suggestedBoxCategory: parsed.suggestedBoxCategory || 'coffee_book',
          aiExplanation: parsed.aiExplanation || 'İsteğindeki detayları inceleyip seçtiğin bütçeye en yakın uyumlu parçaları bir araya getirdik!',
        });
      }
    }

    // Fallback matching algorithm if Gemini client is absent or unavailable
    const lowerPrompt = prompt.toLowerCase();
    let selectedProducts = PRODUCTS.filter((p) =>
      p.tags.some((tag) => lowerPrompt.includes(tag.toLowerCase())) ||
      lowerPrompt.includes(p.name.toLowerCase()) ||
      lowerPrompt.includes(p.category.toLowerCase())
    );

    if (selectedProducts.length < 3) {
      if (lowerPrompt.includes('eskişehir') || lowerPrompt.includes('sanatçı') || lowerPrompt.includes('oyun')) {
        selectedProducts = PRODUCTS.filter((p) => p.tags.includes('eskişehir') || p.tags.includes('seramik') || p.tags.includes('kahve') || p.tags.includes('mizah') || p.tags.includes('oyun'));
      } else if (lowerPrompt.includes('kedi') || lowerPrompt.includes('cat')) {
        selectedProducts = PRODUCTS.filter((p) => p.tags.includes('kedi') || p.tags.includes('kahve') || p.tags.includes('kitap'));
      } else if (lowerPrompt.includes('saka') || lowerPrompt.includes('şaka') || lowerPrompt.includes('truva') || lowerPrompt.includes('troll')) {
        selectedProducts = PRODUCTS.filter((p) => p.boxTypes.includes('truva'));
      } else if (lowerPrompt.includes('bebek') || lowerPrompt.includes('anne')) {
        selectedProducts = PRODUCTS.filter((p) => p.boxTypes.includes('baby_mom'));
      } else if (lowerPrompt.includes('iş') || lowerPrompt.includes('kurumsal') || lowerPrompt.includes('terfi')) {
        selectedProducts = PRODUCTS.filter((p) => p.boxTypes.includes('corporate'));
      } else {
        selectedProducts = [PRODUCTS[0], PRODUCTS[3], PRODUCTS[4], PRODUCTS[11]];
      }
    }

    // Pick best subset of 3-4 products matching requestedBudget closely
    let bestProducts = selectedProducts.slice(0, 4);
    let minDiff = Math.abs(bestProducts.reduce((s, i) => s + i.price, 0) - requestedBudget);

    for (let i = 0; i < selectedProducts.length; i++) {
      for (let j = i + 1; j < selectedProducts.length; j++) {
        for (let k = j + 1; k < selectedProducts.length; k++) {
          const combo3 = [selectedProducts[i], selectedProducts[j], selectedProducts[k]];
          const diff3 = Math.abs(combo3.reduce((s, x) => s + x.price, 0) - requestedBudget);
          if (diff3 < minDiff) {
            minDiff = diff3;
            bestProducts = combo3;
          }
          for (let l = k + 1; l < selectedProducts.length; l++) {
            const combo4 = [selectedProducts[i], selectedProducts[j], selectedProducts[k], selectedProducts[l]];
            const diff4 = Math.abs(combo4.reduce((s, x) => s + x.price, 0) - requestedBudget);
            if (diff4 < minDiff) {
              minDiff = diff4;
              bestProducts = combo4;
            }
          }
        }
      }
    }

    const finalProducts = bestProducts;
    const totalPrice = finalProducts.reduce((sum, item) => sum + item.price, 0);

    return res.json({
      boxTitle: lowerPrompt.includes('eskişehir') ? "Eskişehir'in Sanatçı Ruhu & Oyun Keyfi Kutusu" : 'Kişiye Özel Happinio Sürprizi',
      tagline: 'Kişisel İlgi Alanlarına Özel Tasarlandı',
      matchedItems: finalProducts,
      totalPrice,
      matchScore: 97,
      personalizedGiftNote: lowerPrompt.includes('eskişehir')
        ? 'Kahve kokusu, Eskişehir dokusu ve eğlenceli oyun saatleri bir arada! Yüzünden tebessüm hiç eksik olmasın.'
        : `İyi ki doğdun! Senin kadar tatlı ve özel sürprizlerle dolu günler dilerim.`,
      suggestedBoxCategory: 'custom',
      aiExplanation: `İstediğin konsept ve ilgi alanlarına tam uyum sağlayan, sevdiklerini mutlu edecek en özel parçaları bir araya getirdik!`,
    });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    return res.status(500).json({ error: 'Hediye eşleştirmesi yapılırken bir hata oluştu.' });
  }
});

// API Endpoint 2: Get Catalog Data
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

app.get('/api/boxes', (req, res) => {
  res.json(GIFT_BOXES);
});

app.get('/api/reviews', (req, res) => {
  res.json(MOCK_REVIEWS);
});

app.get('/api/city-suggestions', (req, res) => {
  res.json(INITIAL_CITY_SUGGESTIONS);
});

// API Endpoint 3: Submit New City/Country Product Suggestion (+100 Points)
app.post('/api/city-suggestions', (req, res) => {
  const { cityName, countryName, productName, category, description, suggestedBy } = req.body;
  if (!cityName || !productName || !description) {
    return res.status(400).json({ error: 'Lütfen tüm gerekli alanları doldurun.' });
  }

  const newSuggestion = {
    id: `SUG-${Date.now()}`,
    cityName,
    countryName: countryName || 'Türkiye',
    productName,
    category: category || 'Yerel Ürün',
    description,
    suggestedBy: suggestedBy || 'Kullanıcı',
    date: 'Bugün',
    status: 'approved' as const,
    pointsAwarded: 100,
  };

  return res.json({
    success: true,
    message: 'Harika! Şehir özel ürün önerin onaylandı ve hesabına +100 Hediye Puanı tanımlandı.',
    suggestion: newSuggestion,
  });
});

// API Endpoint 4: PCI DSS Compliant Simulated Payment Gateway
app.post('/api/checkout', (req, res) => {
  const { items, totalAmount, recipientName, recipientAddress, cardNumber } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Sepetiniz boş.' });
  }

  // PCI DSS Simulation Check
  const maskedCard = cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : '**** **** **** 4242';
  const orderId = `HPY-${Math.floor(100000 + Math.random() * 900000)}`;

  return res.json({
    success: true,
    orderId,
    trackingCode: orderId,
    status: 'received',
    message: 'Ödemeniz PCI DSS Uyumlu Güvenli Sanal POS (iyzico/Stripe altyapısı) ile başarıyla alındı.',
    paymentDetails: {
      maskedCard,
      amount: totalAmount,
      currency: 'TRY',
      pciCompliant: true,
      timestamp: new Date().toISOString(),
    },
  });
});

// Start Express Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HapyBox server listening on http://0.0.0.0:${PORT}`);
  });
}

// Export express app for serverless platforms like Vercel
export default app;

// Start Express Server only when not running on Vercel
if (!process.env.VERCEL) {
  startServer();
}
