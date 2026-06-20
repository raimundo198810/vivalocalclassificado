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
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  isPremium: boolean; // featured ads
  views: number;
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
