// src/app/[locale]/cart/page.tsx

import { Metadata } from 'next';
// დავამატეთ .tsx გაფართოება Module Not Found შეცდომის თავიდან ასაცილებლად
import CartContent from './_components/CartContent.tsx'; 

export const metadata: Metadata = {
  title: 'ჩემი კალათა | ChantaShop.ge',
  description: 'თქვენი არჩეული პროდუქტები',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-mocha-light pt-32 pb-24 px-4 md:px-0">
      <div className="container mx-auto max-w-6xl">
        <CartContent />
      </div>
    </div>
  );
}