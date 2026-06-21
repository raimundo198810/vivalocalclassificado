import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface CookieBannerProps {
  onNavigateToCookies: () => void;
}

export default function CookieBanner({ onNavigateToCookies }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem('vivalocal_cookies_accepted');
      if (!accepted) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('vivalocal_cookies_accepted', 'all');
    setVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('vivalocal_cookies_accepted', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md z-50 bg-slate-900 text-white rounded-2xl p-4.5 border border-slate-800 shadow-2xl space-y-3.5 animate-slideLeft border-l-4 border-l-red-500 font-sans" id="cookie-consent-widget">
      <div className="flex gap-2.5 items-start">
        <ShieldCheck className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs font-semibold leading-relaxed text-gray-300">
          <h4 className="font-extrabold text-white text-sm">Privacidade de Cookies & LGPD</h4>
          <p>
            Utilizamos cookies e tecnologias similares para personalizar e aprimorar a sua experiência em nossa plataforma. Ao prosseguir, você concorda com nossos cookies. Leia nossa{' '}
            <button
              onClick={onNavigateToCookies}
              type="button"
              className="text-red-500 font-bold hover:underline cursor-pointer"
            >
              Política de Cookies e RGPD
            </button>.
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-end">
        <button
          onClick={handleAcceptEssential}
          className="text-[10px] uppercase font-black text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 cursor-pointer transition"
        >
          Recusar
        </button>
        <button
          onClick={handleAcceptAll}
          className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl cursor-pointer shadow-sm transition"
        >
          Aceitar Cookies
        </button>
      </div>
    </div>
  );
}
