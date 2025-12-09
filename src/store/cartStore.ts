// src/store/cartStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, action: 'inc' | 'dec') => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

      updateQuantity: (id, action) => set((state) => ({
        items: state.items.map((i) => {
          if (i.id === id) {
            return { 
              ...i, 
              quantity: action === 'inc' ? i.quantity + 1 : Math.max(1, i.quantity - 1) 
            };
          }
          return i;
        })
      })),

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        const items = get().items;
        return items.reduce((total, item) => {
            if (!item.price) return total;
            const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')); 
            return total + (isNaN(numericPrice) ? 0 : numericPrice * item.quantity);
        }, 0);
      }
    }),
    { 
      name: 'chantashop-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);