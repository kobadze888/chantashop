import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { CheckCircle, XCircle, Package, Truck, Home, ArrowRight, Receipt, CreditCard } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';

const WP_URL = process.env.NEXT_PUBLIC_WP_URL;
const CK = process.env.WC_CONSUMER_KEY;
const CS = process.env.WC_CONSUMER_SECRET;

// შეკვეთის წამოღება
async function getOrderDetails(id: string) {
  if (!id || id === '---') return null;
  try {
    const response = await axios.get(`${WP_URL}/wp-json/wc/v3/orders/${id}`, {
      auth: { username: CK!, password: CS! }
    });
    return response.data;
  } catch (error) {
    console.error("Order fetch error:", error);
    return null;
  }
}

export default async function SuccessPage({ 
  searchParams,
  params
}: { 
  searchParams: Promise<{ wc_order_id?: string; orderId?: string; status?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations('Success');
  const sp = await searchParams;
  const { locale } = await params;

  const idFromUrl = sp.wc_order_id || sp.orderId || '---';
  const status = sp.status;
  const order = await getOrderDetails(idFromUrl);

  // ❌ თუ შეკვეთა ვერ მოიძებნა
  if (!order) {
     return <div className="min-h-screen flex items-center justify-center">შეკვეთა ვერ მოიძებნა...</div>;
  }

  // --- მონაცემების დამუშავება ---
  const items = order.line_items || [];
  const currency = order.currency_symbol || "₾";
  const shippingTotal = parseFloat(order.shipping_total || "0");
  const subtotal = parseFloat(order.total) - shippingTotal;
  const total = parseFloat(order.total);
  const paymentMethod = order.payment_method_title;
  const isFailed = status === 'fail'; 

  // --- 📅 მიწოდების თარიღის ლოგიკა ---
  // ვიღებთ ქალაქს (ჯერ შიფინგს, თუ არა და ბილინგს)
  const city = (order.shipping?.city || order.billing?.city || "").toLowerCase().trim();
  
  // ვამოწმებთ არის თუ არა თბილისი
  const isTbilisi = city.includes('tbilisi') || city.includes('თბილისი');

  // თბილისი: 1-2 დღე, რეგიონი: 2-3 დღე
  const minDays = isTbilisi ? 1 : 2;
  const maxDays = isTbilisi ? 2 : 3;

  const today = new Date();
  
  // საწყისი თარიღი
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + minDays);
  
  // საბოლოო თარიღი
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + maxDays);

  const month = endDate.toLocaleDateString(locale === 'ka' ? 'ka-GE' : 'en-US', { month: 'long' });
  
  // შედეგი: "24 - 25 დეკემბერი"
  const deliveryText = `${startDate.getDate()} - ${endDate.getDate()} ${month}`;


  // ❌ FAILURE UI
  if (isFailed) {
    return (
        <div className="min-h-screen lg:pt-48 bg-red-50 pt-32 pb-24 px-4 flex justify-center items-center">
            <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-xl border border-red-100">
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-gray-900">გადახდა ვერ მოხერხდა</h1>
                <p className="text-gray-500 mb-8">სამწუხაროდ ბანკმა უარყო ტრანზაქცია. თანხა არ ჩამოჭრილა.</p>
                <Link href="/checkout" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all">
                    თავიდან ცდა
                </Link>
            </div>
        </div>
    );
  }

  // ✅ SUCCESS UI
  return (
    <div className="min-h-screen bg-gray-50 pt-28 lg:pt-48 pb-20 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* მარცხენა მხარე */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center lg:text-left overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2">{t('title')}</h1>
                        <p className="text-gray-500">შეკვეთის ნომერი: <span className="text-gray-900 font-bold">#{idFromUrl}</span></p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="mt-10 relative px-2">
                    <div className="absolute top-4 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                    <div className="absolute top-4 left-0 w-[15%] h-1 bg-green-500 -z-10 rounded-full"></div>
                    <div className="flex justify-between">
                        <TimelineStep icon={CheckCircle} label="მიღებულია" status="active" />
                        <TimelineStep icon={Package} label="მუშავდება" status="pending" />
                        <TimelineStep icon={Truck} label="გზაშია" status="pending" />
                        <TimelineStep icon={Home} label="ჩაბარდა" status="pending" />
                    </div>
                </div>
            </div>

            {/* 🚚 მიწოდების ბოქსი (დინამიური თარიღით) */}
            <div className="bg-blue-50 rounded-2xl p-6 flex items-center gap-4 border border-blue-100">
                <div className="bg-white p-3 rounded-full shadow-sm text-blue-500">
                    <Truck size={24} />
                </div>
                <div>
                    <p className="text-sm text-blue-800 font-bold uppercase tracking-wider">
                        {isTbilisi ? 'მიწოდება თბილისში' : 'მიწოდება რეგიონში'}
                    </p>
                    <p className="text-xl font-black text-gray-900">{deliveryText}</p>
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                        ({isTbilisi ? '1-2 სამუშაო დღე' : '2-3 სამუშაო დღე'})
                    </p>
                </div>
            </div>
            
            <div className="text-center lg:text-left">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold transition-colors">
                    <ArrowRight className="rotate-180 w-4 h-4" /> მთავარზე დაბრუნება
                </Link>
            </div>
        </div>

        {/* მარჯვენა მხარე: ჩეკი */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-28">
                <div className="flex items-center gap-2 mb-6 text-gray-400 uppercase text-xs font-bold tracking-widest border-b pb-4">
                    <Receipt size={16} />
                    შეკვეთის დეტალები
                </div>

                {/* პროდუქტები */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item: any) => (
                        <div key={item.id} className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-50 rounded-xl relative overflow-hidden border border-gray-100 flex-shrink-0">
                                {item.image?.src ? (
                                    <Image 
                                        src={item.image.src} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover" 
                                        sizes="64px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.quantity} x {parseFloat(item.price).toFixed(2)} {currency}</p>
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                                {item.total} {currency}
                            </div>
                        </div>
                    ))}
                </div>

                {/* კალკულაცია */}
                <div className="space-y-3 border-t pt-4 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>ღირებულება</span>
                        <span>{subtotal.toFixed(2)} {currency}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>მიწოდება</span>
                        <span>{shippingTotal > 0 ? `${shippingTotal.toFixed(2)} ${currency}` : 'უფასო'}</span>
                    </div>
                    <div className="flex justify-between text-gray-900 text-lg font-black border-t pt-3 mt-2">
                        <span>სულ</span>
                        <span>{total.toFixed(2)} {currency}</span>
                    </div>
                </div>

                {/* გადახდის მეთოდი */}
                <div className="mt-6 bg-gray-50 rounded-xl p-3 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-2">
                        <CreditCard size={14} />
                        მეთოდი:
                    </span>
                    <span className="font-bold text-gray-900">{paymentMethod}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

function TimelineStep({ icon: Icon, label, status }: { icon: any, label: string, status: 'active' | 'pending' }) {
    const isActive = status === 'active';
    return (
        <div className="flex flex-col items-center gap-2 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-green-600' : 'text-gray-300'}`}>{label}</span>
        </div>
    );
}