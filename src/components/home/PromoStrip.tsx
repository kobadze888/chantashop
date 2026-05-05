import { Truck, Bike, CreditCard } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PromoStrip() {
  const t = useTranslations('Home.Promo');

  const items = [
    { Icon: Truck, label: t('shipping'), desc: t('shippingDesc') },
    { Icon: Bike, label: t('courier'), desc: t('courierDesc') },
    { Icon: CreditCard, label: t('card'), desc: t('cardDesc') },
  ];

  return (
    <section className="container mx-auto px-3 md:px-6 mt-10 md:mt-14">
      <ul className="grid grid-cols-3 gap-2 md:gap-6">
        {items.map(({ Icon, label, desc }, i) => (
          <li
            key={i}
            className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 p-4 md:p-5 rounded-2xl bg-brand-gray border border-gray-100"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand-DEFAULT" />
            </div>
            <div className="text-center md:text-left min-w-0">
              <div className="font-bold text-[11px] md:text-sm text-brand-dark leading-tight">
                {label}
              </div>
              <div className="hidden md:block text-xs text-gray-500 mt-1">{desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
