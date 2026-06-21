export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | null; // null for negotiable/a combinar
  category: CategoryId;
  subCategory: string;
  region: string; // state (e.g. SP, RJ, MG)
  city: string;
  neighborhood?: string;
  createdAt: string; // date string
  imageUrl: string;
  images?: string[]; // Up to 10 photos
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  isPremium: boolean; // featured ads
  premiumPlan?: 'vip' | 'highlight-30' | 'highlight-7' | 'monthly' | 'none';
  views: number;
  youtubeUrl?: string;
  sellerId?: string; // linked to user
  isApproved?: boolean; // default to true or adjustable by admin
  sellerRating?: number;
  verifiedSeller?: boolean;
}

export type CategoryId = 'compra-venda' | 'imoveis' | 'servicos' | 'empregos' | 'veiculos' | 'comunidade' | 'adulto';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string; // name of Lucide icon
  subCategories: string[];
  color: string; // tailwind color class
}

export interface Region {
  id: string;
  name: string;
  cities: string[];
}

export interface SearchFilters {
  query: string;
  category: CategoryId | 'all';
  subCategory: string | 'all';
  region: string | 'all';
  city: string | 'all';
  minPrice: string;
  maxPrice: string;
  onlyPremium: boolean;
  sortBy: 'recent' | 'price-asc' | 'price-desc' | 'popular';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  isVerified?: boolean;
  avatar?: string;
  listingsPublishedCount: number;
  createdAt: string;
}

export interface MessageChat {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  sellerEmail: string;
  messages: {
    sender: 'buyer' | 'seller';
    text: string;
    timestamp: string;
  }[];
}

export interface SiteNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface PaymentLog {
  id: string;
  listingId?: string;
  listingTitle?: string;
  plan: string;
  amount: number;
  method: 'pix';
  status: 'pending' | 'approved';
  createdAt: string;
  userEmail: string;
}
