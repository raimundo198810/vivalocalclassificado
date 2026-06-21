import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Check, ShieldCheck, AlertCircle, KeyRound, RefreshCw, Send } from 'lucide-react';
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
  
  // Advanced flows: recovery & verification
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingUser, setPendingUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRecoverySent(true);
      triggerNotification('info', `Instruções de recuperação enviadas com sucesso para ${recoveryEmail}`);
    }, 1200);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      // Login Simulation
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
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
        // Standard recovery demo validation
        if (found && (password === 'admin123' || password.length >= 4)) {
          onLoginSuccess(found);
          triggerNotification('success', `Seja bem-vindo de volta, ${found.name}!`);
          onClose();
        } else {
          setErrorMsg('E-mail ou senha incorretos. Dica: você pode se cadastrar ao lado!');
        }
      }, 700);
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

      const tempUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        phone,
        password,
        isVerified: false,
        listingsPublishedCount: 0,
        createdAt: new Date().toISOString()
      };

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setPendingUser(tempUser);
        setOtpMode(true);
        triggerNotification('info', `Código de verificação enviado por e-mail para ${email}`);
      }, 1000);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Código de segurança inválido.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pendingUser) {
        const verifiedUser: UserType = {
          ...pendingUser,
          isVerified: true
        };

        const stored = localStorage.getItem('vivalocal_users');
        let users: UserType[] = stored ? JSON.parse(stored) : [];
        users.push(verifiedUser);
        localStorage.setItem('vivalocal_users', JSON.stringify(users));

        onLoginSuccess(verifiedUser);
        triggerNotification('success', `E-mail verificado! Conta comercial ativada para ${verifiedUser.name}.`);
        onClose();
      }
    }, 900);
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
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-red-500 animate-float" />
              <span>viva<span className="text-red-500">local</span></span>
            </h2>
            <p className="text-xs text-gray-400 font-semibold">
              {recoveryMode 
                ? 'Recuperação de Senha Segura' 
                : otpMode 
                  ? 'Verificação de Identidade Obrigatória' 
                  : isLogin 
                    ? 'Faça login para faturar e gerenciar anúncios' 
                    : 'Crie sua conta gratuita em poucos segundos'}
            </p>
          </div>
        </div>

        {/* 1. PASSWORD RECOVERY SCREEN */}
        {recoveryMode ? (
          <form onSubmit={handlePasswordRecovery} className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Recuperação de Acessos</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              Insira o e-mail cadastrado associado à sua conta. Enviaremos as instruções de redefinição de credenciais de forma instantânea.
            </p>

            {recoverySent ? (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase">
                  <Check className="h-4 w-4 text-emerald-600 font-extrabold" />
                  <span>E-mail enviado!</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed font-semibold">
                  Verifique a sua caixa de entrada, spam ou lixo eletrônico. Siga os passos contidos lá para redefinir sua senha com segurança.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="Ex: raimundomoreira@email.com"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:border-red-500 transition"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              {!recoverySent && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Enviar Link de Recuperação</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setRecoveryMode(false);
                  setRecoverySent(false);
                  setErrorMsg('');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Voltar para o Login
              </button>
            </div>
          </form>
        ) : otpMode ? (
          /* 2. OTP TOKEN CODES RE-VERIFICATION SCREEN */
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
            <div className="flex items-center gap-3 bg-red-50 p-3 rounded-2xl">
              <ShieldCheck className="h-8 w-8 text-red-600 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-slate-800">Verifique seu E-mail</h4>
                <p className="text-[10px] text-gray-500 font-medium leading-none mt-0.5">Enviamos um token de segurança.</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              O Vivalocal preza pela segurança ativa de transações. Insira abaixo o código de validação recebido por e-mail para validar seus acessos.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center block">Código de Validação</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex. 905792"
                className="w-full bg-slate-100 border border-gray-300 rounded-2xl py-3 text-center text-lg font-black tracking-widest outline-none focus:bg-white focus:border-red-500 transition text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Confirmar Token & Cadastrar</span>}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpMode(false);
                  setPendingUser(null);
                  setErrorMsg('');
                }}
                className="w-full text-slate-500 hover:text-slate-800 font-bold text-xs py-2 transition text-center cursor-pointer"
              >
                Cancelar Cadastro
              </button>
            </div>
          </form>
        ) : (
          /* 3. STANDARD LOGIN / REGISTER SCREEN */
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
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Senha de Acesso</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMode(true);
                      setRecoveryEmail(email);
                    }}
                    className="text-[10px] text-red-600 hover:underline font-extrabold cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
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
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition cursor-pointer shadow-sm tracking-wide uppercase mt-2 btn-3d-red flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>{isLogin ? 'Acessar Conta Vivalocal' : 'Criar minha Conta Comercial'}</span>}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-400 font-semibold font-sans">
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
        )}
      </div>
    </div>
  );
}
