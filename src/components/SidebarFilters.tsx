import React from 'react';
import { Search, RotateCcw, ShieldCheck, Heart, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, BRAZIL_REGIONS } from '../data/seedData';
import { CategoryId, SearchFilters } from '../types';

interface SidebarFiltersProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onResetFilters: () => void;
  listingsCount: number;
}

export default function SidebarFilters({
  filters,
  setFilters,
  onResetFilters,
  listingsCount,
}: SidebarFiltersProps) {

  const handleCategoryChange = (catId: CategoryId | 'all') => {
    setFilters((prev) => ({
      ...prev,
      category: catId,
      subCategory: 'all', // Reset subcategory when category swings
    }));
  };

  const handleSubCategoryChange = (subCat: string) => {
    setFilters((prev) => ({
      ...prev,
      subCategory: prev.subCategory === subCat ? 'all' : subCat,
    }));
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    // Only allow whole positive integers
    const cleaned = value.replace(/\D/g, '');
    setFilters((prev) => ({
      ...prev,
      [field]: cleaned,
    }));
  };

  // Find subcategories for selected category
  const activeCategoryObj = CATEGORIES.find((c) => c.id === filters.category);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm divide-y divide-gray-100" id="sidebar-filters">
      {/* Title & Count */}
      <div className="pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-slate-700" />
          <h2 className="text-md font-bold text-slate-800">Filtros de Busca</h2>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          title="Resetar todos os filtros"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpar
        </button>
      </div>

      {/* Category selection tree */}
      <div className="py-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Categoria Principal
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              filters.category === 'all'
                ? 'bg-red-50 text-red-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Todas Categorias
          </button>
          
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                filters.category === cat.id
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.id && <span className="h-1.5 w-1.5 rounded-full bg-red-600 block" />}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory selectors if a category is selected */}
      {activeCategoryObj && (
        <div className="py-4 animate-fadeIn">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
            Subcategoria de {activeCategoryObj.name}
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {activeCategoryObj.subCategories.map((sub) => {
              const isChecked = filters.subCategory === sub;
              return (
                <label
                  key={sub}
                  className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors text-xs font-medium ${
                    isChecked ? 'text-red-700 bg-red-50/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSubCategoryChange(sub)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5 transition-all cursor-pointer"
                  />
                  <span>{sub}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price thresholds */}
      <div className="py-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Faixa de Preço (R$)
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2.5 text-[10px] text-gray-400 font-bold">Mín</span>
            <input
              type="text"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              placeholder="0,00"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-2 py-2 text-xs font-semibold text-gray-700 focus:bg-white focus:border-red-500 focus:outline-none transition-all placeholder:text-gray-300"
            />
          </div>
          <span className="text-gray-400 font-medium">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2.5 text-[10px] text-gray-400 font-bold">Máx</span>
            <input
              type="text"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              placeholder="S/ limite"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-2 py-2 text-xs font-semibold text-gray-700 focus:bg-white focus:border-red-500 focus:outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Premium booster ads */}
      <div className="py-4">
        <label className="flex items-center justify-between cursor-pointer group" id="only-premium-toggle">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              Destaques Premium
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Visualizar apenas anúncios topo</span>
          </div>
          <input
            type="checkbox"
            checked={filters.onlyPremium}
            onChange={(e) => setFilters(prev => ({ ...prev, onlyPremium: e.target.checked }))}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-4 w-4 transition-all cursor-pointer"
          />
        </label>
      </div>

      {/* Sorting engine */}
      <div className="py-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Ordenar por
        </h3>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-red-500 cursor-pointer"
        >
          <option value="recent">Mais Recentes</option>
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
          <option value="popular">Popularidade (Cliques)</option>
        </select>
      </div>

      {/* Safety info footer */}
      <div className="py-4 bg-slate-50 rounded-xl p-3 mt-4 border border-slate-100">
        <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
          🛡️ Compra 100% Segura
        </h4>
        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
          Nunca envie dinheiro adiantado ou faça depósitos antes de ver o item e negociar pessoalmente com o anunciante.
        </p>
      </div>
    </div>
  );
}
