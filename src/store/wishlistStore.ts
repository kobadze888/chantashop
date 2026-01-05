import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useToastStore } from './toastStore';

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  salePrice?: string;
  regularPrice?: string;
  image: string;
  slug: string;
  attributes?: any;
  stockQuantity?: number;
  stockStatus?: string;
  productCategories?: any;
}

// ✅ მესიჯების ინტერფეისი
interface WishlistMessages {
  added?: string;
  removed?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  // ✅ toggleItem იღებს მესიჯებს
  toggleItem: (item: WishlistItem, messages?: WishlistMessages) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (newItem, messages) =>
        set((state) => {
          const exists = state.items.find((item) => item.id === newItem.id);

          if (exists) {
            // ✅ თუ უკვე არის -> ვიღებთ და ვაჩვენებთ "Removed" მესიჯს
            if (messages?.removed) {
                useToastStore.getState().showToast(messages.removed, 'info');
            }
            return {
              items: state.items.filter((item) => item.id !== newItem.id),
            };
          } else {
            // ✅ თუ არ არის -> ვამატებთ და ვაჩვენებთ "Added" მესიჯს
            if (messages?.added) {
                useToastStore.getState().showToast(messages.added, 'success');
            }
            return {
              items: [...state.items, newItem],
            };
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      isInWishlist: (id) => {
        const items = get().items;
        return items.some((item) => item.id === id);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'chantashop-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);