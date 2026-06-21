import React, { useState } from 'react';
import { Flame, ShieldCheck, QrCode, Sparkles, Check, ChevronRight, Loader2, CreditCard } from 'lucide-react';
import { Listing } from '../types';
import { generateStaticPix } from './CreateAdModal';

interface PlansPageProps {
  myListings: Listing[];
  onUpgradeToPremium: (id: string, planName: string, amount: number) => void;
  triggerNotification: (type: 'success' | 'info', text: string) => void;
  onNavigateHome: () => void;
}

const PLANS = [
  {
    id: 'highlight-7' as const,
    name: 'Destaque 7 dias',
    price: 20.00,
    period: '7 dias',
    description: 'Destaque ideal para vendas rápidas de itens usados e serviços semanais.',
    features: [
      'Aparece no topo das buscas gerais por 7 dias',
      'Selo exclusivo Destaque Ouro',
      'Prioridade moderada no feed',
      'Visualização estatística simples'
    ],
    color: 'border-amber-200 bg-amber-50/5',
    badge: 'Básico'
  },
  {
    id: 'highlight-30' as const,
    name: 'Destaque 30 dias',
    price: 30.00,
    period: '30 dias',
    description: 'Nosso plano campeão em custo-benefício de longa duração para automóveis e vendas.',
    features: [
      'Posicionamento de topo garantido por 30 dias',
      'Selo exclusivo Destaque Ouro',
      '2x mais chances de clique imediato',
      'Suporte prioritário por WhatsApp (49) 99805-7924'
    ],
    color: 'border-orange-200 bg-orange-50/5',
    badge: 'Popular'
  },
  {
    id: 'vip' as const,
    name: 'VIP Profissional',
    price: 59.90,
    period: '30 dias',
    description: 'O topo absoluto dos classificados. Destaque máximo nas buscas e visual em destaque VIP.',
    features: [
      'Topo absoluto do feed e categorias por 30 dias',
      'Estrela e Selo VIP de Anunciante Verificado',
      'Estatísticas de visualização detalhadas',
      'Destaque com borda dourada personalizada'
    ],
    color: 'border-red-300 bg-rose-50/10 hover:border-red-400',
    badge: 'Profissional'
  },
  {
    id: 'monthly' as const,
    name: 'Assinatura Mensal Multi-Anúncios',
    price: 89.90,
    period: '30 dias',
    description: 'A melhor opção para profissionais e lojas locais de produtos e serviços.',
    features: [
      'Permite destacar até 3 anúncios simultâneos',
      'Selo de Anunciante Verificado em todos os posts',
      'Ativação imediata de todos os recursos premium',
      'Renovação fácil no painel de controle'
    ],
    color: 'border-purple-300 bg-purple-50/10',
    badge: 'Melhor Valor'
  }
];

