'use client';

import { ShoppingBag, XCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AddToCartButtonProps {
    product: Omit<CartItem, 'quantity'> & { quantity: number };
    stockStatus?: string;
    disabled?: boolean;
}

export default function AddToCartButton({ product, stockStatus, disabled = false }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const t = useTranslations('Product');
    const tToast = useTranslations('Toast'); // ✅ თარგმანები ტოსტებისთვის
    const [isAdding, setIsAdding] = useState(false);
    
    // მარაგის შემოწმება
    const isOutOfStock = stockStatus !== 'IN_STOCK' || (product.stockQuantity !== undefined && product.stockQuantity === 0);
    // ღილაკის გათიშვის პირობები
    const isButtonDisabled = disabled || isOutOfStock || product.quantity === 0 || isAdding;

    const handleAddToCart = () => {
        if (!isButtonDisabled) {
            setIsAdding(true);
            const { quantity: qtyToUse, ...itemBase } = product; 
            
            // ✅ ვქმნით მესიჯების ობიექტს
            const messages = {
                added: tToast('added', { name: product.name }),
                increased: tToast('quantityIncreased', { name: product.name }),
                stockError: tToast('stockError', { quantity: product.stockQuantity })
            };
            
            // ვამატებთ არჩეულ რაოდენობას ციკლით
            for(let i = 0; i < qtyToUse; i++) {
                // ✅ მესიჯს გადავცემთ მხოლოდ ბოლო იტერაციაზე, რომ სპამი არ იყოს
                const msgPayload = (i === qtyToUse - 1) ? messages : undefined;
                addItem(itemBase, msgPayload); 
            }

            // მცირე დაყოვნება ვიზუალური ეფექტისთვის
            setTimeout(() => setIsAdding(false), 500);
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
            {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : !isOutOfStock ? (
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