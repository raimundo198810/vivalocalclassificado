import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  triggerNotification: (type: 'success' | 'info', text: string) => void;
}

export default function AuthModal({ onClose, onLoginSuccess, triggerNotification }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      // Login Simulation
      if (email === 'admin@vivalocal.com' && password === 'admin123') {
        const adminUser: UserType = {
          id: 'admin',
          name: 'Administrador Geral',
          email: 'admin@vivalocal.com',
          phone: '(11) 99999-9999',
          isVerified: true,
          listingsPublishedCount: 12,
          createdAt: new Date().toISOString()
        };
        onLoginSuccess(adminUser);
        triggerNotification('success', 'Bem-vindo ao Painel Administrativo do Vivalocal!');
        onClose();
        return;
      }

      const stored = localStorage.getItem('vivalocal_users');
      let users: UserType[] = stored ? JSON.parse(stored) : [];
      
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found && found.password === password) {
        onLoginSuccess(found);
        triggerNotification('success', `Seja bem-vindo de volta, ${found.name}!`);
        onClose();
      } else {
        setErrorMsg('E-mail ou senha incorretos. Dica: você pode se cadastrar ao lado!');
      }
    } else {
      // Register Simulation
      if (!name || !email || !password) {
        setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const stored = localStorage.getItem('vivalocal_users');
      let users: UserType[] = stored ? JSON.parse(stored) : [];

      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setErrorMsg('Este e-mail já está cadastrado em nosso sistema.');
        return;
      }

      const newUser: UserType & { password?: string } = {
        id: `user_${Date.now()}`,
        name,
        email,
        phone,
        password,
        isVerified: true, // Auto set verified under this registration
        listingsPublishedCount: 0,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('vivalocal_users', JSON.stringify(users));
      
      onLoginSuccess(newUser);
      triggerNotification('success', `Parabéns ${name}! Sua conta foi criada no Vivalocal.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
        
        {/* Modal Header banner */}
        <div className="bg-slate-900 px-5 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-1.5 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="space-y-1 mt-1">
            <h2 className="text-lg font-black tracking-tight">
              viva<span className="text-red-500">local</span> Classificados
            </h2>
            <p className="text-xs text-gray-400 font-semibold">
              {isLogin ? 'Faça login para faturar e gerenciar anúncios' : 'Crie sua conta gratuita em poucos segundos'}
            </p>
          </div>
        </div>

        {/* Modal form */}
        <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-150 p-3 rounded-xl flex gap-2.5 text-xs text-rose-800 font-semibold leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Seu Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Raimundo Moreira"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:border-red-500 transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">E-mail Cadastrado</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: seunome@email.com"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:border-red-500 transition"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Celular / WhatsApp (Opcional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (49) 99805-7924"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:border-red-500 transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira sua senha"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:border-red-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition cursor-pointer shadow-sm tracking-wide uppercase mt-2"
          >
            {isLogin ? 'Acessar Conta Vivalocal' : 'Criar minha Conta Comercial'}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-400 font-semibold">
              {isLogin ? 'Não tem uma conta?' : 'Já possui cadastro?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg('');
                }}
                className="text-red-600 font-extrabold ml-1.5 hover:underline cursor-pointer"
              >
                {isLogin ? 'Cadastre-se de Graça' : 'Faça Login'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
