import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Eye, Phone, Mail, Send, CheckCircle2, ShieldAlert, Heart } from 'lucide-react';
import { Listing } from '../types';
import { CATEGORIES } from '../data/seedData';

interface ListingDetailProps {
  listing: Listing;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ListingDetail({
  listing,
  onBack,
  isFavorite,
  onToggleFavorite,
}: ListingDetailProps) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Olá, ${listing.sellerName}! Vi o seu anúncio "${listing.title}" no Vivalocal Classificados e gostaria de ter mais informações. Está disponível?`,
  });

  const currentCat = CATEGORIES.find((cat) => cat.id === listing.category);

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Preço a combinar / consultar';
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Recentemente';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate API delivery
    setTimeout(() => {
      setFormSubmitted(true);
    }, 450);
  };

  // Precomposed WhatsApp link
  const getWhatsAppLink = () => {
    const rawNumber = listing.sellerPhone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Olá! Vi o seu anúncio "${listing.title}" de R$ ${listing.price || 'a combinar'} no Vivalocal Classificados e tenho interesse.`
    );
    return `https://wa.me/55${rawNumber}?text=${text}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 animate-fadeIn" id="listing-detail">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors cursor-pointer mb-6"
        id="btn-back-to-list"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a lista de anúncios
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Image & Listing Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Detailed Large Image display container */}
            <div className="relative h-[25rem] sm:h-[30rem] bg-slate-900 flex items-center justify-center">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={onToggleFavorite}
                  className={`p-2.5 rounded-full shadow-lg transition-transform cursor-pointer scale-100 hover:scale-105 active:scale-95 ${
                    isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
                  }`}
                  title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {listing.isPremium && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 font-extrabold text-xs text-white uppercase px-3 py-1.5 rounded-md shadow-md">
                  ★ Anúncio Destaque
                </div>
              )}
            </div>

            {/* Title, Category metadata block */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  currentCat?.color || 'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {currentCat?.name} &rsaquo; {listing.subCategory}
                </span>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Postado {formatDate(listing.createdAt)}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    <span>{listing.views} visualizações</span>
                  </div>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                {listing.title}
              </h1>

              {/* Price Tag */}
              <div className="py-4 border-y border-gray-100 flex items-center justify-between" id="detail-price-box">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preço</span>
                <span className={`text-2xl sm:text-3xl font-black ${
                  listing.price === null ? 'text-slate-500 text-lg font-semibold' : 'text-emerald-600'
                }`}>
                  {formatPrice(listing.price)}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-3.5 pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Descrição Completa
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Location Card */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-3 mt-6">
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Localização</h4>
                  <p className="text-sm font-semibold text-gray-800">
                    {listing.city} {listing.neighborhood ? `(${listing.neighborhood})` : ''} - {listing.region}, Brasil
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Seller Card & Email Messenger Form */}
        <div className="space-y-6">
          {/* Seller Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5" id="seller-card">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-gray-100 pb-3">
              Informações do Anunciante
            </h3>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-black text-lg flex items-center justify-center shadow-inner">
                {listing.sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{listing.sellerName}</h4>
                <p className="text-xs text-gray-400 font-medium">Anunciante verificado</p>
              </div>
            </div>

            {/* Click to reveal phone scraper blocker */}
            <div className="space-y-2 pt-2">
              {phoneRevealed ? (
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${listing.sellerPhone.replace(/\D/g, '')}`}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Phone className="h-4 w-4 text-slate-600 shrink-0" />
                    <span>{listing.sellerPhone}</span>
                  </a>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Falar no WhatsApp</span>
                  </a>
                </div>
              ) : (
                <button
                  onClick={() => setPhoneRevealed(true)}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  id="btn-reveal-contact"
                >
                  <Phone className="h-4 w-4 shrink-0 animate-bounce" />
                  <span>Ver Telefone & WhatsApp</span>
                </button>
              )}
            </div>
          </div>

          {/* Contact Seller Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm" id="detail-contact-form-box">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-gray-100 pb-3 mb-4">
              Enviar Mensagem por E-mail
            </h3>

            {formSubmitted ? (
              <div className="text-center py-6 px-2 space-y-3 animate-fadeIn">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-800">Mensagem Enviada!</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  O anunciante foi notificado por e-mail e deve entrar em contato com você em breve.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData(prev => ({ ...prev, name: '', email: '', phone: '' }));
                  }}
                  className="text-xs text-red-600 hover:underline font-bold pt-2 cursor-pointer"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:border-red-500 outline-none transition-all text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Seu E-mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Ex: joao@exemplo.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:border-red-500 outline-none transition-all text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Seu Telefone (Opcional)</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Ex: (11) 98888-8888"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:border-red-500 outline-none transition-all text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mensagem</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:border-red-500 outline-none transition-all text-gray-700 resize-none h-28"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Enviar E-mail de Contato</span>
                </button>
              </form>
            )}
          </div>

          {/* Safety warnings block */}
          <div className="bg-yellow-50/50 border border-yellow-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <ShieldAlert className="h-5 w-5 shrink-0 text-yellow-600" />
              <span className="font-bold text-xs uppercase tracking-wider">Dicas de Segurança</span>
            </div>
            <ul className="list-disc pl-4 text-[10px] text-yellow-700 space-y-1.5 font-medium">
              <li>Negocie sempre pessoalmente num local público iluminado (como shoppings ou supermercados).</li>
              <li>Não envie depósitos, PIX adiantados de reservas ou pagamentos prévios pelo correio.</li>
              <li>Desconfie de ofertas excessivamente tentadoras ou anúncios excessivamente baratos.</li>
              <li>Verifique o estado elétrico e mecânico de qualquer veículo ou eletrônico antes de formalizar a compra.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
