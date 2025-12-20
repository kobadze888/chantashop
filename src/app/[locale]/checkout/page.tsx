import { Metadata } from 'next';
import CheckoutClient from './_components/CheckoutClient';
import { getTranslations } from 'next-intl/server';
import { redirect } from '@/navigation';
import { useCartStore } from '@/store/cartStore'; // Note: useCartStore is client-side, but we can't call it here directly.

export const metadata: Metadata = {
  title: 'შეკვეთის გაფორმება | ChantaShop',
  description: 'გააფორმე შეკვეთა სწრაფად და მარტივად',
};

// Dummy check for cart items (In a real app, this would check server-side cart state)
async function hasCartItems() {
    // Since zustand state (cartStore) is client-side, we can't check it directly 
    // in a server component. In a real scenario, you'd check a cookie/session.
    // For now, we will assume the client redirects if the cart is empty.
    return true; 
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Checkout'); // Assuming you create checkout translations

  if (!(await hasCartItems())) {
    // redirect('/cart'); // Enable this if you integrate server-side cart state
  }

  return (
    <div className="md:pt-36 pt-28 pb-24 min-h-screen bg-white">
     <div className="container mx-auto px-4 xl:px-0 max-w-[1400px]">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-dark mb-10">
          {locale === 'ka' ? 'შეკვეთის გაფორმება' : 'Checkout'}
        </h1>
        <CheckoutClient locale={locale} />
      </div>
    </div>
  );
}