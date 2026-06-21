import React, { useState } from 'react';
import { MapPin, PlusCircle, Heart, User, ClipboardList, MessageSquare, ShieldCheck, Sparkles, LogOut } from 'lucide-react';
import { BRAZIL_REGIONS } from '../data/seedData';
// @ts-ignore
import brandLogo3d from '../assets/images/vivalocal_logo_3d_1782000935551.jpg';
import { User as UserType } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onAnnounceClick: () => void;
  favoritesCount: number;
  loggedInUser: UserType | null;
  onTriggerLogin: () => void;
  onLogout: () => void;
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
  loggedInUser,
  onTriggerLogin,
  onLogout,
}: HeaderProps) {
  // Find cities for current chosen region
  const availableCities = BRAZIL_REGIONS.find((r) => r.id === selectedRegion)?.cities || [];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm" id="main-header select-none">
      {/* Top microbar */}
      <div className="bg-gray-50 border-b border-gray-100 py-1.5 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-semibold flex items-center gap-1">
            <span className="text-red-600">✓</span> O melhor site de classificados locais do Brasil!
          </span>
          <div className="flex items-center gap-4 font-semibold">
            <span onClick={() => { setCurrentTab('contact'); }} className="hover:text-red-600 cursor-pointer">Ajuda & Contato</span>
            <span className="text-gray-300">|</span>
            <span onClick={() => { setCurrentTab('help'); }} className="hover:text-red-600 cursor-pointer">Termos de Segurança</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto py-3.5 px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Brand logo & State picker */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => { setCurrentTab('home'); }}
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
              <span className="text-[9px] text-gray-400 font-black tracking-wider uppercase leading-none mt-1">
                Classificados
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
              className="bg-transparent border-none outline-none font-bold cursor-pointer max-w-[120px]"
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
                <span className="text-gray-400 font-extrabold">/</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent border-none outline-none font-bold cursor-pointer max-w-[110px]"
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
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              currentTab === 'home'
                ? 'text-red-700 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
          >
            <span>ANÚNCIOS</span>
          </button>

          <button
            onClick={() => setCurrentTab('plans')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              currentTab === 'plans'
                ? 'text-red-700 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
          >
            <span>PLANOS</span>
          </button>

          <button
            onClick={() => setCurrentTab('my-ads')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              currentTab === 'my-ads'
                ? 'text-red-700 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>PAINEL</span>
          </button>

          {/* UPGRADED: Real-time Messages Chat Tab */}
          <button
            onClick={() => setCurrentTab('chat')}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              currentTab === 'chat'
                ? 'text-red-700 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>CHAT</span>
            <span className="absolute -top-1 -right-0.5 bg-indigo-600 text-white text-[8px] font-black h-4 w-4 flex items-center justify-center rounded-full">
              1
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('favorites')}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
              currentTab === 'favorites'
                ? 'text-red-700 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>FAVORITOS</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-0.5 bg-red-600 text-white text-[8px] font-black h-4 w-4 flex items-center justify-center rounded-full animate-pulse">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* UPGRADED: Administrator Panel shortcut widget */}
          {loggedInUser?.email === 'admin@vivalocal.com' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition`}
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-600" />
              <span>ADMIN</span>
            </button>
          )}

          {/* UPGRADED: User Profile Icon with Login control */}
          <div className="pl-2 border-l border-gray-100 flex items-center gap-3">
            {loggedInUser ? (
              <div className="flex items-center gap-2.5">
                <img
                  src={loggedInUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                  alt={loggedInUser.name}
                  onClick={() => setCurrentTab('my-ads')}
                  className="h-8 w-8 rounded-full border border-red-500/35 object-cover cursor-pointer ring-2 ring-red-500/10 shadow-md hover:scale-105 transition"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
                  }}
                />
                <div className="hidden lg:flex flex-col select-none leading-none">
                  <span className="text-[10px] font-black text-slate-800 leading-none flex items-center gap-0.5">
                    {loggedInUser.name.split(' ')[0]}
                    <span className="bg-emerald-50 text-emerald-600 p-0.5 rounded text-[7px]" title="Verificado">✓</span>
                  </span>
                  <span className="text-[8px] text-gray-400 font-semibold leading-none mt-1">Conta Ativa</span>
                </div>
              </div>
            ) : (
              <button
                onClick={onTriggerLogin}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-3 flex items-center gap-1.5 text-xs font-black transition cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Entrar</span>
              </button>
            )}
          </div>

          {/* Golden Publish Action CTA */}
          <button
            onClick={onAnnounceClick}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-black px-4.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-95 btn-3d"
            id="nav-btn-announce"
          >
            <PlusCircle className="h-4 w-4" />
            <span>ANUNCIAR GRÁTIS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
