import React, { useState, useEffect, useRef } from 'react';
import { Send, User, CheckCheck, Smile, Phone, ShieldCheck, Mail, ArrowLeft, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  sellerName: string;
  listingTitle: string;
  listingPrice: string;
  listingImage: string;
  unreadCount: number;
  messages: Message[];
  autoReplies: string[];
}

export default function ChatPanel() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load initial simulated chats list
  useEffect(() => {
    const stored = localStorage.getItem('vivalocal_chats');
    if (stored) {
      setChats(JSON.parse(stored));
    } else {
      const initialChats: Chat[] = [
        {
          id: 'chat_1',
          sellerName: 'Marcos Silva',
          listingTitle: 'Honda Civic LXS 2018 Automático',
          listingPrice: 'R$ 79.900,00',
          listingImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
          unreadCount: 1,
          autoReplies: [
            'Olá! O Civic está disponível para visitas sim. Fica localizado no centro da cidade.',
            'O carro está com as revisões em dia e IPVA pago. Aceito propostas à vista, sem trocas.',
            'Com certeza, você prefere marcar amanhã de manhã ou de tarde?'
          ],
          messages: [
            { id: 'm1', sender: 'them', text: 'Olá, obrigado pelo interesse! O carro está impecável.', timestamp: '14:22' },
            { id: 'm2', sender: 'me', text: 'Boa tarde Marcos, aceita fazer vistoria cautelar?', timestamp: '14:24' },
            { id: 'm3', sender: 'them', text: 'Sim, com certeza. Vistoria cautelar é sinal de segurança. Está disponível pra ver amanhã?', timestamp: '14:25' }
          ]
        },
        {
          id: 'chat_2',
          sellerName: 'Roberto Imóveis SP',
          listingTitle: 'Apartamento Estúdio Mobiliado Pinheiros',
          listingPrice: 'R$ 3.100 / mês',
          listingImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
          unreadCount: 0,
          autoReplies: [
            'Perfeito! O condomínio já inclui água e internet de fibra ótica.',
            'O aluguel é direto comigo. Preciso apenas de caução de 2 meses.',
            'Vou te enviar a lista de documentos necessários daqui a pouquinho.'
          ],
          messages: [
            { id: 'm4', sender: 'them', text: 'Seja bem-vindo. O estúdio aceita pet de pequeno porte.', timestamp: 'Ontem' },
            { id: 'm5', sender: 'me', text: 'Que ótimo! O condomínio está incluso no valor?', timestamp: 'Ontem' },
            { id: 'm6', sender: 'them', text: 'Sim, condomínio e IPTU inclusos, exceto luz.', timestamp: 'Ontem' }
          ]
        }
      ];
      setChats(initialChats);
      localStorage.setItem('vivalocal_chats', JSON.stringify(initialChats));
    }
  }, []);

  const activeChat = chats.find(c => c.id === selectedChatId) || null;

  // Auto scroll to message bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId || !activeChat) return;

    const myMsg: Message = {
      id: `my_${Date.now()}`,
      sender: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = chats.map(c => {
      if (c.id === selectedChatId) {
        return {
          ...c,
          messages: [...c.messages, myMsg],
          unreadCount: 0
        };
      }
      return c;
    });

    setChats(updatedChats);
    localStorage.setItem('vivalocal_chats', JSON.stringify(updatedChats));
    setNewMessage('');

    // Trigger typing and auto reply logic after 1.5 seconds!
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const currentChatState = updatedChats.find(c => c.id === selectedChatId);
      if (!currentChatState) return;

      const replyText = currentChatState.autoReplies.length > 0 
        ? currentChatState.autoReplies[0] 
        : 'Certo, entrarei em contato para que possamos finalizar a negociação!';

      const remainingReplies = currentChatState.autoReplies.slice(1);

      const sellerMsg: Message = {
        id: `sel_${Date.now()}`,
        sender: 'them',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      const finalChats = updatedChats.map(c => {
        if (c.id === selectedChatId) {
          return {
            ...c,
            messages: [...c.messages, sellerMsg],
            autoReplies: remainingReplies
          };
        }
        return c;
      });

      setChats(finalChats);
      localStorage.setItem('vivalocal_chats', JSON.stringify(finalChats));
    }, 1600);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-3 min-h-[550px] max-w-6xl mx-auto animate-fadeIn select-none" id="chat-workspace">
      
      {/* Left Column: Chats List */}
      <div className={`border-r border-gray-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm tracking-tight">Negociações Vivalocal</h3>
            <p className="text-[10px] text-gray-400 font-semibold leading-none mt-0.5">Central de Mensagens do Chat</p>
          </div>
          <span className="bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {chats.filter(c => c.unreadCount > 0).length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {chats.map(chat => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            return (
              <button
                key={chat.id}
                onClick={() => {
                  setSelectedChatId(chat.id);
                  // Resete unread counter
                  setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
                }}
                className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  selectedChatId === chat.id ? 'bg-indigo-50/45' : 'hover:bg-slate-55'
                }`}
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                    {chat.sellerName.charAt(0)}
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-800 text-xs truncate max-w-[120px]">{chat.sellerName}</span>
                    <span className="text-[9px] text-gray-400 font-bold">{lastMsg ? lastMsg.timestamp : ''}</span>
                  </div>
                  <p className="text-[10px] text-red-600 font-bold truncate mt-0.5">{chat.listingTitle}</p>
                  <p className="text-[11px] text-slate-500 font-semibold truncate mt-1">
                    {lastMsg ? lastMsg.text : 'Nenhuma mensagem recente'}
                  </p>
                </div>
              </button>
            );
          })}
          {chats.length === 0 && (
            <p className="text-xs text-gray-400 font-semibold text-center py-12">Nenhuma conversa ativa no momento.</p>
          )}
        </div>
      </div>

      {/* Right Column: Message Dialogue Window */}
      {activeChat ? (
        <div className="col-span-1 md:col-span-2 flex flex-col h-full bg-slate-50/50">
          
          {/* Active Head */}
          <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedChatId(null)}
              className="md:hidden p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-slate-700" />
            </button>

            <div className="h-10 w-10 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center shadow-inner">
              {activeChat.sellerName.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 leading-none">
                <span>{activeChat.sellerName}</span>
                <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-emerald-100 leading-none">
                  <ShieldCheck className="h-2.5 w-2.5 fill-current" />
                  VERIFICADO
                </span>
              </h4>
              <p className="text-[10px] text-gray-400 font-medium truncate mt-1">
                Ref: <span className="font-bold text-red-600">{activeChat.listingTitle}</span> ({activeChat.listingPrice})
              </p>
            </div>
          </div>

          {/* Secure Trading Indicator */}
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center gap-1.5 text-[10px] text-amber-800 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>Evite depósitos e pagamentos PIX adiantados. Faça encontros seguros em locais públicos!</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
            {activeChat.messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                    msg.sender === 'me' 
                      ? 'bg-red-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-75">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'me' && <CheckCheck className="h-2.5 w-2.5 text-white/90" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-bl-none p-3 flex items-center gap-1">
                  <span className="text-[9px] text-slate-500 font-black animate-pulse">Digitando...</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2.5 items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua resposta no Vivalocal Chat..."
              className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:border-red-500 transition text-slate-700"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-xl transition duration-300 transform active:scale-95 flex items-center justify-center shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      ) : (
        /* Empty Welcome State */
        <div className="col-span-1 md:col-span-2 hidden md:flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
          <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 shadow-inner">
            <Mail className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Suas Conversas Vivalocal</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-semibold mt-1.5">
            Selecione um vendedor na barra esquerda para iniciar a negociação direta de forma gratuita e rápida.
          </p>
        </div>
      )}

    </div>
  );
}
