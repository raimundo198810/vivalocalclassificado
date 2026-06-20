import React from 'react';
import { MapPin, Calendar, Eye, Heart, ShieldCheck } from 'lucide-react';
import { Listing } from '../types';
import { CATEGORIES } from '../data/seedData';

interface ListingCardProps {
  key?: string;
  listing: Listing;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export default function ListingCard({
  listing,
  onClick,
  isFavorite,
  onToggleFavorite,
}: ListingCardProps) {
  // Find category color and icon metadata
  const currentCat = CATEGORIES.find((cat) => cat.id === listing.category);

  // Format date readable in Portuguese
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const diffMs = today.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Hoje';
      if (diffDays === 1) return 'Ontem';
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return 'Recentemente';
    }
  };

  // Format price helper
  const formatPrice = (price: number | null) => {
    if (price === null) return 'A combinar';
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col md:flex-row bg-white border rounded-xl overflow-hidden cursor-pointer transition-all ${
        listing.isPremium
          ? 'border-amber-300 bg-amber-50/15 hover:border-amber-400 shadow-[0_2px_12px_rgba(245,158,11,0.08)] hover:shadow-[0_4px_16px_rgba(245,158,11,0.15)] hover:scale-[1.01]'
          : 'border-slate-100 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]'
      }`}
      id={`listing-card-${listing.id}`}
    >
      {/* Premium label on cards */}
      {listing.isPremium && (
        <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md shadow flex items-center gap-1.5 backdrop-blur-sm">
          <ShieldCheck className="h-3 w-3" />
          Destaque
        </span>
      )}

      {/* Image thumbnail on left */}
      <div className="relative w-full md:w-56 h-48 md:h-full min-h-[160px] max-h-[220px] bg-slate-50 overflow-hidden shrink-0">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback image if broken
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Toggle favorites icon */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all cursor-pointer ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 scale-110'
              : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-600'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        >
          <Heart className={`h-4.5 w-4.5 transition-transform ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Body content details */}
      <div className="flex-1 p-4.5 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category microbanner & Views */}
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className={`px-2 py-0.5 rounded-full border text-[10px] ${
              currentCat?.color || 'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              {currentCat?.name || listing.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 font-medium">
              <Eye className="h-3 w-3" />
              <span>{listing.views} visualizações</span>
            </div>
          </div>

          {/* Listing title */}
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
            {listing.title}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 md:line-clamp-3 leading-relaxed font-normal">
            {listing.description}
          </p>
        </div>

        {/* Footer info: Location, Date & Price */}
        <div className="pt-4 mt-2 border-t border-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3.5 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
              <span className="truncate max-w-[140px] md:max-w-none">
                {listing.city} {listing.neighborhood ? `(${listing.neighborhood})` : ''}, {listing.region}
              </span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span>Anunciado {formatDate(listing.createdAt)}</span>
            </span>
          </div>

          {/* Listing Price */}
          <div className="text-right shrink-0">
            <span className={`text-lg font-black tracking-tight ${
              listing.price === null ? 'text-slate-500 text-sm font-semibold' : 'text-emerald-600'
            }`}>
              {formatPrice(listing.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
