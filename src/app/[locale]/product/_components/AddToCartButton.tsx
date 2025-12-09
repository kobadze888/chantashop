'use client';

import { ShoppingBag, XCircle } from 'lucide-react'; // XCircle დავამატეთ მარაგის არქონის აიკონისთვის
import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';
import { useTranslations } from 'next-intl';

interface AddToCartButtonProps {
    product: Omit<CartItem, 'quantity'> & { quantity: number };
    stockStatus?: string;
    disabled?: boolean;
}

export default function AddToCartButton({ product, stockStatus, disabled = false }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const t = useTranslations('Product');
    const inStock = stockStatus === 'IN_STOCK';
    const isButtonDisabled = disabled || !inStock;

    const handleAddToCart = () => {
        if (!isButtonDisabled) {
            for(let i = 0; i < product.quantity; i++) {
                addItem(product); 
            }
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
            className={`
                w-full h-14 rounded-2xl font-bold transition-all duration-300 
                flex items-center justify-center gap-3 uppercase tracking-wider text-xs md:text-sm
                ${!isButtonDisabled
                    ? 'bg-brand-dark text-white hover:bg-brand-DEFAULT shadow-xl hover:shadow-brand-DEFAULT/30 active:scale-95 cursor-pointer border border-transparent' 
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-80'
                }
            `}
        >
            {inStock ? (
                <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{t('addToCart')}</span>
                </>
            ) : (
                <>
                    <XCircle className="w-5 h-5" />
                    <span>{t('outOfStock')}</span>
                </>
            )}
        </button>
    );
}