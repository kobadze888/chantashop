import { Link } from '@/navigation';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';

export default async function SuccessPage({
  searchParams,
  params
}: {
  searchParams: Promise<{ orderNumber: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { orderNumber } = await searchParams;
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-4xl font-serif font-black text-brand-dark mb-4">
          {locale === 'ka' ? 'მადლობა შეკვეთისთვის!' : 'Thank you for your order!'}
        </h1>
        
        <p className="text-gray-500 text-lg mb-8">
          {locale === 'ka' 
            ? `თქვენი შეკვეთა #${orderNumber || '...'} მიღებულია და მუშავდება.`
            : `Your order #${orderNumber || '...'} has been received and is being processed.`}
        </p>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10">
          <p className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">
            {locale === 'ka' ? 'შეკვეთის ნომერი' : 'Order Number'}
          </p>
          <p className="text-3xl font-black text-brand-dark font-serif">#{orderNumber}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/collection" 
            className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-brand-DEFAULT transition shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {locale === 'ka' ? 'შოპინგის გაგრძელება' : 'Continue Shopping'}
          </Link>
          
          <Link 
            href="/" 
            className="w-full bg-white text-brand-dark border border-gray-200 py-4 rounded-xl font-bold hover:border-brand-dark transition flex items-center justify-center gap-2"
          >
            {locale === 'ka' ? 'მთავარ გვერდზე დაბრუნება' : 'Back to Home'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}