// src/app/[locale]/track-order/[id]/page.tsx
import { getOrder } from '@/lib/actions';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { ArrowLeft, CheckCircle, Package, Truck, Home, Clock } from 'lucide-react';
import Image from 'next/image';

const formatPrice = (price: string) => {
    const num = parseFloat(price.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? price : `${num} ₾`;
};

// სტატუსის გამოთვლა დროის მიხედვით
function calculateStatusStep(orderDateString: string) {
    const orderDate = new Date(orderDateString);
    const now = new Date();
    
    const diffHours = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    if (diffHours >= 72) return 4; // 3 დღე
    if (diffHours >= 9) return 3;  // 9 სთ
    if (diffHours >= 5) return 2;  // 5 სთ
    return 1;                      // 0-5 სთ
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id } = await params;
  const t = await getTranslations('Success');
  const tTrack = await getTranslations('Tracking');
  
  const order = await getOrder(id);

  if (!order) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl font-bold text-brand-dark mb-4">{tTrack('notFound')}</h1>
            <Link href="/track-order" className="text-brand-DEFAULT underline font-bold">{tTrack('back')}</Link>
        </div>
    );
  }

  const currentStep = calculateStatusStep(order.date);
  const formattedDate = new Date(order.date).toLocaleDateString('ka-GE', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-3xl">
        
        <div className="flex items-center gap-4 mb-8">
            <Link href="/track-order" className="p-3 bg-white rounded-full shadow-sm hover:bg-brand-light transition text-brand-dark">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
                <h1 className="text-2xl font-serif font-black text-brand-dark">
                    {tTrack('orderFound')}{order.orderNumber}
                </h1>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {formattedDate}
                </p>
            </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-DEFAULT to-purple-500"></div>
             
             <div className="relative my-8 px-2">
                <div className="absolute top-5 left-4 right-4 h-1 bg-gray-100 rounded-full -z-0"></div>
                <div 
                    className="absolute top-5 left-4 h-1 bg-green-500 rounded-full transition-all duration-1000 -z-0"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>

                <div className="flex justify-between relative z-10">
                    <TimelineItem icon={CheckCircle} label={t('timeline_1')} step={1} currentStep={currentStep} />
                    <TimelineItem icon={Package} label={t('timeline_2')} step={2} currentStep={currentStep} />
                    <TimelineItem icon={Truck} label={t('timeline_3')} step={3} currentStep={currentStep} />
                    <TimelineItem icon={Home} label={t('timeline_4')} step={4} currentStep={currentStep} />
                </div>
             </div>

             <div className="bg-brand-light/40 rounded-xl p-4 text-center">
                 <p className="text-brand-dark font-bold text-sm">
                     {currentStep === 1 && "თქვენი შეკვეთა მიღებულია და მალე დამუშავდება."}
                     {currentStep === 2 && "თქვენი შეკვეთა მუშავდება საწყობში."}
                     {currentStep === 3 && "ამანათი გზაშია და მალე მოგეწოდებათ."}
                     {currentStep === 4 && "ამანათი ჩაბარებულია. გმადლობთ!"}
                 </p>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-brand-dark">ნივთები</h3>
                <div className="space-y-4">
                    {order.lineItems.nodes.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 items-center">
                            <div className="relative w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                <Image 
                                    src={item.product?.node?.image?.sourceUrl || '/placeholder.jpg'} 
                                    alt={item.product?.node?.name || 'Product'} 
                                    fill 
                                    className="object-cover" 
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-brand-dark truncate">{item.product?.node?.name}</p>
                                <p className="text-xs text-gray-500">რაოდენობა: {item.quantity}</p>
                            </div>
                            <span className="font-bold text-sm">{formatPrice(item.total)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-bold text-gray-500">სულ გადახდილი:</span>
                    <span className="text-xl font-black text-brand-DEFAULT">{formatPrice(order.total)}</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-brand-dark">მიწოდების მისამართი</h3>
                <div className="space-y-1 text-gray-600 text-sm">
                    <p className="font-bold text-brand-dark text-base">{order.billing?.firstName} {order.billing?.lastName}</p>
                    <p>{order.billing?.city}</p>
                    <p>{order.billing?.address1}</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wide">გადახდა შესრულებულია</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ icon: Icon, label, step, currentStep }: { icon: any, label: string, step: number, currentStep: number }) {
    const isActive = step <= currentStep;
    const isCurrent = step === currentStep;

    return (
        <div className="flex flex-col items-center gap-2 w-1/4">
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10
                ${isActive ? 'bg-green-500 border-green-100 text-white shadow-lg shadow-green-200' : 'bg-white border-gray-100 text-gray-300'}
                ${isCurrent ? 'scale-110 ring-4 ring-green-50' : ''}
            `}>
                <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] text-center font-bold tracking-wider transition-colors uppercase ${isActive ? 'text-green-600' : 'text-gray-300'}`}>
                {label}
            </span>
        </div>
    );
}