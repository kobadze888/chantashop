import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { getContactInfo } from '@/lib/api';
import GeorgiaMap from '@/components/contact/GeorgiaMap';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  return { title: t('title'), description: t('subtitle') };
}

function waHref(v: string): string {
  if (!v) return '';
  if (v.startsWith('http')) return v;
  const digits = v.replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  const info = await getContactInfo();

  const phone = info.phone || '+995 591 29 06 10';
  const email = info.email || 'chantashopge@gmail.com';
  const whatsapp = waHref(info.whatsapp || info.phone || phone);

  const infoCards = [
    { icon: Phone, label: t('phoneLabel'), value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: Mail,  label: t('emailLabel'), value: email, href: `mailto:${email}` },
    ...(info.address ? [{ icon: MapPin, label: t('addressLabel'), value: info.address, href: '' }] : []),
    ...(info.workingHours ? [{ icon: Clock, label: t('hoursLabel'), value: info.workingHours, href: '' }] : []),
  ];

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50/40 to-white pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="absolute top-8 -right-16 w-72 h-72 rounded-full bg-brand-DEFAULT/10 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-5 relative text-center max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-brand-DEFAULT/20 text-brand-DEFAULT text-[11px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT" />
            {t('badge')}
          </span>
          <h1 className="font-display font-bold text-brand-dark leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="container mx-auto px-5 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 max-w-5xl mx-auto">

          {/* Info column */}
          <div className="lg:col-span-2 space-y-4">
            {infoCards.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-DEFAULT/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-DEFAULT" strokeWidth={1.7} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
                    <p className="text-brand-dark font-medium mt-0.5 whitespace-pre-line">{value}</p>
                  </div>
                </div>
              );
              return (
                <div key={label} className="bg-white rounded-2xl p-5 ring-1 ring-black/5 shadow-sm">
                  {href ? <a href={href} className="block hover:opacity-80 transition">{inner}</a> : inner}
                </div>
              );
            })}

            {/* WhatsApp + socials */}
            <div className="bg-brand-dark rounded-2xl p-5 space-y-4">
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-5 py-3 rounded-xl font-bold text-sm hover:brightness-95 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('whatsappCta')}
                </a>
              )}
              {(info.instagram || info.facebook) && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-3 text-center">{t('followUs')}</p>
                  <div className="flex gap-3 justify-center">
                    {info.instagram && (
                      <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition">
                        <Instagram className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {info.facebook && (
                      <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-DEFAULT hover:border-brand-DEFAULT transition">
                        <Facebook className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map column — delivery coverage across Georgia */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="font-display font-bold text-xl md:text-2xl text-brand-dark">{t('mapTitle')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('mapSubtitle')}</p>
            </div>
            <GeorgiaMap />
          </div>
        </div>
      </section>
    </div>
  );
}
