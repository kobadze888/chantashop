// src/app/[locale]/product/_components/AddToCartButton.tsx

'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';

interface AddToCartButtonProps {
    product: Omit<CartItem, 'quantity'>;
    stockStatus?: string;
}

export default function AddToCartButton({ product, stockStatus }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const inStock = stockStatus === 'IN_STOCK';

    const handleAddToCart = () => {
        if (inStock) {
            addItem(product);
            console.log(`Product ${product.name} added to cart`);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full max-w-xs text-white px-8 py-4 rounded-full font-bold text-base transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                inStock 
                    ? 'bg-mocha-DEFAULT hover:bg-mocha-dark' 
                    : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
            <ShoppingBag className="w-5 h-5" />
            {inStock ? 'კალათაში დამატება' : 'მარაგში არ არის'}
        </button>
    );
}