'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';

interface AddToCartButtonProps {
    product: Omit<CartItem, 'quantity'>;
    stockStatus?: string;
    disabled?: boolean;
}

export default function AddToCartButton({ product, stockStatus, disabled = false }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const inStock = stockStatus === 'IN_STOCK';
    const isButtonDisabled = disabled || !inStock;

    const handleAddToCart = () => {
        if (!isButtonDisabled) {
            addItem(product);
            // აქ შეგიძლიათ დაამატოთ Toast Notification
            console.log(`Product ${product.name} added to cart`);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
            className={`w-full max-w-xs text-white px-8 py-4 rounded-full font-bold text-base transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                !isButtonDisabled
                    ? 'bg-mocha-DEFAULT hover:bg-mocha-dark cursor-pointer' 
                    : 'bg-gray-300 cursor-not-allowed opacity-70'
            }`}
        >
            <ShoppingBag className="w-5 h-5" />
            {inStock ? 'კალათაში დამატება' : 'მარაგში არ არის'}
        </button>
    );
}