'use client';

import { ShoppingBag } from 'lucide-react';
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
            className={`flex-1 rounded-full font-bold h-16 transition shadow-2xl flex items-center justify-center gap-4 active:scale-95 transform duration-200 uppercase tracking-widest text-sm ${
                !isButtonDisabled
                    ? 'bg-brand-dark text-white hover:bg-brand-DEFAULT shadow-brand-dark/20 cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
            <ShoppingBag className="w-5 h-5" />
            {inStock ? t('addToCart') : t('outOfStock')}
        </button>
    );
}