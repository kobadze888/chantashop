'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const t = useTranslations('ContactPage');
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <p className="text-lg font-semibold text-brand-dark max-w-sm">{t('success')}</p>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:border-brand-DEFAULT focus:bg-white focus:ring-2 focus:ring-brand-DEFAULT/15 outline-none transition';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brand-dark/70 mb-1.5">{t('name')}</label>
          <input type="text" required value={form.name} onChange={set('name')} placeholder={t('namePh')} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-dark/70 mb-1.5">{t('phone')}</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder={t('phonePh')} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-brand-dark/70 mb-1.5">{t('email')}</label>
        <input type="email" value={form.email} onChange={set('email')} placeholder={t('emailPh')} className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-brand-dark/70 mb-1.5">{t('message')}</label>
        <textarea required rows={5} value={form.message} onChange={set('message')} placeholder={t('messagePh')} className={`${inputCls} resize-none`} />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group w-full inline-flex items-center justify-center gap-2.5 bg-brand-dark text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-DEFAULT transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('sending')}
          </>
        ) : (
          <>
            {t('send')}
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
