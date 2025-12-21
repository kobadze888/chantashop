import { getTranslations } from 'next-intl/server';
import TrackOrderContent from './TrackOrderContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  return {
    title: t('trackOrder'),
  };
}

export default function TrackOrderPage() {
  return <TrackOrderContent />;
}