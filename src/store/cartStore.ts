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
        
        // თუ მარაგში საერთოდ არ არის
        if (!existing && maxStock <= 0) {
            useToastStore.getState().showToast('პროდუქტი მარაგში არ არის', 'error');
            return state;
        }

        // თუ უკვე არის კალათაში და ვზრდით რაოდენობას
        if (existing) {
          const newQuantity = existing.quantity + 1;
          if (newQuantity <= maxStock) { 
            // წარმატებული დამატება (რაოდენობის ზრდა)
            useToastStore.getState().showToast(`რაოდენობა გაიზარდა: ${item.name}`, 'success');
            return {
              items: items.map((i) => 
                i.id === item.id ? { ...i, quantity: newQuantity } : i
              ),
            };
          }
          // მარაგის ლიმიტი
          useToastStore.getState().showToast(`მარაგში მხოლოდ ${maxStock} ცალია`, 'error');
          return state;
        }
        
        // ახალი პროდუქტის დამატება
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
            const newQuantity = action === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
            const maxStock = item.stockQuantity ?? 999;
            
            if (action === 'inc' && newQuantity > maxStock) {
                useToastStore.getState().showToast(`მაქსიმალური რაოდენობა: ${maxStock}`, 'error');
                return item;
            }
            return { ...item, quantity: newQuantity };
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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);