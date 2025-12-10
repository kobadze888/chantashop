import { Metadata } from 'next';
import CartContent from './_components/CartContent';

export const metadata: Metadata = {
  title: 'ჩემი კალათა | ChantaShop.ge',
  description: 'თქვენი არჩეული პროდუქტები',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-mocha-light pt-32 pb-24 px-4 md:px-0">
      <div className="container mx-auto px-4 xl:px-0 max-w-[1400px]">
        <CartContent />
      </div>
    </div>
  );
}