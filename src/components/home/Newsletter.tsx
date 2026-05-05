'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, ArrowRight, Check } from 'lucide-react';

export default function Newsletter() {
  const t = useTranslations('Home.Newsletter');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <section className="container mx-auto px-3 md:px-6 mt-16 md:mt-24 mb-16 md:mb-24">
      <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-brand-dark text-white px-6 py-12 md:px-16 md:py-20 text-center">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-DEFAULT/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-DEFAULT/20 blur-3xl" />

        <div className="relative max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 border border-white/15 mb-6">
            <Mail className="w-6 h-6 md:w-7 md:h-7 text-brand-DEFAULT" />
          </div>

          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-brand-DEFAULT font-bold mb-3">
            {t('subtitle')}
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight mb-4 md:mb-5 leading-tight">
            {t('title')}
          </h2>
          <p className="text-sm md:text-base text-white/70 mb-8 md:mb-10">{t('desc')}</p>

          {submitted ? (
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-white/10 border border-white/15 text-sm md:text-base">
              <Check className="w-5 h-5 text-brand-DEFAULT" />
              {t('success')}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('placeholder')}
                className="flex-1 bg-white/10 border border-white/15 rounded-full px-6 py-4 text-sm placeholder-white/40 focus:outline-none focus:border-brand-DEFAULT transition-colors"
              />
              <button
                type="submit"
                className="group bg-brand-DEFAULT text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-white hover:text-brand-dark transition-all flex items-center justify-center gap-2"
              >
                {t('cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-white/40 mt-5">{t('agree')}</p>
        </div>
      </div>
    </section>
  );
}
