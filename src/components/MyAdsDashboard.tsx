import React from 'react';
import { Trash2, ShieldCheck, Eye, PlusCircle, ClipboardList, TrendingUp } from 'lucide-react';
import { Listing } from '../types';

interface MyAdsDashboardProps {
  myListings: Listing[];
  onDeleteListing: (id: string) => void;
  onUpgradeToPremium: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onAnnounceClick: () => void;
}

export default function MyAdsDashboard({
  myListings,
  onDeleteListing,
  onUpgradeToPremium,
  onSelectListing,
  onAnnounceClick,
}: MyAdsDashboardProps) {

  const formatPrice = (price: number | null) => {
    if (price === null) return 'A combinar';
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (myListings.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-6 animate-fadeIn" id="my-ads-empty-state">
        <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <ClipboardList className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-800">Você não tem anúncios ativos</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Publique seu primeiro anúncio gratuito agora e alcance milhares de compradores e contratantes na sua região de forma rápida!
          </p>
        </div>
        <button
          onClick={onAnnounceClick}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Anunciar Grátis Agora</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-fadeIn" id="my-ads-dashboard">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-red-600" />
            Painel de Controle: Meus Anúncios
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Gerencie, exclua ou promova os seus anúncios publicados neste navegador.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 shrink-0">
          <TrendingUp className="h-4 w-4" />
          <span>{myListings.length} Anúncio(s) Ativo(s)</span>
        </div>
      </div>

      {/* Grid of myListings */}
      <div className="space-y-4">
        {myListings.map((listing) => (
          <div
            key={listing.id}
            className={`bg-white border rounded-2xl p-4.5 flex flex-col md:flex-row items-center justify-between gap-4.5 transition-all shadow-sm ${
              listing.isPremium ? 'border-amber-300 bg-amber-50/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            {/* Listing Thumbnail & Title info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                referrerPolicy="no-referrer"
                className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover border border-gray-100 shrink-0 cursor-pointer"
                onClick={() => onSelectListing(listing)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500&auto=format&fit=crop&q=80';
                }}
              />
              <div className="min-w-0">
                <h3
                  onClick={() => onSelectListing(listing)}
                  className="font-bold text-slate-800 text-sm md:text-base leading-snug hover:text-red-600 transition-colors cursor-pointer truncate max-w-[280px] sm:max-w-md"
                >
                  {listing.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 font-medium">
                  <span className="font-bold text-emerald-600 text-sm md:text-md">
                    {formatPrice(listing.price)}
                  </span>
                  <span>•</span>
                  <span>{listing.city}, {listing.region}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Eye className="h-3 w-3" />
                    {listing.views} cliques
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: upgrade / delete */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
              {listing.isPremium ? (
                <div className="bg-amber-100 hover:bg-amber-150 text-amber-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Destaque Ativo</span>
                </div>
              ) : (
                <button
                  onClick={() => onUpgradeToPremium(listing.id)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1 shadow transition-all cursor-pointer transform hover:scale-[1.02]"
                  title="Destacar meu anúncio no topo das buscas"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Destacar Grátis!</span>
                </button>
              )}

              <button
                onClick={() => onDeleteListing(listing.id)}
                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                title="Excluir este anúncio para sempre"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
