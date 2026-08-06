import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';
import { PRODUCTS } from '../src/data/mockData';
import { generateClientFallbackRecommendation } from '../src/utils/aiGenerator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let bodyData = req.body;
  if (typeof bodyData === 'string') {
    try {
      bodyData = JSON.parse(bodyData);
    } catch (e) {
      bodyData = {};
    }
  }
  const { prompt, targetBudget } = bodyData || {};
  const userPrompt = typeof prompt === 'string' && prompt.trim().length > 0 ? prompt.trim() : 'Özel Hediye Kutusu';
  let requestedBudget = typeof targetBudget === 'number' && targetBudget > 0 ? targetBudget : 1000;

  try {
    const promptMatch = userPrompt.match(/(\d{3,4})\s*(tl|lira|₺)?/i);
    if (promptMatch && (!targetBudget || targetBudget === 1000)) {
      const parsedVal = parseInt(promptMatch[1], 10);
      if (parsedVal >= 200 && parsedVal <= 5000) requestedBudget = parsedVal;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `
Sen "Happinio" hediye platformunun sevimli, zeki ve yardımsever yapay zeka asistanı Hapy'sin!
Görevin: Kullanıcının doğal dille yazdığı hediye isteğini (prompt) analiz etmek ve mevcut ürün veritabanındaki ürünlerden en uygun 3-5 ürünü seçerek kişiselleştirilmiş harika bir Hediye Kutusu oluşturmak.

Mevcut Ürün Veritabanı (JSON formatı):
${JSON.stringify(PRODUCTS, null, 2)}

BÜTÇE ŞARTI:
Kullanıcının belirlediği hedef bütçe: ${requestedBudget} TL.
Seçeceğin 3-5 ürünün TOPLAM FİYATI, belirlenen bu ${requestedBudget} TL bütçesine MÜMKÜN OLDUĞUNCA ÇOK YAKIN (yaklaşık ±%5-10 bandında) olmalıdır.

Kurallar:
1. Kullanıcının belirttiği meslek, alıcı (kız kardeş, abla, erkek kardeş, abi, bebek, çocuk, yeğen, eş, sevgili, arkadaş, anne, baba vb.), ilgi alanları, amaç ve duygusal tonu analiz et.
2. KRİTİK UNİQUE ÜRÜN KURALI: matchedItemIds dizisine KESİNLİKLE aynı ürünü birden fazla ekleme! Tüm seçilen ürün ID'leri birbirinden %100 FARKLI ve benzersiz olmalıdır.
3. KRİTİK ALICI VE İLİŞKİ HİTAP KURALI: Promptta belirtilen ilişkiye (kız kardeş, abla, erkek kardeş, abi, anne, baba, eş, sevgili, arkadaş vb.) BİREBİR uygun bir dille ve hitapla yaz!
   - Eğer hediye KIZ KARDEŞ, ABLA, KARDEŞ içinse; kart notunda ("personalizedGiftNote") ve kutu başlığında ("boxTitle") KESİNLİKLE 'sevgilim', 'aşkım', 'biricik eşim' gibi romantik ifadeler KULLANMA! Bunun yerine 'Canım Kız Kardeşim', 'Canım Ablam', 'Canım Kardeşim' gibi sevecen kardeşlik hitaplarını kullan.
   - Eğer hediye çocuk/bebek/yeğen içinse; KESİNLİKLE yetişkin kahveleri, termoslar, babalar günü ürünleri seçme; oyuncak, sevimli kupa, tatlı çikolata seç.
   - Yalnızca promptta açıkça eş, sevgili veya romantik ilişki belirtilmişse romantik dil kullan.
4. KRİTİK HEDİYE NOTU KURALI: Eğer kullanıcı promptunda açıkça "doğum günü", "yaş günü" veya "yeni yaş" BELİRTİLMEDİYSE, kart notunda ("personalizedGiftNote") KESİNLİKLE "İyi ki doğdun", "Doğum günün kutlu olsun" veya "Yeni yaşın" YAZMA! Konseptsiz genel tebrikler verme.
5. KRİTİK SEÇİM NEDENİ / AÇIKLAMA KURALI: aiExplanation alanında, seçtiğin ürünlerin neden tam da bu kişiye (örn: kız kardeş, yazılımcı dost, yeni anne) ve konseptine uygun olduğunu samimi, tatlı ve detaylıca açıkla. Mekanik veya jenerik yüzdeler YAZMA.
6. Ürün veritabanındaki ID'leri seç. Fiyatların toplamı ${requestedBudget} TL bütçesine çok yakın olsun.
7. Sevecen, sevimli, alıcıya/konsepte özgü Türkçe bir hediye kartı notu ("personalizedGiftNote") yaz.
8. Kutuya konsepte ve kişiye özel sevimli bir isim ver ("boxTitle").
9. Neden bu ürünleri seçtiğini açıklayan tatlı, samimi bir Hapy açıklaması yaz ("aiExplanation").
10. Yanıtını STRICT JSON formatında ver.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Kullanıcı Promptu: "${userPrompt}" (Hedef Bütçe: ${requestedBudget} TL)`,
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
        const uniqueItemIds = Array.from(new Set(parsed.matchedItemIds || []));
        let matchedItems = PRODUCTS.filter((p) => uniqueItemIds.includes(p.id));
        if (matchedItems.length === 0) matchedItems = PRODUCTS.slice(0, 4);

        const totalPrice = matchedItems.reduce((acc, curr) => acc + curr.price, 0);

        return res.status(200).json({
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

    // Smart Fallback Algorithm
    const fallbackResult = generateClientFallbackRecommendation(userPrompt, requestedBudget);
    return res.status(200).json(fallbackResult);
  } catch (error) {
    console.error('API Error:', error);
    // Return smart fallback on status 200 to prevent serverless crashes on Vercel
    const fallbackResult = generateClientFallbackRecommendation(userPrompt, requestedBudget);
    return res.status(200).json(fallbackResult);
  }
}
