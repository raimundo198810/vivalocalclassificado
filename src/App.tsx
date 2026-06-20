/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SidebarFilters from './components/SidebarFilters';
import ListingCard from './components/ListingCard';
import ListingDetail from './components/ListingDetail';
import CreateAdModal from './components/CreateAdModal';
import MyAdsDashboard from './components/MyAdsDashboard';
import { Listing, SearchFilters, CategoryId } from './types';
import { INITIAL_LISTINGS } from './data/seedData';
import { Heart, Sparkles, AlertCircle, ShoppingBag, PlusCircle, CheckCircle } from 'lucide-react';

export default function App() {
  // --- Persistent Storage State Sync ---
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const stored = localStorage.getItem('vivalocal_listings');
      return stored ? JSON.parse(stored) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vivalocal_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [myCreatedIds, setMyCreatedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('vivalocal_my_created');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem('vivalocal_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('vivalocal_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vivalocal_my_created', JSON.stringify(myCreatedIds));
  }, [myCreatedIds]);

  // --- UI Layout state control ---
  const [currentTab, setCurrentTab] = useState<'home' | 'my-ads' | 'favorites'>('home');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // --- Global Location Selectors ---
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // --- Advanced Filtering Config ---
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    subCategory: 'all',
    region: 'all',
    city: 'all',
    minPrice: '',
    maxPrice: '',
    onlyPremium: false,
    sortBy: 'recent',
  });

  // Keep filters in sync with header quick state location select
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      region: selectedRegion,
      city: selectedCity,
    }));
  }, [selectedRegion, selectedCity]);

  // Handle hero banner instant search trigger
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentTab('home');
    setSelectedListing(null);
    triggerAlert('info', 'Filtros aplicados com sucesso!');
  };

  const handleResetFilters = () => {
    setSelectedRegion('all');
    setSelectedCity('all');
    setFilters({
      query: '',
      category: 'all',
      subCategory: 'all',
      region: 'all',
      city: 'all',
      minPrice: '',
      maxPrice: '',
      onlyPremium: false,
      sortBy: 'recent',
    });
    triggerAlert('info', 'Todos os filtros foram redefinidos.');
  };

  // --- Helper notifications flash ---
  const triggerAlert = (type: 'success' | 'info', text: string) => {
    setShowNotification({ type, text });
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // --- Compute Real-time counters per principal category ---
  const listingsCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach((list) => {
      counts[list.category] = (counts[list.category] || 0) + 1;
    });
    return counts;
  }, [listings]);

  // --- Extract User's own items vs Favorites items ---
  const myListings = useMemo(() => {
    return listings.filter((l) => myCreatedIds.includes(l.id));
  }, [listings, myCreatedIds]);

  const favoriteListings = useMemo(() => {
    return listings.filter((l) => favorites.includes(l.id));
  }, [listings, favorites]);

  // --- Orchestrate Complex Filter Pipeline ---
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Under favorites or personal dashboard views, restrict global pool
    if (currentTab === 'favorites') {
      result = result.filter((l) => favorites.includes(l.id));
    } else if (currentTab === 'my-ads') {
      result = result.filter((l) => myCreatedIds.includes(l.id));
    }

    // 1. Keyword search (title + description)
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
    }

    // 2. Primary Category Filter
    if (filters.category !== 'all') {
      result = result.filter((l) => l.category === filters.category);
    }

    // 3. Sub Category Filter
    if (filters.subCategory !== 'all') {
      result = result.filter((l) => l.subCategory === filters.subCategory);
    }

    // 4. Region (State) Filter
    if (filters.region !== 'all') {
      result = result.filter((l) => l.region === filters.region);
    }

    // 5. City Filter
    if (filters.city !== 'all') {
      result = result.filter((l) => l.city === filters.city);
    }

    // 6. Minimum Price Floor
    if (filters.minPrice) {
      const min = Number(filters.minPrice);
      result = result.filter((l) => l.price !== null && l.price >= min);
    }

    // 7. Maximum Price Cap
    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      result = result.filter((l) => l.price !== null && l.price <= max);
    }

    // 8. Only highlight / premium ads
    if (filters.onlyPremium) {
      result = result.filter((l) => l.isPremium);
    }

    // 9. Sorting core engine
    result.sort((a, b) => {
      // Premium ads are ALWAYS prioritized to the absolute top of lists naturally (VivaLocal behavior)
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;

      if (filters.sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'price-asc') {
        const pA = a.price === null ? Infinity : a.price;
        const pB = b.price === null ? Infinity : b.price;
        return pA - pB;
      }
      if (filters.sortBy === 'price-desc') {
        const pA = a.price === null ? -Infinity : a.price;
        const pB = b.price === null ? -Infinity : b.price;
        return pB - pA;
      }
      if (filters.sortBy === 'popular') {
        return b.views - a.views;
      }
      return 0;
    });

    return result;
  }, [listings, filters, currentTab, favorites, myCreatedIds]);

  // --- Interaction Event handlers ---

  const handleSelectListing = (listing: Listing) => {
    // Increment view counter dynamically representing traffic activity
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, views: l.views + 1 } : l))
    );
    setSelectedListing({ ...listing, views: listing.views + 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        triggerAlert('info', 'Anúncio removido dos seus salvos.');
        return prev.filter((item) => item !== id);
      } else {
        triggerAlert('success', 'Anúncio salvo nos seus favoritos!');
        return [...prev, id];
      }
    });
  };

  const handleCreateAd = (newAdData: Omit<Listing, 'id' | 'views' | 'createdAt'>) => {
    const newId = `ad_${Date.now()}`;
    const newListing: Listing = {
      ...newAdData,
      id: newId,
      views: 0,
      createdAt: new Date().toISOString(),
    };

    setListings((prev) => [newListing, ...prev]);
    setMyCreatedIds((prev) => [newId, ...prev]);
    setIsCreateModalOpen(false);
    triggerAlert('success', 'Seu anúncio foi publicado com sucesso!');
    setCurrentTab('my-ads');
    setSelectedListing(null);
  };

  const handleDeleteListing = (id: string) => {
    if (window.confirm('Tem certeza de que deseja remover permanentemente este anúncio de classificados?')) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      setMyCreatedIds((prev) => prev.filter((itemId) => itemId !== id));
      setFavorites((prev) => prev.filter((itemId) => itemId !== id));
      if (selectedListing?.id === id) {
        setSelectedListing(null);
      }
      triggerAlert('info', 'Seu anúncio foi desativado e removido do sistema.');
    }
  };

  const handleUpgradeToPremium = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isPremium: true } : l))
    );
    triggerAlert('success', 'Parabéns! Seu anúncio agora é Destaque Premium e aparecerá no topo do feed!');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" id="viva-local-app">
      {/* Top sticky bar and navigation elements */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedListing(null); // Close active detailed pages during tab change
        }}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onAnnounceClick={() => setIsCreateModalOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Interactive visual search banner (Only active on Home tab) */}
      {currentTab === 'home' && !selectedListing && (
        <Hero
          searchQuery={filters.query}
          setSearchQuery={(q) => setFilters((prev) => ({ ...prev, query: q }))}
          selectedCategory={filters.category}
          setSelectedCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
          selectedSubCategory={filters.subCategory}
          setSelectedSubCategory={(sub) => setFilters((prev) => ({ ...prev, subCategory: sub }))}
          listingsCounts={listingsCounts}
          onSearchSubmit={handleHeroSearch}
        />
      )}

      {/* Floating Sparkles custom alert prompt */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 border border-slate-800 text-white font-semibold rounded-2xl px-5 py-3.5 shadow-2xl animate-slideLeft max-w-sm">
          {showNotification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <Sparkles className="h-5 w-5 text-amber-500 shrink-0 animate-spin" />
          )}
          <span className="text-xs leading-relaxed">{showNotification.text}</span>
        </div>
      )}

      {/* Core view orchestrator content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {selectedListing ? (
          // Case 1: Active Listing Detailed Layout view
          <ListingDetail
            listing={selectedListing}
            onBack={() => {
              setSelectedListing(null);
              // Safe: preserve previous listing views increment
              const listObj = listings.find((x) => x.id === selectedListing.id);
              if (listObj) {
                setSelectedListing(null);
              }
            }}
            isFavorite={favorites.includes(selectedListing.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedListing.id)}
          />
        ) : currentTab === 'my-ads' ? (
          // Case 2: Personal uploaded items list dashboard manager
          <MyAdsDashboard
            myListings={myListings}
            onDeleteListing={handleDeleteListing}
            onUpgradeToPremium={handleUpgradeToPremium}
            onSelectListing={handleSelectListing}
            onAnnounceClick={() => setIsCreateModalOpen(true)}
          />
        ) : (
          // Case 3: Public listings browser (Home / Search & Favorites tabs)
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left sidebar filters */}
            <div className="lg:col-span-1 sticky top-28 hidden lg:block">
              <SidebarFilters
                filters={filters}
                setFilters={setFilters}
                onResetFilters={handleResetFilters}
                listingsCount={filteredListings.length}
              />
            </div>

            {/* Mobile filter sheet trigger */}
            <div className="lg:hidden w-full flex flex-wrap gap-2 mb-2 p-1.5 bg-white border border-gray-200 rounded-xl">
              <div className="flex-1">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value as any, subCategory: 'all' }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs font-semibold"
                >
                  <option value="all">Filtro: Categorias</option>
                  {INITIAL_LISTINGS.map((l) => (
                    <option key={l.id} value={l.category}>
                      {l.category}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-600 px-3 cursor-pointer bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>

            {/* Central matching items listings list */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
                    {currentTab === 'favorites' ? 'Seus Favoritos Salvos' : 'Resultados Recentes'}
                  </h2>
                  <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                    {filteredListings.length} anúncios encontrados de acordo com filtros ativos
                  </p>
                </div>

                {/* Micro Sort order dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase hidden sm:inline">Ordernar</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                    className="bg-transparent border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-600 outline-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="recent">Mais Recentes</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                    <option value="popular">Popularidade</option>
                  </select>
                </div>
              </div>

              {/* No items matches */}
              {filteredListings.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl max-w-lg mx-auto p-6 space-y-4 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800">
                      {currentTab === 'favorites' ? 'Nenhum favorito salvo' : 'Nenhum anúncio corresponde à sua busca'}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold mt-1">
                      {currentTab === 'favorites'
                        ? 'Explore os classificados e clique no ícone do coração para salvar seus anúncios prediletos!'
                        : 'Tente redefinir a faixa de preço, expandir a busca para outro estado, ou limpar os textos inseridos.'}
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer transition-colors"
                  >
                    Resetar Filtros de Busca
                  </button>
                </div>
              ) : (
                // Items Loop
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onClick={() => handleSelectListing(listing)}
                      isFavorite={favorites.includes(listing.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(listing.id, e)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Render Anunciar multi-step creation overlay form modal */}
      {isCreateModalOpen && (
        <CreateAdModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAd}
        />
      )}

      {/* Global footer detail block */}
      <footer className="bg-slate-900 text-gray-400 mt-20 border-t border-slate-850 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs font-medium">
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white tracking-tight">
              viva<span className="text-red-500">local</span> Classificados
            </h4>
            <p className="leading-relaxed font-semibold">
              O Vivalocal é a plataforma líder em classificados locais no Brasil. Projetada para facilitar anúncios gratuitos de compra e venda, imóveis, serviços e veículos com segurança e facilidade.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-black text-white">Categorias em Destaque</h4>
            <ul className="space-y-1.5 font-semibold">
              <li className="hover:text-white cursor-pointer transition-colors">Celulares & Telefonia</li>
              <li className="hover:text-white cursor-pointer transition-colors">Imóveis para Aluguel</li>
              <li className="hover:text-white cursor-pointer transition-colors">Serviços de Massagem & Limpeza</li>
              <li className="hover:text-white cursor-pointer transition-colors">Honda Civic & Carros Usados</li>
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-sm font-black text-white">Conselhos de Negociação</h4>
            <p className="leading-relaxed font-semibold">
              Sempre realize encontros ou conferências presenciais em locais de alta movimentação para concretizar transações comerciais seguras. Desconfie de faturas externas de pagamento antecipado.
            </p>
            <p className="text-[10px] text-gray-500 pt-1">
              &copy; 2026 Vivalocal. Feito com cuidado de interface e design para fins de demonstração.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
