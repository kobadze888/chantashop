import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useToastStore } from './toastStore';

// ტიპი, რომელსაც ვისლისტში ვინახავთ (ProductCard-ის მონაცემები)
export interface WishlistItem {
  id: number;
  name: string;
  price: string;
  salePrice?: string;
  regularPrice?: string;
  image: string;
  slug: string;
  stockQuantity?: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const exists = state.items.find((i) => i.id === item.id);
        if (!exists) {
          useToastStore.getState().showToast('დაემატა სურვილების სიაში', 'success');
          return { items: [...state.items, item] };
        }
        return state;
      }),

      removeItem: (id) => set((state) => {
        useToastStore.getState().showToast('ამოიშალა სურვილების სიიდან', 'info');
        return { items: state.items.filter((i) => i.id !== id) };
      }),

      toggleItem: (item) => {
        const state = get();
        const exists = state.items.find((i) => i.id === item.id);
        if (exists) {
          state.removeItem(item.id);
        } else {
          state.addItem(item);
        }
      },

      isInWishlist: (id) => {
        return !!get().items.find((i) => i.id === id);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'chantashop-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);