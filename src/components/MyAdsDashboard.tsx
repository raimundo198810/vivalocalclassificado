import React, { useState } from 'react';
import { Trash2, ShieldCheck, Eye, PlusCircle, ClipboardList, TrendingUp, User, Home, Sparkles, LogOut, Check, Save } from 'lucide-react';
import { Listing, User as UserType } from '../types';

interface MyAdsDashboardProps {
  myListings: Listing[];
  onDeleteListing: (id: string) => void;
  onUpgradeToPremium: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onAnnounceClick: () => void;
  loggedInUser: UserType | null;
  onLogout: () => void;
  onUpdateProfile: (updated: UserType) => void;
  onTriggerLogin: () => void;
}

export default function MyAdsDashboard({
  myListings,
  onDeleteListing,
  onUpgradeToPremium,
  onSelectListing,
  onAnnounceClick,
  loggedInUser,
  onLogout,
  onUpdateProfile,
  onTriggerLogin,
}: MyAdsDashboardProps) {
  
  // Profile edit fields
  const [profileName, setProfileName] = useState(loggedInUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(loggedInUser?.phone || '');
  const [profilePhoto, setProfilePhoto] = useState(loggedInUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
  const [profileBio, setProfileBio] = useState(loggedInUser?.bio || 'Membro verificado no maior site de classificados do Brasil.');
  const [saving, setSaving] = useState(false);

  // Synchronize state when user logs in/updates
  React.useEffect(() => {
    if (loggedInUser) {
      setProfileName(loggedInUser.name);
      setProfilePhone(loggedInUser.phone || '');
      setProfilePhoto(loggedInUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
      setProfileBio(loggedInUser.bio || 'Membro verificado.');
    }
  }, [loggedInUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInUser) return;
    setSaving(true);
    setTimeout(() => {
      onUpdateProfile({
        ...loggedInUser,
        name: profileName,
        phone: profilePhone,
        avatarUrl: profilePhoto,
        bio: profileBio,
      });
      setSaving(false);
    }, 850);
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'A combinar';
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // 1. GUEST BLOCKED STATE (Encourages login/registration system)
  if (!loggedInUser) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-6 animate-fadeIn" id="my-ads-guest-state">
        <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mx-auto shadow border border-gray-150">
          <User className="h-7 w-7 text-red-500 animate-float" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-800">Crie ou Acesse sua Conta</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed font-semibold">
            Para gerenciar anúncios, configurar seu perfil com foto pessoal, favoritar negócios e conversar no chat direto com vendedores, conecte-se com segurança.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onTriggerLogin}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 px-6 rounded-2xl transition shadow-md btn-3d-red cursor-pointer"
          >
            Acessar / Cadastrar Grátis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8 animate-fadeIn" id="my-ads-dashboard">
      
      {/* Upper Title dashboard */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-red-600" />
            Painel Central do Usuário
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Configure seu perfil comercial e controle os anúncios ativos para faturar de forma autêntica.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
          
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl px-3 py-2 text-xs font-black flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>{myListings.length} Ativos</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN 1 & 2: Ads Manager Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-gray-100 pb-2">
            Seus Anúncios Publicados ({myListings.length})
          </h2>

          {myListings.length === 0 ? (
            <div className="bg-white border border-gray-150 rounded-2xl p-8 text-center space-y-4">
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Você não possui anúncios cadastrados de forma recente. Que tal criar um agora? É grátis e rápido!
              </p>
              <button
                onClick={onAnnounceClick}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl cursor-pointer shadow transition scale-100 active:scale-95"
              >
                + Publicar Novo Anúncio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className={`bg-white border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all shadow-sm ${
                    listing.isPremium ? 'border-amber-300 bg-amber-50/5' : 'border-gray-100 hover:border-gray-150'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
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
                        className="font-bold text-slate-800 text-sm hover:text-red-600 transition-colors cursor-pointer truncate max-w-[200px] sm:max-w-xs"
                      >
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                        <span className="font-extrabold text-emerald-600">
                          {formatPrice(listing.price)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <Eye className="h-3 w-3" />
                          {listing.views} visualizações
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                    {listing.isPremium ? (
                      <div className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-amber-600" />
                        <span>Premium</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onUpgradeToPremium(listing.id)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[10px] font-black uppercase px-3 py-2 rounded-lg flex items-center gap-1 shadow transition-transform cursor-pointer hover:scale-105"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Destacar anúncio</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteListing(listing.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN 3: User Profile Information Customiser Card */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-gray-100 pb-2">
            Perfil com Foto e Info
          </h2>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md space-y-6">
            
            {/* Visual Avatar preview card */}
            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src={profilePhoto}
                  alt={profileName}
                  className="h-20 w-20 rounded-full object-cover mx-auto ring-4 ring-red-500/20 shadow-md border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
                  }}
                />
                <span className="absolute bottom-0 right-1 bg-emerald-500 text-white h-5 w-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black" title="Selo Oficial Vivalocal">
                  ✓
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">{profileName || 'Anunciante Vivalocal'}</h4>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase mt-0.5">{loggedInUser.email}</p>
              </div>
            </div>

            {/* Profile editor Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Seu Nome Comercial</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white focus:border-red-500 outline-none transition text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">WhatsApp de Contato</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="Ex: (11) 98888-8888"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white focus:border-red-500 outline-none transition text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Foto do Perfil (URL)</label>
                <input
                  type="url"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  placeholder="Link público de avatar ou imagem pessoal"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white focus:border-red-500 outline-none transition text-slate-700 text-ellipsis"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Biografia pessoal / Comercial</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:border-red-500 outline-none transition text-slate-700 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 btn-3d-slate"
              >
                {saving ? (
                  <Check className="h-4 w-4 animate-ping" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Atualizar Meu Perfil</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
