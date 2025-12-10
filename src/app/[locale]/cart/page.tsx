// src/app/[locale]/cart/page.tsx

import { Metadata } from 'next';
// ✅ ამოვიღეთ .tsx გაფართოება (Build Error #3)
import CartContent from './_components/CartContent'; 

export const metadata: Metadata = {
  title: 'ჩემი კალათა | ChantaShop.ge',
  description: 'თქვენი არჩეული პროდუქტები',
};

// ✅ დავამატეთ { params } მიღება და locale-ის ამოღება
export default function CartPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  return (
    <div className="min-h-screen bg-mocha-light pt-32 pb-24 px-4 md:px-0">
      <div className="container mx-auto px-4 xl:px-0 max-w-[1400px]">
        <CartContent locale={locale} /> {/* ✅ locale-ის გადაცემა */}
      </div>
    </div>
  );
}