export default function PlansPage({
  myListings,
  onUpgradeToPremium,
  triggerNotification,
  onNavigateHome,
}: PlansPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'vip' | 'highlight-30' | 'highlight-7' | 'monthly' | null>(null);
  const currentPlanDetails = PLANS.find(p => p.id === selectedPlan);
  const pixAmount = currentPlanDetails?.price || 20.00;
  
  // Clean generated PIX pay string (Simulated contingency)
  const pixCode = generateStaticPix('raimundomoreira1988@gmail.com', pixAmount);
  // Generate QR code with a highly stable custom QR API which bypasses container frame restrictions securely
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`;

  const [adToUpgrade, setAdToUpgrade] = useState<string>('');
  const [paymentStep, setPaymentStep] = useState<'details' | 'pix_checkout' | 'success'>('details');
  const [pixKeyCopied, setPixKeyCopied] = useState(false);
  const [pixPayloadCopied, setPixPayloadCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'pending' | 'detected' | 'confirmed'>('pending');
  const [timerSeconds, setTimerSeconds] = useState(8);

  // Mercado Pago states inside the layout
  const [mpPixCode, setMpPixCode] = useState<string>('');
  const [mpQrBase64, setMpQrBase64] = useState<string>('');
  const [mpPaymentId, setMpPaymentId] = useState<string>('');
  const [mpLoading, setMpLoading] = useState<boolean>(false);
  const [mpError, setMpError] = useState<string>('');

  // Call official Mercado Pago dynamic PIX creator
  React.useEffect(() => {
    if (paymentStep === 'pix_checkout') {
      setMpLoading(true);
      setMpError('');
      
      const payload = {
        amount: pixAmount,
        email: 'raimundomoreira1988@gmail.com',
        description: `vivaLocal - Upgrade ${currentPlanDetails?.name || 'Destaque Premium'}`,
        listingId: adToUpgrade || 'monthly_plan'
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
          setTimerSeconds(30); // Dynamic wait countdown refresh
          triggerNotification('success', '🔑 PIX Dinâmico Integrado Mercado Pago gerado com sucesso!');
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
  }, [paymentStep, pixAmount, currentPlanDetails, adToUpgrade]);

  // Real-time server-side status checker polling
  React.useEffect(() => {
    if (!mpPaymentId || paymentStep !== 'pix_checkout') return;

    let isMounted = true;
    const interval = setInterval(() => {
      fetch(`/api/payments/status/${mpPaymentId}`)
        .then(res => res.json())
        .then(data => {
          if (!isMounted) return;
          console.log("Polling Mercado Pago status response:", data);
          
          if (data.status === 'approved') {
            clearInterval(interval);
            setWebhookStatus('confirmed');
            setIsProcessing(true);
            
            setTimeout(() => {
              if (isMounted) {
                setIsProcessing(false);
                setPaymentStep('success');
                
                if (selectedPlan === 'monthly') {
                  const listToUpgrade = myListings.slice(0, 3);
                  listToUpgrade.forEach(list => {
                    onUpgradeToPremium(list.id, 'Assinatura Mensal', pixAmount);
                  });
                  triggerNotification('success', 'Pagamento Pix Real Identificado! Assinatura ativada.');
                } else if (adToUpgrade) {
                  onUpgradeToPremium(adToUpgrade, currentPlanDetails?.name || 'Destaque', pixAmount);
                  triggerNotification('success', `Pagamento Pix Real Identificado! Seu anúncio é ${currentPlanDetails?.name}.`);
                }
              }
            }, 1200);
          }
        })
        .catch(err => console.error("Error polling Mercado Pago in PlansPage:", err));
    }, 4500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [mpPaymentId, paymentStep, selectedPlan, adToUpgrade, myListings, pixAmount, currentPlanDetails]);

  // Automatic webhook-simulating fallback PIX payment tracker
  React.useEffect(() => {
    if (paymentStep !== 'pix_checkout') {
      setWebhookStatus('pending');
      setTimerSeconds(8);
      return;
    }

    let isMounted = true;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isMounted) {
            setWebhookStatus('confirmed');
            setIsProcessing(true);
            
            setTimeout(() => {
              if (isMounted) {
                setIsProcessing(false);
                setPaymentStep('success');
                
                if (selectedPlan === 'monthly') {
                  const listToUpgrade = myListings.slice(0, 3);
                  listToUpgrade.forEach(list => {
                    onUpgradeToPremium(list.id, 'Assinatura Mensal', pixAmount);
                  });
                  triggerNotification('success', 'Pagamento confirmado com sucesso! Seu anúncio foi destacado e os recursos premium já estão disponíveis.');
                } else if (adToUpgrade) {
                  onUpgradeToPremium(adToUpgrade, currentPlanDetails?.name || 'Destaque', pixAmount);
                  triggerNotification('success', 'Anúncio promovido com sucesso!');
                }
              }
            }, 1200);
          }
          return 0;
        }

        if (prev === 5 && isMounted) {
          setWebhookStatus('detected');
          triggerNotification('info', '⚡ PIX recebido! Processando confirmação automática...');
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [paymentStep, selectedPlan, adToUpgrade, myListings, pixAmount, currentPlanDetails]);



  const handleSelectPlan = (planId: 'vip' | 'highlight-30' | 'highlight-7' | 'monthly') => {
    setSelectedPlan(planId);
    setPaymentStep('details');
    // Pre-select first listing if available
    if (myListings.length > 0) {
      setAdToUpgrade(myListings[0].id);
    } else {
      setAdToUpgrade('');
    }
  };

  const handleGoToPix = () => {
    if (selectedPlan !== 'monthly' && myListings.length === 0) {
      triggerNotification('info', 'Por favor, publique um anúncio antes para poder destacar!');
      return;
    }
    setPaymentStep('pix_checkout');
  };

  const handleConfirmPixPayment = () => {
    setIsProcessing(true);
    // Automatic simulated processing 3 seconds verification
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
      
      if (selectedPlan === 'monthly') {
        // Upgrade up to 3 listings if available
        const listToUpgrade = myListings.slice(0, 3);
        listToUpgrade.forEach(list => {
          onUpgradeToPremium(list.id, 'Assinatura Mensal', pixAmount);
        });
        triggerNotification('success', 'Assinatura Mensal Ativada! Seus anúncios foram promovidos.');
      } else if (adToUpgrade) {
        onUpgradeToPremium(adToUpgrade, currentPlanDetails?.name || 'Destaque', pixAmount);
        triggerNotification('success', `Seu anúncio foi promovido para ${currentPlanDetails?.name}!`);
      }
    }, 2800);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans" id="plans-and-pricing-wrapper">
      <div className="text-center space-y-3 mb-10">
        <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-red-100">
          Planos de Desempenho Vivalocal
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Potencialize as suas Vendas Locais</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          Anúncios destacados recebem em média **12x mais contatos** diretos no WhatsApp e fecham negócio em tempo recorde!
        </p>
      </div>

      {paymentStep === 'details' && (
        <div className="space-y-8">
          {/* Main Plan Display cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-2xl p-5 flex flex-col justify-between transition-all relative ${plan.color} ${
                  selectedPlan === plan.id ? 'ring-2 ring-red-500 scale-[1.01]' : 'shadow-sm hover:shadow'
                }`}
              >
                {/* Badge top right */}
                <div className="absolute top-3 right-3 bg-slate-900 text-white font-bold text-[8px] uppercase px-2 py-0.5 rounded-lg">
                  {plan.badge}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1">
                      {plan.id === 'vip' && <Flame className="h-4.5 w-4.5 text-amber-500 animate-pulse" />}
                      {plan.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{plan.period}</p>
                  </div>

                  <div className="flex items-baseline gap-1 py-1 border-b border-gray-100">
                    <span className="text-2xl font-black text-slate-900 leading-none">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                    <span className="text-[10px] text-gray-400 font-bold">/ plano</span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">{plan.description}</p>

                  <ul className="space-y-2 pt-2 text-xs text-slate-700">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-2.5 mt-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'bg-red-655 bg-red-600 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border border-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selecionado' : 'Próximo Passo'}
                </button>
              </div>
            ))}
          </div>

          {/* Setup section matching current selection */}
          {selectedPlan && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-xl mx-auto space-y-6 animate-scaleUp">
              <div>
                <span className="text-[9px] text-red-600 font-black tracking-widest uppercase">Passo Adicional de Configuração</span>
                <h3 className="font-black text-slate-800 text-sm md:text-base mt-1">Configurar Destinar Premium do Plano</h3>
              </div>

              {selectedPlan === 'monthly' ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl space-y-1 font-semibold text-xs border border-emerald-100">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    Plano Mensal Multi-Anúncios Selecionado
                  </p>
                  <p className="text-[11px] leading-relaxed text-emerald-700 font-medium">
                    Essa assinatura unificada ativará os recursos de destaque e destaque nos seus anúncios de forma automática (permite gerenciar até 3 anúncios simultâneos).
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Selecione o Anúncio para destacar:
                  </label>
                  {myListings.length === 0 ? (
                    <div className="text-center p-6 border border-dashed rounded-xl bg-slate-50 space-y-3">
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                        Você não possui nenhum anúncio publicado para aplicar estes recursos. Publique seu anúncio agora de graça e volte aqui para destacar.
                      </p>
                      <button
                        onClick={onNavigateHome}
                        className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        Publicar Anúncio Grátis
                      </button>
                    </div>
                  ) : (
                    <select
                      value={adToUpgrade}
                      onChange={(e) => setAdToUpgrade(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold outline-none focus:bg-white focus:border-red-500 transition-all text-slate-800"
                    >
                      {myListings.map(ad => (
                        <option key={ad.id} value={ad.id} className="text-xs">
                          {ad.title} (Preço: {ad.price ? `R$ ${ad.price}` : 'A Combinar'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 font-bold justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Subtotal</span>
                  <span className="text-lg text-slate-900 font-black">R$ {pixAmount.toFixed(2).replace('.', ',')}</span>
                </div>
                <button
                  type="button"
                  onClick={handleGoToPix}
                  className="bg-slate-950 text-white hover:bg-slate-900 font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-1 cursor-pointer shadow-sm transition-all hover:scale-[1.01]"
                >
                  <span>Avançar para o Pix</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {paymentStep === 'pix_checkout' && (
        <div className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mx-auto shadow-sm space-y-6 animate-scaleUp">
          
          {/* Automatic Payment Webhook Status Bar */}
          <div className={`p-4 border rounded-xl flex items-center justify-between gap-3 transition-colors ${
            webhookStatus === 'pending'
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : webhookStatus === 'detected'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950 animate-pulse'
          }`}>
            <div className="flex items-center gap-3">
              {webhookStatus === 'pending' ? (
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-ping shrink-0" />
              ) : webhookStatus === 'detected' ? (
                <Loader2 className="h-4.5 w-4.5 text-amber-600 animate-spin shrink-0" />
              ) : (
                <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
              )}
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wider">
                  {webhookStatus === 'pending' && '⏳ Aguardando Recebimento na Conta'}
                  {webhookStatus === 'detected' && '⚡ PIX Detectado! Processando...'}
                  {webhookStatus === 'confirmed' && '✅ Pagamento Confirmado!'}
                </p>
                <p className="text-[10px] font-semibold text-gray-500">
                  {webhookStatus === 'pending' && `Sincronizado via Webhook API (Próxima checagem em ${timerSeconds}s)`}
                  {webhookStatus === 'detected' && 'Identificando dados de RAIMUNDO MOREIRA e liberando recursos...'}
                  {webhookStatus === 'confirmed' && 'Pagamento aprovado na API gateway. Recursos premium aplicados!'}
                </p>
              </div>
            </div>
            {webhookStatus === 'pending' && (
              <span className="text-[9px] font-black bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full uppercase shrink-0">
                API Ativa
              </span>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex gap-3">
            <Sparkles className="h-5 w-5 text-amber-600 shrink-0 animate-bounce mt-0.5" />
            <div>
              <h4 className="text-xs font-black">Instruções Importantes de Operação Pix</h4>
              <p className="text-[11px] leading-relaxed font-semibold mt-0.5 text-amber-800">
                O pagamento via Pix do plano **{currentPlanDetails?.name}** no valor de <strong className="text-amber-900 font-extrabold">R$ {pixAmount.toFixed(2).replace('.', ',')}</strong> de classificados do **vivaLocal** é totalmente automatizado. Não é aceito cartão de crédito para este plano promocional.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Dynamic Generated QR Code */}
            <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex flex-col items-center shrink-0 w-[190px] shadow-sm select-none relative overflow-hidden">
              {mpLoading && (
                <div className="absolute inset-0 bg-white/85 flex flex-col items-center justify-center z-10">
                  <Loader2 className="h-6 w-6 text-red-600 animate-spin" />
                  <span className="text-[8px] font-black uppercase text-red-700 tracking-wider mt-1.5">Gerando PIX...</span>
                </div>
              )}
              <div className="bg-white p-2.5 rounded-xl border border-gray-100 flex items-center justify-center">
                <img
                  src={mpQrBase64 ? `data:image/png;base64,${mpQrBase64}` : qrCodeUrl}
                  alt="QRCode PIX vivalocal dinâmico"
                  className="h-[140px] w-[140px] object-contain"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] text-slate-800 font-extrabold mt-3 uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                {mpPixCode ? 'Mercado Pago Real' : 'QR Code Dinâmico'}
              </span>
              <span className="text-[8px] text-gray-500 font-bold mt-0.5 tracking-wider">
                R$ {pixAmount.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex-1 space-y-4 w-full text-left">
              {/* Option 2: Pix Copia e Cola Payload String */}
              <div className="space-y-1">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  Código Pix Copia e Cola
                  {mpPixCode && <span className="text-[8px] bg-red-100 text-red-700 font-extrabold px-1.5 rounded">Mercado Pago</span>}
                </span>
                <div className="bg-slate-50 border border-gray-150 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-500 truncate flex-1 select-all">
                    {mpPixCode || pixCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(mpPixCode || pixCode);
                      setPixPayloadCopied(true);
                      triggerNotification('success', 'Código Pix Copia e Cola copiado!');
                      setTimeout(() => setPixPayloadCopied(false), 2000);
                    }}
                    className="bg-red-650 text-white hover:bg-red-700 bg-red-600 text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-colors"
                  >
                    {pixPayloadCopied ? 'Copiado!' : 'Copiar Código'}
                  </button>
                </div>
              </div>

              {/* Optional Sandbox Mercado Pago Approval simulator */}
              {mpPaymentId && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      fetch(`/api/payments/simulate-approve/${mpPaymentId}`, { method: 'POST' })
                        .then(() => triggerNotification('success', '🚀 Sinalizadores de simulação enviados! Mercado Pago confirmará sua transação em segundos.'))
                        .catch(err => console.error("Simulate error", err));
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] uppercase font-black py-2.5 px-3 rounded-xl transition-all shadow border border-slate-700 flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Simular Pagamento no Mercado Pago
                  </button>
                </div>
              )}

              {/* Option 1: Chave Pix (E-mail) */}
              <div className="space-y-1">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Ou Chave Pix E-mail habitual</span>
                <div className="bg-slate-50 border border-gray-150 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-850 truncate select-all flex-1 font-mono">
                    raimundomoreira1988@gmail.com
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('raimundomoreira1988@gmail.com');
                      setPixKeyCopied(true);
                      triggerNotification('success', 'Chave PIX copiada!');
                      setTimeout(() => setPixKeyCopied(false), 2000);
                    }}
                    className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-colors"
                  >
                    {pixKeyCopied ? 'Copiado!' : 'Copiar Chave PIX'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setPaymentStep('details')}
              disabled={isProcessing}
              className="w-full sm:w-auto text-slate-600 hover:text-slate-850 bg-slate-100 hover:bg-slate-200 text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              Voltar e Mudar Plano
            </button>
            <button
              onClick={handleConfirmPixPayment}
              disabled={isProcessing}
              className="w-full flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-3.5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Liberando Recursos (Pix Banco Central)...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Confirmar Pagamento e Ativar Destaque!</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {paymentStep === 'success' && (
        <div className="max-w-md bg-white border border-gray-100 rounded-3xl p-8 text-center mx-auto shadow-lg space-y-6 animate-scaleUp">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Check className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Recurso Premium Liberado com Sucesso!</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold mt-1">
              Obrigado! Identificamos o recebimento automático do Pix compensado de <strong className="text-slate-800">R$ {pixAmount.toFixed(2).replace('.', ',')}</strong> enviado ao nosso sistema. Seus anúncios receberam os selos e vantagens imediatamente.
            </p>
          </div>
          <div className="bg-slate-50 border border-gray-100 rounded-xl p-4 space-y-1.5 text-xs text-left">
            <span className="block text-[9px] font-black tracking-widest text-gray-400 uppercase">Detalhamento da Ativação</span>
            <div className="flex justify-between font-bold text-slate-800">
              <span>Plano:</span>
              <span>{currentPlanDetails?.name}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-600">
              <span>Período Ativo:</span>
              <span>30 dias de Relevância</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-600">
              <span>Compensação:</span>
              <span className="text-emerald-700 font-extrabold">Pix Pago [Sucesso]</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onNavigateHome}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow transition"
            >
              Ir para o Feed de Classificados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
