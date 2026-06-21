import React, { useState } from 'react';
import { 
  ShieldAlert, Check, X, Users, CreditCard, Tag, Image, Settings2, BarChart3, 
  Trash2, AlertTriangle, ToggleLeft, ToggleRight, PlusCircle, Edit3, HelpCircle 
} from 'lucide-react';
import { Listing, User, Category, PaymentLog } from '../types';

interface AdminPanelProps {
  listings: Listing[];
  onApproveAd: (id: string, isApproved: boolean) => void;
  users: User[];
  onToggleUserStatus: (userId: string) => void;
  paymentLogs: PaymentLog[];
  categories: Category[];
  onAddSubCategory: (catId: string, subName: string) => void;
  banners: { id: string; imgUrl: string; label: string; link: string }[];
  onAddBanner: (banner: { imgUrl: string; label: string; link: string }) => void;
  onRemoveBanner: (id: string) => void;
  siteSettings: { siteName: string; supportPhone: string; footerCopy: string };
  onUpdateSiteSettings: (settings: { siteName: string; supportPhone: string; footerCopy: string }) => void;
  onDeleteUser: (userId: string) => void;
}

export default function AdminPanel({
  listings,
  onApproveAd,
  users,
  onToggleUserStatus,
  paymentLogs,
  categories,
  onAddSubCategory,
  banners,
  onAddBanner,
  onRemoveBanner,
  siteSettings,
  onUpdateSiteSettings,
  onDeleteUser,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'payments' | 'categories' | 'banners' | 'content' | 'reports'>('listings');
  
  // States for creations
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  
  const [bannerImg, setBannerImg] = useState('');
  const [bannerLabel, setBannerLabel] = useState('');
  const [bannerLink, setBannerLink] = useState('');

  const [siteName, setSiteName] = useState(siteSettings.siteName);
  const [supportPhone, setSupportPhone] = useState(siteSettings.supportPhone);
  const [footerCopy, setFooterCopy] = useState(siteSettings.footerCopy);

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings({ siteName, supportPhone, footerCopy });
    alert('Configurações institucionais do site atualizadas com sucesso!');
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || !newSubCategoryName.trim()) return;
    onAddSubCategory(selectedCatId, newSubCategoryName.trim());
    setNewSubCategoryName('');
    alert('Subcategoria injetada com sucesso nos filtros e categorização pública!');
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImg.trim() || !bannerLabel.trim()) return;
    onAddBanner({ imgUrl: bannerImg, label: bannerLabel, link: bannerLink || '#' });
    setBannerImg('');
    setBannerLabel('');
    setBannerLink('');
  };

  // Calculations for Reports
  const totalSalesAmount = paymentLogs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalUsersCount = users.length;
  const totalAdsCount = listings.length;
  const premiumRatio = (listings.filter(l => l.isPremium).length / totalAdsCount) * 100 || 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans animate-fadeIn" id="admin-master-portal">
      <div className="border-b border-gray-150 pb-5 mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ShieldAlert className="h-6.5 w-6.5 text-red-655 text-red-650" />
          Central Administrativa Vivalocal
        </h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">
          Painel central reservado para moderadores. Aprove anúncios, bloqueie spams, adicione bônus e monitore faturamento total Pix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Navigation Admin Column */}
        <div className="lg:col-span-1 bg-white border border-gray-150 rounded-2xl p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible select-none">
          <button
            onClick={() => setActiveTab('listings')}
            className={`w-full whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
              activeTab === 'listings' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-655 hover:bg-gray-50'
            }`}
          >
            <Check className="h-4.5 w-4.5" />
            Aprovação / Filtros
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-655 hover:bg-gray-50'
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            Usuários
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
              activeTab === 'payments' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-655 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-4.5 w-4.5" />
            Pagamentos Pix
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
              activeTab === 'categories' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-655 hover:bg-gray-50'
            }`}
          >
            <Tag className="h-4.5 w-4.5" />
            Categorias
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
              activeTab === 'banners' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-655 hover:bg-gray-50'
            }`}
          >
            <Image className="h-4.5 w-4.5" />
            Banners Publicitários
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
              activeTab === 'content' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-655 hover:bg-gray-50'
            }`}
          >
            <Settings2 className="h-4.5 w-4.5" />
            Conteúdos Site
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
              activeTab === 'reports' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-655 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="h-4.5 w-4.5" />
            Relatórios Gerais
          </button>
        </div>

        {/* Dynamic Inner views columns */}
        <div className="lg:col-span-4 bg-white border border-gray-150 rounded-3xl p-5 sm:p-6 shadow-sm min-h-[460px]">
          
          {/* 1. APPROVE / REJECT LISTINGS OR DUPLICATES */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
                Aprovação e Moderação de Conteúdo Duplicado
              </h3>
              
              <div className="space-y-3">
                {listings.map(ad => (
                  <div key={ad.id} className="bg-slate-50 border border-gray-150 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs font-semibold text-slate-850">
                    <div className="flex items-center gap-3">
                      <img src={ad.imageUrl} alt="" className="h-11 w-11 object-cover rounded-lg border shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold block truncate max-w-[240px]">{ad.title}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Autor: {ad.sellerName} • {ad.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${
                        ad.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ad.isApproved ? 'Aprovado' : 'Pendente / Pausado'}
                      </span>

                      {ad.isApproved ? (
                        <button
                          onClick={() => onApproveAd(ad.id, false)}
                          className="bg-red-50 hover:bg-rose-100 text-red-600 p-2 rounded-lg cursor-pointer transition border border-red-200"
                          title="Reprovar / Pausar Anúncio"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onApproveAd(ad.id, true)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-2 rounded-lg cursor-pointer transition border border-emerald-200"
                          title="Aprovar e Liberar no Feed"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
                Gerenciar Contas de Anunciantes
              </h3>

              <div className="space-y-2.5">
                {users.map(u => (
                  <div key={u.id} className="p-3.5 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs font-semibold">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-1">
                        {u.name}
                        {u.isVerified && <span className="bg-blue-100 text-blue-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Verificado</span>}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{u.email} • Cadastro: {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleUserStatus(u.id)}
                        className="text-slate-655 p-1 hover:text-slate-900 cursor-pointer"
                        title="Alternar Selo de Verificação"
                      >
                        {u.isVerified ? (
                          <ToggleRight className="h-6 w-6 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </button>

                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="p-2 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition"
                        title="Desativar Conta"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PAYMENTS MONITORING */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
                Faturamento Pix Comercial Registrado
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100">
                  <span className="text-[9px] font-black uppercase block text-emerald-600">Total Arrecadado</span>
                  <span className="text-xl font-black">R$ {totalSalesAmount.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="bg-blue-50 text-blue-850 p-4 rounded-xl border border-blue-100">
                  <span className="text-[9px] font-black uppercase block text-blue-600">Total Transações Pix</span>
                  <span className="text-xl font-black">{paymentLogs.length} compensadas</span>
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {paymentLogs.map(log => (
                  <div key={log.id} className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-xs font-semibold flex items-center justify-between text-slate-800">
                    <div>
                      <span className="block font-bold">{log.plan}</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">Email: {log.userEmail} • {new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 block">R$ {log.amount.toFixed(2).replace('.', ',')}</span>
                      <span className="text-[8px] bg-emerald-100 text-emerald-850 font-black px-1.5 py-0.5 rounded uppercase mt-1 inline-block">Pago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CATEGORIES EXPANSION */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
                  Estrutura de Categorias & Subcategorias
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-relaxed">
                  Insira novas subcategorias à nossa árvore de busca para expandir os produtos anunciados.
                </p>
              </div>

              <form onSubmit={handleAddSub} className="p-4 bg-slate-50 border border-gray-100 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Categoria Principal</label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs font-semibold outline-none"
                  >
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Nome da Subcategoria</label>
                  <input
                    type="text"
                    required
                    value={newSubCategoryName}
                    onChange={(e) => setNewSubCategoryName(e.target.value)}
                    placeholder="Ex: Consultoria, Teclados"
                    className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs font-semibold outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-slate-950 text-white hover:bg-slate-900 text-xs font-black py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <PlusCircle className="h-4 w-4" /> Incluir
                </button>
              </form>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Árvore de Filtros Ativos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-3 bg-slate-50 border rounded-xl text-xs space-y-1.5">
                      <span className="font-extrabold text-slate-900 block text-xs">{cat.name}</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cat.subCategories.map((sub, i) => (
                          <span key={i} className="bg-white border border-gray-200 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. PROMOTIONAL BANNERS */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-801 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
                  Banners Publicitários e Patrocinadores
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">
                  Crie campanhas publicitárias rotativas no topo do feed do site para gerar receita extra de parceiros locais.
                </p>
              </div>

              <form onSubmit={handleCreateBanner} className="p-4 bg-slate-50 border border-gray-100 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Título da Campanha</label>
                  <input
                    type="text"
                    required
                    value={bannerLabel}
                    onChange={(e) => setBannerLabel(e.target.value)}
                    placeholder="Ex: Coca-Cola Retrô"
                    className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Link de Imagem (URL)</label>
                  <input
                    type="url"
                    required
                    value={bannerImg}
                    onChange={(e) => setBannerImg(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">URL do Patrocinador</label>
                  <input
                    type="text"
                    value={bannerLink}
                    onChange={(e) => setBannerLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-gray-200 p-2 rounded-lg text-xs font-semibold outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 px-4 rounded-lg cursor-pointer transition sm:col-span-3 text-center"
                >
                  Adicionar Banner de Patrocínio Ao Sistema
                </button>
              </form>

              <div className="space-y-3.5">
                <h4 className="text-xs font-black text-slate-750 uppercase tracking-widest">Banners Ativos na Plataforma</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {banners.map(b => (
                    <div key={b.id} className="bg-slate-50 border border-gray-150 p-3 rounded-xl space-y-2 font-semibold text-xs flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={b.imgUrl} alt="" className="h-10 w-24 object-cover border rounded bg-white shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'; }} />
                        <div>
                          <span className="font-extrabold text-slate-800 block text-xs">{b.label}</span>
                          <span className="text-[9px] text-gray-450 truncate block mt-0.5">{b.link}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveBanner(b.id)}
                        className="text-gray-400 hover:text-red-650 p-2 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. CONTENT OF THE SITE EDIT */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
                Editar Conteúdo Dinâmico Institucional
              </h3>

              <form onSubmit={handleUpdateSettings} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Nome Fantasia da Plataforma</label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 p-2.5 rounded-xl outline-none focus:bg-white focus:border-red-550 focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">WhatsApp de Suporte (Rodapé)</label>
                    <input
                      type="text"
                      required
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 p-2.5 rounded-xl outline-none focus:bg-white focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Mensagem Legal do Rodapé (Direitos Autorais)</label>
                  <textarea
                    rows={3}
                    required
                    value={footerCopy}
                    onChange={(e) => setFooterCopy(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 p-2.5 rounded-xl outline-none focus:bg-white focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-950 text-white font-extrabold hover:bg-slate-900 py-3 rounded-xl cursor-pointer transition shadow-sm uppercase tracking-wider text-[10px]"
                >
                  Salvar Informações do Site
                </button>
              </form>
            </div>
          )}

          {/* 7. REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pb-2 border-b border-gray-100">
                Relatórios Globais de Volume e Vendas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border rounded-xl p-4 text-center">
                  <span className="text-[9px] text-gray-400 font-black uppercase">Faturamento Pix</span>
                  <span className="block text-xl font-black text-slate-900 mt-1">R$ {totalSalesAmount.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="bg-slate-50 border rounded-xl p-4 text-center">
                  <span className="text-[9px] text-gray-400 font-black uppercase">Total Contas Ativas</span>
                  <span className="block text-xl font-black text-slate-900 mt-1">{totalUsersCount} Usuários</span>
                </div>
                <div className="bg-slate-50 border rounded-xl p-4 text-center">
                  <span className="text-[9px] text-gray-400 font-black uppercase">Conversão Premium</span>
                  <span className="block text-xl font-black text-amber-600 mt-1">{premiumRatio.toFixed(1)}%</span>
                </div>
              </div>

              {/* Graphic charts mock using inline divs */}
              <div className="p-4 bg-slate-50 rounded-2xl border space-y-4">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Crescimento Semanal (Estimado)</span>
                
                <div className="flex h-36 items-end gap-6.5 justify-around px-4 select-none pt-2">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-slate-205 bg-gray-200 rounded-t h-12"></div>
                    <span className="text-[9px] font-bold text-gray-400">Semana 1</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-red-400 rounded-t h-20"></div>
                    <span className="text-[9px] font-bold text-gray-400 font-semibold text-slate-705">Semana 2</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-emerald-500 rounded-t h-32"></div>
                    <span className="text-[9px] font-bold text-emerald-800 font-extrabold block">Semana Atual</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
