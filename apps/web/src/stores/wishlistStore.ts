import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        if (!items.find(item => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter(item => item.id !== productId) }),
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) =>
        get().items.some(item => item.id === productId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;
