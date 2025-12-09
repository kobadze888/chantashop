// src/app/[locale]/checkout/_components/CheckoutClient.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Link, useRouter } from '@/navigation'; 
import { Check, CreditCard, Banknote, ArrowLeft, Loader2, Tag, MapPin, ChevronDown } from 'lucide-react';
import { placeOrder, calculateCartTotals } from '@/lib/actions'; // ✅ ახალი იმპორტი

const GE_CITIES = [
  "თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი", "ზუგდიდი", "ფოთი", "ქობულეთი", 
  "ხაშური", "სამტრედია", "სენაკი", "ზესტაფონი", "მარნეული", "თელავი", "ახალციხე", 
  "ოზურგეთი", "კასპი", "ჭიათურა", "წყალტუბო", "საგარეჯო", "გარდაბანი", "ბორჯომი", 
  "ტყიბული", "ხონი", "ბოლნისი", "ახალქალაქი", "გურჯაანი", "მცხეთა", "ყვარელი", "საჩხერე", "დუშეთი"
];

// ✅ ფასის ფორმატირება (ათწილადების გარეშე)
const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  if (isNaN(num)) return '0 ₾';
  
  return new Intl.NumberFormat('ka-GE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num) + ' ₾';
};

export default function CheckoutClient({ locale }: { locale: string }) {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bacs'>('cod');
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  // კუპონის და ტოტალების სთეიტები
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  
  // სერვერიდან მოსული ფასები
  const [serverTotals, setServerTotals] = useState<{
    subtotal: string;
    total: string;
    shippingTotal: string;
    discountTotal: string;
  } | null>(null);
  
  // სესიის ტოკენი (რომ არ დაიკარგოს კალკულაციიდან შეკვეთამდე)
  const [sessionToken, setSessionToken] = useState<string | undefined>(undefined);

  // ქალაქის ძებნა
  const [citySearch, setCitySearch] = useState('თბილისი');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: 'თბილისი',
    address: '',
    apt: ''
  });

  useEffect(() => {
    setMounted(true);
    // პირველადი კალკულაცია გვერდის ჩატვირთვისას
    if (items.length > 0) {
        handleCalculateTotals('თბილისი', '');
    }

    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node) &&
          cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ ტოტალების გადათვლა სერვერზე
  const handleCalculateTotals = async (city: string, coupon: string) => {
    setIsCalculating(true);
    try {
        const cartItemsData = items.map(item => ({ productId: item.id, quantity: item.quantity }));
        const res = await calculateCartTotals(cartItemsData, coupon, city);
        
        if (res.totals) {
            setServerTotals(res.totals);
            if (res.sessionToken) setSessionToken(res.sessionToken);
        }
    } catch (error) {
        console.error("Calculation Error", error);
    } finally {
        setIsCalculating(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setFormData({ ...formData, city: city });
    setCitySearch(city);
    setIsCityDropdownOpen(false);
    // ქალაქის შეცვლისას თავიდან ვითვლით (მიწოდების ფასისთვის)
    handleCalculateTotals(city, appliedCoupon || '');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCitySearch(e.target.value);
    setFormData({ ...formData, city: e.target.value });
    setIsCityDropdownOpen(true);
  };

  // ✅ კუპონის გააქტიურების ღილაკის ლოგიკა
  const handleApplyCoupon = () => {
      if (!couponCode) return;
      setAppliedCoupon(couponCode);
      handleCalculateTotals(formData.city, couponCode);
  };

  const filteredCities = GE_CITIES.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleOrder = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.city) {
          alert(locale === 'ka' ? 'გთხოვთ მიუთითოთ ქალაქი' : 'Please select a city');
          return;
      }
      setIsLoading(true);

      try {
        const cartItemsData = items.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const billingData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address,
            address2: formData.apt,
            city: formData.city,
            email: formData.email,
            phone: formData.phone,
            country: 'GE'
        };

        const orderInput = {
            paymentMethod: paymentMethod,
            billing: billingData,
            shipping: billingData,
            shipToDifferentAddress: false,
        };

        // ვგზავნით sessionToken-საც, რომ არ დაიკარგოს კალკულაციის შედეგი
        const response = await placeOrder(orderInput, cartItemsData, appliedCoupon || '', sessionToken);

        if (response?.errors) {
            console.error("Checkout Errors:", response.errors);
            const msg = response.errors[0]?.message || "შეცდომა შეკვეთისას";
            alert(`ვერ მოხერხდა: ${msg}`);
            return;
        }

        if (response?.order) {
            console.log("Order Created:", response.order);
            clearCart();
            alert(`შეკვეთა მიღებულია! №: ${response.order.orderNumber}`);
            router.push('/'); 
        } else {
            alert("უცნობი შეცდომა. სცადეთ თავიდან.");
        }

      } catch (error) {
          console.error("System Error:", error);
          alert("დაფიქსირდა ტექნიკური ხარვეზი.");
      } finally {
          setIsLoading(false);
      }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold mb-4">{locale === 'ka' ? 'კალათა ცარიელია' : 'Cart is empty'}</h2>
        <Link href="/collection" className="text-brand-DEFAULT hover:text-brand-dark font-bold underline decoration-2 underline-offset-4 transition">
          {locale === 'ka' ? 'კატალოგში დაბრუნება' : 'Back to Collection'}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
      
      <div className="lg:col-span-7 space-y-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-dark transition mb-4">
            <ArrowLeft className="w-4 h-4" /> {locale === 'ka' ? 'კალათაში დაბრუნება' : 'Back to Cart'}
        </Link>

        <form id="checkout-form" onSubmit={handleOrder} className="space-y-10">
            <section>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm font-sans">1</span>
                    {locale === 'ka' ? 'საკონტაქტო ინფორმაცია' : 'Contact Info'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup name="firstName" value={formData.firstName} onChange={handleInputChange} label={locale === 'ka' ? 'სახელი' : 'First Name'} placeholder="გიორგი" />
                    <InputGroup name="lastName" value={formData.lastName} onChange={handleInputChange} label={locale === 'ka' ? 'გვარი' : 'Last Name'} placeholder="ბერიძე" />
                    <InputGroup name="phone" value={formData.phone} onChange={handleInputChange} label={locale === 'ka' ? 'ტელეფონი' : 'Phone'} placeholder="+995 5XX XX XX XX" type="tel" className="md:col-span-2" />
                    <InputGroup name="email" value={formData.email} onChange={handleInputChange} label={locale === 'ka' ? 'ელ-ფოსტა' : 'Email'} placeholder="example@gmail.com" type="email" className="md:col-span-2" />
                </div>
            </section>

            <hr className="border-gray-100" />

            <section>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm font-sans">2</span>
                    {locale === 'ka' ? 'მისამართი' : 'Shipping Address'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* ✅ Searchable City Dropdown */}
                    <div className="md:col-span-2 relative">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide ml-1">
                            {locale === 'ka' ? 'ქალაქი' : 'City'}
                        </label>
                        <div className="relative">
                            <input
                                ref={cityInputRef}
                                type="text"
                                value={citySearch}
                                onChange={handleCityChange}
                                onFocus={() => setIsCityDropdownOpen(true)}
                                className="w-full border border-gray-200 bg-gray-50/50 p-4 rounded-xl focus:outline-none focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT focus:bg-white transition-all font-medium placeholder:text-gray-300 pr-10"
                                placeholder={locale === 'ka' ? 'აირჩიეთ ან ჩაწერეთ...' : 'Select or type...'}
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown className={`w-4 h-4 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {isCityDropdownOpen && (
                            <div ref={cityDropdownRef} className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-fade-in custom-scrollbar">
                                {filteredCities.length > 0 ? (
                                    filteredCities.map((city) => (
                                        <button
                                            key={city}
                                            type="button"
                                            onClick={() => handleCitySelect(city)}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-brand-light hover:text-brand-DEFAULT transition-colors flex items-center gap-2"
                                        >
                                            <MapPin className="w-3 h-3 opacity-50" />
                                            {city}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-xs text-gray-400">
                                        {locale === 'ka' ? 'ქალაქი სიაში ვერ მოიძებნა (გამოვიყენებთ ჩაწერილს)' : 'City not in list (will use typed value)'}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <InputGroup name="address" value={formData.address} onChange={handleInputChange} label={locale === 'ka' ? 'მისამართი' : 'Address'} placeholder="ჭავჭავაძის გამზ. 1" className="md:col-span-2" />
                    <InputGroup name="apt" value={formData.apt} onChange={handleInputChange} label={locale === 'ka' ? 'ბინა/სადარბაზო (არასავალდებულო)' : 'Apt (Optional)'} placeholder="" className="md:col-span-2" required={false} />
                </div>
            </section>

            <hr className="border-gray-100" />

            <section>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm font-sans">3</span>
                    {locale === 'ka' ? 'გადახდის მეთოდი' : 'Payment Method'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div onClick={() => setPaymentMethod('bacs')} className={`cursor-pointer border-2 rounded-2xl p-5 flex items-center gap-4 transition-all relative ${paymentMethod === 'bacs' ? 'border-brand-DEFAULT bg-brand-light/10 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bacs' ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>
                            {paymentMethod === 'bacs' && <div className="w-2.5 h-2.5 rounded-full bg-brand-DEFAULT"></div>}
                        </div>
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'bacs' ? 'text-brand-dark' : 'text-gray-400'}`} />
                        <span className="font-bold text-sm text-brand-dark">{locale === 'ka' ? 'საბანკო გადარიცხვა' : 'Bank Transfer'}</span>
                    </div>
                    <div onClick={() => setPaymentMethod('cod')} className={`cursor-pointer border-2 rounded-2xl p-5 flex items-center gap-4 transition-all relative ${paymentMethod === 'cod' ? 'border-brand-DEFAULT bg-brand-light/10 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-DEFAULT' : 'border-gray-300'}`}>
                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-brand-DEFAULT"></div>}
                        </div>
                        <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-brand-dark' : 'text-gray-400'}`} />
                        <span className="font-bold text-sm text-brand-dark">{locale === 'ka' ? 'ადგილზე გადახდა' : 'Cash on Delivery'}</span>
                    </div>
                </div>
            </section>
        </form>
      </div>

      <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200 relative">
          {/* ლოადერი კალკულაციის დროს */}
          {isCalculating && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[2rem]">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-DEFAULT" />
              </div>
          )}

          <h3 className="font-bold text-lg mb-6 text-brand-dark uppercase tracking-widest">{locale === 'ka' ? 'თქვენი შეკვეთა' : 'Your Order'}</h3>
          <div className="space-y-5 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-4 items-start py-2">
                <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <span className="absolute bottom-0 right-0 bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-tl-lg font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-brand-dark line-clamp-2 font-serif leading-tight">{item.name}</h4>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                      {item.selectedOptions && Object.values(item.selectedOptions).join(', ')}
                  </div>
                </div>
                <div className="font-bold text-sm whitespace-nowrap">{formatPrice(item.price)}</div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{locale === 'ka' ? 'ღირებულება' : 'Subtotal'}</span>
              <span className="font-bold">
                  {serverTotals ? formatPrice(serverTotals.subtotal) : '...'}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{locale === 'ka' ? 'მიწოდება' : 'Shipping'}</span>
              <span className="font-bold">
                  {serverTotals ? formatPrice(serverTotals.shippingTotal) : '...'}
              </span>
            </div>
            {/* ფასდაკლების ჩვენება */}
            {serverTotals && parseFloat(serverTotals.discountTotal) > 0 && (
                <div className="flex justify-between text-sm text-brand-DEFAULT">
                    <span>{locale === 'ka' ? 'ფასდაკლება' : 'Discount'}</span>
                    <span className="font-bold">-{formatPrice(serverTotals.discountTotal)}</span>
                </div>
            )}
          </div>

          {/* ✅ კუპონის ველი ღილაკით */}
          <div className="mt-6">
             <div className="flex gap-2">
                <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={locale === 'ka' ? 'პრომო კოდი' : 'Promo Code'}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-DEFAULT placeholder:text-gray-300 font-bold uppercase tracking-wider"
                    />
                </div>
                <button 
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode || isCalculating}
                    className="bg-gray-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-brand-DEFAULT transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {locale === 'ka' ? 'გააქტიურება' : 'Apply'}
                </button>
             </div>
             {appliedCoupon && (
                 <p className="text-[10px] text-green-600 mt-2 font-bold flex items-center gap-1">
                     <Check className="w-3 h-3" /> კუპონი "{appliedCoupon}" გააქტიურებულია
                 </p>
             )}
          </div>

          <div className="border-t-2 border-dashed border-gray-200 pt-6 mt-6 mb-8">
            <div className="flex justify-between items-end">
              <span className="font-black text-brand-dark text-lg">{locale === 'ka' ? 'სულ გადასახდელი' : 'Total'}</span>
              <span className="font-black text-3xl text-brand-DEFAULT font-serif">
                  {serverTotals ? formatPrice(serverTotals.total) : '...'}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={isLoading}
            className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold hover:bg-brand-DEFAULT transition-all shadow-xl hover:shadow-brand-DEFAULT/20 text-sm uppercase tracking-widest active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (locale === 'ka' ? 'დადასტურება' : 'Place Order')}
          </button>
          
          <div className="text-center mt-6 text-xs text-gray-400 flex items-center justify-center gap-2">
             <Check className="w-3 h-3" /> {locale === 'ka' ? 'უსაფრთხო გადახდა' : 'Secure Transaction'}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text", className, name, value, onChange, required = true }: { label: string, placeholder: string, type?: string, className?: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean }) {
    return (
        <div className={className}>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wide ml-1">{label}</label>
            <input name={name} value={value} onChange={onChange} type={type} className="w-full border border-gray-200 bg-gray-50/50 p-4 rounded-xl focus:outline-none focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT focus:bg-white transition-all font-medium placeholder:text-gray-300" placeholder={placeholder} required={required} />
        </div>
    );
}