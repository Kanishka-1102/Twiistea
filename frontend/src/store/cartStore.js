import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find(i => i._id === product._id);
        if (existing) {
          set({ items: items.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
        set({ isOpen: true });
      },

      removeItem: (id) => set({ items: get().items.filter(i => i._id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return get().removeItem(id);
        set({ items: get().items.map(i => i._id === id ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      get subtotal() {
        return get().items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
      },
      get itemCount() {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      get shipping() {
        const sub = get().items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
        return sub >= 500 ? 0 : 60;
      },
      get total() {
        const sub = get().items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
        const ship = sub >= 500 ? 0 : 60;
        return sub + ship + Math.round(sub * 0.05);
      },
    }),
    { name: 'twistea-cart', partialize: (state) => ({ items: state.items }) }
  )
);

export default useCartStore;
