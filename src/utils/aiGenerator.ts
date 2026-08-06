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

function generateClientFallbackRecommendation(prompt: string, requestedBudget: number): AIRecommendationResult {
  const lowerPrompt = prompt.toLowerCase();

  // Extract budget from prompt if specified
  let targetBudget = requestedBudget;
  const promptMatch = prompt.match(/(\d{3,4})\s*(tl|lira|₺)?/i);
  if (promptMatch && (!requestedBudget || requestedBudget === 1000)) {
    const parsedVal = parseInt(promptMatch[1], 10);
    if (parsedVal >= 200 && parsedVal <= 5000) targetBudget = parsedVal;
  }

  // Filter matching products
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

  // Find best subset of 3-4 products matching targetBudget closely
  let bestProducts = selectedProducts.slice(0, 4);
  let minDiff = Math.abs(bestProducts.reduce((s, i) => s + i.price, 0) - targetBudget);

  for (let i = 0; i < selectedProducts.length; i++) {
    for (let j = i + 1; j < selectedProducts.length; j++) {
      for (let k = j + 1; k < selectedProducts.length; k++) {
        const combo3 = [selectedProducts[i], selectedProducts[j], selectedProducts[k]];
        const diff3 = Math.abs(combo3.reduce((s, x) => s + x.price, 0) - targetBudget);
        if (diff3 < minDiff) {
          minDiff = diff3;
          bestProducts = combo3;
        }
        for (let l = k + 1; l < selectedProducts.length; l++) {
          const combo4 = [selectedProducts[i], selectedProducts[j], selectedProducts[k], selectedProducts[l]];
          const diff4 = Math.abs(combo4.reduce((s, x) => s + x.price, 0) - targetBudget);
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

  let boxTitle = 'Kişiye Özel Happinio Sürpriz Kutusu';
  if (lowerPrompt.includes('eskişehir')) {
    boxTitle = "Eskişehir'in Sanatçı Ruhu & Oyun Keyfi Kutusu";
  } else if (lowerPrompt.includes('kedi')) {
    boxTitle = 'Kedisever Kahve & Kitap Keyfi Kutusu 🐱';
  } else if (lowerPrompt.includes('bebek') || lowerPrompt.includes('anne')) {
    boxTitle = 'Yeni Anne & Minik Mucize Hoş Geldin Kutusu 👶';
  } else if (lowerPrompt.includes('truva') || lowerPrompt.includes('şaka')) {
    boxTitle = 'Eğlenceli Şaka & Truva Sürpriz Kutusu 🎁';
  }

  const personalizedGiftNote = lowerPrompt.includes('eskişehir')
    ? 'Kahve kokusu, Eskişehir dokusu ve eğlenceli oyun saatleri bir arada! Yüzünden tebessüm hiç eksik olmasın.'
    : lowerPrompt.includes('kedi')
    ? 'En tatlı pati dostun ve sıcacık kahven eşliğinde huzur dolu anlar seninle olsun! 🐾'
    : 'İyi ki doğdun! Senin kadar özel ve tatlı sürprizlerle dolu harika bir yaş dilerim. ✨';

  return {
    boxTitle,
    tagline: 'Joy Genie Akıllı Hediye Eşleştirmesi',
    matchedItems: finalProducts,
    totalPrice,
    matchScore: 97,
    personalizedGiftNote,
    suggestedBoxCategory: 'custom',
    aiExplanation: 'Yazdığın tüm detayları ve ilgi alanlarını inceleyip bütçene en uygun sevimli parçaları özenle bir araya getirdik!',
  };
}
