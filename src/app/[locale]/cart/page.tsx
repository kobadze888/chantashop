import CartContent from './_components/CartContent';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Cart' });
  return {
    title: t('title'),
  };
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-mocha-light pt-32 pb-24 px-4 md:px-0">
      <div className="container mx-auto px-4 xl:px-0 max-w-[1400px]">
        <CartContent />
      </div>
    </div>
  );
}