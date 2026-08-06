export type BoxCategory = 
  | 'all'
  | 'city'
  | 'truva'
  | 'meme'
  | 'fantasy'
  | 'music'
  | 'fathers'
  | 'corporate'
  | 'baby_mom'
  | 'special_day'
  | 'coffee_book'
  | 'custom';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
  boxTypes: BoxCategory[];
  inStock: boolean;
  image: string;
  description: string;
  rating: number;
  originCity?: string;
}

export interface GiftBox {
  id: string;
  name: string;
  category: BoxCategory;
  price: number;
  discountPrice?: number;
  image: string;
  badge?: string;
  description: string;
  items: Product[];
  tags: string[];
  rating: number;
  reviewCount: number;
  popularFor?: string;
  isCustomizable?: boolean;
  originCity?: string;
}

export interface CartItem {
  id: string;
  boxId?: string;
  title: string;
  price: number;
  image: string;
  items: Product[];
  giftNote?: string;
  recipientName?: string;
  senderName?: string;
  quantity: number;
  isAiGenerated?: boolean;
  rawAiResult?: any;
}

export interface AIRecommendationRequest {
  prompt: string;
  budget?: number;
  occasion?: string;
}

export interface AIRecommendationResponse {
  boxTitle: string;
  tagline: string;
  matchedItems: Product[];
  totalPrice: number;
  matchScore: number;
  personalizedGiftNote: string;
  suggestedBoxCategory: BoxCategory;
  aiExplanation: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  status: 'received' | 'preparing' | 'note_printed' | 'shipped' | 'delivered';
  trackingCode: string;
  recipientName: string;
  recipientAddress: string;
  deliveryDate: string;
  paymentMethod: string;
  giftNote?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  boxName: string;
  boxCategory: BoxCategory;
  comment: string;
  verifiedBuyer: boolean;
  photos?: string[];
  likes: number;
}

export interface CitySuggestion {
  id: string;
  cityName: string;
  countryName: string;
  productName: string;
  category: string;
  description: string;
  suggestedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
}

export interface DownloadableArt {
  id: string;
  month: string;
  year: number;
  title: string;
  description: string;
  previewUrl: string;
  fileSize: string;
  format: string;
  type?: 'wallpaper' | 'calendar' | 'tags' | 'all';
  funnyMotto?: string;
  downloadCount?: number;
  tagline?: string;
  dimensions?: string;
}

export interface Producer {
  id: string;
  name: string;
  artisanName: string;
  city: string;
  badge: string;
  category: string;
  story: string;
  image: string;
  mapCoords: { x: number; y: number }; // percentage on Turkey map
  productsCrafted: string[];
  relatedBoxCategory?: BoxCategory;
}

export interface SavedAddress {
  id: string;
  title: string; // e.g. "Ev Adresim 🏠", "Ofis / İş Yeri 🏢"
  recipientName: string;
  phone: string;
  email?: string;
  province: string;
  district: string;
  neighborhood: string;
  postalCode: string;
  addressDetails: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  addresses?: SavedAddress[];
  isLoggedIn?: boolean;
  isSubscribedToNewsletter?: boolean;
  points: number;
  monthlySuggestionsCount: number; // Max 3 per month
  monthlyPointsLimit: number; // 300 points max
  level: 
    | 'Minik Çırak Happinio' 
    | 'Sürpriz Mimarı Happinio' 
    | 'Mutluluk Elçisi Happinio' 
    | 'Efsanevi Hediye Gurusu Happinio' 
    | 'Minik Happinio' 
    | 'Sevimli Happinio' 
    | 'Süper Happinio' 
    | 'Efsane Happinio';
  orders: Order[];
  favorites: string[]; // box IDs
  suggestions: CitySuggestion[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  billingPeriod: '1_month' | '3_months' | '12_months';
  discountBadge?: string;
  features: string[];
}
