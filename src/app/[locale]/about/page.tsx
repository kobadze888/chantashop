import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { ArrowRight, Gem, Tag, Truck, Camera } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  const stats = [
    { num: t('stat1Num'), label: t('stat1Label') },
    { num: t('stat2Num'), label: t('stat2Label') },
    { num: t('stat3Num'), label: t('stat3Label') },
    { num: t('stat4Num'), label: t('stat4Label') },
  ];

  const values = [
    { icon: Gem,    title: t('value1Title'), desc: t('value1Desc') },
    { icon: Tag,    title: t('value2Title'), desc: t('value2Desc') },
    { icon: Truck,  title: t('value3Title'), desc: t('value3Desc') },
    { icon: Camera, title: t('value4Title'), desc: t('value4Desc') },
  ];

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50/40 to-white pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="absolute top-10 -right-16 w-72 h-72 rounded-full bg-brand-DEFAULT/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-16 w-80 h-80 rounded-full bg-rose-300/20 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-5 relative text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-brand-DEFAULT/20 text-brand-DEFAULT text-[11px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-DEFAULT" />
            {t('badge')}
          </span>
          <h1 className="font-display font-bold text-brand-dark leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl mb-5">
            {t('title')}
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="container mx-auto px-5 -mt-6 md:-mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 bg-brand-dark rounded-3xl p-6 md:p-10 shadow-xl shadow-brand-dark/10">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-white">
              <div className="font-display font-bold text-2xl md:text-4xl">{s.num}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.14em] text-white/55 mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="container mx-auto px-5 py-16 md:py-24 max-w-3xl text-center">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-5">{t('introTitle')}</h2>
        <p className="text-gray-500 text-base md:text-lg leading-relaxed">{t('introBody')}</p>
      </section>

      {/* ── Values ── */}
      <section className="bg-gradient-to-b from-white to-rose-50/40 py-16 md:py-24">
        <div className="container mx-auto px-5">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-dark text-center mb-12 md:mb-16">
            {t('valuesTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group bg-white rounded-3xl p-7 md:p-8 ring-1 ring-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-brand-DEFAULT/10 flex items-center justify-center mb-5 group-hover:bg-brand-DEFAULT transition-colors">
                  <Icon className="w-7 h-7 text-brand-DEFAULT group-hover:text-white transition-colors" strokeWidth={1.6} />
                </div>
                <h3 className="font-bold text-lg text-brand-dark mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-5 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-brand-dark text-white text-center px-6 py-14 md:py-20 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent" />
          <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-brand-DEFAULT/15 blur-3xl pointer-events-none" />
          <h2 className="font-display font-bold text-2xl md:text-4xl mb-8 max-w-xl mx-auto leading-snug">
            {t('ctaTitle')}
          </h2>
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-2.5 bg-white text-brand-dark px-8 py-4 rounded-full font-bold text-sm hover:bg-brand-DEFAULT hover:text-white transition-all shadow-lg"
          >
            {t('ctaButton')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
