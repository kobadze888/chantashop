// src/app/[locale]/checkout/_components/CheckoutClient.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Link, useRouter } from '@/navigation'; 
import { CreditCard, Banknote, ArrowLeft, Loader2, Tag, MapPin, ChevronDown, XCircle } from 'lucide-react';
import { placeOrder, calculateCartTotals } from '@/lib/actions'; 
import { useTranslations } from 'next-intl';
import { getCitiesList, getDefaultCity, isTbilisi } from '@/lib/ge-cities'; 

// ✅ დავამატოთ CartTotals ტიპის ინტერფეისი Type Error #4-ის გამოსასწორებლად
interface CartTotals {
    total: string | number;
    subtotal: string | number;
    shippingTotal: string | number;
    discountTotal: string | number;
    appliedCoupons?: { code: string; discountAmount: string; }[];
}

const formatPrice = (price: string | number) => {
  if (price === null || price === undefined) return '0 ₾';
  const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  if (isNaN(num)) return '0 ₾';
  return new Intl.NumberFormat('ka-GE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num) + ' ₾';
};

export default function CheckoutClient({ locale }: { locale: string }) {
  const t = useTranslations('Checkout');
  const cartT = useTranslations('Cart');
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bacs'>('cod');
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  // ✅ განვსაზღვრეთ ტიპი CartTotals ან null
  const [serverTotals, setServerTotals] = useState<CartTotals | null>(null);
  const [sessionToken, setSessionToken] = useState<string | undefined>(undefined);

  // --- City & Zone Logic ---
  const citiesList = useMemo(() => getCitiesList(locale), [locale]);
  const defaultCity = useMemo(() => getDefaultCity(locale), [locale]);
  
  const lastCalculatedZone = useRef<'tbilisi' | 'region' | null>(null); 

  const [citySearch, setCitySearch] = useState(defaultCity);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    city: defaultCity, address: '', apt: ''
  });
  
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    setMounted(true);
    if (items.length > 0) handleCalculateTotals(defaultCity, '', true);
    
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node) &&
          cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [items.length, defaultCity]);

  const filteredCities = useMemo(() => {
    if (!isSearching) return citiesList;
    return citiesList.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
  }, [citiesList, citySearch, isSearching]);

  const handleCalculateTotals = async (city: string, coupon: string, force = false) => {
    const currentZone = isTbilisi(city) ? 'tbilisi' : 'region';
    
    const normalizedLastCoupon = appliedCoupon ? appliedCoupon.toLowerCase().trim() : '';
    const normalizedCurrentCoupon = coupon ? coupon.toLowerCase().trim() : '';

    if (!force && currentZone === lastCalculatedZone.current && normalizedCurrentCoupon === normalizedLastCoupon) {
        return; 
    }

    lastCalculatedZone.current = currentZone;
    setIsCalculating(true);
    
    try {
        const cartItemsData = items.map(item => ({ productId: item.id, quantity: item.quantity }));
        const res = await calculateCartTotals(cartItemsData, coupon, city); 
        
        if (res.totals) {
            setServerTotals(res.totals as CartTotals); // ✅ ტიპის მითითება
            if (res.sessionToken) setSessionToken(res.sessionToken);
        }
    } catch (error) { 
        console.error("Calculate Totals Error:", error);
        
        // ✅ Type Error #4-ის გამოსწორება
        setServerTotals(prev => {
            const currentTotal = totalPrice();
            // თუ წინა subtotal არსებობს, შევინარჩუნოთ, თორემ გამოვიყენოთ ლოკალური totalPrice
            const subtotal = prev?.subtotal ? prev.subtotal : currentTotal; 
            
            return {
                ...(prev || {}), 
                subtotal: subtotal, 
                shippingTotal: "0", // დავაყენოთ 0, თუ ვერ გამოითვალა
                discountTotal: "0",
                total: subtotal 
            } as CartTotals;
        });
        
    } 
    finally { setIsCalculating(false); }
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, city: city }));
    setCitySearch(city);
    setIsCityDropdownOpen(false);
    setIsSearching(false);
    handleCalculateTotals(city, appliedCoupon || '');
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    if (name === 'city') {
        setCitySearch(value);
        setIsCityDropdownOpen(true); 
        setIsSearching(true);
        handleCalculateTotals(value, appliedCoupon || '');
    }
  };

  const handleCityBlur = () => {
    setTimeout(() => {
        setIsCityDropdownOpen(false);
        handleCalculateTotals(formDataRef.current.city, appliedCoupon || ''); 
    }, 200);
  };

  const handleApplyCoupon = () => {
      if (!couponCode) return;
      setAppliedCoupon(couponCode); 
      handleCalculateTotals(formData.city, couponCode, true);
  };

  const handleOrder = async (e: React.FormEvent) => {
      e.preventDefault();
      setGlobalError(null);

      if (!formData.city) { 
          setGlobalError(t('errorCity')); 
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
          return; 
      }
      
      setIsLoading(true);

      try {
        const cartItemsData = items.map(item => ({ productId: item.id, quantity: item.quantity }));
        const billingData = {
            firstName: formData.firstName, lastName: formData.lastName, address1: formData.address,
            address2: formData.apt, city: formData.city, email: formData.email, phone: formData.phone, country: 'GE'
        };
        const orderInput = {
            paymentMethod: paymentMethod, billing: billingData, shipping: billingData, shipToDifferentAddress: false,
        };

        const response = await placeOrder(orderInput, cartItemsData, appliedCoupon || '', sessionToken);

        if (response?.errors) {
            const msg = response.errors[0]?.message || t('errorGeneric');
            setGlobalError(msg);
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (response?.order) {
            clearCart();
            router.push(`/checkout/success?orderId=${response.order.orderNumber}&email=${formData.email}`); 
        } else {
            setGlobalError(t('errorGeneric'));
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (error) {
          const msg = error instanceof Error ? error.message : t('errorGeneric');
          setGlobalError(msg);
          setIsLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  if (!mounted) return null;

  if (items.length === 0 && !isLoading) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold mb-4">{cartT('empty')}</h2>
        <Link href="/collection" className="text-brand-DEFAULT font-bold underline">{t('backToCart')}</Link>
      </div>
    );
  }

  // ✅ grandTotal-ის სწორი გამოთვლა (ახლა serverTotals-ს აქვს განსაზღვრული ტიპი)
  const grandTotal = serverTotals ? serverTotals.total : totalPrice();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
      <div className="lg:col-span-7 space-y-8">
        
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-dark transition">
            <ArrowLeft className="w-4 h-4" /> {t('backToCart')}
        </Link>

        {globalError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                    <span className="font-bold block mb-1">შეკვეთა ვერ შესრულდა</span>
                    {globalError}
                </div>
            </div>
        )}

        <form id="checkout-form" onSubmit={handleOrder} className="space-y-10">
            <section>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm font-sans">1</span>
                    {t('contactInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup name="firstName" value={formData.firstName} onChange={handleFormChange} label={t('firstName')} placeholder="" />
                    <InputGroup name="lastName" value={formData.lastName} onChange={handleFormChange} label={t('lastName')} placeholder="" />
                    <InputGroup name="phone" value={formData.phone} onChange={handleFormChange} label={t('phone')} placeholder="+995..." className="md:col-span-2" />
                    <InputGroup name="email" value={formData.email} onChange={handleFormChange} label={t('email')} placeholder="example@mail.com" className="md:col-span-2" />
                </div>
            </section>

            <hr className="border-gray-100" />

            <section>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm font-sans">2</span>
                    {t('addressTitle')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="md:col-span-2 relative">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide ml-1">{t('city')}</label>
                        <div className="relative">
                            <input 
                                ref={cityInputRef} 
                                type="text" 
                                name="city"
                                value={citySearch} 
                                onChange={handleFormChange} 
                                onClick={() => {
                                    setIsCityDropdownOpen(true);
                                    setIsSearching(false); 
                                }}
                                onFocus={() => {
                                    setIsCityDropdownOpen(true);
                                    setIsSearching(false);
                                }}
                                onBlur={handleCityBlur} 
                                className="w-full border border-gray-200 bg-gray-50/50 p-4 rounded-xl focus:outline-none focus:border-brand-DEFAULT transition-all font-medium pr-10" 
                                placeholder={t('cityPlaceholder')} 
                                required 
                            />
                            <ChevronDown 
                                className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-300 ${isCityDropdownOpen ? 'rotate-180' : ''}`} 
                                onClick={() => {
                                    const nextState = !isCityDropdownOpen;
                                    setIsCityDropdownOpen(nextState);
                                    if(nextState) {
                                        cityInputRef.current?.focus();
                                        setIsSearching(false);
                                    }
                                }}
                            />
                        </div>
                        {isCityDropdownOpen && (
                            <div ref={cityDropdownRef} className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fade-in custom-scrollbar">
                                {filteredCities.length > 0 ? (
                                    filteredCities.map((city) => (
                                        <button 
                                            key={city} 
                                            type="button" 
                                            onMouseDown={(e) => e.preventDefault()} 
                                            onClick={() => handleCitySelect(city)} 
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-brand-light hover:text-brand-DEFAULT transition-colors flex items-center gap-2"
                                        >
                                            <MapPin className="w-3 h-3 opacity-50" />
                                            {city}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-400 italic">
                                        {t('cityNotFound')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <InputGroup name="address" value={formData.address} onChange={handleFormChange} label={t('address')} placeholder="" className="md:col-span-2" />
                    <InputGroup name="apt" value={formData.apt} onChange={handleFormChange} label={t('apt')} placeholder="" className="md:col-span-2" required={false} />
                </div>
            </section>

            <hr className="border-gray-100" />

            <section>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm font-sans">3</span>
                    {t('paymentMethod')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div onClick={() => setPaymentMethod('bacs')} className={`cursor-pointer border-2 rounded-2xl p-5 flex items-center gap-4 transition-all ${paymentMethod === 'bacs' ? 'border-brand-DEFAULT bg-brand-light/10 shadow-sm' : 'border-gray-100'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bacs' ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>{paymentMethod === 'bacs' && <div className="w-2.5 h-2.5 rounded-full bg-brand-DEFAULT"></div>}</div>
                        <CreditCard className="w-6 h-6 text-brand-dark" /><span className="font-bold text-sm text-brand-dark">{t('bacs')}</span>
                    </div>
                    <div onClick={() => setPaymentMethod('cod')} className={`cursor-pointer border-2 rounded-2xl p-5 flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-brand-DEFAULT bg-brand-light/10 shadow-sm' : 'border-gray-100'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>{paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-brand-DEFAULT"></div>}</div>
                        <Banknote className="w-6 h-6 text-brand-dark" /><span className="font-bold text-sm text-brand-dark">{t('cod')}</span>
                    </div>
                </div>
            </section>
        </form>
      </div>

      <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200 relative">
          {isCalculating && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[2rem]"><Loader2 className="w-8 h-8 animate-spin text-brand-DEFAULT" /></div>}
          <h3 className="font-bold text-lg mb-6 text-brand-dark uppercase tracking-widest">{t('yourOrder')}</h3>
          <div className="space-y-5 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-start py-2">
                <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-200"><Image src={item.image} alt={item.name} fill className="object-cover" /><span className="absolute bottom-0 right-0 bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-tl-lg font-bold">{item.quantity}</span></div>
                <div className="flex-1 min-w-0"><h4 className="font-bold text-sm text-brand-dark line-clamp-2 font-serif">{item.name}</h4></div>
                <div className="font-bold text-sm whitespace-nowrap">{formatPrice(item.price)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between text-sm text-gray-600"><span>{cartT('subtotal')}</span><span className="font-bold">{serverTotals ? formatPrice(serverTotals.subtotal) : '...'}</span></div>
            <div className="flex justify-between text-sm text-gray-600"><span>{cartT('shipping')}</span><span className="font-bold">{serverTotals ? formatPrice(serverTotals.shippingTotal) : '...'}</span></div>
            {serverTotals && parseFloat(serverTotals.discountTotal.toString()) > 0 && <div className="flex justify-between text-sm text-brand-DEFAULT"><span>{t('discount')}</span><span className="font-bold">-{formatPrice(serverTotals.discountTotal)}</span></div>}
          </div>
          <div className="mt-6 flex gap-2">
                <div className="relative flex-1"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder={t('promoCode')} value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-DEFAULT uppercase font-bold" /></div>
                <button type="button" onClick={handleApplyCoupon} disabled={!couponCode || isCalculating} className="bg-gray-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-brand-DEFAULT transition disabled:opacity-50">{t('apply')}</button>
          </div>
          <div className="border-t-2 border-dashed border-gray-200 pt-6 mt-6 mb-8">
            <div className="flex justify-between items-end"><span className="font-black text-brand-dark text-lg">{t('total')}</span><span className="font-black text-3xl text-brand-DEFAULT font-serif">{formatPrice(grandTotal)}</span></div>
          </div>
          <button 
            type="submit" 
            form="checkout-form" 
            disabled={isLoading} 
            className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold hover:bg-brand-DEFAULT transition-all shadow-xl text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text", className, name, value, onChange, required = true }: any) {
    return (
        <div className={className}>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide ml-1">{label}</label>
            <input name={name} value={value} onChange={onChange} type={type} className="w-full border border-gray-200 bg-gray-50/50 p-4 rounded-xl focus:outline-none focus:border-brand-DEFAULT transition-all font-medium" placeholder={placeholder} required={required} />
        </div>
    );
}