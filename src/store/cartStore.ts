import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types';
import { useToastStore } from './toastStore';

// მესიჯების ინტერფეისი
interface ToastMessages {
  added?: string;
  increased?: string;
  stockError?: string;
  removed?: string;
}

interface CartStore {
  items: CartItem[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  // ✅ addItem იღებს მესიჯებს
  addItem: (item: Omit<CartItem, 'quantity'>, messages?: ToastMessages) => void;
  removeItem: (id: number, removedMsg?: string) => void;
  // ✅ updateQuantity იღებს მესიჯს
  updateQuantity: (id: number, action: 'inc' | 'dec', errorMsg?: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (item, messages) => set((state) => {
        const items = [...state.items];
        const existing = items.find((i) => i.id === item.id);
        const maxStock = (item as CartItem).stockQuantity ?? 999;
        const itemSku = item.sku; 

        // ✅ გლობალური მარაგის შემოწმება SKU-ს მიხედვით
        const currentGlobalQuantity = items.reduce((sum, i) => {
             if (itemSku && i.sku && i.sku === itemSku) return sum + i.quantity;
             if (!itemSku && i.id === item.id) return sum + i.quantity;
             return sum;
        }, 0);

        if (currentGlobalQuantity >= maxStock) {
            // ✅ ვიყენებთ გადმოცემულ error მესიჯს
            if (messages?.stockError) {
                useToastStore.getState().showToast(messages.stockError, 'error');
            }
            return state;
        }

        if (existing) {
          // ✅ ვიყენებთ "რაოდენობა გაიზარდა" მესიჯს
          if (messages?.increased) {
              useToastStore.getState().showToast(messages.increased, 'success');
          }
          return {
            items: items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        
        // ✅ ვიყენებთ "დაემატა" მესიჯს
        if (messages?.added) {
            useToastStore.getState().showToast(messages.added, 'success');
        }
        return { 
          items: [...items, { ...item, quantity: 1, stockQuantity: maxStock }] 
        };
      }),

      removeItem: (id, removedMsg) => set((state) => {
        if (removedMsg) {
            useToastStore.getState().showToast(removedMsg, 'info');
        }
        return { items: state.items.filter((i) => i.id !== id) };
      }),

      updateQuantity: (id, action, errorMsg) => set((state) => ({
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
                // ✅ ვიყენებთ სტოკის ერორ მესიჯს
                if (errorMsg) {
                    useToastStore.getState().showToast(errorMsg, 'error');
                }
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
      version: 2,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);