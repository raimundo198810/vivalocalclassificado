import React, { useState } from 'react';
import { 
  ShieldAlert, Check, X, Users, CreditCard, Tag, Image, Settings2, BarChart3, 
  Trash2, AlertTriangle, ToggleLeft, ToggleRight, PlusCircle, Edit3, HelpCircle, Loader2,
  Database, Server, RefreshCw
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
  onTriggerWebhook?: () => void;
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
  onTriggerWebhook,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'payments' | 'categories' | 'banners' | 'content' | 'reports' | 'database'>('listings');
  const [paymentSubTab, setPaymentSubTab] = useState<'all' | 'pending' | 'confirmed' | 'featured'>('all');
  
  // Database Monitor & Webhook testing sandbox states
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [sqlCommand, setSqlCommand] = useState('SELECT * FROM pagamentos');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [executingSql, setExecutingSql] = useState(false);
  const [simulatedWebhookAdId, setSimulatedWebhookAdId] = useState('18');
  const [simulatedWebhookAmount, setSimulatedWebhookAmount] = useState('29.90');
  const [triggeringWebhook, setTriggeringWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState<any>(null);

  // States for creations
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  
  const [bannerImg, setBannerImg] = useState('');
  const [bannerLabel, setBannerLabel] = useState('');
  const [bannerLink, setBannerLink] = useState('');

  const [siteName, setSiteName] = useState(siteSettings.siteName);
  const [supportPhone, setSupportPhone] = useState(siteSettings.supportPhone);
  const [footerCopy, setFooterCopy] = useState(siteSettings.footerCopy);

  const fetchDatabaseStatus = async () => {
    setDbLoading(true);
    try {
      const response = await fetch('/api/admin/database-status');
      const data = await response.json();
      setDbStatus(data);
    } catch (e: any) {
      console.error(e);
      setDbStatus({ success: false, error: e.message });
    } finally {
      setDbLoading(false);
    }
  };

  const handleExecuteSql = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqlCommand.trim()) return;
    setExecutingSql(true);
    setSqlResult(null);
    try {
      const response = await fetch('/api/admin/database-test-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryText: sqlCommand })
      });
      const data = await response.json();
      setSqlResult(data);
      // Refresh status numbers
      fetchDatabaseStatus();
    } catch (e: any) {
      setSqlResult({ success: false, error: e.message });
    } finally {
      setExecutingSql(false);
    }
  };

  const handleTriggerWebhookSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriggeringWebhook(true);
    setWebhookResult(null);
    try {
      // Setup payload matching Mercado Pago webhook schema
      const randomPaymentId = `mp-web-${Math.floor(Math.random() * 900000000 + 100000000)}`;
      const payload = {
        action: "payment.created",
        type: "payment",
        data: {
          id: randomPaymentId
        }
      };

      // 1. Simulate creation of corresponding payment row in pagamentos
      console.log(`[SIMULATOR Webhook] Creating pending payment for listing ${simulatedWebhookAdId} with status 'pendente' and amount R$ ${simulatedWebhookAmount}`);
      const createPixRes = await fetch('/api/payments/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: simulatedWebhookAmount,
          email: "raimundomoreira1988@gmail.com",
          description: `Simulação Pix Anúncio #${simulatedWebhookAdId}`,
          listingId: simulatedWebhookAdId
        })
      });
      const pixelData = await createPixRes.json();
      
      const realPaymentId = pixelData.paymentId || randomPaymentId;

      // 2. Trigger simulated webhook approval on that specific ID
      console.log(`[SIMULATOR Webhook] Triggering webhook approval status call for reference payment ${realPaymentId}`);
      await fetch(`/api/payments/simulate-approve/${realPaymentId}`, { method: 'POST' });

      // 3. Fire Webhook endpoint so server pulls down status update and updates MySQL databases accordingly!
      const response = await fetch(`/api/payments/webhook?id=${realPaymentId}&topic=payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setWebhookResult({
          success: true,
          message: `Webhook disparado com sucesso! Plataforma buscou o pagamento #${realPaymentId}, detectou o status 'approved', atualizou a tabela de pagamentos no MySQL para 'pago' e liberou automaticamente o anúncio #${simulatedWebhookAdId} definindo destaque=1 e liberando campo de link.`,
          paymentId: realPaymentId
        });
        
        // Refresh statuses
        fetchDatabaseStatus();
        if (onTriggerWebhook) {
          onTriggerWebhook();
        }
      } else {
        setWebhookResult({ success: false, error: 'O webhook retornou status de resposta inválido' });
      }
    } catch (er: any) {
      setWebhookResult({ success: false, error: er.message });
    } finally {
      setTriggeringWebhook(false);
    }
  };

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

          <button
            onClick={() => {
              setActiveTab('database');
              fetchDatabaseStatus();
            }}
            className={`w-full whitespace-nowrap px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left flex items-center gap-2 ${
              activeTab === 'database' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-655 hover:bg-gray-50'
            }`}
            id="database-panel-nav-button"
          >
            <Database className="h-4.5 w-4.5" />
            Banco de Dados & Pix
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

          {/* 3. PAYMENTS MONITORING WITH COMPREHENSIVE PAINEL FINANCEIRO */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pb-1 border-b border-gray-100 flex items-center gap-2" id="adm-finances-header">
                  <CreditCard className="h-5 w-5 text-red-650" />
                  Painel Financeiro & Auditoria Pix
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">
                  Acompanhe em tempo real o fluxo de pagamentos Pix, faturamento consolidado e anúncios promovidos na plataforma vivaLocal.
                </p>
              </div>

              {/* Webhook Service Simulation Box */}
              {onTriggerWebhook && (
                <div className="bg-slate-900 border border-slate-850 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl select-none">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-red-550">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                      Simulador de Webhook de Pagamento PIX
                    </h4>
                    <p className="text-[10px] text-slate-350 font-bold max-w-xl">
                      Nosso gateway de API Pix envia avisos de liquidação via Webhook. Como administrador, você pode induzir uma verificação imediata para detectar transações pendentes de Pix no banco e atualizar os anúncios correspondentes instantaneamente.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onTriggerWebhook}
                    className="shrink-0 bg-red-650 hover:bg-red-750 text-white text-[10px] font-black py-2.5 px-4 rounded-xl shadow-md uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    🚀 Forçar Webhook (Pix)
                  </button>
                </div>
              )}

              {/* Consolidated Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="adm-finances-metrics-grid">
                <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl">
                  <span className="text-[9px] font-black uppercase text-emerald-700 block">Total Arrecadado</span>
                  <p className="text-lg font-black text-emerald-950 mt-1">
                    R$ {paymentLogs.filter(log => log.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-[8px] font-bold text-emerald-600 mt-0.5 font-sans">Apenas compensações aprovadas</p>
                </div>

                <div className="bg-blue-50 border border-blue-150 p-4 rounded-2xl">
                  <span className="text-[9px] font-black uppercase text-blue-700 block">Destaques Ativos</span>
                  <p className="text-lg font-black text-blue-950 mt-1">
                    {listings.filter(l => l.isPremium).length} anúncios
                  </p>
                  <p className="text-[8px] font-bold text-blue-600 mt-0.5">Recursos premium ativos no feed</p>
                </div>

                <div className="bg-amber-50 border border-amber-150 p-4 rounded-2xl animate-pulse">
                  <span className="text-[9px] font-black uppercase text-amber-700 block">Pix Pendentes</span>
                  <p className="text-lg font-black text-amber-950 mt-1">
                    {paymentLogs.filter(log => log.status === 'pending').length} transações
                  </p>
                  <p className="text-[8px] font-bold text-amber-600 mt-0.5">Aguardando confirmação webhook</p>
                </div>

                <div className="bg-purple-50 border border-purple-150 p-4 rounded-2xl">
                  <span className="text-[9px] font-black uppercase text-purple-700 block">Histórico Geral</span>
                  <p className="text-lg font-black text-purple-950 mt-1">{paymentLogs.length} tentativas</p>
                  <p className="text-[8px] font-bold text-purple-600 mt-0.5">Registros na base de dados</p>
                </div>
              </div>

              {/* Sub navigation Tabs for Payments Monitoring */}
              <div className="flex border-b border-gray-100 gap-1 pb-px overflow-x-auto select-none sm:scrollbar-none" id="adm-finances-subtabs">
                <button
                  type="button"
                  onClick={() => setPaymentSubTab('all')}
                  className={`px-4 py-2 border-b-2 text-xs font-extrabold whitespace-nowrap transition-colors ${
                    paymentSubTab === 'all'
                      ? 'border-red-600 text-slate-900 font-black'
                      : 'border-transparent text-gray-400 hover:text-slate-700'
                  }`}
                >
                  Histórico de Transações ({paymentLogs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentSubTab('pending')}
                  className={`px-4 py-2 border-b-2 text-xs font-extrabold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    paymentSubTab === 'pending'
                      ? 'border-red-600 text-slate-900 font-black'
                      : 'border-transparent text-gray-400 hover:text-slate-700'
                  }`}
                >
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-ping shrink-0"></span>
                  Pagamentos Pendentes ({paymentLogs.filter(l => l.status === 'pending').length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentSubTab('confirmed')}
                  className={`px-4 py-2 border-b-2 text-xs font-extrabold whitespace-nowrap transition-colors ${
                    paymentSubTab === 'confirmed'
                      ? 'border-red-600 text-slate-900 font-black'
                      : 'border-transparent text-gray-400 hover:text-slate-700'
                  }`}
                >
                  Pagamentos Confirmados ({paymentLogs.filter(l => l.status === 'approved').length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentSubTab('featured')}
                  className={`px-4 py-2 border-b-2 text-xs font-extrabold whitespace-nowrap transition-colors ${
                    paymentSubTab === 'featured'
                      ? 'border-red-600 text-slate-900 font-black'
                      : 'border-transparent text-gray-400 hover:text-slate-700'
                  }`}
                >
                  Anúncios Destacados ({listings.filter(l => l.isPremium).length})
                </button>
              </div>

              {/* List displays based on sub-tab */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto" id="adm-finances-subtabs-listings">
                {paymentSubTab === 'all' && (
                  <>
                    {paymentLogs.length === 0 ? (
                      <p className="text-xs text-gray-400 font-semibold text-center py-8">Nenhum registro de transação encontrado.</p>
                    ) : (
                      paymentLogs.map(log => (
                        <div key={log.id} className="p-3.5 bg-slate-50 border border-gray-150 rounded-xl text-xs font-semibold flex items-center justify-between text-slate-800 hover:bg-slate-100 transition-colors">
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-900 block">{log.plan}</span>
                            <span className="text-[10px] text-gray-500 block">
                              ID: <span className="font-mono text-[9px] text-gray-400">{log.id}</span> • Email: {log.userEmail}
                            </span>
                            <span className="text-[10px] text-gray-400 block">{new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="text-right space-y-1">
                            <span className="font-black text-slate-900 block text-xs">R$ {log.amount.toFixed(2).replace('.', ',')}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase inline-block ${
                              log.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {log.status === 'approved' ? 'Confirmado / Pago' : 'Aguardando PIX'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {paymentSubTab === 'pending' && (
                  <>
                    {paymentLogs.filter(l => l.status === 'pending').length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 border border-dashed border-gray-200 rounded-2xl">
                        <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2 animate-bounce" />
                        <h4 className="text-xs font-bold text-slate-800">Tudo em dia!</h4>
                        <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto">Nenhum PIX pendente aguardando webhook neste momento.</p>
                      </div>
                    ) : (
                      paymentLogs.filter(l => l.status === 'pending').map(log => (
                        <div key={log.id} className="p-3.5 bg-amber-50/40 border border-amber-150 rounded-xl text-xs font-semibold flex items-center justify-between text-slate-800">
                          <div>
                            <span className="font-black text-amber-955">{log.plan}</span>
                            <span className="text-[10px] text-slate-600 block mt-0.5">Email do comprador: {log.userEmail}</span>
                            <span className="text-[9px] text-gray-400 block mt-1">Solicitado em: {new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="text-right space-y-1.5">
                            <span className="font-black text-gray-900 block">R$ {log.amount.toFixed(2).replace('.', ',')}</span>
                            <div className="flex items-center gap-1.5 justify-end">
                              <span className="text-[8px] bg-amber-100 text-amber-850 font-black px-1.5 py-0.5 rounded uppercase">Pendente</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {paymentSubTab === 'confirmed' && (
                  <>
                    {paymentLogs.filter(l => l.status === 'approved').length === 0 ? (
                      <p className="text-xs text-gray-400 font-semibold text-center py-8">Nenhum pagamento confirmado até agora.</p>
                    ) : (
                      paymentLogs.filter(l => l.status === 'approved').map(log => (
                        <div key={log.id} className="p-3.5 bg-emerald-50/20 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center justify-between text-slate-800">
                          <div>
                            <span className="font-black text-emerald-900">{log.plan}</span>
                            <span className="text-[10px] text-slate-600 block mt-0.5">Email do usuário: {log.userEmail}</span>
                            <span className="text-[9px] text-gray-400 block mt-1">Compensado em: {new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-950 block">R$ {log.amount.toFixed(2).replace('.', ',')}</span>
                            <span className="text-[8px] bg-emerald-100 text-emerald-850 font-black px-2 py-0.5 rounded uppercase mt-1.5 inline-block animate-pulse">Confirmado</span>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {paymentSubTab === 'featured' && (
                  <>
                    {listings.filter(l => l.isPremium).length === 0 ? (
                      <p className="text-xs text-gray-400 font-semibold text-center py-8">Não há anúncios marcados como Destaque atualmente.</p>
                    ) : (
                      listings.filter(l => l.isPremium).map(listing => (
                        <div key={listing.id} className="p-3.5 bg-white border border-gray-150 rounded-xl text-xs font-semibold flex items-center gap-3 text-slate-800 hover:border-red-200 transition-colors">
                          <img
                            src={listing.imageUrl}
                            alt={listing.title}
                            className="h-10 w-10 object-cover rounded-lg shrink-0 border border-gray-100"
                          />
                          <div className="flex-1 truncate">
                            <span className="font-black text-slate-900 block truncate">{listing.title}</span>
                            <span className="text-[10px] text-gray-500 block truncate">Região: {listing.city} - {listing.region} • Anunciante: {listing.sellerName}</span>
                            {listing.externalLink && (
                              <span className="text-[9px] text-blue-600 font-bold block truncate mt-0.5">Website: {listing.externalLink}</span>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[9px] font-black bg-red-100 text-red-750 px-2 py-0.5 rounded-full uppercase block text-center animate-bounce">
                              {listing.premiumPlan === 'vip' ? '🔥 VIP Max' : '⭐ Ouro'}
                            </span>
                            <span className="text-[8px] text-gray-450 font-semibold block mt-1">{listing.views} visualizações</span>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
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

          {/* 8. DATABASE & PIX CENTRAL CONTROL INTERFACE */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 border-gray-150">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                    Banco de Dados & Integração Pix (Mercado Pago)
                  </h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    Configure, verifique e administre tabelas do banco SQL e fluxos de webhook Pix.
                  </p>
                </div>
                <button
                  onClick={fetchDatabaseStatus}
                  disabled={dbLoading}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <RefreshCw className={`h-3 w-3 ${dbLoading ? 'animate-spin' : ''}`} />
                  {dbLoading ? 'Atualizando...' : 'Recarregar Status IP'}
                </button>
              </div>

              {/* telemetry connection card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-2xl border ${
                  dbStatus?.usingMySQL 
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <Server className={`h-5 w-5 ${dbStatus?.usingMySQL ? 'text-emerald-700' : 'text-amber-600'}`} />
                    <span className="text-xs font-black uppercase">Status da Conexão</span>
                  </div>
                  <span className="block text-[10px] font-bold mt-2 font-mono break-all uppercase">
                    {dbStatus?.diagnostics?.status || 'Carregue as estatísticas...'}
                  </span>
                  {dbStatus?.diagnostics?.error && (
                    <span className="block text-[9px] font-bold text-red-700 mt-1 font-mono">
                      Erro: {dbStatus.diagnostics.error}
                    </span>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl text-slate-800">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-slate-600" />
                    <span className="text-xs font-black uppercase">Parâmetros .env</span>
                  </div>
                  <div className="mt-2 text-[10px] font-mono space-y-1">
                    <p><b className="text-slate-500">BD:</b> {dbStatus?.connectionConfig?.database || 'vivalocal'}</p>
                    <p><b className="text-slate-500">HOST:</b> {dbStatus?.connectionConfig?.host || 'localhost'}</p>
                    <p><b className="text-slate-500">USER:</b> {dbStatus?.connectionConfig?.user || 'root'}</p>
                    <p><b className="text-slate-500">SENHA:</b> {dbStatus?.connectionConfig?.passwordSet ? '****** (Definida)' : '(Vazia pelo Root)'}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl text-slate-800">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-slate-600" />
                    <span className="text-xs font-black uppercase">Esquemas Sincronizados</span>
                  </div>
                  <div className="mt-2 text-[9px] font-mono space-y-1 font-bold">
                    <p className="flex justify-between">
                      <span>USUARIOS (Tabela):</span> 
                      <span className="text-blue-700">{dbStatus?.counts?.usuarios ?? 3} registros</span>
                    </p>
                    <p className="flex justify-between">
                      <span>ANUNCIOS (Tabela):</span> 
                      <span className="text-blue-700">{dbStatus?.counts?.anuncios ?? 0} registros</span>
                    </p>
                    <p className="flex justify-between">
                      <span>PAGAMENTOS (Tabela):</span> 
                      <span className="text-blue-700">{dbStatus?.counts?.pagamentos ?? 2} registros</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Webhook live test pipeline tool */}
              <div className="p-4 border border-blue-200 bg-blue-50/20 rounded-2xl space-y-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-blue-900 uppercase">Simulador de Webhook Mercado Pago & Liberar Anúncio</h4>
                    <p className="text-[10px] text-blue-700 font-semibold mt-1 leading-relaxed">
                      Este painel simula a chegada instantânea de uma notificação Pix do Mercado Pago. O servidor recebe o ID do pagamento, valida o status no gateway e, ao retornar <b className="text-emerald-700 uppercase">"approved"</b>, executa duas consultas no MySQL:
                    </p>
                    <ul className="list-disc pl-4 text-[9px] text-blue-800 font-mono mt-1 space-y-0.5 font-bold">
                      <li>UPDATE pagamentos SET status = 'pago' WHERE mp_payment_id = ?</li>
                      <li>UPDATE anuncios SET destaque = 1, pago = 1 WHERE id = ?</li>
                    </ul>
                  </div>
                </div>

                <form onSubmit={handleTriggerWebhookSimulate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">ID do Anúncio (anuncios.id)</label>
                    <input
                      type="number"
                      required
                      value={simulatedWebhookAdId}
                      onChange={(e) => setSimulatedWebhookAdId(e.target.value)}
                      placeholder="Ex: 18"
                      className="w-full bg-white border border-gray-200 p-2 text-xs rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Valor Transferencial (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={simulatedWebhookAmount}
                      onChange={(e) => setSimulatedWebhookAmount(e.target.value)}
                      placeholder="29.90"
                      className="w-full bg-white border border-gray-200 p-2 text-xs rounded-lg font-mono font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={triggeringWebhook}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {triggeringWebhook ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processando...
                      </>
                    ) : (
                      'Simular Confirmação Webhook'
                    )}
                  </button>
                </form>

                {webhookResult && (
                  <div className={`p-3 rounded-xl border text-xs leading-relaxed font-semibold font-sans ${
                    webhookResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {webhookResult.success ? (
                      <div className="space-y-1.5">
                        <span className="font-extrabold block text-emerald-950 uppercase text-[10px] tracking-wider">🎉 Transação Processada com Sucesso!</span>
                        <p className="text-[11px] leading-relaxed font-medium">{webhookResult.message}</p>
                        <span className="text-[9px] font-bold font-mono text-emerald-600 block mt-1">ID PAGAMENTO MP: {webhookResult.paymentId}</span>
                      </div>
                    ) : (
                      <span>Ocorreu um erro no simulador: {webhookResult.error}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Direct query console editor terminal */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-950 space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-slate-400 uppercase flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></span>
                    Terminal de Consulta SQL do Administrador
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">SQLITE & MYSQL-PROMISE CLIENT</span>
                </div>

                <form onSubmit={handleExecuteSql} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 block uppercase">Comando de Banco (SQL Statement)</label>
                    <textarea
                      rows={2}
                      value={sqlCommand}
                      onChange={(e) => setSqlCommand(e.target.value)}
                      placeholder="SELECT * FROM usuarios LIMIT 5"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-lg text-xs font-mono outline-none focus:border-red-500 font-bold leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSqlCommand('SELECT * FROM pagamentos')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] px-2.5 py-1.5 rounded-lg cursor-pointer transition"
                    >
                      Estatísticas de Pagamentos
                    </button>
                    <button
                      type="button"
                      onClick={() => setSqlCommand('SELECT * FROM anuncios')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] px-2.5 py-1.5 rounded-lg cursor-pointer transition"
                    >
                      Diagnosticar Classificados
                    </button>
                    <button
                      type="button"
                      onClick={() => setSqlCommand('SELECT * FROM usuarios')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] px-2.5 py-1.5 rounded-lg cursor-pointer transition"
                    >
                      Contas Cadastradas
                    </button>

                    <button
                      type="submit"
                      disabled={executingSql}
                      className="ml-auto bg-red-650 hover:bg-red-600 text-white text-[10px] uppercase font-black px-4.5 py-1.5 rounded-lg transition cursor-pointer cursor-pointer"
                    >
                      {executingSql ? 'Consultando...' : 'Executar Query SQL'}
                    </button>
                  </div>
                </form>

                {sqlResult && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] space-y-2 overflow-x-auto max-h-[220px]">
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span>Executado via: {sqlResult.liveMySQL ? 'MYSQL SERVIDOR' : 'SIMULADOR DE BASE'}</span>
                      <span>{Array.isArray(sqlResult.rows) ? sqlResult.rows.length : 1} registros retornados</span>
                    </div>

                    {sqlResult.error ? (
                      <span className="text-red-400 font-black">Falha: {sqlResult.error}</span>
                    ) : (
                      <pre className="text-emerald-400 font-mono font-medium leading-relaxed leading-5">
                        {JSON.stringify(sqlResult.rows, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
