// stores/cartStore.ts
import { create } from 'zustand';
import { CartItem } from '@/types/cart'; // ⬅️ sesuaikan path jika berbeda

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item: CartItem) => {
    const items = get().items;
    const existing = items.find(i => i.productId === item.productId);

    if (existing) {
      set({
        items: items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...items, item] });
    }
  },

  removeItem: (productId: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));
