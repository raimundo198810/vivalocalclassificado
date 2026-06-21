import React, { useState } from 'react';
import { Mail, Phone, ShieldCheck, MapPin, Search, HelpCircle, FileText, Compass, Info, Check } from 'lucide-react';

interface LegalPagesProps {
  page: 'about' | 'privacy' | 'cookies' | 'terms' | 'sitemap' | 'contact' | 'help';
  onNavigate: (page: any) => void;
  categoriesList?: any[];
}

export default function LegalPages({ page, onNavigate, categoriesList = [] }: LegalPagesProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Dúvida');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [faqSearch, setFaqSearch] = useState('');

  const faqs = [
    { q: 'Como criar um anúncio no Vivalocal?', a: 'Para anunciar, basta clicar no botão "Anunciar Grátis" no canto superior direito de qualquer página, preencher as informações do seu produto, serviço ou imóvel, cadastrar as fotos (até 10 por anúncio) e clicar em enviar. O anúncio passará por nossa moderação rápida antes de ficar público!' },
    { q: 'Quais são as vantagens dos planos de destaque?', a: 'Os planos pagos (VIP, Destaque 30 dias e Destaque 7 dias) posicionam o seu anúncio no topo das buscas gerais e dentro das respectivas categorias. Anúncios destacados geram até 12x mais visitas, contam com selo exclusivo de verificação e prioridade máxima de cliques.' },
    { q: 'O pagamento via Pix é seguro e automático?', a: 'Sim! Nosso sistema utiliza tecnologia avançada com chaves dinâmicas Pix cadastradas no Banco Central. Logo após realizar a transferência e escanear o QR Code, a transação é processada em segundos e seus recursos premium são ativados no anúncio imediatamente.' },
    { q: 'Como funciona a lei LGPD sobre meus dados?', a: 'Em estrito respeito à Lei Geral de Proteção de Dados (LGPD), garantimos total privacidade e liberdade do usuário. Seus dados cadastrais só são utilizados para manutenção de sua conta e segurança das negociações. Você pode editar ou remover seus dados a qualquer momento em seu painel.' },
    { q: 'Como posso falar com o suporte Vivalocal?', a: 'Você pode entrar em contato conosco pelo formulário do Fale Conosco, pelo e-mail oficial de suporte ou enviando mensagens diretamente ao nosso número oficial do WhatsApp: (49) 99805-7924.' }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  const handleDownloadSitemapXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://vivalocal.com.br/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://vivalocal.com.br/ajuda</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://vivalocal.com.br/fale-conosco</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://vivalocal.com.br/sobre</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://vivalocal.com.br/privacidade</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-white border border-gray-150 rounded-2xl shadow-sm animate-fadeIn" id="legal-pages-container">
      
      {/* 1. SOBRE NÓS */}
      {page === 'about' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <Info className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-black text-slate-800">Sobre Nós - Vivalocal Classificados</h1>
          </div>
          <div className="prose text-xs md:text-sm text-slate-700 leading-relaxed space-y-4">
            <p className="font-bold text-slate-800 text-sm">
              Bem-vindo ao Vivalocal, o portal inteligente de anúncios locais que conecta pessoas de forma imediata, simples e segura.
            </p>
            <p>
              Fundado com o objetivo de descomplicar o comércio eletrônico regional no Brasil, o Vivalocal provou ser um parceiro confiável para milhares de anunciantes. Proporcionamos um ambiente livre de atritos para que vendedores, provedores de serviços, corretores imobiliários e compradores encontrem exatamente o que buscam na sua própria cidade.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl space-y-1.5">
                <span className="font-black text-xs text-red-700 uppercase tracking-wider block">Nossa Missão</span>
                <p className="text-xs text-slate-600 font-medium">Empoderar nossa comunidade facilitando negociações justas com total clareza e credibilidade.</p>
              </div>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                <span className="font-black text-xs text-emerald-700 uppercase tracking-wider block">Nossa Visão</span>
                <p className="text-xs text-slate-600 font-medium font-semibold">Tornar-se o ponto de referência unificado e seguro do comércio sustentável local no Sul e em todo o Brasil.</p>
              </div>
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1.5">
                <span className="font-black text-xs text-blue-700 uppercase tracking-wider block">Nossos Valores</span>
                <p className="text-xs text-slate-600 font-semibold">Transparência absoluta, foco na usabilidade, proteção ao usuário, responsabilidade social e modernização contínua.</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-slate-850 text-xs uppercase tracking-wider">Contato Oficial e Redes Sociais</h3>
              <p className="text-xs text-gray-500 font-medium">Estamos sempre prontos para lhe ouvir ou responder qualquer demanda institucional:</p>
              <ul className="text-xs space-y-2 text-slate-700 font-semibold mt-2">
                <li className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-emerald-600" /> WhatsApp Oficial: <strong>(49) 99805-7924</strong></li>
                <li className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-red-600" /> E-mail Institucional: support@vivalocal.com.br</li>
                <li className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gray-500" /> Sede: São Paulo (SP) / Santa Catarina (SC)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. POLÍTICA DE PRIVACIDADE LGPD */}
      {page === 'privacy' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <ShieldCheck className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-black text-slate-800">Política de Privacidade (LGPD)</h1>
          </div>
          <div className="prose text-xs text-slate-600 leading-relaxed space-y-4">
            <p className="text-xs font-semibold text-slate-700">
              Esta política estabelece as diretrizes de tratamento de dados pessoais coletados pela plataforma Vivalocal Classificados em estrito cumprimento da Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD).
            </p>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-850 text-xs">1. Quais dados coletamos</h3>
              <p>
                Coletamos apenas informações fornecidas de forma voluntária por você no momento de cadastro da conta e da postagem de anúncios: Nome completo, endereço de e-mail, telefone para contato comercial, localização aproximada (Estado, Cidade e Bairro) e imagens enviadas por upload voluntário.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-850 text-xs">2. Como os dados são utilizados</h3>
              <p>
                Os dados são estritamente direcionados para autenticar contas, proteger contra publicações fraudulentas em massa, e possibilitar o contato comercial imediato entre potenciais compradores e o vendedor através de WhatsApp ou chat integrado.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-850 text-xs">3. Seus Direitos</h3>
              <p>
                Como proprietário legal dos seus dados sob a LGPD, você possui o direito de solicitar a qualquer instante: a confirmação de tratamento de dados, o acesso completo aos dados armazenados, a exclusão definitiva da conta e dados vinculados do nosso sistema de arquivamento por solicitação.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-850 text-xs">4. Segurança dos Dados</h3>
              <p>
                Adotamos rígidos padrões de segurança informática, implementando criptografia SSL no tráfego de dados, barreiras contra injeção de scripts maliciosos e isolamento de chaves secretas para impedir o vazamento ou furto de informações privativas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. POLÍTICA DE COOKIES */}
      {page === 'cookies' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <FileText className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-black text-slate-800">Política de Cookies</h1>
          </div>
          <div className="prose text-xs text-slate-600 leading-relaxed space-y-4">
            <p>
              Explicamos detalhadamente de que forma nosso site utiliza cookies e tecnologias análogas de rastreamento local para lhe proporcionar uma navegação muito mais otimizada e segura.
            </p>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-850 text-xs">O que são Cookies?</h3>
              <p>
                Cookies são pequenos arquivos em formato de texto instalados e arquivados eletronicamente no disco rígido ou navegador do seu dispositivo móvel ou robô no momento em que você se conecta ao site. Eles guardam preferências básicas de exibição e identidade.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-bold text-slate-850 text-xs">Aplicações e Tipos de Cookies</h3>
              <ul className="list-disc pl-5 space-y-1.5 font-semibold">
                <li><strong>Cookies Estritamente Necessários:</strong> Cruciais para armazenar seu login, anúncios de classificados favoritados no navegador e o funcionamento dinâmico da área do vendedor.</li>
                <li><strong>Cookies de Performance e Estatística:</strong> Conectados a relatórios agregados anônimos por meio de Google Analytics para sabermos quais páginas possuem maior volume de visitas para otimização futura.</li>
              </ul>
            </div>

            <p className="p-3.5 bg-gray-50 rounded-xl font-semibold border border-gray-100">
              Você pode aceitar ou recusar cookies de marketing diretamente editando as preferências do seu navegador web, ciente de que a desativação de cookies funcionais pode desativar o salvamento de seus favoritos e preferências de busca automática.
            </p>
          </div>
        </div>
      )}

      {/* 4. TERMOS DE USO */}
      {page === 'terms' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <HelpCircle className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-black text-slate-800">Termos e Condições de Uso</h1>
          </div>
          <div className="prose text-xs text-slate-600 leading-relaxed space-y-4">
            <p>
              Ao utilizar ou registrar anúncios na plataforma Vivalocal Classificados, você concorda expressa e incondicionalmente com todos os termos e orientações legais descritos abaixo:
            </p>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-850 text-xs">1. Cadastro e Publicações</h3>
              <p>
                O anunciante assume integral e exclusiva responsabilidade cível, penal e administrativa pela legalidade, veracidade, estado material de conservação e garantia jurídica dos produtos, imóveis ou serviços que decide divulgar publicamente no site.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-850 text-xs">2. Conteúdo Proibido e Moderação Automática</h3>
              <p>
                É terminantemente vetada a publicação de anúncios relacionados a vendas ilegais, produtos contrafeitos ou roubados, golpes financeiros, propaganda política, difamações, armas de fogo de uso controlado e publicidade repetitiva de spam. Todos os anúncios passam por nosso sistema eletrônico de moderação automático e moderadores sob demanda corporativa.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-850 text-xs">3. Responsabilidade das Negociações</h3>
              <p>
                O Vivalocal funciona unicamente como uma plataforma virtual de anúncios focados em visibilidade e conexões livres. Não intermediamos a entrega física, o envio postal, o recebimento de valores físicos de compras ou a integridade material das mercadorias. Recomendamos encontros exclusivamente em praças e locais públicos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAPA DO SITE */}
      {page === 'sitemap' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <Compass className="h-6 w-6 text-red-600" />
              <h1 className="text-xl font-black text-slate-800">Mapa do Site (Sitemap)</h1>
            </div>
            <button
              onClick={handleDownloadSitemapXml}
              className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-colors"
            >
              Baixar XML Sitemap
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
              <h3 className="font-black text-slate-800 border-b border-slate-200 pb-1 uppercase tracking-wider text-xs">Navegação Principal</h3>
              <ul className="space-y-2 font-semibold text-slate-705">
                <li><button onClick={() => onNavigate('home')} className="text-red-600 hover:underline">Página Inicial (Feed Geral)</button></li>
                <li><button onClick={() => onNavigate('my-ads')} className="text-red-600 hover:underline">Painel do Anunciante</button></li>
                <li><button onClick={() => onNavigate('favorites')} className="text-red-600 hover:underline">Anúncios Favoritos Salvos</button></li>
                <li><button onClick={() => onNavigate('plans')} className="text-red-600 hover:underline">Planos Premium & Preços</button></li>
              </ul>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
              <h3 className="font-black text-slate-800 border-b border-slate-200 pb-1 uppercase tracking-wider text-xs">Links Legais e Suporte</h3>
              <ul className="space-y-2 font-semibold text-slate-705">
                <li><button onClick={() => onNavigate('about')} className="hover:text-red-600">Sobre Nós</button></li>
                <li><button onClick={() => onNavigate('help')} className="hover:text-red-600">Central de Ajuda / FAQ</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-red-600">Fale Conosco</button></li>
                <li><button onClick={() => onNavigate('privacy')} className="hover:text-red-600">Política de Privacidade LGPD</button></li>
                <li><button onClick={() => onNavigate('cookies')} className="hover:text-red-600">Política de Cookies</button></li>
                <li><button onClick={() => onNavigate('terms')} className="hover:text-red-600">Termos de Uso</button></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-2">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Categorias de Pesquisa Organizadas</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {categoriesList.map(cat => (
                  <span key={cat.id} className="bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FALE CONOSCO */}
      {page === 'contact' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <Mail className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-black text-slate-800">Fale Conosco</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Tem dúvidas sobre segurança, pagamentos Pix ou quer reportar anúncios duplicados? Use o formulário ou fale conosco diretamente nos canais:
              </p>
              <div className="space-y-3">
                <div className="bg-slate-50 border border-gray-100 p-3.5 rounded-xl space-y-1">
                  <span className="block text-[10px] text-emerald-700 font-black uppercase tracking-wider">WhatsApp de Suporte</span>
                  <a href="https://wa.me/5549998057924" target="_blank" rel="noreferrer" className="text-sm font-black text-slate-800 hover:text-emerald-600 flex items-center gap-1.5">
                    <span>(49) 99805-7924</span>
                  </a>
                  <span className="text-[10px] text-gray-400 block font-semibold leading-relaxed">Resposta rápida em horário comercial.</span>
                </div>
                <div className="bg-slate-50 border border-gray-100 p-3.5 rounded-xl space-y-1">
                  <span className="block text-[10px] text-red-700 font-black uppercase tracking-wider">E-mail Oficial</span>
                  <p className="text-sm font-bold text-slate-800">suporte@vivalocal.com.br</p>
                  <span className="text-[10px] text-gray-400 block font-semibold">Tempo de retorno de até 24 horas úteis.</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-150 p-6 rounded-2xl text-center space-y-3">
                  <div className="h-10 w-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-emerald-800">Mensagem Enviada com Sucesso!</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed font-semibold">
                    Agradecemos seu contato. Nossa equipe de moderação e suporte responderá seu e-mail em até 24 horas úteis.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Seu Nome</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Ex: João Silva"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:border-red-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">E-mail de Retorno</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="joao@gmail.com"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:border-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase col-span-2">Assunto do Contato</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:bg-white"
                    >
                      <option value="Dúvida">Dúvida sobre Anúncios</option>
                      <option value="Pagamento Pix">Erro ou Dúvida de Pagamento Pix</option>
                      <option value="Premium">Destaques e Planos VIP</option>
                      <option value="Denúncia">Denúncia de Fraude ou Abusos</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Sua Mensagem / Descrição do ocorrido</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Descreva detalhadamente o que precisa..."
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:border-red-500 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Enviar Formulário de Contato
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. CENTRAL DE AJUDA */}
      {page === 'help' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <HelpCircle className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-black text-slate-800">Central de Ajuda Vivalocal</h1>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Busque por palavras de suporte (Ex: Pix, Anunciar, Premium...)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 bg-red-50/10 rounded-xl">
                <span className="block font-black text-xs text-red-700 uppercase tracking-wider mb-1">Guia de Publicação</span>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">Insira títulos claros, coloque preços reais ou marque a combinar, indique fotos nítidas do seu dispositivo móvel ou links seguros, e nunca replique o mesmo anúncio múltiplas vezes para evitar travas de moderação contra spam.</p>
              </div>
              <div className="p-4 border border-gray-100 bg-emerald-50/10 rounded-xl">
                <span className="block font-black text-xs text-emerald-700 uppercase tracking-wider mb-1">Guia para Pagamentos</span>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">Toda contratação de relevância e destaque premium (VIP, Destaque 30d ou Destaque 7d) utiliza chave automática gerada na tela. Faça o pagamento do QR Code apenas por canais internos Pix Copia e Cola para segurança imediata.</p>
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Principais Perguntas Respondidas</h3>
              <div className="space-y-3">
                {filteredFaqs.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">Nenhum resultado corresponde à sua pesquisa de dúvidas.</p>
                ) : (
                  filteredFaqs.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-xs space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500 shrink-0"></span>
                        {item.q}
                      </h4>
                      <p className="text-slate-600 leading-relaxed font-semibold pl-3.5">{item.a}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
