import { getTranslations } from 'next-intl/server';
import WishlistContent from './WishlistContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Wishlist' });
  return {
    title: t('title'),
  };
}

export default function WishlistPage({ params }: { params: { locale: string } }) {
  return <WishlistContent locale={params.locale} />;
}