'use client';

import { useToastStore } from '@/store/toastStore';
import { CheckCircle, XCircle, Info, X, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Toast() {
  const { message, isVisible, type, hideToast } = useToastStore();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) setShouldRender(true);
  }, [isVisible]);

  if (!shouldRender) return null;

  const bgColors = {
    success: 'bg-black border-gray-800', // პრემიუმ შავი
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500'
  };

  const icons = {
    success: <ShoppingBag className="w-5 h-5 text-brand-DEFAULT" />,
    error: <XCircle className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />
  };

  return (
    <div 
      onAnimationEnd={() => !isVisible && setShouldRender(false)}
      className={`
        fixed z-[9999] 
        bottom-26 left-4 right-4 
        md:bottom-auto md:top-28 md:right-8 md:left-auto 
        md:w-auto md:min-w-[320px] md:max-w-sm
        transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
      `}
    >
      <div className={`${bgColors[type]} text-white px-5 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 backdrop-blur-md bg-opacity-95`}>
        <div className="shrink-0 bg-white/10 p-2 rounded-full">
          {icons[type]}
        </div>

        <p className="text-sm font-bold flex-1 leading-snug">
          {message}
        </p>

        <button 
          onClick={hideToast}
          className="shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
}