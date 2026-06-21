import React, { useState, useEffect } from 'react';
import { 
  Trash2, ShieldCheck, Eye, PlusCircle, ClipboardList, TrendingUp, Edit2, 
  RefreshCcw, MessageSquare, CreditCard, ChevronRight, BarChart2, Star, Check 
} from 'lucide-react';
import { Listing, MessageChat, PaymentLog } from '../types';

interface AdvertiserDashboardProps {
  myListings: Listing[];
  onDeleteListing: (id: string) => void;
  onEditListing: (listing: Listing) => void;
  onUpgradeToPremium: (id: string) => void; // points to triggering payment flow
  onSelectListing: (listing: Listing) => void;
  onAnnounceClick: () => void;
  triggerNotification: (type: 'success' | 'info', text: string) => void;
  chats: MessageChat[];
  onSendMessageInChat: (chatId: string, text: string, sender: 'buyer' | 'seller') => void;
  paymentLogs: PaymentLog[];
}

export default function AdvertiserDashboard({
  myListings,
  onDeleteListing,
  onEditListing,
  onUpgradeToPremium,
  onSelectListing,
  onAnnounceClick,
  triggerNotification,
  chats,
  onSendMessageInChat,
  paymentLogs,
}: AdvertiserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'my-ads' | 'stats' | 'messages' | 'payments'>('my-ads');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const formatPrice = (price: number | null) => {
    if (price === null) return 'A combinar';
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleRenewAd = (id: string, title: string) => {
    triggerNotification('success', `Anúncio "${title.substring(0, 20)}..." renovado com sucesso por mais 30 dias de audiência!`);
  };

  const handleSendReply = (chatId: string) => {
    if (!replyText.trim()) return;
    onSendMessageInChat(chatId, replyText, 'seller');
    setReplyText('');
    triggerNotification('success', 'Mensagem enviada com sucesso ao interessado!');
  };

  const selectedChat = chats.find(c => c.id === selectedChatId);

  // Compute stats
  const totalViews = myListings.reduce((acc, curr) => acc + curr.views, 0);
  const premiumCount = myListings.filter(l => l.isPremium).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans animate-fadeIn" id="advertiser-full-dashboard">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-150 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-6.5 w-6.5 text-red-600" />
            Painel do Anunciante
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            Gerencie seus anúncios publicados, responda compradores, acompanhe faturas Pix e estatísticas de audiência.
          </p>
        </div>
        <button
          onClick={onAnnounceClick}
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 shadow"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Criar Novo Anúncio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white border border-gray-150 rounded-2xl p-3 space-y-1">
          <button
            onClick={() => setActiveTab('my-ads')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'my-ads'
                ? 'bg-red-50 text-red-700 font-extrabold'
                : 'text-slate-650 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5" />
              Meus Anúncios
            </span>
            <span className="bg-gray-100 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-black">
              {myListings.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('messages');
              if (chats.length > 0) setSelectedChatId(chats[0].id);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'messages'
                ? 'bg-red-50 text-red-700 font-extrabold'
                : 'text-slate-650 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5" />
              Mensagens / Chat
            </span>
            {chats.length > 0 && (
              <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">
                {chats.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'stats' ? 'bg-red-50 text-red-700 font-extrabold' : 'text-slate-650 hover:bg-gray-50'
            }`}
          >
            <BarChart2 className="h-4.5 w-4.5" />
            Estatísticas de Cuidado
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'payments' ? 'bg-red-50 text-red-700 font-extrabold' : 'text-slate-650 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5" />
              Histórico de Faturas Pix
            </span>
            <span className="bg-gray-100 text-slate-805 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {paymentLogs.length}
            </span>
          </button>
        </div>

        {/* Content Section */}
        <div className="md:col-span-3">
          
          {/* TAB 1: MEUS ANÚNCIOS */}
          {activeTab === 'my-ads' && (
            <div className="space-y-4">
              {myListings.length === 0 ? (
                <div className="text-center bg-white p-12 border border-gray-150 rounded-2xl space-y-4">
                  <ClipboardList className="h-10 w-10 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500 font-semibold">Nenhum anúncio publicado neste navegador.</p>
                  <button onClick={onAnnounceClick} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl">Anunciar Grátis</button>
                </div>
              ) : (
                myListings.map(ad => (
                  <div key={ad.id} className={`bg-white border rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all shadow-sm ${
                    ad.isPremium ? 'border-amber-300 bg-amber-50/5' : 'border-gray-150 hover:border-gray-200'
                  }`}>
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="h-16 w-16 rounded-xl object-cover border shrink-0 cursor-pointer"
                      onClick={() => onSelectListing(ad)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 onClick={() => onSelectListing(ad)} className="font-extrabold text-slate-805 hover:text-red-650 transition cursor-pointer text-sm md:text-base leading-snug truncate">
                        {ad.title}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-0.5 mt-1 text-xs text-gray-400 font-semibold">
                        <span className="text-emerald-700 font-extrabold">{formatPrice(ad.price)}</span>
                        <span>•</span>
                        <span>{ad.city}, {ad.region}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {ad.views} visitas</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      {ad.isPremium ? (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black uppercase px-2 py-1 rounded-lg flex items-center gap-0.5">
                          <ShieldCheck className="h-3.5 w-3.5" /> Premium VIP
                        </span>
                      ) : (
                        <button
                          onClick={() => onUpgradeToPremium(ad.id)}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-0.5"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" /> Destacar
                        </button>
                      )}

                      <button
                        onClick={() => handleRenewAd(ad.id, ad.title)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg"
                        title="Renovar por mais 30 dias"
                      >
                        <RefreshCcw className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onEditListing(ad)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg"
                        title="Editar Anúncio"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteListing(ad.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-red-600 p-2 rounded-lg"
                        title="Excluir Anúncio"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ESTATÍSTICAS */}
          {activeTab === 'stats' && (
            <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-6">
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
                <BarChart2 className="h-5 w-5 text-red-600" />
                Desempenho Geral de Cliques
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase">Visitas Únicas</span>
                  <span className="block text-xl font-black text-slate-900">{totalViews}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase font-bold">Taxa de Cliques</span>
                  <span className="block text-xl font-black text-rose-700">{totalViews > 0 ? (totalViews * 1.4).toFixed(0) : 0}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Anúncios Destacados</span>
                  <span className="block text-xl font-black text-amber-600">{premiumCount} / {myListings.length}</span>
                </div>
              </div>

              {/* Graphic simulated bars */}
              <div className="space-y-3.5 pt-2">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Cliques por Anúncio</h4>
                <div className="space-y-2.5">
                  {myListings.map(ad => {
                    const percent = Math.min(100, Math.max(10, (ad.views / 400) * 100));
                    return (
                      <div key={ad.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span className="truncate max-w-[200px]">{ad.title}</span>
                          <span>{ad.views} Cliques</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${ad.isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-red-500'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHAT / MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
              {/* Chat Sidebar list */}
              <div className="border-r border-gray-150 p-4 space-y-3 bg-slate-50">
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Interessados</h3>
                {chats.length === 0 ? (
                  <p className="text-xs text-gray-400 font-semibold py-6 text-center">Nenhuma mensagem recebida ainda.</p>
                ) : (
                  <div className="space-y-1.5">
                    {chats.map(chat => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs transition border ${
                          selectedChatId === chat.id
                            ? 'bg-white border-red-200 shadow-sm ring-1 ring-red-500'
                            : 'border-transparent hover:bg-white'
                        }`}
                      >
                        <span className="font-bold text-slate-900 block truncate">{chat.buyerName}</span>
                        <span className="text-[10px] text-gray-400 block truncate mt-0.5">{chat.listingTitle}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Dialogue box */}
              <div className="md:col-span-2 p-4 flex flex-col justify-between bg-white h-full">
                {selectedChat ? (
                  <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                    {/* Header info */}
                    <div className="border-b border-gray-100 pb-2">
                      <span className="text-[9px] text-gray-400 font-bold uppercase block">Referente ao Anúncio</span>
                      <span className="text-xs font-black text-slate-900">{selectedChat.listingTitle}</span>
                    </div>

                    {/* Messages scroll */}
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] p-2 bg-slate-50/50 rounded-xl border border-dashed border-gray-100">
                      {selectedChat.messages.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'seller' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-2xl max-w-[80%] text-xs font-semibold leading-relaxed ${
                            m.sender === 'seller'
                              ? 'bg-slate-900 text-white rounded-tr-none'
                              : 'bg-gray-100 text-slate-800 rounded-tl-none'
                          }`}>
                            <p>{m.text}</p>
                            <span className="text-[8px] text-gray-405 opacity-60 block mt-1 text-right">
                              {new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer text field send */}
                    <div className="flex gap-2.5 items-center">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(selectedChat.id);
                        }}
                        placeholder="Digite sua resposta segura para o interessado..."
                        className="flex-1 bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:bg-white focus:border-red-500"
                      />
                      <button
                        onClick={() => handleSendReply(selectedChat.id)}
                        className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-12 text-center text-xs text-gray-400 font-semibold h-full">
                    Aguardando seleção de conversa para iniciar chat seguro.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HISTÓRICO DE PAGAMENTO */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
                Faturas Processadas por Pix
              </h3>
              
              {paymentLogs.length === 0 ? (
                <p className="text-xs text-gray-400 font-semibold py-8 text-center">Nenhum pagamento registrado neste histórico.</p>
              ) : (
                <div className="space-y-2.5">
                  {paymentLogs.map(log => (
                    <div key={log.id} className="bg-slate-50 border border-gray-100 p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-800 font-black block">{log.plan}</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">ID: {log.id} • {new Date(log.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm block">R$ {log.amount.toFixed(2).replace('.', ',')}</span>
                        <span className="text-[9px] text-emerald-700 font-black flex items-center justify-end gap-0.5 mt-0.5">
                          <Check className="h-3 w-3" /> Pix Compensado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
