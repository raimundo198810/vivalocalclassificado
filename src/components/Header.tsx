import React from 'react';
import { MapPin, PlusCircle, Search, Heart, User, ClipboardList } from 'lucide-react';
import { BRAZIL_REGIONS } from '../data/seedData';
// @ts-ignore
import brandLogo3d from '../assets/images/vivalocal_logo_3d_1782000935551.jpg';

interface HeaderProps {
  currentTab: 'home' | 'my-ads' | 'favorites';
  setCurrentTab: (tab: 'home' | 'my-ads' | 'favorites') => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onAnnounceClick: () => void;
  favoritesCount: number;
}

export default function Header({
  currentTab,
  setCurrentTab,
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
  onAnnounceClick,
  favoritesCount,
}: HeaderProps) {
  // Find cities for current chosen region
  const availableCities = BRAZIL_REGIONS.find((r) => r.id === selectedRegion)?.cities || [];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm" id="main-header">
      {/* Top microbar */}
      <div className="bg-gray-50 border-b border-gray-100 py-1.5 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>O melhor site de classificados locais do Brasil!</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-red-600 cursor-pointer">Ajuda & Contato</span>
            <span className="text-gray-300">|</span>
            <span className="hover:text-red-600 cursor-pointer">Dicas de Segurança</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto py-3.5 px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Brand logo & State picker */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
            id="brand-logo"
          >
            <img
              src={brandLogo3d}
              alt="Vivalocal Logo 3D"
              className="h-9 w-9 object-cover rounded-xl shadow-md border border-gray-150 transition-transform duration-300 group-hover:scale-110 animate-float"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-800 tracking-tight leading-none">
                viva<span className="text-red-600">local</span>
              </span>
              <span className="text-[9px] text-gray-500 font-extrabold tracking-wider uppercase leading-none mt-1">
                Classificados 3D
              </span>
            </div>
          </div>

          {/* Quick Location Settings */}
          <div className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-1.5 text-xs text-gray-700" id="header-location">
            <MapPin className="h-3.5 w-3.5 text-red-600" />
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCity('all');
              }}
              className="bg-transparent border-none outline-none font-semibold cursor-pointer max-w-[120px]"
            >
              <option value="all">Todo o Brasil</option>
              {BRAZIL_REGIONS.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>

            {selectedRegion !== 'all' && (
              <>
                <span className="text-gray-400">/</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent border-none outline-none font-medium cursor-pointer max-w-[110px]"
                >
                  <option value="all">Todas Cidades</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              currentTab === 'home'
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
            id="nav-btn-home"
          >
            <span>Anúncios</span>
          </button>

          <button
            onClick={() => setCurrentTab('my-ads')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              currentTab === 'my-ads'
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
            id="nav-btn-my-ads"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Meus Anúncios</span>
          </button>

          <button
            onClick={() => setCurrentTab('favorites')}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              currentTab === 'favorites'
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
            id="nav-btn-favorites"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Favoritos</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* BRIGHT RED ACT OF CREATION BUTTON - MAIN VIVALOCAL FEATURE */}
          <button
            onClick={onAnnounceClick}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md transition-all transform hover:scale-[1.03] cursor-pointer btn-3d-red"
            id="header-announce-btn"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Anunciar Grátis</span>
          </button>
        </div>
      </div>
    </header>
  );
}
