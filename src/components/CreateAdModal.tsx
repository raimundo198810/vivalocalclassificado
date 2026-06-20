import React, { useState, useEffect } from 'react';
import { X, Check, MapPin, AlertCircle, Sparkles, Image as ImageIcon, CreditCard, QrCode, Flame, ShieldCheck, Loader2 } from 'lucide-react';
import { CATEGORIES, BRAZIL_REGIONS } from '../data/seedData';
import { Listing, CategoryId } from '../types';

interface CreateAdModalProps {
  onClose: () => void;
  onSubmit: (listing: Omit<Listing, 'id' | 'views' | 'createdAt'>) => void;
}

// Preset visual themes based on chosen category to prevent empty images
const STOCK_PHOTOS: Record<CategoryId, { url: string; label: string }[]> = {
  'compra-venda': [
    { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', label: 'Celular / Gadget' },
    { url: 'https://images.unsplash.com/photo-1496181130204-7552aa1554da?w=600&auto=format&fit=crop&q=80', label: 'Computador / Notebook' },
    { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&auto=format&fit=crop&q=80', label: 'Sofá / Decoração' },
    { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80', label: 'Roupas / Moda' },
  ],
  imoveis: [
    { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80', label: 'Apartamento Interno' },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80', label: 'Casa Moderna' },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80', label: 'Varanda / Quintal' },
  ],
  servicos: [
    { url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&auto=format&fit=crop&q=80', label: 'Massagem / Bem-Estar' },
    { url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80', label: 'Pintura / Obras' },
    { url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80', label: 'Limpeza / Diarista' },
  ],
  empregos: [
    { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80', label: 'Vendas / Escritório' },
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80', label: 'Tecnologia / Suporte' },
  ],
  veiculos: [
    { url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600&auto=format&fit=crop&q=80', label: 'Carro Prata' },
    { url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80', label: 'Moto Esportiva' },
    { url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80', label: 'Lancha / Náutica' },
  ],
  comunidade: [
    { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80', label: 'Cão Golden Retriever' },
    { url: 'https://images.unsplash.com/photo-1513360309081-36f5e878fc11?w=600&auto=format&fit=crop&q=80', label: 'Gato Brincalhão' },
    { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80', label: 'Evento / Encontro' },
  ],
  adulto: [
    { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', label: 'Flores & Encontros' },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80', label: 'Massagem & Velas' },
    { url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80', label: 'Coquetel & Noite' },
    { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80', label: 'Moda Intíma' },
  ],
};

export default function CreateAdModal({ onClose, onSubmit }: CreateAdModalProps) {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields State
  const [category, setCategory] = useState<CategoryId>('compra-venda');
  const [subCategory, setSubCategory] = useState('');
  const [region, setRegion] = useState('SP');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  
  const [title, setTitle] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [description, setDescription] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [customImage, setCustomImage] = useState(false);
  
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  // States for Paid/Premium Ad Payment Simulation
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'confirmed'>('idle');
  const [cardNumber, setCardNumber] = useState('4532 7182 9301 2475');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('11/30');
  const [cardCvv, setCardCvv] = useState('738');
  const [pixKeyCopied, setPixKeyCopied] = useState(false);

  // Auto-set subcategory when category shifts
  useEffect(() => {
    const defaultSub = CATEGORIES.find((c) => c.id === category)?.subCategories[0] || '';
    setSubCategory(defaultSub);
    // Set default stock photo matching selected category
    if (!customImage) {
      setImageUrl(STOCK_PHOTOS[category]?.[0]?.url || '');
    }
  }, [category, customImage]);

  // Handle region shifts
  useEffect(() => {
    const list = BRAZIL_REGIONS.find((r) => r.id === region)?.cities || [];
    setCity(list[0] || '');
  }, [region]);

  const validateStep = (currentStep: number) => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!category) return 'Por favor, selecione uma categoria.';
      if (!subCategory) return 'Por favor, selecione uma subcategoria.';
      if (!region) return 'Por favor, selecione um estado.';
      if (!city) return 'Por favor, selecione uma cidade.';
      if (!neighborhood.trim()) return 'Por favor, informe o bairro.';
    }
    if (currentStep === 2) {
      if (title.trim().length < 10) return 'O título do anúncio deve ter pelo menos 10 caracteres.';
      if (!isNegotiable && (!priceInput.trim() || isNaN(Number(priceInput)) || Number(priceInput) <= 0)) {
        return 'Por favor, digite um preço válido superior a zero ou marque "A Combinar".';
      }
      if (description.trim().length < 20) return 'A descrição detalhada deve conter pelo menos 20 caracteres.';
    }
    if (currentStep === 3) {
      if (!imageUrl.trim()) return 'Selecione uma foto modelo ou forneça um link correspondente.';
      if (!sellerName.trim()) return 'Insira o nome do vendedor.';
      if (!sellerPhone.trim() || sellerPhone.replace(/\D/g, '').length < 10) {
        return 'Forneça um telefone para contato com DDD válido (Ex: 11 98888-8888).';
      }
      if (!sellerEmail.trim() || !sellerEmail.includes('@')) {
        return 'Insira um e-mail para contato eletrônico válido.';
      }
    }
    return '';
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      setErrorMessage(err);
      return;
    }
    if (step === 3 && isPremium) {
      setStep(4);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMessage('');
    if (step === 4) {
      setPaymentStatus('idle');
    }
    setStep((prev) => prev - 1);
  };

  const handleSimulatePayment = () => {
    setErrorMessage('');
    if (paymentMethod === 'card' && !cardHolder.trim()) {
      setErrorMessage('Por favor, insira o nome completo do titular do cartão.');
      return;
    }
    
    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('confirmed');
      setTimeout(() => {
        onSubmit({
          title,
          description,
          price: isNegotiable ? null : Number(priceInput),
          category,
          subCategory,
          region,
          city,
          neighborhood: neighborhood.trim(),
          imageUrl,
          sellerName,
          sellerPhone,
          sellerEmail,
          isPremium: true,
        });
      }, 1500);
    }, 1800);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const err = validateStep(3);
    if (err) {
      setErrorMessage(err);
      return;
    }

    if (isPremium && step < 4) {
      setStep(4);
      return;
    }

    onSubmit({
      title,
      description,
      price: isNegotiable ? null : Number(priceInput),
      category,
      subCategory,
      region,
      city,
      neighborhood: neighborhood.trim(),
      imageUrl,
      sellerName,
      sellerPhone,
      sellerEmail,
      isPremium,
    });
  };

  const subCategories = CATEGORIES.find((c) => c.id === category)?.subCategories || [];
  const cities = BRAZIL_REGIONS.find((r) => r.id === region)?.cities || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-scaleUp" id="create-ad-modal">
        {/* Header bar */}
        <div className="sticky top-0 bg-white border-b border-gray-100 py-4.5 px-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 text-red-600" />
              Publicar Anúncio Gratuito
            </h2>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Sem comissões, negociação direta e rápida!</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Custom Stepper Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-100 py-3 px-6 flex items-center justify-between text-xs text-slate-500 font-bold select-none">
          <div className="flex items-center gap-1.5">
            <span className={`h-5 w-5 flex items-center justify-center rounded-full text-[10px] ${
              step >= 1 ? 'bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 1 ? <Check className="h-3 w-3" /> : '1'}
            </span>
            <span className={step === 1 ? 'text-slate-800' : 'text-slate-400'}>Localização & Categoria</span>
          </div>
          <span className="text-gray-300">&rsaquo;</span>
          <div className="flex items-center gap-1.5">
            <span className={`h-5 w-5 flex items-center justify-center rounded-full text-[10px] ${
              step >= 2 ? 'bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 2 ? <Check className="h-3 w-3" /> : '2'}
            </span>
            <span className={step === 2 ? 'text-slate-800' : 'text-slate-400'}>Detalhes & Preço</span>
          </div>
          <span className="text-gray-300">&rsaquo;</span>
          <div className="flex items-center gap-1.5">
            <span className={`h-5 w-5 flex items-center justify-center rounded-full text-[10px] ${
              step >= 3 ? 'bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 3 ? <Check className="h-3 w-3" /> : '3'}
            </span>
            <span className={step === 3 ? 'text-slate-800' : 'text-slate-400'}>Contato & Imagem</span>
          </div>
          {isPremium && (
            <>
              <span className="text-gray-300">&rsaquo;</span>
              <div className="flex items-center gap-1.5">
                <span className={`h-5 w-5 flex items-center justify-center rounded-full text-[10px] ${
                  step >= 4 ? 'bg-amber-600 text-white shadow' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > 4 ? <Check className="h-3 w-3" /> : '4'}
                </span>
                <span className={step === 4 ? 'text-amber-600 font-extrabold animate-pulse' : 'text-slate-400'}>Aprovação</span>
              </div>
            </>
          )}
        </div>

        {/* Modal Form body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex-1 space-y-5">
          {errorMessage && (
            <div className="bg-red-50 border border-red-100 text-red-800 text-xs font-semibold p-3 rounded-xl flex items-start gap-2 animate-shake animate-duration-350">
              <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: CATEGORY & REGION SELECTOR */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category dropdown check */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Categoria Principal
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-red-500 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory dropdown check */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Subcategoria
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-red-500 cursor-pointer"
                  >
                    {subCategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Selectors */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-red-600" />
                  Onde está localizado seu item ou serviço?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* State Select */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Estado
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-red-500 cursor-pointer"
                    >
                      {BRAZIL_REGIONS.map((reg) => (
                        <option key={reg.id} value={reg.id}>
                          {reg.name} ({reg.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Select */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Cidade
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-red-500 cursor-pointer"
                    >
                      {cities.map((ct) => (
                        <option key={ct} value={ct}>
                          {ct}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Neighborhood manual text */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex: Centro, Savassi, Copacabana"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS & PRICING */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Título do Anúncio
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Apartamento mobiliado 2 quartos próximo metrô"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-red-500 transition-all"
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                  Crie um título claro e atrativo. Mínimo de 10 caracteres. (Atual: {title.length})
                </span>
              </div>

              {/* Price Entry & Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Preço (R$)
                  </label>
                  <input
                    type="text"
                    disabled={isNegotiable}
                    value={priceInput}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '');
                      setPriceInput(cleaned);
                    }}
                    placeholder="Ex: 1500"
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-gray-700 outline-none focus:border-red-500 transition-all disabled:bg-gray-150 disabled:text-gray-400"
                  />
                </div>

                <div className="py-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-4.5 w-4.5 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">Preço a combinar</span>
                      <span className="text-[10px] text-gray-400 font-semibold">Preço negociável com comprador</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description box */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Descrição Detalhada do seu Produto/Serviço
                </label>
                <textarea
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva detalhes importantes como estado de conservação, acessórios, diferenciais do imóvel ou competências profissionais..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-red-500 transition-all resize-none h-32"
                />
                <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                  Forneça informações completas para evitar perguntas repetitivas. Mínimo 20 caracteres. (Atual: {description.length})
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT INFORMATION & GALLERY TARGETS */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Photo setup selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Foto Ilustrativa do Anúncio (Obrigatória)
                </label>

                {/* Stock theme list choice */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="h-4.5 w-4.5 text-red-600" />
                      Escolha uma Foto de Alta Qualidade
                    </span>
                    <button
                      type="button"
                      onClick={() => setCustomImage(!customImage)}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      {customImage ? 'Usar Modelo Ilustrativo' : 'Fornecer Link de Foto do Web'}
                    </button>
                  </div>

                  {customImage ? (
                    <div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Insira o link da imagem (https://...)"
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:border-red-500 outline-none"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block font-semibold">Certifique-se de que o link esteja público e carregue diretamente.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {STOCK_PHOTOS[category]?.map((photo) => {
                        const isSelected = imageUrl === photo.url;
                        return (
                          <div
                            key={photo.url}
                            type="button"
                            onClick={() => setImageUrl(photo.url)}
                            className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all cursor-pointer ${
                              isSelected ? 'border-red-600 scale-[1.03] shadow' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={photo.url} referrerPolicy="no-referrer" alt={photo.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 pt-0.5 pb-1 text-[8px] text-center text-white font-bold leading-tight truncate">
                              {photo.label}
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5">
                                <Check className="h-2 w-2" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Seller details fields */}
              <div className="border-t border-gray-100 pt-4 space-y-3.5">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Suas Informações para Contato de Compradores
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Seller Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="Ex: Gustavo Lima"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-red-500 transition-all"
                    />
                  </div>

                  {/* Seller Phone/WhatsApp */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Telefone com DDD (WhatsApp)
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerPhone}
                      onChange={(e) => {
                        // Apply quick phone masking in Brazilian style (XX) XXXXX-XXXX
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length > 11) v = v.substring(0, 11);
                        if (v.length > 6) {
                          v = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
                        } else if (v.length > 2) {
                          v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
                        } else if (v.length > 0) {
                          v = `(${v}`;
                        }
                        setSellerPhone(v);
                      }}
                      placeholder="Ex: (11) 98888-8888"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                {/* Seller email */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Seu endereço de E-mail (Privado para envio de mensagens)
                  </label>
                  <input
                    type="email"
                    required
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    placeholder="Ex: gustavo.lima@exemplo.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-red-500 transition-all"
                  />
                </div>

                {/* Optional toggle to make listing Premium right away */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between mt-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-600 animate-spin" />
                      Tornar Destaque Premium (Apenas R$ 29,90)
                    </span>
                    <span className="text-[10px] text-amber-800 font-semibold leading-normal">Seu anúncio no topo de todas as buscas, com selo de verificação dourado e 10x mais visitas!</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 h-5 w-5 transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT SIMULATION & AUTO CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Você escolheu Destaque Premium!</h4>
                  <p className="text-[11px] text-slate-600 font-semibold leading-relaxed mt-0.5 animate-pulse">
                    Para confirmar a publicação do seu anúncio no topo do feed do <strong className="text-slate-800">vivaLocal</strong>, efetue o pagamento simulado abaixo de <strong className="text-amber-700 font-extrabold text-xs">R$ 29,90</strong>. A liberação ocorrerá instantaneamente.
                  </p>
                </div>
              </div>

              {paymentStatus === 'idle' ? (
                <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm bg-white">
                  {/* Selector tabs */}
                  <div className="grid grid-cols-2 bg-slate-50 border-b border-gray-100 text-xs font-bold text-gray-500 select-none">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`py-3.5 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                        paymentMethod === 'pix'
                          ? 'border-red-600 text-slate-800 bg-white shadow-sm'
                          : 'border-transparent hover:text-slate-850 hover:bg-white/50'
                      }`}
                    >
                      <QrCode className="h-4.5 w-4.5 text-red-600" />
                      Pagar via PIX (Automático)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-3.5 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-red-600 text-slate-800 bg-white shadow-sm'
                          : 'border-transparent hover:text-slate-850 hover:bg-white/50'
                      }`}
                    >
                      <CreditCard className="h-4.5 w-4.5 text-red-600" />
                      Cartão de Crédito
                    </button>
                  </div>

                  <div className="p-5 sm:p-6">
                    {paymentMethod === 'pix' ? (
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Simulated QR Code */}
                        <div className="bg-slate-50 border border-gray-150 p-2.5 rounded-2xl flex flex-col items-center">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=raimundomoreira1988@gmail.com"
                            alt="QRCode PIX vivalocal"
                            className="h-[130px] w-[130px] object-contain border border-gray-100 rounded-lg"
                          />
                          <span className="text-[9px] text-gray-500 font-black mt-1.5 uppercase tracking-wider">Pix Destaque R$ 29,90</span>
                        </div>

                        <div className="flex-1 space-y-3.5 w-full text-left">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Instruções de Pagamento</span>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-0.5">
                              Abra seu aplicativo de banco, vá na área Pix e selecione a opção de pagar por <strong className="text-red-600">E-mail</strong> ou escaneie o código QR ao lado com o valor de <strong className="text-emerald-600 font-extrabold text-xs">R$ 29,90</strong>.
                            </p>
                          </div>

                          <div className="bg-slate-50 border border-gray-150 rounded-xl p-2.5 flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-800 truncate select-all flex-1">
                              raimundomoreira1988@gmail.com
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('raimundomoreira1988@gmail.com');
                                setPixKeyCopied(true);
                                setTimeout(() => setPixKeyCopied(false), 2000);
                              }}
                              className="bg-slate-950 text-white hover:bg-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-colors"
                            >
                              {pixKeyCopied ? 'Copiado!' : 'Copiar E-mail'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nome do Titular (conforme cartão)</label>
                          <input
                            type="text"
                            required
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            placeholder="JOÃO M S SILVA"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-red-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Número do Cartão</label>
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4532 7182 9301 2475"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-red-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Validade</label>
                              <input
                                type="text"
                                required
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="MM/AA"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-center text-slate-800 outline-none focus:bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">CVV</label>
                              <input
                                type="password"
                                required
                                maxLength={4}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                placeholder="123"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-center text-slate-800 outline-none focus:bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : paymentStatus === 'processing' ? (
                <div className="border border-amber-100 bg-amber-50/50 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-inner">
                  <div className="relative flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-amber-600 animate-spin shrink-0 animate-duration-[1600ms]" />
                    <Sparkles className="h-4 w-4 text-amber-500 absolute animate-pulse shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Processando Pix / Transação...</h4>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1">Sincronizando de forma segura com o Banco Central para compensação.</p>
                  </div>
                  <div className="text-[9px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-black uppercase">Simulação de Segurança Ativa</div>
                </div>
              ) : (
                <div className="border border-emerald-150 bg-emerald-50/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-inner">
                  <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md animate-scaleUp">
                    <Check className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-emerald-800">Pagamento Confirmado com Sucesso!</h4>
                    <p className="text-xs font-semibold text-slate-600 mt-1">O gateway confirmou a transferência de R$ 29,90. Carregando classificado de destaque...</p>
                  </div>
                  <div className="text-[9px] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-black uppercase tracking-wider">Publicado & Confirmado Automaticamente</div>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Modal buttons footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 py-4 px-6 flex items-center justify-between z-10 select-none">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              disabled={paymentStatus !== 'idle'}
              type="button"
              className="bg-gray-150 hover:bg-gray-200 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              type="button"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              Continuar
            </button>
          ) : step === 3 ? (
            <button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-extrabold px-7 py-2.5 rounded-full shadow-md transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              {isPremium ? 'Ir para Pagamento (R$ 29,90)' : 'Finalizar & Publicar Anúncio'}
            </button>
          ) : (
            <button
              onClick={handleSimulatePayment}
              disabled={paymentStatus !== 'idle'}
              className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-extrabold px-7 py-2.5 rounded-full shadow-md transition-all cursor-pointer transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentStatus === 'idle'
                ? `Pagar e Ativar Anúncio Premium Automaticamente`
                : paymentStatus === 'processing'
                ? 'Confirmando Pagamento...'
                : 'Confirmado com Sucesso!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
