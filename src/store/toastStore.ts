import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  isVisible: boolean;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  isVisible: false,
  type: 'success',
  
  showToast: (message, type = 'success') => {
    set({ isVisible: true, message, type });

    // ავტომატურად გაქრეს 3 წამში
    setTimeout(() => {
      set({ isVisible: false });
    }, 3000);
  },

  hideToast: () => set({ isVisible: false }),
}));