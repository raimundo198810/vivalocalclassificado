import React from 'react';
import { Search, ShoppingBag, Home, Wrench, Briefcase, Car, Users, Flame, Tv, Shirt, Music, Sprout } from 'lucide-react';
import { CATEGORIES } from '../data/seedData';
import { CategoryId } from '../types';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (category: CategoryId | 'all') => void;
  selectedSubCategory: string | 'all';
  setSelectedSubCategory: (sub: string | 'all') => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  listingsCounts: Record<string, number>;
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  onSearchSubmit,
  listingsCounts,
}: HeroProps) {

  // Map icon strings to Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag': return <ShoppingBag className="h-6 w-6" />;
      case 'Home': return <Home className="h-6 w-6" />;
      case 'Wrench': return <Wrench className="h-6 w-6" />;
      case 'Briefcase': return <Briefcase className="h-6 w-6" />;
      case 'Car': return <Car className="h-6 w-6" />;
      case 'Users': return <Users className="h-6 w-6" />;
      case 'Flame': return <Flame className="h-6 w-6" />;
      case 'Tv': return <Tv className="h-6 w-6" />;
      case 'Shirt': return <Shirt className="h-6 w-6" />;
      case 'Music': return <Music className="h-6 w-6" />;
      case 'Sprout': return <Sprout className="h-6 w-6" />;
      default: return <Search className="h-6 w-6" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-10 px-4 shadow-inner" id="hero-banner">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Milhares de oportunidades perto de você!
        </h1>
        <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-xl mx-auto">
          Encontre imóveis, empregos, carros, serviços locais exclusivos e compre ou venda produtos novos e usados em segundos.
        </p>

        {/* Large Search Box */}
        <form onSubmit={onSearchSubmit} className="bg-white rounded-2xl sm:rounded-full p-2 shadow-[0_12px_30px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row items-stretch gap-2 text-gray-800 border-b-4 border-slate-700/50" id="hero-search-form">
          {/* Query input */}
          <div className="flex-1 flex items-center px-4 py-1.5 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Search className="h-5 w-5 text-gray-400 mr-2 shrink-0 animate-pulse" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você está procurando hoje?"
              className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-400 font-medium py-1"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:w-60 flex items-center px-4 py-1.5 border-b sm:border-b-0 sm:border-r border-gray-100">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as CategoryId | 'all');
                setSelectedSubCategory('all');
              }}
              className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-700 cursor-pointer"
            >
              <option value="all">Todas Categorias</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Action */}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl sm:rounded-full px-8 py-3 text-sm transition-all shadow-md shrink-0 cursor-pointer btn-3d-red"
          >
            Buscar
          </button>
        </form>

        {/* Categories Shortcut Grid */}
        <div className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-4 select-none container-3d-view" id="categories-grid">
          {CATEGORIES.map((cat) => {
            const isChosen = selectedCategory === cat.id;
            const count = listingsCounts[cat.id] || 0;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(isChosen ? 'all' : cat.id);
                  setSelectedSubCategory('all');
                }}
                className={`flex flex-col items-center p-3.5 rounded-xl border transition-all cursor-pointer text-center group ${
                  isChosen
                    ? 'bg-red-600 border-red-600 text-white scale-[1.04] shadow-[0_12px_24px_-6px_rgba(220,38,38,0.5)] border-b-4 border-red-800'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white card-3d'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
                id={`hero-cat-${cat.id}`}
              >
                <div 
                  className={`p-2 rounded-lg mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                    isChosen ? 'bg-red-700 text-white' : 'bg-white/10 text-gray-100 group-hover:text-white'
                  }`}
                  style={{ transform: 'translateZ(10px)' }}
                >
                  {getIcon(cat.iconName)}
                </div>
                <span className="text-xs font-bold leading-tight line-clamp-1 block" style={{ transform: 'translateZ(15px)' }}>
                  {cat.name}
                </span>
                <span className={`text-[10px] mt-1 font-semibold ${
                  isChosen ? 'text-red-100' : 'text-gray-400'
                }`} style={{ transform: 'translateZ(5px)' }}>
                  {count} anúncios
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
