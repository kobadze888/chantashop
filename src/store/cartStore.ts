import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types';
import { useToastStore } from './toastStore';

interface CartStore {
  items: CartItem[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
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
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (item) => set((state) => {
        const items = [...state.items];
        const existing = items.find((i) => i.id === item.id);
        const maxStock = (item as CartItem).stockQuantity ?? 999;
        const itemSku = item.sku; 

        // ✅ გლობალური მარაგის შემოწმება SKU-ს მიხედვით
        // ახალი ცვლილების შემდეგ, ვარიაციების SKU აღარ იქნება საერთო (მშობლის), თუ ის კონკრეტულად არ არის გაწერილი
        const currentGlobalQuantity = items.reduce((sum, i) => {
             if (itemSku && i.sku && i.sku === itemSku) return sum + i.quantity;
             if (!itemSku && i.id === item.id) return sum + i.quantity;
             return sum;
        }, 0);

        if (currentGlobalQuantity >= maxStock) {
            useToastStore.getState().showToast(`მარაგში მხოლოდ ${maxStock} ცალია`, 'error');
            return state;
        }

        if (existing) {
          useToastStore.getState().showToast(`რაოდენობა გაიზარდა: ${item.name}`, 'success');
          return {
            items: items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        
        useToastStore.getState().showToast(`${item.name} დაემატა კალათაში`, 'success');
        return { 
          items: [...items, { ...item, quantity: 1, stockQuantity: maxStock }] 
        };
      }),

      removeItem: (id) => set((state) => {
        useToastStore.getState().showToast('პროდუქტი ამოღებულია', 'info');
        return { items: state.items.filter((i) => i.id !== id) };
      }),

      updateQuantity: (id, action) => set((state) => ({
        items: state.items.map((item) => {
          if (item.id === id) {
            if (action === 'dec') {
                return { ...item, quantity: Math.max(1, item.quantity - 1) };
            }

            const maxStock = item.stockQuantity ?? 999;
            const itemSku = item.sku;

            const currentGlobalQuantity = state.items.reduce((sum, i) => {
                if (itemSku && i.sku && i.sku === itemSku) return sum + i.quantity;
                if (!itemSku && i.id === item.id) return sum + i.quantity;
                return sum;
            }, 0);
            
            if (currentGlobalQuantity >= maxStock) {
                useToastStore.getState().showToast(`მაქსიმალური რაოდენობა: ${maxStock}`, 'error');
                return item;
            }
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        })
      })),

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        const items = get().items;
        return items.reduce((total, item) => {
            const priceStr = String(item.price || "0");
            const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')); 
            return total + (isNaN(numericPrice) ? 0 : numericPrice * item.quantity);
        }, 0);
      }
    }),
    { 
      name: 'chantashop-cart',
      storage: createJSONStorage(() => localStorage),
      version: 2, // ✅ ვერსია გაიზარდა, რომ კალათა გასუფთავდეს
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);