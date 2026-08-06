import { GiftBox, Product } from '../types';

export function getProducerBadge(boxOrProduct: GiftBox | Product | { originCity?: string; name?: string; tags?: string[] }): string | null {
  if (!boxOrProduct) return null;

  const city = boxOrProduct.originCity?.toLowerCase() || '';
  const name = boxOrProduct.name?.toLowerCase() || '';
  const tags = (boxOrProduct.tags || []).join(' ').toLowerCase();

  if (city.includes('eskişehir') || name.includes('eskişehir') || tags.includes('eskişehir')) {
    return '🏷️ Eskişehir Yerel İmalatı';
  }
  if (city.includes('ayvalık') || name.includes('ayvalık') || tags.includes('sabun') || tags.includes('kooperatif')) {
    return '🌸 Kadın Kooperatifi Ürünü';
  }
  if (city.includes('gaziantep') || name.includes('antep') || name.includes('bakır') || tags.includes('bakır')) {
    return '🔨 Gaziantep El İşlemesi';
  }
  if (city.includes('denizli') || city.includes('buldan') || name.includes('buldan') || tags.includes('peştemal')) {
    return '🧵 Buldan El Dokuması';
  }
  if (city.includes('trabzon') || city.includes('rize') || name.includes('rize') || name.includes('fındık')) {
    return '🍵 Doğu Karadeniz Yerel İmalatı';
  }
  if (city.includes('çeşme') || city.includes('izmir') || name.includes('lavanta')) {
    return '🌿 Çeşme Doğal Üretimi';
  }

  // Default fallback for city boxes
  if (city) {
    return `🏷️ ${boxOrProduct.originCity} Yerel Üretimi`;
  }

  return null;
}
