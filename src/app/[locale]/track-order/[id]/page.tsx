import { getOrder } from '@/lib/actions';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { ArrowLeft, CheckCircle, Package, Truck, Home, Clock, XCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const formatPrice = (price: string) => {
  if (!price) return '0 ₾';
  const num = parseFloat(price.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? price : `${num} ₾`;
};

type WCStatus = 'PENDING' | 'PROCESSING' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | 'FAILED';

function getStatusStep(status: WCStatus): number {
  switch (status) {
    case 'PENDING':    return 1;
    case 'ON_HOLD':    return 2;
    case 'PROCESSING': return 2;
    case 'COMPLETED':  return 4;
    default:           return 1;
  }
}

function isCancelledStatus(status: WCStatus) {
  return status === 'CANCELLED' || status === 'REFUNDED' || status === 'FAILED';
}

export default async function OrderDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ phone?: string; email?: string }>;
}) {
  const { id, locale } = await params;
  const sp = await searchParams;
  // support both new (phone) and legacy (email) param
  const credential = sp.phone || sp.email || '';

  const t = await getTranslations('Success');
  const tTrack = await getTranslations('Tracking');

  const order = await getOrder(id, credential);

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4 pt-32">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-brand-dark mb-3">{tTrack('notFound')}</h1>
        <p className="text-gray-500 mb-6 max-w-sm text-sm leading-relaxed">{tTrack('notFoundDesc')}</p>
        <Link
          href="/track-order"
          className="px-6 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-DEFAULT transition text-sm"
        >
          {tTrack('back')}
        </Link>
      </div>
    );
  }

  const status = (order.status as WCStatus) || 'PENDING';
  const cancelled = isCancelledStatus(status);
  const currentStep = cancelled ? 0 : getStatusStep(status);

  const formattedDate = new Date(order.date).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const steps = [
    { icon: CheckCircle, label: t('timeline_1'), step: 1 },
    { icon: Package,      label: t('timeline_2'), step: 2 },
    { icon: Truck,        label: t('timeline_3'), step: 3 },
    { icon: Home,         label: t('timeline_4'), step: 4 },
  ];

  const statusMessage = () => {
    if (cancelled) return tTrack('statusCancelled');
    switch (currentStep) {
      case 1: return t('status_1');
      case 2: return t('status_2');
      case 3: return t('status_3');
      case 4: return t('status_4');
      default: return t('status_1');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-3xl">

        {/* Back + Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/track-order" className="p-3 bg-white rounded-full shadow-sm hover:bg-brand-light transition text-brand-dark">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-black text-brand-dark">
              {tTrack('orderFound')}{order.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3" /> {formattedDate}
            </p>
          </div>
        </div>

        {/* Status card */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1.5 ${cancelled ? 'bg-red-400' : 'bg-gradient-to-r from-brand-DEFAULT to-purple-500'}`} />

          {cancelled ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <p className="font-bold text-red-600 text-base">{statusMessage()}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{status}</p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="relative my-8 px-2">
                <div className="absolute top-5 left-4 right-4 h-1 bg-gray-100 rounded-full" />
                <div
                  className="absolute top-5 left-4 h-1 bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${((currentStep - 1) / 3) * 92}%` }}
                />
                <div className="flex justify-between relative z-10">
                  {steps.map(({ icon, label, step }) => (
                    <TimelineItem key={step} icon={icon} label={label} step={step} currentStep={currentStep} />
                  ))}
                </div>
              </div>

              <div className="bg-brand-light/40 rounded-xl p-4 text-center">
                <p className="text-brand-dark font-bold text-sm">{statusMessage()}</p>
              </div>
            </>
          )}
        </div>

        {/* Items + Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-base mb-4 text-brand-dark">{t('items')}</h3>
            <div className="space-y-4">
              {order.lineItems.nodes.map((item: any, i: number) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product?.node?.image?.sourceUrl || '/placeholder.jpg'}
                      alt={item.product?.node?.name || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-dark truncate">{item.product?.node?.name}</p>
                    <p className="text-xs text-gray-400">{t('quantity')}: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm shrink-0">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-500 text-sm">{t('totalPaid')}:</span>
              <span className="text-xl font-black text-brand-DEFAULT">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-base mb-4 text-brand-dark">{t('shippingAddress')}</h3>
            <div className="space-y-1 text-gray-600 text-sm">
              <p className="font-bold text-brand-dark text-base">
                {order.billing?.firstName} {order.billing?.lastName}
              </p>
              {order.billing?.city && <p>{order.billing.city}</p>}
              {order.billing?.address1 && <p>{order.billing.address1}</p>}
              {order.billing?.phone && (
                <p className="text-xs text-gray-400 mt-2">{order.billing.phone}</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide">{t('paymentDone')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function TimelineItem({
  icon: Icon, label, step, currentStep,
}: {
  icon: any; label: string; step: number; currentStep: number;
}) {
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
      <span className={`text-[10px] text-center font-bold tracking-wider uppercase transition-colors ${isActive ? 'text-green-600' : 'text-gray-300'}`}>
        {label}
      </span>
    </div>
  );
}
