import React, { useState, useEffect } from 'react';
import { X, Check, MapPin, AlertCircle, Sparkles, Image as ImageIcon, CreditCard, QrCode, Flame, ShieldCheck, Loader2, Upload, PlayCircle, Globe } from 'lucide-react';
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
  eletronicos: [
    { url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80', label: 'Smart TV / Tela' },
    { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', label: 'Eletroportáteis' },
    { url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80', label: 'Câmera Fotográfica' },
  ],
  'moda-beleza': [
    { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80', label: 'Cosméticos / Beleza' },
    { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80', label: 'Acessórios & Coleções' },
    { url: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&auto=format&fit=crop&q=80', label: 'Calçados / Tênis' },
  ],
  musica: [
    { url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80', label: 'Guitarras & Violões' },
    { url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80', label: 'Pianos / Teclados' },
    { url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop&q=80', label: 'Instrumentos de Percussão' },
  ],
  'agro-industria': [
    { url: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?w=600&auto=format&fit=crop&q=80', label: 'Tratores & Fazenda' },
    { url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80', label: 'Animais de Campo' },
    { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80', label: 'Equipamento de Carga' },
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
  const [imageSource, setImageSource] = useState<'stock' | 'url' | 'upload'>('stock');
  const [isDragging, setIsDragging] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [listingImages, setListingImages] = useState<string[]>([]);
  
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState<'gold' | 'platinum'>('platinum');
  const [customPaymentLink, setCustomPaymentLink] = useState('https://mpago.la/raimundomoreira4990');

  // States for Paid/Premium Ad Payment Simulation
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'confirmed'>('idle');
  const [cardNumber, setCardNumber] = useState('4532 7182 9301 2475');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('11/30');
  const [cardCvv, setCardCvv] = useState('738');
  const [pixKeyCopied, setPixKeyCopied] = useState(false);
  const [pixCodeCopied, setPixCodeCopied] = useState(false);
  const [copyAlertText, setCopyAlertText] = useState('');
  
  const [webhookSeconds, setWebhookSeconds] = useState(8);
  const [webhookState, setWebhookState] = useState<'pending' | 'detected' | 'confirmed'>('pending');

  // Mercado Pago states inside the layout
  const [mpPixCode, setMpPixCode] = useState<string>('');
  const [mpQrBase64, setMpQrBase64] = useState<string>('');
  const [mpPaymentId, setMpPaymentId] = useState<string>('');
  const [mpLoading, setMpLoading] = useState<boolean>(false);
  const [mpError, setMpError] = useState<string>('');

  // Call official Mercado Pago dynamic PIX creator for Ads creation
  useEffect(() => {
    if (step === 4 && isPremium && paymentMethod === 'pix') {
      setMpLoading(true);
      setMpError('');
      
      const payload = {
        amount: premiumPlan === 'platinum' ? 49.90 : 29.90,
        email: sellerEmail || 'raimundomoreira1988@gmail.com',
        description: `vivaLocal - ${premiumPlan === 'platinum' ? 'Destaque Platinum Max' : 'Destaque Ouro'}`,
        listingId: `temp_ad_${Date.now()}`,
        callbackUrl: window.location.origin + '/api/payments/webhook'
      };

      fetch('/api/payments/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (!res.ok) throw new Error('Falha no terminal de API Mercado Pago.');
        return res.json();
      })
      .then(data => {
        if (data.success && data.qrCode) {
          setMpPixCode(data.qrCode);
          setMpQrBase64(data.qrCodeBase64);
          setMpPaymentId(data.paymentId);
          setWebhookSeconds(30); // Dynamic wait countdown refresh
        } else {
          throw new Error(data.error || 'Erro inesperado.');
        }
      })
      .catch(err => {
        console.error("Mercado Pago load issue:", err);
        setMpError('Falha ao falar com Mercado Pago. Acionando redirecionamento de contingência.');
      })
      .finally(() => {
        setMpLoading(false);
      });
    }
  }, [step, isPremium, paymentMethod, premiumPlan, sellerEmail]);

  // Real-time server-side status checker polling for Ads creation
  useEffect(() => {
    if (!mpPaymentId || step !== 4 || paymentStatus === 'confirmed') return;

    let isMounted = true;
    const interval = setInterval(() => {
      fetch(`/api/payments/status/${mpPaymentId}`)
        .then(res => res.json())
        .then(data => {
          if (!isMounted) return;
          console.log("Polling Mercado Pago status response:", data);
          
          if (data.status === 'approved') {
            clearInterval(interval);
            setWebhookState('confirmed');
            setPaymentStatus('processing');
            
            setTimeout(() => {
              if (isMounted) {
                setPaymentStatus('confirmed');
                setCopyAlertText("Pagamento confirmado via Mercado Pago! Recursos premium ativos.");
                
                setTimeout(() => {
                  if (isMounted) {
                    onSubmit({
                      title,
                      description,
                      price: isNegotiable ? null : Number(priceInput),
                      category,
                      subCategory,
                      region,
                      city,
                      neighborhood: neighborhood.trim(),
                      imageUrl: listingImages[0] || imageUrl,
                      images: listingImages.length > 0 ? listingImages : [imageUrl],
                      youtubeUrl,
                      externalLink,
                      sellerName,
                      sellerPhone,
                      sellerEmail,
                      isPremium: true,
                      premiumPlan: premiumPlan === 'platinum' ? 'vip' : 'highlight-30',
                      isApproved: true,
                    });
                  }
                }, 2000);
              }
            }, 1200);
          }
        })
        .catch(err => console.error("Error polling Mercado Pago in CreateAdModal:", err));
    }, 4500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [mpPaymentId, step, paymentStatus, title, description, priceInput, isNegotiable, category, subCategory, region, city, neighborhood, imageUrl, listingImages, youtubeUrl, externalLink, sellerName, sellerPhone, sellerEmail, premiumPlan, onSubmit]);

  // Automatic webhook payments simulation fallback
  useEffect(() => {
    if (step !== 4 || paymentMethod !== 'pix' || paymentStatus !== 'idle') {
      setWebhookState('pending');
      setWebhookSeconds(8);
      return;
    }

    let isMounted = true;
    const interval = setInterval(() => {
      setWebhookSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isMounted) {
            setWebhookState('confirmed');
            setPaymentStatus('processing');
            
            setTimeout(() => {
              if (isMounted) {
                setPaymentStatus('confirmed');
                setCopyAlertText("Pagamento confirmado com sucesso! Seu anúncio foi destacado e os recursos premium já estão disponíveis.");
                
                setTimeout(() => {
                  if (isMounted) {
                    onSubmit({
                      title,
                      description,
                      price: isNegotiable ? null : Number(priceInput),
                      category,
                      subCategory,
                      region,
                      city,
                      neighborhood: neighborhood.trim(),
                      imageUrl: listingImages[0] || imageUrl,
                      images: listingImages.length > 0 ? listingImages : [imageUrl],
                      youtubeUrl,
                      externalLink,
                      sellerName,
                      sellerPhone,
                      sellerEmail,
                      isPremium: true,
                      premiumPlan: premiumPlan === 'platinum' ? 'vip' : 'highlight-30',
                      isApproved: true,
                    });
                  }
                }, 2000);
              }
            }, 1200);
          }
          return 0;
        }

        if (prev === 5 && isMounted) {
          setWebhookState('detected');
          setCopyAlertText('⚡ PIX Detectado! Processando confirmação automática...');
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [step, paymentMethod, paymentStatus, title, description, priceInput, isNegotiable, category, subCategory, region, city, neighborhood, imageUrl, listingImages, youtubeUrl, externalLink, sellerName, sellerPhone, sellerEmail, premiumPlan, onSubmit]);

  // Auto-set subcategory when category shifts
  useEffect(() => {
    const defaultSub = CATEGORIES.find((c) => c.id === category)?.subCategories[0] || '';
    setSubCategory(defaultSub);
    // Set default stock photo matching selected category
    if (imageSource === 'stock') {
      setImageUrl(STOCK_PHOTOS[category]?.[0]?.url || '');
    }
  }, [category, imageSource]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Por favor, envie apenas arquivos de imagem.');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('A imagem selecionada é muito grande. O limite máximo é 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setImageUrl(event.target.result);
          setErrorMessage('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Por favor, envie apenas arquivos de imagem.');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage('A imagem selecionada é muito grande. O limite máximo é 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setImageUrl(event.target.result);
          setErrorMessage('');
        }
      };
      reader.readAsDataURL(file);
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
          imageUrl: listingImages[0] || imageUrl,
          images: listingImages.length > 0 ? listingImages : [imageUrl],
          youtubeUrl,
          externalLink, // enabled automatically on premium payment!
          sellerName,
          sellerPhone,
          sellerEmail,
          isPremium: true,
          premiumPlan: premiumPlan === 'platinum' ? 'vip' : 'highlight-30',
          isApproved: true,
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
      imageUrl: listingImages[0] || imageUrl,
      images: listingImages.length > 0 ? listingImages : [imageUrl],
      youtubeUrl,
      externalLink: isPremium ? externalLink : '', // only if premium
      sellerName,
      sellerPhone,
      sellerEmail,
      isPremium,
      premiumPlan: isPremium ? (premiumPlan === 'platinum' ? 'vip' : 'highlight-30') : 'none',
      isApproved: true,
    });
  };

  const subCategories = CATEGORIES.find((c) => c.id === category)?.subCategories || [];
  const cities = BRAZIL_REGIONS.find((r) => r.id === region)?.cities || [];

  const pixAmount = premiumPlan === 'platinum' ? 49.90 : 29.90;
  const pixCode = generateStaticPix('raimundomoreira1988@gmail.com', pixAmount);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`;

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

              {/* YouTube Video URL Input matching item 14 */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <PlayCircle className="h-4.5 w-4.5 text-red-600 animate-pulse" />
                  Link de Vídeo do YouTube (Opcional - Máx: 1 Vídeo)
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-slate-850 outline-none focus:border-red-500 transition-all"
                />
                <span className="text-[9px] text-gray-400 font-semibold block leading-relaxed">
                  Insira o link de 1 vídeo do YouTube sobre o seu item para enriquecer o anúncio! Cada anúncio suporta de forma excelente <strong className="text-slate-800 font-bold">até 10 fotos</strong> no carrossel de exibição e <strong className="text-slate-800 font-bold">até 1 vídeo incorporado</strong>.
                </span>
              </div>

              {/* Website Link (Premium Feature) */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5 hover:border-blue-200 transition">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
                  Link Externo / Website do Anúncio (Opcional - Recurso Premium)
                </label>
                <input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder={isPremium ? "Ex: https://seusite.com.br/produto-ou-whatsapp" : "🔒 Liberado automaticamente após ativar o Destaque Premium"}
                  disabled={!isPremium}
                  className={`w-full border rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-blue-500 transition-all ${
                    !isPremium 
                      ? 'bg-gray-100 border-gray-250 text-gray-400 cursor-not-allowed select-none' 
                      : 'bg-white border-gray-200 text-slate-850'
                  }`}
                />
                <span className="text-[9px] font-semibold block leading-relaxed">
                  {!isPremium ? (
                    <span className="text-orange-700">⚠️ Bloqueado: Este recurso permite criar links diretos para seu site, WhatsApp ou portfólio. Para liberar, selecione a opção de Destaque na Etapa 3!</span>
                  ) : (
                    <span className="text-indigo-700 font-extrabold">🎉 Liberado! Como você escolheu um Plano Premium, você pode adicionar seu link diretamente agora. Ele ficará ativo após a confirmação.</span>
                  )}
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
                  Foto do Anúncio (Obrigatória)
                </label>

                {/* Stock theme list choice */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="h-4.5 w-4.5 text-red-600" />
                      Escolha o Método da Foto do Anúncio
                    </span>
                  </div>

                  {/* Segmented Tab Bar Selector */}
                  <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setImageSource('stock');
                        setImageUrl(STOCK_PHOTOS[category]?.[0]?.url || '');
                      }}
                      className={`flex-1 text-center py-2 px-2 rounded-lg text-[10px] sm:text-xs font-black tracking-wide transition-all duration-200 cursor-pointer ${
                        imageSource === 'stock'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Banco de Fotos
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageSource('url');
                        setImageUrl('');
                      }}
                      className={`flex-1 text-center py-2 px-2 rounded-lg text-[10px] sm:text-xs font-black tracking-wide transition-all duration-200 cursor-pointer ${
                        imageSource === 'url'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Link da Web
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageSource('upload');
                        setImageUrl('');
                      }}
                      className={`flex-1 text-center py-2 px-2 rounded-lg text-[10px] sm:text-xs font-black tracking-wide transition-all duration-200 cursor-pointer ${
                        imageSource === 'upload'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Enviar do Dispositivo
                    </button>
                  </div>

                  {imageSource === 'stock' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fadeIn">
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

                  {imageSource === 'url' && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Insira o link da imagem (https://...)"
                        className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:border-red-500 outline-none"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block font-semibold leading-relaxed">
                        Insira um link de imagem válido e público (ex: do Unsplash, Imgur, ou do seu site).
                      </span>
                    </div>
                  )}

                  {imageSource === 'upload' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all min-h-[140px] relative text-center cursor-pointer ${
                          isDragging
                            ? 'border-red-500 bg-red-50/20'
                            : imageUrl.startsWith('data:image')
                            ? 'border-emerald-500 bg-emerald-50/5'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                        onClick={() => document.getElementById('device-photo-upload')?.click()}
                      >
                        <input
                          id="device-photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />

                        {imageUrl.startsWith('data:image') ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="relative rounded-xl overflow-hidden max-h-[125px] w-[140px] h-[95px] shadow border border-gray-150 bg-gray-50 flex items-center justify-center">
                              <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
                              <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                                <Check className="h-2.5 w-2.5" />
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-bold text-emerald-700">Foto carregada do dispositivo</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Clique ou arraste outro arquivo para substituir</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-red-50 rounded-full text-red-600">
                              <Upload className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Arraste sua foto aqui ou clique para buscar</p>
                              <p className="text-[10px] text-gray-400 font-semibold mt-1">Imagens JPG, PNG, GIF ou WEBP de até 8MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Multiple image gallery checklist matching "Permitir que os usuários enviem até 10 fotos por anúncio" */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-205 pb-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <ImageIcon className="h-4.5 w-4.5 text-red-600" />
                        Fotos do Seu Anúncio ({listingImages.length}/10)
                      </span>
                      {imageUrl && listingImages.length < 10 && !listingImages.includes(imageUrl) && (
                        <button
                          type="button"
                          onClick={() => {
                            setListingImages(prev => [...prev, imageUrl]);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg cursor-pointer transition shadow-sm"
                        >
                          Anexar Foto Selecionada ao Anúncio
                        </button>
                      )}
                    </div>

                    {listingImages.length === 0 ? (
                      <p className="text-[10px] bg-slate-100 p-2.5 rounded-xl text-gray-500 font-semibold leading-relaxed">
                        Selecione as fotos usando o Banco de Fotos, links ou do seu dispositivo acima e clique no botão <strong className="text-red-700 font-bold">"Anexar Foto Selecionada"</strong> para adicionar até 10 fotos. Elas aparecerão juntas em um carrossel na página do anúncio!
                      </p>
                    ) : (
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {listingImages.map((img, idx) => (
                          <div key={idx} className="relative h-11 w-11 rounded-lg overflow-hidden border bg-white shadow-sm shrink-0 group">
                            <img src={img} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setListingImages(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute inset-0 bg-red-600/90 text-white text-[8px] font-black uppercase transition-all duration-150 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 mt-3 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="h-4 w-4 text-amber-600 animate-pulse" />
                        Destacar Anúncio & Vender 10x Mais Rápido
                      </span>
                      <p className="text-[10px] text-gray-500 font-semibold">Destaques automáticos no topo das buscas com selo de verificação.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 h-5.5 w-5.5 transition-all cursor-pointer"
                    />
                  </div>

                  {isPremium && (
                    <div className="space-y-3 animate-fadeIn">
                      <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">Selecione o plano desejado:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Option 1: Gold */}
                        <button
                          type="button"
                          onClick={() => setPremiumPlan('gold')}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                            premiumPlan === 'gold'
                              ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-amber-800">Destaque Ouro</span>
                              <span className="text-xs font-black text-slate-900">R$ 29,90</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1">
                              Fique no topo da categoria por 7 dias com borda dourada chamativa de destaque.
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold mt-2.5 inline-flex items-center gap-1 ${premiumPlan === 'gold' ? 'text-amber-700' : 'text-gray-400'}`}>
                            {premiumPlan === 'gold' ? '● Selecionado' : 'Selecionar'}
                          </span>
                        </button>

                        {/* Option 2: Platinum */}
                        <button
                          type="button"
                          onClick={() => setPremiumPlan('platinum')}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                            premiumPlan === 'platinum'
                              ? 'border-red-500 bg-rose-50/30 ring-1 ring-red-500'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                            Melhor Valor
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-red-700 flex items-center gap-1">
                                <Flame className="h-3 w-3 fill-rose-600 text-rose-600 animate-pulse animate-duration-1000" />
                                Platinum Max
                              </span>
                              <span className="text-xs font-black text-slate-900">R$ 49,90</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1">
                              Topo absoluto do feed global e de todas categorias por 15 dias, selo VIP verificado e relevância máxima.
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold mt-2.5 inline-flex items-center gap-1 ${premiumPlan === 'platinum' ? 'text-rose-700' : 'text-gray-400'}`}>
                            {premiumPlan === 'platinum' ? '● Selecionado' : 'Selecionar'}
                          </span>
                        </button>
                      </div>

                      {/* Customizable payment link field matching: "colocar opcao de colocar link para plano pago no valor de 49,90" */}
                      {premiumPlan === 'platinum' && (
                        <div className="bg-white border border-gray-150 p-3 rounded-xl space-y-1.5">
                          <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                            Link de Pagamento Externo (Plano R$ 49,90)
                          </label>
                          <p className="text-[9px] text-gray-400 font-semibold leading-relaxed">
                            Defina uma URL de cobrança personalizada (Mercado Pago, Stripe, PagSeguro, etc.) para que o usuário pague diretamente.
                          </p>
                          <input
                            type="url"
                            value={customPaymentLink}
                            onChange={(e) => setCustomPaymentLink(e.target.value)}
                            placeholder="Ex: https://link-mercadopago.com.br/plano-49-90"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-[11px] font-semibold text-slate-700 outline-none focus:bg-white focus:border-red-500 transition-all font-mono"
                          />
                        </div>
                      )}
                    </div>
                  )}
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
                  <h4 className="text-xs font-bold text-slate-850">
                    Você escolheu {premiumPlan === 'platinum' ? 'Destaque Platinum Max' : 'Destaque Ouro'}!
                  </h4>
                  <p className="text-[11px] text-slate-600 font-semibold leading-relaxed mt-0.5 animate-pulse">
                    Para confirmar a publicação do seu anúncio no topo do feed do <strong className="text-slate-800">vivaLocal</strong>, efetue o pagamento abaixo de <strong className="text-amber-700 font-extrabold text-xs">R$ {premiumPlan === 'platinum' ? '49,90' : '29,90'}</strong>. A liberação ocorrerá instantaneamente.
                  </p>
                </div>
              </div>

              {premiumPlan === 'platinum' && customPaymentLink && (
                <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-amber-200 rounded-2xl p-4.5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-600 animate-pulse" />
                    <span className="text-xs font-extrabold text-slate-800">Link de Pagamento Dedicado</span>
                  </div>
                  <p className="text-[10px] text-gray-600 font-semibold leading-relaxed">
                    Você pode efetuar o pagamento diretamente acessando este link seguro de checkout:
                  </p>
                  <a
                    href={customPaymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 rounded-xl shadow transition-all hover:scale-[1.01]"
                  >
                    <span>Ir para o Link de Pagamento (R$ 49,90)</span>
                    <span className="text-[10px] bg-red-800 text-white font-black px-1.5 py-0.5 rounded uppercase">Mercado Pago / etc</span>
                  </a>
                </div>
              )}

              {paymentStatus === 'idle' ? (
                <div className="space-y-4 bg-white rounded-2xl">
                  {/* Automatic Payment Webhook Status Bar */}
                  <div className={`p-4 border rounded-xl flex items-center justify-between gap-3 transition-colors ${
                    webhookState === 'pending'
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : webhookState === 'detected'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950 animate-pulse'
                  }`}>
                    <div className="flex items-center gap-3">
                      {webhookState === 'pending' ? (
                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-ping shrink-0" />
                      ) : webhookState === 'detected' ? (
                        <Loader2 className="h-4.5 w-4.5 text-amber-600 animate-spin shrink-0 animate-duration-[1600ms]" />
                      ) : (
                        <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                      )}
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-wider">
                          {webhookState === 'pending' && '⏳ Aguardando Recebimento na Conta'}
                          {webhookState === 'detected' && '⚡ PIX Detectado! Processando...'}
                          {webhookState === 'confirmed' && '✅ Pagamento Confirmado!'}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-500 text-left">
                          {webhookState === 'pending' && `Sincronizado automaticamente via API Webhook (Próxima checagem em ${webhookSeconds}s)`}
                          {webhookState === 'detected' && 'Identificando dados de RAIMUNDO MOREIRA e liberando recursos...'}
                          {webhookState === 'confirmed' && 'Pagamento aprovado na API gateway. Recursos premium aplicados!'}
                        </p>
                      </div>
                    </div>
                    {webhookState === 'pending' && (
                      <span className="text-[9px] font-black bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full uppercase shrink-0">
                        API Ativa
                      </span>
                    )}
                  </div>

                  <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <div className="bg-slate-50 border-b border-gray-100 p-4 font-bold text-xs text-slate-800 flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-red-600 animate-pulse" />
                      Pagar via PIX Seguro (Compensação Automática)
                    </div>

                  <div className="p-5 sm:p-6 font-sans">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Dynamic Generated QR Code */}
                      <div className="bg-slate-50 border border-gray-150 p-3 rounded-2xl flex flex-col items-center shrink-0 w-[180px] shadow-sm select-none relative overflow-hidden">
                        {mpLoading && (
                          <div className="absolute inset-0 bg-white/85 flex flex-col items-center justify-center z-10">
                            <Loader2 className="h-5 w-5 text-red-650 animate-spin" />
                            <span className="text-[8px] font-black uppercase text-red-700 tracking-wider mt-1">Gerando PIX...</span>
                          </div>
                        )}
                        <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-center">
                          <img
                            src={mpQrBase64 ? `data:image/png;base64,${mpQrBase64}` : qrCodeUrl}
                            alt="QRCode PIX vivalocal dinâmico"
                            className="h-[140px] w-[140px] object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-slate-800 font-extrabold mt-2.5 uppercase tracking-wider flex items-center gap-1">
                          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                          {mpPixCode ? 'Mercado Pago Real' : 'QR Code Dinâmico'}
                        </span>
                        <span className="text-[8px] text-gray-500 font-bold mt-0.5 tracking-wider">
                          R$ {pixAmount.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <div className="flex-1 space-y-4 w-full text-left">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Instruções de Pix</span>
                          <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-0.5">
                            Abra seu aplicativo do banco, escolha pagar com <strong className="text-red-700 bg-red-50 px-1 py-0.5 rounded">Pix Copia e Cola</strong> ou <strong className="text-red-700 bg-red-50 px-1 py-0.5 rounded">QR Code</strong> e use a chave ou o código abaixo de <strong className="text-emerald-700 font-black">R$ {pixAmount.toFixed(2).replace('.', ',')}</strong>.
                          </p>
                        </div>

                        {/* Option 1: Chave Pix (E-mail) */}
                        <div className="space-y-1">
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">1. Chave Pix E-mail habitual</span>
                          <div className="bg-slate-50 border border-gray-150 rounded-xl p-2.5 flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-850 truncate select-all flex-1 font-mono">
                              raimundomoreira1988@gmail.com
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('raimundomoreira1988@gmail.com');
                                setPixKeyCopied(true);
                                setCopyAlertText('Chave PIX copiada!');
                                setTimeout(() => {
                                  setPixKeyCopied(false);
                                  setCopyAlertText('');
                                }, 2500);
                              }}
                              className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-colors"
                            >
                              {pixKeyCopied ? 'Copiado!' : 'Copiar Chave PIX'}
                            </button>
                          </div>
                        </div>

                        {/* Option 2: Pix Copia e Cola Payload String */}
                        <div className="space-y-1">
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            2. Código Pix Copia e Cola
                            {mpPixCode && <span className="text-[8px] bg-red-100 text-red-700 font-extrabold px-1.5 rounded">Mercado Pago</span>}
                          </span>
                          <div className="bg-slate-50 border border-gray-150 rounded-xl p-2.5 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-slate-500 truncate flex-1 select-all select-none font-mono">
                              {mpPixCode || pixCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(mpPixCode || pixCode);
                                setPixCodeCopied(true);
                                setCopyAlertText('Código Pix Copia e Cola copiado!');
                                setTimeout(() => {
                                  setPixCodeCopied(false);
                                  setCopyAlertText('');
                                }, 2500);
                              }}
                              className="bg-red-650 text-white hover:bg-red-700 bg-red-600 text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-colors shadow-sm"
                            >
                              {pixCodeCopied ? 'Copiado!' : 'Copiar Código'}
                            </button>
                          </div>
                        </div>

                        {/* Optional Sandbox Mercado Pago Approval simulator */}
                        {mpPaymentId && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                fetch(`/api/payments/simulate-approve/${mpPaymentId}`, { method: 'POST' })
                                  .then(() => {
                                    setCopyAlertText("🚀 Sinalizadores enviados! Mercado Pago identificará o recebimento em instantes...");
                                    setTimeout(() => setCopyAlertText(""), 3000);
                                  })
                                  .catch(err => console.error("Simulate error", err));
                              }}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] uppercase font-black py-2.5 px-3 rounded-xl transition-all shadow border border-slate-700 flex items-center justify-center gap-2 cursor-pointer select-none"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                              Simular Pagamento no Mercado Pago
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
              {isPremium ? `Ir para Pagamento (R$ ${premiumPlan === 'platinum' ? '49,90' : '29,90'})` : 'Finalizar & Publicar Anúncio'}
            </button>
          ) : (
            <button
              onClick={handleSimulatePayment}
              disabled={paymentStatus !== 'idle'}
              className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-extrabold px-7 py-2.5 rounded-full shadow-md transition-all cursor-pointer transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentStatus === 'idle'
                ? `Confirmar Pagamento e Ativar Anúncio`
                : paymentStatus === 'processing'
                ? 'Confirmando Transação...'
                : 'Confirmado com Sucesso!'}
            </button>
          )}
        </div>
      </div>
      {copyAlertText && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-slate-900 border border-slate-800 text-white font-semibold rounded-2xl px-5 py-3.5 shadow-2xl animate-scaleUp max-w-sm">
          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="text-xs leading-relaxed">{copyAlertText}</span>
        </div>
      )}
    </div>
  );
}

// CRC16 CCITT (0x1021) calculation for PIX Standards
function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= (str.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export function generateStaticPix(key: string, amount: number, name: string = 'RAIMUNDO MOREIRA', city: string = 'SAO PAULO'): string {
  const amountStr = amount.toFixed(2);
  
  // Tag 26: Merchant Account Information
  const gui = "0014br.gov.bcb.pix";
  const keyLength = key.length.toString().padStart(2, '0');
  const keyTag = "01" + keyLength + key;
  const tag26Val = gui + keyTag;
  const tag26Length = tag26Val.length.toString().padStart(2, '0');
  const tag26 = "26" + tag26Length + tag26Val;
  
  // Tag 59: Merchant Name
  const formattedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().substring(0, 25);
  const nameLength = formattedName.length.toString().padStart(2, '0');
  const tag59 = "59" + nameLength + formattedName;
  
  // Tag 60: Merchant City
  const formattedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().substring(0, 15);
  const cityLength = formattedCity.length.toString().padStart(2, '0');
  const tag60 = "60" + cityLength + formattedCity;
  
  // Tag 54: Amount
  const amountLength = amountStr.length.toString().padStart(2, '0');
  const tag54 = "54" + amountLength + amountStr;
  
  const payloadWithoutCRC = 
    "000201" +               // Payload Format Indicator
    "010212" +               // Point of Initiation Method (12 = Multi-use / Static)
    tag26 +                  // Merchant Account Info
    "52040000" +             // Merchant Category Code (0000 = Generic/Not specific)
    "5303986" +              // Transaction Currency BRL (986)
    tag54 +                  // Transaction Amount
    "5802BR" +               // Country Code
    tag59 +                  // Name
    tag60 +                  // City
    "62070503***" +          // Additional Data Field Template
    "6304";                  // CRC16 tag header
    
  return payloadWithoutCRC + calculateCRC16(payloadWithoutCRC);
}

